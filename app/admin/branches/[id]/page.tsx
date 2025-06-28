'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Branch, OperatingHours } from '@/types';
import {
  ArrowLeftIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  TrashIcon
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

export default function EditBranchPage() {
  const router = useRouter();
  const params = useParams();
  const { branches, setBranches, zones: deliveryZones } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [branch, setBranch] = useState<Branch | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    isActive: true
  });

  const [operatingHours, setOperatingHours] = useState<OperatingHours>({
    monday: { isOpen: true, open: '09:00', close: '22:00' },
    tuesday: { isOpen: true, open: '09:00', close: '22:00' },
    wednesday: { isOpen: true, open: '09:00', close: '22:00' },
    thursday: { isOpen: true, open: '09:00', close: '22:00' },
    friday: { isOpen: true, open: '09:00', close: '22:00' },
    saturday: { isOpen: true, open: '09:00', close: '22:00' },
    sunday: { isOpen: true, open: '09:00', close: '22:00' }
  });

  useEffect(() => {
    const foundBranch = branches.find(b => b.id === params.id);
    if (foundBranch) {
      setBranch(foundBranch);
      setFormData({
        name: foundBranch.name,
        address: foundBranch.address,
        phone: foundBranch.phone,
        email: foundBranch.email,
        isActive: foundBranch.isActive
      });
      setOperatingHours(foundBranch.operatingHours);
    } else {
      router.push('/admin/branches');
    }
  }, [branches, params.id, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Branch name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate operating hours
    DAYS.forEach(day => {
      const hours = operatingHours[day.key as keyof OperatingHours];
      if (hours.isOpen && hours.open >= hours.close) {
        newErrors[`${day.key}_hours`] = `${day.label}: Opening time must be before closing time`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !branch) {
      return;
    }

    setIsLoading(true);

    try {
      const updatedBranch: Branch = {
        ...branch,
        name: formData.name.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        isActive: formData.isActive,
        operatingHours
      };

      const updatedBranches = branches.map(b => 
        b.id === branch.id ? updatedBranch : b
      );
      setBranches(updatedBranches);

      router.push('/admin/branches');
    } catch (error) {
      console.error('Error updating branch:', error);
      setErrors({ submit: 'Failed to update branch. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!branch) return;
    
    if (confirm('Are you sure you want to delete this branch? This action cannot be undone.')) {
      const updatedBranches = branches.filter(b => b.id !== branch.id);
      setBranches(updatedBranches);
      router.push('/admin/branches');
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleHoursChange = (day: string, field: string, value: string | boolean) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof OperatingHours],
        [field]: value
      }
    }));
    
    const errorKey = `${day}_hours`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const copyHoursToAll = (sourceDay: string) => {
    const sourceHours = operatingHours[sourceDay as keyof OperatingHours];
    const newHours = { ...operatingHours };
    
    DAYS.forEach(day => {
      newHours[day.key as keyof OperatingHours] = { ...sourceHours };
    });
    
    setOperatingHours(newHours);
  };

  if (!branch) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading branch...</p>
        </div>
      </div>
    );
  }

  const branchZones = deliveryZones?.filter(zone => zone.branchId === branch.id) || [];

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
            <h1 className="text-2xl font-bold text-gray-900">Edit Branch</h1>
            <p className="text-gray-600 mt-1">Update branch information</p>
          </div>
        </div>
        
        <button
          onClick={handleDelete}
          className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <TrashIcon className="w-5 h-5" />
          <span>Delete Branch</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Branch Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`input-field ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter branch name"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`input-field pl-10 ${errors.address ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter full address"
                />
              </div>
              {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`input-field pl-10 ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter phone number"
                />
              </div>
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`input-field pl-10 ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
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
              <span className="ml-2 text-sm text-gray-700">Branch is active</span>
            </label>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ClockIcon className="w-5 h-5 mr-2" />
              Operating Hours
            </h2>
          </div>

          <div className="space-y-4">
            {DAYS.map((day, index) => {
              const hours = operatingHours[day.key as keyof OperatingHours];
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
                      <span className="ml-2 text-sm text-gray-700">Open</span>
                    </label>
                    
                    {hours.isOpen && (
                      <>
                        <div className="flex items-center space-x-2">
                          <input
                            type="time"
                            value={hours.open}
                            onChange={(e) => handleHoursChange(day.key, 'open', e.target.value)}
                            className="input-field w-32"
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="time"
                            value={hours.close}
                            onChange={(e) => handleHoursChange(day.key, 'close', e.target.value)}
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

        {/* Delivery Zones */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Delivery Zones</h2>
            <button
              type="button"
              onClick={() => router.push('/admin/delivery-zones/new?branchId=' + branch.id)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Add Zone
            </button>
          </div>
          
          {branchZones.length === 0 ? (
            <p className="text-gray-500 text-sm">No delivery zones assigned to this branch.</p>
          ) : (
            <div className="space-y-2">
              {branchZones.map(zone => (
                <div key={zone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">{zone.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      Fee: KWD {zone.deliveryFee} | Min Order: KWD {zone.minimumOrder}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push(`/admin/delivery-zones/${zone.id}`)}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Edit
                  </button>
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
            {isLoading ? 'Updating...' : 'Update Branch'}
          </button>
        </div>
      </form>
    </div>
  );
}