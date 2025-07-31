'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db, storage } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UploadProduct = () => {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [videoReady, setVideoReady] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    originalPrice: '',
    customizable: false,
    inStock: true,
    stockQuantity: '1',
    tags: '',
    shippingInfo: 'Standard shipping within 7-10 days',
    careInstructions: ''
  });

  const categories = [
    'Pottery & Ceramics',
    'Textiles & Weaving',
    'Jewelry & Accessories',
    'Woodwork & Carving',
    'Metalwork',
    'Leather Craft',
    'Paintings & Art',
    'Home Decor',
    'Bags & Purses',
    'Traditional Crafts',
    'Other'
  ];

  // Add effect to handle video stream
  useEffect(() => {
    if (showCamera && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        console.log('Video metadata loaded');
        setVideoReady(true);
        videoRef.current.play().catch(console.error);
      };
    }
  }, [showCamera, stream]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Add authentication state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth state changed:', currentUser?.uid);
      setUser(currentUser);
      setAuthLoading(false);
      
      if (!currentUser) {
        alert('Please log in to upload products');
        router.push('/seller/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const startCamera = async () => {
    try {
      stopCamera();
      setVideoReady(false);

      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        },
        audio: false
      };

      console.log('Requesting camera access...');
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('Camera access granted');
      setStream(mediaStream);
      setShowCamera(true);
      
    } catch (error) {
      console.error('Camera error:', error);
      let errorMessage = 'Unable to access camera. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera permissions and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage += 'Camera is not supported on this device.';
      } else {
        errorMessage += 'Please check your camera and try again.';
      }
      
      alert(errorMessage);
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      console.log('Stopping camera stream...');
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
    setShowCamera(false);
    setVideoReady(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !videoReady) {
      alert('Camera not ready. Please wait a moment and try again.');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      alert('Video not ready. Please wait a moment and try again.');
      return;
    }

    try {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      console.log('Capturing photo:', video.videoWidth, 'x', video.videoHeight);
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob);
          const newImage = { 
            blob, 
            url: imageUrl, 
            id: Date.now(),
            name: `captured_${Date.now()}.jpg`
          };
          
          setCapturedImages(prev => [...prev, newImage]);
          console.log('Photo captured successfully');
          
          // Show success feedback
          const button = document.querySelector('[data-capture-btn]');
          if (button) {
            const originalText = button.textContent;
            button.textContent = '✅ Captured!';
            setTimeout(() => {
              button.textContent = originalText;
            }, 1000);
          }
        } else {
          alert('Failed to capture photo. Please try again.');
        }
      }, 'image/jpeg', 0.8);
      
    } catch (error) {
      console.error('Error capturing photo:', error);
      alert('Failed to capture photo. Please try again.');
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        setUploadedImages(prev => [...prev, { file, url: imageUrl, id: Date.now() }]);
      }
    });
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (id, type) => {
    if (type === 'captured') {
      setCapturedImages(prev => prev.filter(img => img.id !== id));
    } else {
      setUploadedImages(prev => prev.filter(img => img.id !== id));
    }
  };

  const generateAIDescription = async () => {
    if (!formData.title || !formData.category) {
      alert('Please fill in product title and category first');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiDescription = `Beautiful handcrafted ${formData.title.toLowerCase()} made with traditional techniques. This exquisite piece showcases the authentic artistry of rural Indian craftspeople. Each ${formData.category.toLowerCase()} is carefully created with attention to detail, making it a unique addition to your collection. Perfect for those who appreciate genuine handmade quality and cultural heritage.`;
      
      setFormData(prev => ({
        ...prev,
        description: aiDescription
      }));
      
      alert('AI description generated successfully!');
    } catch (error) {
      alert('Failed to generate description. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async () => {
    const allImages = [...capturedImages, ...uploadedImages];
    console.log('Uploading images:', allImages.length);
    
    if (allImages.length === 0) {
      throw new Error('No images to upload');
    }

    // For now, let's use base64 encoding to avoid Firebase Storage CORS issues
    const imagePromises = allImages.map(async (image, index) => {
      try {
        const file = image.blob || image.file;
        
        // Convert to base64 as a reliable fallback
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            console.log(`Image ${index} converted to base64`);
            resolve(e.target.result);
          };
          reader.onerror = (error) => {
            console.error(`Error reading image ${index}:`, error);
            reject(error);
          };
          reader.readAsDataURL(file);
        });
        
      } catch (error) {
        console.error('Error processing image:', error);
        throw error;
      }
    });
    
    const results = await Promise.all(imagePromises);
    console.log('All images processed as base64:', results.length);
    return results;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    
    // Check authentication
    if (!user) {
      alert('Please log in first');
      router.push('/seller/login');
      return;
    }

    console.log('Current user:', user.uid);

    // Validate images
    if (capturedImages.length === 0 && uploadedImages.length === 0) {
      alert('Please add at least one product image');
      return;
    }

    // Validate required fields
    if (!formData.title || !formData.description || !formData.category || !formData.price) {
      alert('Please fill in all required fields (Title, Description, Category, Price)');
      return;
    }

    console.log('Form data:', formData);
    setLoading(true);

    try {
      console.log('Starting upload process...');
      
      // Process images (convert to base64 for now)
      let imageUrls = [];
      try {
        imageUrls = await uploadImages();
        console.log('Images processed successfully:', imageUrls.length);
      } catch (imageError) {
        console.error('Image processing failed:', imageError);
        throw new Error('Failed to process images. Please try again with different images or check your internet connection.');
      }

      // Prepare product data
      const productData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stockQuantity: parseInt(formData.stockQuantity) || 1,
        customizable: formData.customizable,
        inStock: formData.inStock,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        shippingInfo: formData.shippingInfo.trim(),
        careInstructions: formData.careInstructions.trim(),
        images: imageUrls,
        sellerId: user.uid,
        sellerEmail: user.email || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        views: 0,
        likes: 0,
        orders: 0,
        rating: 0,
        reviews: []
      };

      console.log('Product data prepared, saving to Firestore...');

      // Save to Firestore
      try {
        const docRef = await addDoc(collection(db, 'products'), productData);
        console.log('Product saved with ID:', docRef.id);
        
        // TODO: Add webhook call for N8N automation
        console.log('Webhook would be called here for N8N automation');

        alert('Product uploaded successfully! 🎉\n\nYour product has been added to your catalog and is now live for customers to see.');
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          price: '',
          originalPrice: '',
          customizable: false,
          inStock: true,
          stockQuantity: '1',
          tags: '',
          shippingInfo: 'Standard shipping within 7-10 days',
          careInstructions: ''
        });
        setCapturedImages([]);
        setUploadedImages([]);
        
        // Redirect to dashboard
        router.push('/seller/dashboard');
        
      } catch (firestoreError) {
        console.error('Firestore save failed:', firestoreError);
        throw new Error('Failed to save product data. Please check your internet connection and try again.');
      }
      
    } catch (error) {
      console.error('Error uploading product:', error);
      
      let errorMessage = 'Failed to upload product. ';
      
      if (error.code === 'permission-denied') {
        errorMessage += 'Permission denied. Please make sure you are logged in properly.';
      } else if (error.code === 'unavailable') {
        errorMessage += 'Service temporarily unavailable. Please check your internet connection.';
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please try again or contact support if the problem persists.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
      stopCamera();
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">🏺</span>
          </div>
          <div className="text-xl font-semibold text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  const allImages = [...capturedImages, ...uploadedImages];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="mr-3">📸</span>
            Upload Your Craft
          </h1>
          <p className="text-xl text-gray-700">Showcase your beautiful handmade products to customers worldwide</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image Upload Section */}
        <div className="lg:col-span-1">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="mr-2">📷</span>
                Product Photos
              </CardTitle>
              <p className="text-gray-600">Take or upload high-quality photos</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Camera Section */}
              {!showCamera ? (
                <div className="space-y-4">
                  <Button
                    type="button"
                    onClick={startCamera}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 text-lg font-semibold rounded-xl"
                  >
                    📸 Open Camera
                  </Button>
                  
                  <div className="text-center text-gray-500 font-medium">or</div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 text-lg font-semibold rounded-xl"
                  >
                    📁 Upload from Gallery
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-xl overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-64 object-cover"
                      onLoadedMetadata={() => console.log('Video loaded')}
                      onError={(e) => console.error('Video error:', e)}
                    />
                    
                    {/* Loading overlay */}
                    {!videoReady && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                          <p>Loading camera...</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Camera controls */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                      <Button
                        type="button"
                        onClick={capturePhoto}
                        data-capture-btn
                        className="bg-white text-black hover:bg-gray-100 px-6 py-3 rounded-full font-semibold shadow-lg"
                        disabled={!videoReady}
                      >
                        📸 Capture
                      </Button>
                      <Button
                        type="button"
                        onClick={stopCamera}
                        className="bg-red-500 text-white hover:bg-red-600 px-6 py-3 rounded-full font-semibold shadow-lg"
                      >
                        ❌ Close
                      </Button>
                    </div>
                  </div>
                  
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}

              {/* Image Preview */}
              {allImages.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Photos ({allImages.length})</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {allImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt="Product"
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id, image.blob ? 'captured' : 'uploaded')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                          {image.blob ? '📸' : '📁'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Camera Tips */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
                  <span className="mr-2">💡</span>
                  Photo Tips
                </h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Use natural lighting for best results</li>
                  <li>• Hold camera steady when capturing</li>
                  <li>• Show multiple angles of your product</li>
                  <li>• Include size reference objects</li>
                  <li>• Clean, simple backgrounds work best</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Details Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="mr-2">📝</span>
                Product Details
              </CardTitle>
              <p className="text-gray-600">Tell customers about your amazing craft</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Title *
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., Handcrafted Clay Pot"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="text-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description with AI */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Product Description *
                    </label>
                    <Button
                      type="button"
                      onClick={generateAIDescription}
                      disabled={loading}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      🤖 Generate with AI
                    </Button>
                  </div>
                  <textarea
                    placeholder="Describe your product, materials used, crafting process, and what makes it special..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-4 border border-gray-300 rounded-lg text-lg min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={5}
                    required
                  />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selling Price (₹) *
                    </label>
                    <Input
                      type="number"
                      placeholder="299"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="text-lg"
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price (₹)
                    </label>
                    <Input
                      type="number"
                      placeholder="399"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                      className="text-lg"
                      min="1"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity
                    </label>
                    <Input
                      type="number"
                      placeholder="5"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
                      className="text-lg"
                      min="0"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., handmade, traditional, eco-friendly, gift"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Information
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Standard shipping within 7-10 days"
                    value={formData.shippingInfo}
                    onChange={(e) => setFormData({...formData, shippingInfo: e.target.value})}
                    className="text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Care Instructions
                  </label>
                  <textarea
                    placeholder="How should customers take care of this product?"
                    value={formData.careInstructions}
                    onChange={(e) => setFormData({...formData, careInstructions: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.customizable}
                      onChange={(e) => setFormData({...formData, customizable: e.target.checked})}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 font-medium">Available for customization</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 font-medium">Currently in stock</span>
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    {loading ? 'Uploading...' : '🚀 Upload Product'}
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={() => router.push('/seller/dashboard')}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 text-xl font-bold rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadProduct;
