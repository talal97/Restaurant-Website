'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { DeliveryZone, DeliveryHours } from '@/types';
import {
  ArrowLeftIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
];

const DEFAULT_HOURS = {
  isOpen: true,
  from: '09:00',
  to: '22:00'
};

export default function NewDeliveryZonePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { zones: deliveryZones, setZones: setDeliveryZones, branches } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: '',
    branchId: searchParams.get('branchId') || '',
    deliveryFee: '',
    minimumOrder: '',
    deliveryTime: '',
    isActive: true
  });

  const [deliveryHours, setDeliveryHours] = useState<DeliveryHours>({
    monday: { ...DEFAULT_HOURS },
    tuesday: { ...DEFAULT_HOURS },
    wednesday: { ...DEFAULT_HOURS },
    thursday: { ...DEFAULT_HOURS },
    friday: { ...DEFAULT_HOURS },
    saturday: { ...DEFAULT_HOURS },
    sunday: { ...DEFAULT_HOURS }
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Zone name is required';
    }

    if (!formData.branchId) {
      newErrors.branchId = 'Please select a branch';
    }

    if (!formData.deliveryFee.trim()) {
      newErrors.deliveryFee = 'Delivery fee is required';
    } else if (isNaN(Number(formData.deliveryFee)) || Number(formData.deliveryFee) < 0) {
      newErrors.deliveryFee = 'Please enter a valid delivery fee';
    }

    if (!formData.minimumOrder.trim()) {
      newErrors.minimumOrder = 'Minimum order amount is required';
    } else if (isNaN(Number(formData.minimumOrder)) || Number(formData.minimumOrder) < 0) {
      newErrors.minimumOrder = 'Please enter a valid minimum order amount';
    }

    if (!formData.deliveryTime.trim()) {
      newErrors.deliveryTime = 'Delivery time is required';
    } else if (isNaN(Number(formData.deliveryTime)) || Number(formData.deliveryTime) <= 0) {
      newErrors.deliveryTime = 'Please enter a valid delivery time in minutes';
    }

    // Validate delivery hours
    DAYS.forEach(day => {
      const hours = deliveryHours[day.key as keyof DeliveryHours];
      if (hours.isOpen && hours.from >= hours.to) {
        newErrors[`${day.key}_hours`] = `${day.label}: Start time must be before end time`;
      }
    });

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
      const newZone: DeliveryZone = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        branchId: formData.branchId,
        deliveryFee: Number(formData.deliveryFee),
        minimumOrder: Number(formData.minimumOrder),
        deliveryTime: Number(formData.deliveryTime),
        isActive: formData.isActive,
        deliveryHours
      };

      const updatedZones = [...deliveryZones, newZone];
      setDeliveryZones(updatedZones);

      router.push('/admin/delivery-zones');
    } catch (error) {
      console.error('Error creating delivery zone:', error);
      setErrors({ submit: 'Failed to create delivery zone. Please try again.' });
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

  const handleHoursChange = (day: string, field: string, value: string | boolean) => {
    setDeliveryHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof DeliveryHours],
        [field]: value
      }
    }));
    
    const errorKey = `${day}_hours`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const copyHoursToAll = (sourceDay: string) => {
    const sourceHours = deliveryHours[sourceDay as keyof DeliveryHours];
    const newHours = { ...deliveryHours };
    
    DAYS.forEach(day => {
      newHours[day.key as keyof DeliveryHours] = { ...sourceHours };
    });
    
    setDeliveryHours(newHours);
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
          <h1 className="text-2xl font-bold text-gray-900">Add New Delivery Zone</h1>
          <p className="text-gray-600 mt-1">Create a new delivery zone for a branch</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Zone Name *
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`input-field pl-10 ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter zone name (e.g., Downtown, Suburb Area)"
                />
              </div>
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Branch *
              </label>
              <div className="relative">
                <BuildingStorefrontIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  id="branchId"
                  value={formData.branchId}
                  onChange={(e) => handleInputChange('branchId', e.target.value)}
                  className={`input-field pl-10 ${errors.branchId ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                >
                  <option value="">Select a branch</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.branchId && <p className="text-red-600 text-sm mt-1">{errors.branchId}</p>}
            </div>

            <div>
              <label htmlFor="deliveryFee" className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Fee (KWD) *
              </label>
              <div className="relative">
                <CurrencyDollarIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  id="deliveryFee"
                  value={formData.deliveryFee}
                  onChange={(e) => handleInputChange('deliveryFee', e.target.value)}
                  className={`input-field pl-10 ${errors.deliveryFee ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              {errors.deliveryFee && <p className="text-red-600 text-sm mt-1">{errors.deliveryFee}</p>}
            </div>

            <div>
              <label htmlFor="minimumOrder" className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Order (KWD) *
              </label>
              <div className="relative">
                <CurrencyDollarIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  id="minimumOrder"
                  value={formData.minimumOrder}
                  onChange={(e) => handleInputChange('minimumOrder', e.target.value)}
                  className={`input-field pl-10 ${errors.minimumOrder ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              {errors.minimumOrder && <p className="text-red-600 text-sm mt-1">{errors.minimumOrder}</p>}
            </div>

            <div>
              <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Time (Minutes) *
              </label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  id="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                  className={`input-field pl-10 ${errors.deliveryTime ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="30"
                  min="1"
                />
              </div>
              {errors.deliveryTime && <p className="text-red-600 text-sm mt-1">{errors.deliveryTime}</p>}
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Zone is active</span>
            </label>
          </div>
        </div>

        {/* Delivery Hours */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ClockIcon className="w-5 h-5 mr-2" />
              Delivery Hours
            </h2>
          </div>

          <div className="space-y-4">
            {DAYS.map((day, index) => {
              const hours = deliveryHours[day.key as keyof DeliveryHours];
              const errorKey = `${day.key}_hours`;
              
              return (
                <div key={day.key} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="w-24">
                    <span className="text-sm font-medium text-gray-700">{day.label}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 flex-1">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={hours.isOpen}
                        onChange={(e) => handleHoursChange(day.key, 'isOpen', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Available</span>
                    </label>
                    
                    {hours.isOpen && (
                      <>
                        <div className="flex items-center space-x-2">
                          <input
                            type="time"
                            value={hours.from}
                            onChange={(e) => handleHoursChange(day.key, 'from', e.target.value)}
                            className="input-field w-32"
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="time"
                            value={hours.to}
                            onChange={(e) => handleHoursChange(day.key, 'to', e.target.value)}
                            className="input-field w-32"
                          />
                        </div>
                        
                        {index === 0 && (
                          <button
                            type="button"
                            onClick={() => copyHoursToAll(day.key)}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                          >
                            Copy to all days
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  
                  {errors[errorKey] && (
                    <p className="text-red-600 text-sm w-full sm:w-auto">{errors[errorKey]}</p>
                  )}
                </div>
              );
            })}
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
            {isLoading ? 'Creating...' : 'Create Zone'}
          </button>
        </div>
      </form>
    </div>
  );
}