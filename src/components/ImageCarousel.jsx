import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageCarousel = () => {
  // Sample image array - replace with your own images
  const images = [
   "vite.svg",
   "vite.svg",
   "vite.svg",
   "vite.svg",
   "vite.svg"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % images.length
      );
    }, 3000);

    return () => clearInterval(slideInterval);
  }, [images.length]);

  return (
    <div className="relative w-full h-[70vh] max-h-[600px] mx-auto overflow-hidden">
      <AnimatePresence>
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            transition: { 
              duration: 1, 
              ease: "easeInOut" 
            } 
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.9,
            transition: { 
              duration: 0.5 
            } 
          }}
          className="absolute inset-0 w-full h-full"
        >
          <img 
            src={images[currentIndex]} 
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${currentIndex === index 
                ? 'bg-white scale-125 shadow-lg' 
                : 'bg-white/50 hover:bg-white/75'}
            `}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={() => setCurrentIndex((prevIndex) => 
          (prevIndex - 1 + images.length) % images.length
        )}
        className="absolute left-5 top-1/2 transform -translate-y-1/2 
          bg-black/30 text-white p-2 rounded-full hover:bg-black/50 
          transition-all duration-300"
      >
        ←
      </button>
      <button 
        onClick={() => setCurrentIndex((prevIndex) => 
          (prevIndex + 1) % images.length
        )}
        className="absolute right-5 top-1/2 transform -translate-y-1/2 
          bg-black/30 text-white p-2 rounded-full hover:bg-black/50 
          transition-all duration-300"
      >
        →
      </button>
    </div>
  );
};

export default ImageCarousel;