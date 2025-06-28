'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { mockBranches } from '@/data/mockData';
import { Branch } from '@/types';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ClockIcon,
  MapPinIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

export default function BranchesPage() {
  const { branches, setBranches } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    setBranches(mockBranches);
  }, [setBranches]);

  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && branch.isActive) ||
                         (statusFilter === 'inactive' && !branch.isActive);
    return matchesSearch && matchesStatus;
  });

  const toggleBranchStatus = (branchId: string) => {
    const updatedBranches = branches.map(branch => 
      branch.id === branchId ? { ...branch, isActive: !branch.isActive } : branch
    );
    setBranches(updatedBranches);
  };

  const deleteBranch = (branchId: string) => {
    if (confirm('Are you sure you want to delete this branch?')) {
      const updatedBranches = branches.filter(branch => branch.id !== branchId);
      setBranches(updatedBranches);
    }
  };

  const getOperatingStatus = (branch: Branch) => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof typeof branch.operatingHours;
    const currentTime = now.toTimeString().slice(0, 5);
    
    const daySchedule = branch.operatingHours[currentDay];
    if (!daySchedule || !daySchedule.isOpen) {
      return { status: 'Closed', color: 'text-red-600' };
    }
    
    if (currentTime >= daySchedule.open && currentTime <= daySchedule.close) {
      return { status: 'Open', color: 'text-green-600' };
    }
    
    return { status: 'Closed', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branches</h1>
          <p className="text-gray-600 mt-1">Manage your restaurant branches</p>
        </div>
        <Link
          href="/admin/branches/new"
          className="mt-4 sm:mt-0 inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Branch</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Branches
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or address..."
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
              <option value="all">All Branches</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              Showing {filteredBranches.length} of {branches.length} branches
            </div>
          </div>
        </div>
      </div>

      {/* Branches List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredBranches.length === 0 ? (
          <div className="text-center py-12">
            <BuildingStorefrontIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first branch.</p>
            <Link
              href="/admin/branches/new"
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add First Branch</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branch Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Zones
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBranches.map((branch) => {
                  const operatingStatus = getOperatingStatus(branch);
                  return (
                    <tr key={branch.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{branch.name}</div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            {branch.address}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{branch.phone}</div>
                        <div className="text-sm text-gray-500">{branch.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            branch.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {branch.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <div className={`text-xs flex items-center ${operatingStatus.color}`}>
                            <ClockIcon className="w-3 h-3 mr-1" />
                            {operatingStatus.status}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {branch.deliveryZones.length} zone(s)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/branches/${branch.id}`}
                            className="text-primary-600 hover:text-primary-900 p-1"
                            title="Edit"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => toggleBranchStatus(branch.id)}
                            className={`p-1 ${
                              branch.isActive 
                                ? 'text-red-600 hover:text-red-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                            title={branch.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {branch.isActive ? (
                              <EyeSlashIcon className="w-4 h-4" />
                            ) : (
                              <EyeIcon className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteBranch(branch.id)}
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