'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useStore } from '@/store/useStore';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function BannerSlider() {
  const { settings } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const bannerImages = settings?.bannerImages || [
    'https://images.unsplash.com/photo-1546173159-315724a31696?w=800',
    'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800',
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [bannerImages.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  return (
    <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
      {/* Banner Images */}
      <div className="relative w-full h-full">
        {bannerImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image}
              alt={`Banner ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30" />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            التوصيل مجاناً
          </h1>
          <p className="text-lg sm:text-xl mb-6">
            SQUEEZED LEMONADE
          </p>
          <span className="inline-block bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium">
            NEW
          </span>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? 'bg-white'
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>
    </div>
  );
}