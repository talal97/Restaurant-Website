'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { mockDeliveryZones } from '@/data/mockData';
import { DeliveryZone } from '@/types';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export default function DeliveryZonesPage() {
  const { zones: deliveryZones, setZones: setDeliveryZones, branches } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    setDeliveryZones(mockDeliveryZones);
  }, [setDeliveryZones]);

  const filteredZones = deliveryZones.filter((zone: DeliveryZone) => {
    const matchesSearch = zone.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter === 'all' || zone.branchId === branchFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && zone.isActive) ||
                         (statusFilter === 'inactive' && !zone.isActive);
    return matchesSearch && matchesBranch && matchesStatus;
  });

  const toggleZoneStatus = (zoneId: string) => {
    const updatedZones = deliveryZones.map((zone: DeliveryZone) => 
      zone.id === zoneId ? { ...zone, isActive: !zone.isActive } : zone
    );
    setDeliveryZones(updatedZones);
  };

  const deleteZone = (zoneId: string) => {
    if (confirm('Are you sure you want to delete this delivery zone?')) {
      const updatedZones = deliveryZones.filter((zone: DeliveryZone) => zone.id !== zoneId);
      setDeliveryZones(updatedZones);
    }
  };

  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : 'Unknown Branch';
  };

  const isZoneCurrentlyActive = (zone: DeliveryZone) => {
    if (!zone.isActive) return false;
    
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.toTimeString().slice(0, 5);
    
    const daySchedule = zone.deliveryHours[currentDay as keyof typeof zone.deliveryHours];
    if (!daySchedule || !daySchedule.isOpen) return false;
    
    return currentTime >= daySchedule.from && currentTime <= daySchedule.to;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Zones</h1>
          <p className="text-gray-600 mt-1">Manage delivery zones for your branches</p>
        </div>
        <Link
          href="/admin/delivery-zones/new"
          className="mt-4 sm:mt-0 inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Zone</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Zones
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by zone name..."
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">
              Branch Filter
            </label>
            <select
              id="branch"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Branches</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
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
              <option value="all">All Zones</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              Showing {filteredZones.length} of {deliveryZones.length} zones
            </div>
          </div>
        </div>
      </div>

      {/* Zones List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredZones.length === 0 ? (
          <div className="text-center py-12">
            <MapPinIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No delivery zones found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first delivery zone.</p>
            <Link
              href="/admin/delivery-zones/new"
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add First Zone</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zone Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Time
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredZones.map((zone: DeliveryZone) => {
                  const isCurrentlyActive = isZoneCurrentlyActive(zone);
                  return (
                    <tr key={zone.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{zone.name}</div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            Zone coverage area
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{getBranchName(zone.branchId)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                          KWD {zone.deliveryFee}
                        </div>
                        <div className="text-sm text-gray-500">
                          Min: KWD {zone.minimumOrder}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            zone.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {zone.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {zone.isActive && (
                            <div className={`text-xs flex items-center ${
                              isCurrentlyActive ? 'text-green-600' : 'text-red-600'
                            }`}>
                              <ClockIcon className="w-3 h-3 mr-1" />
                              {isCurrentlyActive ? 'Delivering' : 'Closed'}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {zone.deliveryTime} mins
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/delivery-zones/${zone.id}`}
                            className="text-primary-600 hover:text-primary-900 p-1"
                            title="Edit"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => toggleZoneStatus(zone.id)}
                            className={`p-1 ${
                              zone.isActive 
                                ? 'text-red-600 hover:text-red-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                            title={zone.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {zone.isActive ? (
                              <EyeSlashIcon className="w-4 h-4" />
                            ) : (
                              <EyeIcon className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteZone(zone.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}