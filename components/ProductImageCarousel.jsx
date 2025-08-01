'use client';

import React, { useState } from 'react';

const ProductImageCarousel = ({ images, product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
        <div className="text-center">
          <span className="text-gray-400 text-6xl mb-2 block">🎨</span>
          <p className="text-gray-500 text-sm">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group bg-white rounded-t-2xl overflow-hidden">
      {/* Main Image Container */}
      <div className="w-full h-full relative">
        <img 
          src={images[currentImageIndex]} 
          alt={`${product.title} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          style={{
            objectPosition: 'center',
          }}
        />
        
        {/* Subtle overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Enhanced Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/95 backdrop-blur-sm text-gray-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg z-20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/95 backdrop-blur-sm text-gray-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg z-20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Enhanced Image Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-white scale-125 shadow-md' 
                  : 'bg-white/60 hover:bg-white/80 hover:scale-110'
              }`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          {currentImageIndex + 1}/{images.length}
        </div>
      )}
    </div>
  );
};

export default ProductImageCarousel;
