'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { mockProducts } from '@/data/mockData';
import { Product, Category } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;
  const { categories, setProducts } = useStore();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProductsState] = useState<Product[]>([]);

  useEffect(() => {
    // Initialize products data
    setProducts(mockProducts);
    
    // Find the category
    const foundCategory = categories.find(cat => cat.id === categoryId);
    setCategory(foundCategory || null);
    
    // Filter products by category
    const categoryProducts = mockProducts.filter(product => product.categoryId === categoryId && product.isActive);
    setProductsState(categoryProducts);
  }, [categoryId, categories, setProducts]);

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <Link href="/" className="text-primary-600 hover:text-primary-700">
              Return to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button & Category Header */}
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 relative rounded-lg overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-gray-600 mt-1">{category.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid - 2 columns on mobile, 3 on tablet, 4 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Product Image */}
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                
                {/* Product Info */}
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {/* Price */}
                  <div className="mt-2">
                    {product.variants.length > 0 ? (
                      <div className="text-sm sm:text-base">
                        {product.variants.length === 1 ? (
                          <span className="font-bold text-primary-600">
                            KWD {product.variants[0].price.toFixed(3)}
                          </span>
                        ) : (
                          <span className="text-gray-600">
                            Price on select...
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Price not available</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Available</h3>
            <p className="text-gray-600">Products in this category will appear here once they are added.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}