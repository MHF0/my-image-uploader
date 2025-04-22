# 🖼️ Modern Image Uploader

<div align="center">
  <p><em><a href="https://upload.mohammedfarhan.me">Fast, secure, and effortless image sharing - no sign-up required</a></em></p>
  
  ![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
  ![Status](https://img.shields.io/badge/status-active-success.svg)
</div>

<hr />

## ✨ Features

- **📤 Instant Upload** - Drag & drop or click to upload images effortlessly
- **🔗 Quick Sharing** - Get shareable links instantly with one-click copying
- **👁️ Image Preview** - Preview images before finalizing uploads
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **📊 Progress Tracking** - Real-time progress indicators for each upload
- **📥 Multiple File Support** - Upload multiple images simultaneously
- **🔒 Secure Storage** - Images are stored securely on our servers

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
│   ├── uploads/          # Image storage
│   └── ...               # Additional modules
└── ...                   # Project files
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v22+)
- Go (v1.24+)
- Docker (optional)

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
```bash
# Navigate to server directory
cd server

# Run the Go server
go run main.go
```

### Docker Setup (Optional)
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🧩 How It Works

1. **Upload** - Drag and drop or select images from your device
2. **Process** - Images are processed and stored securely on our servers
3. **Share** - Copy the generated links to share your images instantly
4. **Manage** - View your uploaded images in the gallery

## 🔮 Future Enhancements

- User accounts for persistent image management
- Image editing capabilities
- Custom link customization
- Album creation and organization
- Enhanced security features

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
