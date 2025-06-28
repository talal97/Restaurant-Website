'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useStore } from '@/store/useStore';
import { Product } from '@/types';
import {
  ArrowLeftIcon,
  PhotoIcon,
  TagIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface ProductOption {
  id: string;
  name: string;
  price: number;
  isRequired: boolean;
}

interface ProductAddon {
  id: string;
  name: string;
  options: ProductOption[];
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { products, setProducts, categories } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    categoryId: '',
    image: '',
    isActive: true
  });

  const [addons, setAddons] = useState<ProductAddon[]>([]);

  useEffect(() => {
    const productId = params.id as string;
    const foundProduct = products.find(p => p.id === productId);
    
    if (foundProduct) {
      setProduct(foundProduct);
      setFormData({
        name: foundProduct.name,
        description: foundProduct.description,
        price: foundProduct.price.toString(),
        originalPrice: foundProduct.originalPrice?.toString() || '',
        categoryId: foundProduct.categoryId,
        image: foundProduct.image,
        isActive: foundProduct.isActive
      });
      setImagePreview(foundProduct.image);
      setAddons(foundProduct.addons || []);
    } else {
      router.push('/admin/products');
    }
  }, [params.id, products, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Product price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (formData.originalPrice && (isNaN(Number(formData.originalPrice)) || Number(formData.originalPrice) <= 0)) {
      newErrors.originalPrice = 'Please enter a valid original price';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !product) {
      return;
    }

    setIsLoading(true);

    try {
      const updatedProduct: Product = {
        ...product,
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        categoryId: formData.categoryId,
        image: formData.image.trim(),
        isActive: formData.isActive,
        addons: addons
      };

      const updatedProducts = products.map(p => 
        p.id === product.id ? updatedProduct : p
      );
      setProducts(updatedProducts);

      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      setErrors({ submit: 'Failed to update product. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;

    setIsDeleting(true);

    try {
      const updatedProducts = products.filter(p => p.id !== product.id);
      setProducts(updatedProducts);
      router.push('/admin/products');
    } catch (error) {
      console.error('Error deleting product:', error);
      setErrors({ submit: 'Failed to delete product. Please try again.' });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
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

  const addAddon = () => {
    const newAddon: ProductAddon = {
      id: Date.now().toString(),
      name: '',
      options: []
    };
    setAddons([...addons, newAddon]);
  };

  const removeAddon = (addonId: string) => {
    setAddons(addons.filter(addon => addon.id !== addonId));
  };

  const updateAddon = (addonId: string, field: string, value: string) => {
    setAddons(addons.map(addon => 
      addon.id === addonId ? { ...addon, [field]: value } : addon
    ));
  };

  const addOption = (addonId: string) => {
    const newOption: ProductOption = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      isRequired: false
    };
    setAddons(addons.map(addon => 
      addon.id === addonId 
        ? { ...addon, options: [...addon.options, newOption] }
        : addon
    ));
  };

  const removeOption = (addonId: string, optionId: string) => {
    setAddons(addons.map(addon => 
      addon.id === addonId 
        ? { ...addon, options: addon.options.filter(option => option.id !== optionId) }
        : addon
    ));
  };

  const updateOption = (addonId: string, optionId: string, field: string, value: string | number | boolean) => {
    setAddons(addons.map(addon => 
      addon.id === addonId 
        ? {
            ...addon,
            options: addon.options.map(option => 
              option.id === optionId ? { ...option, [field]: value } : option
            )
          }
        : addon
    ));
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600 mt-1">Modify product information</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <TrashIcon className="w-4 h-4" />
          <span>Delete Product</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <div className="relative">
                <TagIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`input-field pl-10 ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter product name"
                />
              </div>
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="categoryId"
                value={formData.categoryId}
                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                className={`input-field ${errors.categoryId ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              >
                <option value="">Select a category</option>
                {categories.filter(c => c.isActive).map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-600 text-sm mt-1">{errors.categoryId}</p>}
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <div className="relative">
              <DocumentTextIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`input-field pl-10 ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter product description"
              />
            </div>
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price (KWD) *
              </label>
              <div className="relative">
                <CurrencyDollarIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  id="price"
                  step="0.001"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className={`input-field pl-10 ${errors.price ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="0.000"
                />
              </div>
              {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Original Price (KWD)
              </label>
              <div className="relative">
                <CurrencyDollarIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  id="originalPrice"
                  step="0.001"
                  min="0"
                  value={formData.originalPrice}
                  onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                  className={`input-field pl-10 ${errors.originalPrice ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="0.000"
                />
              </div>
              {errors.originalPrice && <p className="text-red-600 text-sm mt-1">{errors.originalPrice}</p>}
              <p className="text-xs text-gray-500 mt-1">Leave empty if no discount</p>
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Product is active</span>
              </label>
            </div>
          </div>
        </div>

        {/* Product Image */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Image</h2>
          
          <div className="space-y-4">
            {imagePreview ? (
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Product preview"
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

              <div className="text-center text-sm text-gray-500">OR</div>

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

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Sample Images (Click to use):</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
                  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop',
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

        {/* Product Add-ons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Product Add-ons</h2>
            <button
              type="button"
              onClick={addAddon}
              className="btn-secondary flex items-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Add-on</span>
            </button>
          </div>

          {addons.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No add-ons added yet. Add-ons allow customers to customize their order.</p>
          ) : (
            <div className="space-y-6">
              {addons.map((addon, addonIndex) => (
                <div key={addon.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <input
                      type="text"
                      value={addon.name}
                      onChange={(e) => updateAddon(addon.id, 'name', e.target.value)}
                      placeholder="Add-on name (e.g., Size, Extras)"
                      className="input-field flex-1 mr-4"
                    />
                    <button
                      type="button"
                      onClick={() => removeAddon(addon.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {addon.options.map((option, optionIndex) => (
                      <div key={option.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                        <input
                          type="text"
                          value={option.name}
                          onChange={(e) => updateOption(addon.id, option.id, 'name', e.target.value)}
                          placeholder="Option name"
                          className="input-field flex-1"
                        />
                        <div className="relative">
                          <CurrencyDollarIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <input
                            type="number"
                            step="0.001"
                            min="0"
                            value={option.price}
                            onChange={(e) => updateOption(addon.id, option.id, 'price', Number(e.target.value))}
                            placeholder="0.000"
                            className="input-field pl-9 w-24"
                          />
                        </div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={option.isRequired}
                            onChange={(e) => updateOption(addon.id, option.id, 'isRequired', e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Required</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => removeOption(addon.id, option.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors duration-200"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => addOption(addon.id)}
                      className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-primary-300 hover:text-primary-600 transition-colors duration-200"
                    >
                      + Add Option
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            {isLoading ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Product</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{product.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}