// main.go
package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func main() {
	// Initialize Gin framework
	router := gin.Default()

	// Create the 'uploads' folder if it doesn't exist
	os.MkdirAll("./uploads", os.ModePerm)

	// Endpoint for uploading images
	router.POST("/upload", func(c *gin.Context) {
		// Get the uploaded file from the form
		file, err := c.FormFile("image")
		if err != nil {
			// Return error if file is not uploaded correctly
			c.JSON(http.StatusBadRequest, gin.H{"error": "File upload failed"})
			return
		}

		// Generate a unique ID for the file (UUID) and create the final file path
		uniqueID := uuid.New().String()[:8] // Create short UUID (first 8 characters)
		fileExtension := filepath.Ext(file.Filename) // Get the file extension
		newFileName := uniqueID + fileExtension // Combine the UUID and original file extension

		// Define the path to save the uploaded image
		path := filepath.Join("uploads", newFileName)

		// Save the uploaded file to the server
		if err := c.SaveUploadedFile(file, path); err != nil {
			// Return error if file save fails
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			return
		}

		// Generate the direct link to the uploaded image
		link := fmt.Sprintf("https://upload.mohammedfarhan.me/uploads/%s", newFileName)

		// Send the link back to the user in JSON format
		c.JSON(http.StatusOK, gin.H{
			"link": link,
		})
	})

	// Serve the uploaded images via static route
	router.Static("/uploads", "./uploads")

	// Start the server on port 8080
	log.Println("Starting server on :8080...")
	log.Fatal(router.Run(":8080"))
}
