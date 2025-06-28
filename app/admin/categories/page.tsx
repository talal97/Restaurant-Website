'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/store/useStore';
import { mockCategories } from '@/data/mockData';
import { Category } from '@/types';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  PhotoIcon,
  TagIcon
} from '@heroicons/react/24/outline';

export default function CategoriesPage() {
  const { categories, setCategories } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    setCategories(mockCategories);
  }, [setCategories]);

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && category.isActive) ||
                         (statusFilter === 'inactive' && !category.isActive);
    return matchesSearch && matchesStatus;
  });

  const toggleCategoryStatus = (categoryId: string) => {
    const updatedCategories = categories.map(category => 
      category.id === categoryId ? { ...category, isActive: !category.isActive } : category
    );
    setCategories(updatedCategories);
  };

  const deleteCategory = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      const updatedCategories = categories.filter(category => category.id !== categoryId);
      setCategories(updatedCategories);
    }
  };

  const moveCategory = (categoryId: string, direction: 'up' | 'down') => {
    const currentIndex = categories.findIndex(cat => cat.id === categoryId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= categories.length) return;

    const updatedCategories = [...categories];
    [updatedCategories[currentIndex], updatedCategories[newIndex]] = 
    [updatedCategories[newIndex], updatedCategories[currentIndex]];
    
    setCategories(updatedCategories);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Manage your product categories</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="mt-4 sm:mt-0 inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Category</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Categories
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or description..."
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status Filter
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="input-field"
            >
              <option value="all">All Categories</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              Showing {filteredCategories.length} of {categories.length} categories
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <TagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first category.</p>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add First Category</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category, index) => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              {/* Category Image */}
              <div className="relative h-48 bg-gray-100">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <PhotoIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    category.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Order Controls */}
                <div className="absolute top-3 right-3 flex flex-col space-y-1">
                  <button
                    onClick={() => moveCategory(category.id, 'up')}
                    disabled={index === 0}
                    className="p-1 bg-white rounded shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveCategory(category.id, 'down')}
                    disabled={index === filteredCategories.length - 1}
                    className="p-1 bg-white rounded shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Category Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.description}</p>
                
                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="text-primary-600 hover:text-primary-900 p-1"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => toggleCategoryStatus(category.id)}
                      className={`p-1 ${
                        category.isActive 
                          ? 'text-red-600 hover:text-red-900' 
                          : 'text-green-600 hover:text-green-900'
                      }`}
                      title={category.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {category.isActive ? (
                        <EyeSlashIcon className="w-4 h-4" />
                      ) : (
                        <EyeIcon className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <Link
                    href={`/admin/products?category=${category.id}`}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    View Products
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reorder Notice */}
      {filteredCategories.length > 1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-900">Category Ordering</h4>
              <p className="text-sm text-blue-700 mt-1">
                Use the up/down arrows on each category to reorder them. The order here determines how they appear on your website.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}