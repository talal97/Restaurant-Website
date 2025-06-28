'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useStore } from '@/store/useStore';
import { mockSettings } from '@/data/mockData';
import {
  PhotoIcon,
  XMarkIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const { settings, setSettings } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(settings?.logo || null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(settings?.bannerImages?.[0] || null);
  
  const [formData, setFormData] = useState({
    siteName: settings?.siteName || '',
    logo: settings?.logo || '',
    bannerImage: settings?.bannerImages?.[0] || '',
    whatsappNumber: settings?.whatsappNumber || '',
    currency: settings?.currency || 'USD',
    deliveryFee: settings?.defaultDeliveryFee?.toString() || '0',
    minimumOrder: '0',
    taxRate: settings?.taxRate?.toString() || '0',
    isDeliveryEnabled: true,
    isPickupEnabled: true
  });

  useEffect(() => {
    if (!settings) {
      setSettings(mockSettings);
    }
  }, [settings, setSettings]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.siteName.trim()) {
      newErrors.siteName = 'Site name is required';
    }

    if (!formData.logo.trim()) {
      newErrors.logo = 'Logo is required';
    }

    if (!formData.bannerImage.trim()) {
      newErrors.bannerImage = 'Banner image is required';
    }

    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'WhatsApp number is required';
    }

    if (!formData.deliveryFee.trim()) {
      newErrors.deliveryFee = 'Delivery fee is required';
    } else if (isNaN(Number(formData.deliveryFee)) || Number(formData.deliveryFee) < 0) {
      newErrors.deliveryFee = 'Please enter a valid delivery fee';
    }



    if (!formData.taxRate.trim()) {
      newErrors.taxRate = 'Tax rate is required';
    } else if (isNaN(Number(formData.taxRate)) || Number(formData.taxRate) < 0 || Number(formData.taxRate) > 100) {
      newErrors.taxRate = 'Please enter a valid tax rate (0-100%)';
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
    setSuccessMessage('');

    try {
      const updatedSettings = {
        id: settings?.id || '1',
        siteName: formData.siteName.trim(),
        logo: formData.logo.trim(),
        bannerImages: formData.bannerImage.trim() ? [formData.bannerImage.trim()] : settings?.bannerImages || [],
        whatsappNumber: formData.whatsappNumber.trim(),
        currency: formData.currency,
        defaultDeliveryFee: Number(formData.deliveryFee),
        taxRate: Number(formData.taxRate),
        updatedAt: new Date()
      };

      setSettings(updatedSettings);
      setSuccessMessage('Settings updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating settings:', error);
      setErrors({ submit: 'Failed to update settings. Please try again.' });
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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setLogoPreview(imageUrl);
      handleInputChange('logo', imageUrl);
    }
  };

  const handleLogoUrlChange = (url: string) => {
    handleInputChange('logo', url);
    setLogoPreview(url);
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBannerPreview(imageUrl);
      handleInputChange('bannerImage', imageUrl);
    }
  };

  const handleBannerUrlChange = (url: string) => {
    handleInputChange('bannerImage', url);
    setBannerPreview(url);
  };

  const removeLogo = () => {
    setLogoPreview(null);
    handleInputChange('logo', '');
  };

  const removeBanner = () => {
    setBannerPreview(null);
    handleInputChange('bannerImage', '');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your website configuration and preferences</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckIcon className="w-5 h-5 text-green-600" />
          <p className="text-green-600 text-sm">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <GlobeAltIcon className="w-6 h-6 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-2">
                Site Name *
              </label>
              <input
                type="text"
                id="siteName"
                value={formData.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                className={`input-field ${errors.siteName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter your restaurant name"
              />
              {errors.siteName && <p className="text-red-600 text-sm mt-1">{errors.siteName}</p>}
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                id="currency"
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="input-field"
              >
                <option value="KWD">KWD - Kuwaiti Dinar</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="SAR">SAR - Saudi Riyal</option>
                <option value="AED">AED - UAE Dirham</option>
              </select>
            </div>
          </div>
        </div>

        {/* Logo Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Logo</h2>
          
          <div className="space-y-4">
            {logoPreview ? (
              <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={logoPreview}
                  alt="Logo preview"
                  fill
                  className="object-contain p-2"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <PhotoIcon className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">No logo</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="logoFile" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Logo File
                </label>
                <input
                  type="file"
                  id="logoFile"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL *
                </label>
                <input
                  type="url"
                  id="logoUrl"
                  value={formData.logo}
                  onChange={(e) => handleLogoUrlChange(e.target.value)}
                  className={`input-field ${errors.logo ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="https://example.com/logo.png"
                />
                {errors.logo && <p className="text-red-600 text-sm mt-1">{errors.logo}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Banner Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Homepage Banner</h2>
          
          <div className="space-y-4">
            {bannerPreview ? (
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={bannerPreview}
                  alt="Banner preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={removeBanner}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No banner image</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bannerFile" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Banner File
                </label>
                <input
                  type="file"
                  id="bannerFile"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="bannerUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Banner URL *
                </label>
                <input
                  type="url"
                  id="bannerUrl"
                  value={formData.bannerImage}
                  onChange={(e) => handleBannerUrlChange(e.target.value)}
                  className={`input-field ${errors.bannerImage ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="https://example.com/banner.jpg"
                />
                {errors.bannerImage && <p className="text-red-600 text-sm mt-1">{errors.bannerImage}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Contact Settings</h2>
          </div>
          
          <div>
            <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp Number *
            </label>
            <input
              type="tel"
              id="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
              className={`input-field ${errors.whatsappNumber ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="+965XXXXXXXX"
            />
            {errors.whatsappNumber && <p className="text-red-600 text-sm mt-1">{errors.whatsappNumber}</p>}
            <p className="text-xs text-gray-500 mt-1">Include country code (e.g., +965 for Kuwait)</p>
          </div>
        </div>

        {/* Order Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CogIcon className="w-6 h-6 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Order Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="deliveryFee" className="block text-sm font-medium text-gray-700 mb-2">
                Default Delivery Fee ({formData.currency}) *
              </label>
              <input
                type="number"
                id="deliveryFee"
                step="0.001"
                min="0"
                value={formData.deliveryFee}
                onChange={(e) => handleInputChange('deliveryFee', e.target.value)}
                className={`input-field ${errors.deliveryFee ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="0.000"
              />
              {errors.deliveryFee && <p className="text-red-600 text-sm mt-1">{errors.deliveryFee}</p>}
            </div>

            <div>
              <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-2">
                Tax Rate (%) *
              </label>
              <input
                type="number"
                id="taxRate"
                step="0.1"
                min="0"
                max="100"
                value={formData.taxRate}
                onChange={(e) => handleInputChange('taxRate', e.target.value)}
                className={`input-field ${errors.taxRate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="0.0"
              />
              {errors.taxRate && <p className="text-red-600 text-sm mt-1">{errors.taxRate}</p>}
            </div>
          </div>


        </div>

        {/* Submit */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}