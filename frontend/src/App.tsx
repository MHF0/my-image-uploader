import { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react'

interface StoredImage {
  preview: string;
  url: string;
}

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [savedImages, setSavedImages] = useState<StoredImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved images from localStorage when component mounts
  useEffect(() => {
    const storedImages = localStorage.getItem('savedImages');
    if (storedImages) {
      try {
        const parsedImages = JSON.parse(storedImages) as StoredImage[];
        setSavedImages(parsedImages);
      } catch (e) {
        console.error('Error parsing saved images from localStorage:', e);
        // If there's an error parsing, clear the localStorage
        localStorage.removeItem('savedImages');
      }
    }
  }, []);

  // Save successful uploads to localStorage
  const saveToLocalStorage = (preview: string, url: string) => {
    const newImage: StoredImage = { preview, url };
    const updatedImages = [...savedImages, newImage];
    setSavedImages(updatedImages);
    
    try {
      localStorage.setItem('savedImages', JSON.stringify(updatedImages));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
      setError('Failed to save image to local storage');
    }
  };

  // Remove image from saved images
  const removeFromGallery = (index: number) => {
    const updatedImages = [...savedImages];
    updatedImages.splice(index, 1);
    setSavedImages(updatedImages);
    
    try {
      localStorage.setItem('savedImages', JSON.stringify(updatedImages));
    } catch (e) {
      console.error('Error updating localStorage:', e);
    }
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    
    const newFiles = Array.from(selectedFiles);
    setFiles(prev => [...prev, ...newFiles]);
    
    // Generate previews
    newFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Initialize progress for new files
    setUploadProgress(prev => [...prev, ...Array(newFiles.length).fill(0)]);
    // Reset error if any
    setError(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setError(null);
    
    // Upload each file to the backend
    const uploadPromises = files.map(async (file, index) => {
      const formData = new FormData();
      formData.append('image', file);
      
      try {
        // Create XMLHttpRequest to track upload progress
        const xhr = new XMLHttpRequest();
        
        // Set up a promise to handle the response
        const uploadPromise = new Promise<string>((resolve, reject) => {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round((event.loaded / event.total) * 100);
              setUploadProgress(prev => {
                const newProgress = [...prev];
                newProgress[index] = percentComplete;
                return newProgress;
              });
            }
          });
          
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText);
                resolve(response.link);
              } catch (error) {
                reject(new Error('Invalid response format'));
              }
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          };
          
          xhr.onerror = () => {
            reject(new Error('Network error occurred'));
          };
        });
        
        // Start the upload
        xhr.open('POST', 'https://uploader.mohammedfarhan.me/upload', true);
        xhr.send(formData);
        
        // Wait for the upload to complete and return the URL
        const imageUrl = await uploadPromise;
        
        setUploadedUrls(prev => {
          const newUrls = [...prev];
          newUrls[index] = imageUrl;
          return newUrls;
        });
        
        // Save to localStorage
        saveToLocalStorage(previews[index], imageUrl);
        
        return imageUrl;
      } catch (error) {
        console.error(`Error uploading file ${index}:`, error);
        setError(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        // Set progress to 0 to indicate failure
        setUploadProgress(prev => {
          const newProgress = [...prev];
          newProgress[index] = 0;
          return newProgress;
        });
        
        return null;
      }
    });
    
    try {
      await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error during upload:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        // Use a more subtle notification approach
        const notification = document.createElement('div');
        notification.textContent = 'URL copied to clipboard!';
        notification.className = 'fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
        document.body.appendChild(notification);
        
        // Remove the notification after 2 seconds
        setTimeout(() => {
          notification.remove();
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy URL: ', err);
        setError('Failed to copy URL to clipboard');
      });
  };

  const clearAll = () => {
    setFiles([]);
    setPreviews([]);
    setUploadProgress([]);
    setUploadedUrls([]);
    setError(null);
  };

  const clearAllSaved = () => {
    setSavedImages([]);
    localStorage.removeItem('savedImages');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-500 mb-2">Mohammed Farhan Image Uploader</h1>
        <p className="text-gray-600">Upload and share images instantly - no sign-up required</p>
      </header>

      <main className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div 
          className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
        >
          <div className="text-blue-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <p className="text-gray-600 text-center">Drag and drop images here, or click to select</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleInputChange} 
            className="hidden" 
            accept="image/*" 
            multiple 
          />
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
            {error}
          </div>
        )}

        {previews.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-blue-500 mb-4">Preview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
              {previews.map((preview, index) => (
                <div key={index} className="rounded-lg overflow-hidden shadow-sm bg-white">
                  <img src={preview} alt={`Preview ${index}`} className="w-full h-48 object-cover" />
                  <div className="h-1.5 bg-gray-100 mx-2.5 my-2.5 rounded overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300" 
                      style={{ width: `${uploadProgress[index]}%` }}
                    ></div>
                  </div>
                  {uploadedUrls[index] && (
                    <div className="flex p-2.5 gap-1">
                      <input 
                        type="text" 
                        value={uploadedUrls[index]} 
                        readOnly 
                        className="flex-1 p-2 text-sm border border-gray-300 rounded text-gray-700 overflow-hidden text-ellipsis"
                      />
                      <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded transition-colors duration-300"
                        onClick={() => copyToClipboard(uploadedUrls[index])}
                      >
                        Copy
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {!isUploading && uploadedUrls.length !== files.length && (
                <button 
                  className={`px-5 py-2.5 rounded font-medium transition-colors duration-300 ${
                    files.length === 0 
                      ? 'bg-gray-300 cursor-not-allowed text-gray-600' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`} 
                  onClick={uploadFiles}
                  disabled={files.length === 0 || isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload Images'}
                </button>
              )}
              <button 
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2.5 rounded font-medium transition-colors duration-300"
                onClick={clearAll}
                disabled={isUploading}
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Saved Gallery from localStorage */}
        {savedImages.length > 0 && (
          <div className="mt-8 border-t pt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-500">Your Saved Gallery</h2>
              <button 
                className="text-sm text-red-500 hover:text-red-700 transition-colors"
                onClick={clearAllSaved}
              >
                Clear Gallery
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {savedImages.map((image, index) => (
                <div key={index} className="rounded-lg overflow-hidden shadow-sm bg-white relative group">
                  <img src={image.preview} alt={`Saved ${index}`} className="w-full h-48 object-cover" />
                  <button 
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFromGallery(index)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="flex p-2.5 gap-1">
                    <input 
                      type="text" 
                      value={image.url} 
                      readOnly 
                      className="flex-1 p-2 text-sm border border-gray-300 rounded text-gray-700 overflow-hidden text-ellipsis"
                    />
                    <button 
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded transition-colors duration-300"
                      onClick={() => copyToClipboard(image.url)}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current session uploads */}
        {uploadedUrls.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-blue-500 mb-4">Your Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {previews.map((preview, index) => (
                uploadedUrls[index] && (
                  <div key={index} className="rounded-lg overflow-hidden shadow-sm bg-white">
                    <img src={preview} alt={`Uploaded ${index}`} className="w-full h-48 object-cover" />
                    <div className="flex p-2.5 gap-1">
                      <input 
                        type="text" 
                        value={uploadedUrls[index]} 
                        readOnly 
                        className="flex-1 p-2 text-sm border border-gray-300 rounded text-gray-700 overflow-hidden text-ellipsis"
                      />
                      <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded transition-colors duration-300"
                        onClick={() => copyToClipboard(uploadedUrls[index])}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Mohammed Farhan Image Uploader - All rights reserved</p>
      </footer>
    </div>
  )
}

export default App
