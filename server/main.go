package main

import (
	"io"
	"log"
	"net/http"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load Cloudinary credentials from environment variables
	cloudName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	apiKey := os.Getenv("CLOUDINARY_API_KEY")
	apiSecret := os.Getenv("CLOUDINARY_API_SECRET")

	cld, err := cloudinary.NewFromParams(cloudName, apiKey, apiSecret)
	if err != nil {
		log.Fatalf("Failed to initialize Cloudinary: %v", err)
	}

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:5173", "https://upload.mohammedfarhan.me"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * 60 * 60,
	}))

	// Upload endpoint
	router.POST("/upload", func(c *gin.Context) {
		// Get the file from the request
		file, err := c.FormFile("image")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "File upload failed"})
			return
		}

		// Open the file
		src, err := file.Open()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open uploaded file"})
			return
		}
		defer src.Close()

		// Upload the file to Cloudinary
		uploadResult, err := cld.Upload.Upload(c, src, uploader.UploadParams{})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload to Cloudinary"})
			return
		}

		// Return the URL of the uploaded image
		c.JSON(http.StatusOK, gin.H{
			"link": uploadResult.SecureURL,
		})
	})

	// Reverse proxy route to serve Cloudinary images
	router.GET("/images/:filename", func(c *gin.Context) {
		filename := c.Param("filename")

		cloudinaryURL := "https://res.cloudinary.com/dvfsreifp/image/upload/" + filename

		// Fetch the image from Cloudinary
		resp, err := http.Get(cloudinaryURL)
		if err != nil || resp.StatusCode != 200 {
			c.JSON(http.StatusBadGateway, gin.H{"error": "Failed to fetch image"})
			return
		}
		defer resp.Body.Close()

		// Copy content-type header from Cloudinary response
		contentType := resp.Header.Get("Content-Type")
		if contentType == "" {
			contentType = "image/jpeg" // Default fallback
		}

		// Set headers and stream the image
		c.Header("Content-Type", contentType)
		c.Status(resp.StatusCode)
		io.Copy(c.Writer, resp.Body)
	})

	log.Println("Server is running on :8080")
	log.Fatal(router.Run(":8080"))
}
