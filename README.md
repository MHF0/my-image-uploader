# 🖼️ Modern Image Uploader

<div align="center">
  <p><em><a href="https://upload.mohammedfarhan.me" alt="upload">Fast, secure, and effortless image sharing - no sign-up required</a></em></p>
  
  ![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
  ![Status](https://img.shields.io/badge/status-active-success.svg)
  ![License](https://img.shields.io/badge/license-MIT-blue.svg)
</div>

<hr />

## ✨ Features

- **📤 Instant Upload** - Drag & drop or click to upload images effortlessly
- **🔗 Quick Sharing** - Get shareable links instantly with one-click copying
- **👁️ Image Preview** - Preview images before finalizing uploads
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **📊 Progress Tracking** - Real-time progress indicators for each upload
- **📥 Multiple File Support** - Upload multiple images simultaneously
- **🔒 Secure Storage** - Images are stored securely on Cloudinary
- **💾 Local Gallery** - View and manage your uploaded images even after page refresh

## 🚀 Tech Stack

<div align="center">
  <table>
    <tr>
      <td align="center" width="120">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40" height="40" alt="React" />
        <br>React
      </td>
      <td align="center" width="120">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="40" height="40" alt="TypeScript" />
        <br>TypeScript
      </td>
      <td align="center" width="120">
        <img src="https://tailwindcss.com/_next/static/media/tailwindcss-mark.d52e9897.svg" width="40" height="40" alt="Tailwind CSS" />
        <br>Tailwind CSS
      </td>
      <td align="center" width="120">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg" width="40" height="40" alt="Go" />
        <br>Go
      </td>
      <td align="center" width="120">
        <img src="https://uploader.mohammedfarhan.me/images/syihfukwoityjix25mxb.png" width="40" height="40" alt="Cloudinary" />
        <br>Cloudinary
      </td>
      <td align="center" width="120">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" width="40" height="40" alt="Docker" />
        <br>Docker
      </td>
    </tr>
  </table>
</div>

## 📷 Screenshots

<div align="center">
  <img src="https://upload.mohammedfarhan.me/uploads/fa8e3455.png" width="45%" alt="Home" />
  &nbsp;&nbsp;
  <img src="https://upload.mohammedfarhan.me/uploads/fbe148ba.png" width="45%" alt="Upload" />
  <br/><br/>
  <img src="https://upload.mohammedfarhan.me/uploads/404a3021.png" width="45%" alt="Gallery" />
</div>

## 🏗️ Architecture

The application follows a clean, simple architecture:

```
my-image-uploader/
├── frontend/             # React/TypeScript frontend
│   ├── src/              # Source code
│   ├── public/           # Static assets
│   └── ...               # Configuration files
├── server/               # Go backend API
│   ├── main.go           # Entry point
│   └── ...               # Additional modules
└── ...                   # Project files
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- Go (v1.18+)
- Cloudinary account (for image storage)
- Docker (optional, for containerized deployment)

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

The backend uses Go with Gin framework and Cloudinary for image storage.

```bash
# Navigate to server directory
cd server

# Install dependencies
go mod tidy

# Set up environment variables
# On Windows
set CLOUDINARY_CLOUD_NAME=your_cloud_name
set CLOUDINARY_API_KEY=your_api_key
set CLOUDINARY_API_SECRET=your_api_secret

# On Linux/Mac
export CLOUDINARY_CLOUD_NAME=your_cloud_name
export CLOUDINARY_API_KEY=your_api_key
export CLOUDINARY_API_SECRET=your_api_secret

# Run the Go server
go run main.go
```

### Docker Deployment

You can easily deploy the application using Docker:

```bash
# Build the Docker image
docker build -t image-uploader .

# Run the container
docker run -p 8080:8080 \
  -e CLOUDINARY_CLOUD_NAME=your_cloud_name \
  -e CLOUDINARY_API_KEY=your_api_key \
  -e CLOUDINARY_API_SECRET=your_api_secret \
  image-uploader
```

Or use Docker Compose:

```bash
# Create a .env file with your Cloudinary credentials first
# Then run:
docker-compose up -d
```

## CORS Configuration

The server includes CORS configuration to allow cross-origin requests. If you're experiencing CORS issues:

1. Ensure the frontend URL is added to the allowed origins in `main.go`:

```go
router.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"http://localhost:3000", "http://localhost:5173", "https://your-frontend-domain.com"},
    AllowMethods:     []string{"GET", "POST", "OPTIONS"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
    MaxAge:           12 * 60 * 60,
}))
```

2. Restart the server after making changes.

## 🧩 How It Works

1. **Upload** - Drag and drop or select images from your device
2. **Process** - Images are processed and uploaded to Cloudinary via the Go backend
3. **Share** - Copy the generated links to share your images instantly
4. **Manage** - View your uploaded images in the gallery (persisted in localStorage)

## 🔮 Future Enhancements

- User accounts for persistent image management
- Image editing capabilities
- Custom link customization
- Album creation and organization
- Enhanced security features
- Support for additional file types

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👨‍💻 Author

**Mohammed Farhan** - [GitHub Profile](https://github.com/mhf0)

---

<div align="center">
  <p>Made with ❤️ for the love of simple, effective solutions</p>
</div>
