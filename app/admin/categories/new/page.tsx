'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useStore } from '@/store/useStore';
import { Category } from '@/types';
import {
  ArrowLeftIcon,
  PhotoIcon,
  TagIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function NewCategoryPage() {
  const router = useRouter();
  const { categories, setCategories } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Category description is required';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Category image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        image: formData.image.trim(),
        isActive: formData.isActive
      };

      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);

      router.push('/admin/categories');
    } catch (error) {
      console.error('Error creating category:', error);
      setErrors({ submit: 'Failed to create category. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to a server
      // For now, we'll create a local URL for preview
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      handleInputChange('image', imageUrl);
    }
  };

  const handleImageUrlChange = (url: string) => {
    handleInputChange('image', url);
    setImagePreview(url);
  };

  const removeImage = () => {
    setImagePreview(null);
    handleInputChange('image', '');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Category</h1>
          <p className="text-gray-600 mt-1">Create a new product category</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <div className="relative">
                <TagIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`input-field pl-10 ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter category name"
                />
              </div>
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Category is active</span>
              </label>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className={`input-field ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter category description"
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Category Image */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Image</h2>
          
          <div className="space-y-4">
            {/* Image Preview */}
            {imagePreview ? (
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Category preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No image selected</p>
                </div>
              </div>
            )}

            {/* Upload Options */}
            <div className="space-y-4">
              <div>
                <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image File
                </label>
                <input
                  type="file"
                  id="imageFile"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="input-field"
                />
              </div>

              <div className="text-center text-sm text-gray-500">
                OR
              </div>

              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  value={formData.image}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  className={`input-field ${errors.image ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
              </div>
            </div>

            {/* Sample Images */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Sample Images (Click to use):</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop',
                  'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
                  'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=300&h=200&fit=crop',
                  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop'
                ].map((sampleUrl, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleImageUrlChange(sampleUrl)}
                    className="relative h-20 bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-primary-500 transition-all duration-200"
                  >
                    <Image
                      src={sampleUrl}
                      alt={`Sample ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? 'Creating...' : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
  );
}