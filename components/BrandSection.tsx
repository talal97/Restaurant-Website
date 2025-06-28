'use client';

import Image from 'next/image';
import { useStore } from '@/store/useStore';

export default function BrandSection() {
  const { settings } = useStore();

  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-6">
          {/* Brand Name */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              {settings?.siteName || 'AseerTime'}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              (You Are Loved)
            </p>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative">
              {settings?.logo ? (
                <Image
                  src={settings.logo}
                  alt={`${settings.siteName} Logo`}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg sm:text-xl md:text-2xl">
                    AT
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Brand Badge */}
        <div className="flex justify-center mt-6">
          <div className="bg-primary-600 text-white px-6 py-2 rounded-full">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold text-sm">AT</span>
              </div>
              <span className="font-medium">ASEER TIME</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}