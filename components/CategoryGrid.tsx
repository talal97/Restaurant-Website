'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/store/useStore';

export default function CategoryGrid() {
  const { categories } = useStore();
  const activeCategories = categories.filter(category => category.isActive);

  return (
    <section className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Container - 2 columns on mobile, 3 on tablet, 4 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {activeCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Category Image */}
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  
                  {/* Special Badge for New Items */}
                  {category.name === 'New Items' && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        NEW
                      </span>
                    </div>
                  )}
                  
                  {/* Special Badge for Best Offers */}
                  {category.name === 'Best Offers' && (
                    <div className="absolute top-2 left-2">
                      <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full relative">
                        <div className="absolute -top-1 -left-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                          <span className="text-[10px] font-bold">SUPER</span>
                        </div>
                        <span className="ml-4">OFFER!</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Category Info */}
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-primary-600 transition-colors duration-200">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Empty State */}
        {activeCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Categories Available</h3>
            <p className="text-gray-600">Categories will appear here once they are added.</p>
          </div>
        )}
      </div>
    </section>
  );
}