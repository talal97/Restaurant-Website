'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BuildingStorefrontIcon,
  MapPinIcon,
  Squares2X2Icon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalBranches: number;
  activeBranches: number;
  totalZones: number;
  activeZones: number;
  totalCategories: number;
  activeCategories: number;
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  todayRevenue: number;
  monthlyRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBranches: 2,
    activeBranches: 2,
    totalZones: 2,
    activeZones: 2,
    totalCategories: 6,
    activeCategories: 6,
    totalProducts: 6,
    activeProducts: 6,
    totalOrders: 45,
    pendingOrders: 3,
    todayRevenue: 125.50,
    monthlyRevenue: 3250.75
  });

  const quickActions = [
    {
      name: 'Add New Branch',
      href: '/admin/branches/new',
      icon: BuildingStorefrontIcon,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'Create Delivery Zone',
      href: '/admin/delivery-zones/new',
      icon: MapPinIcon,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'Add Category',
      href: '/admin/categories/new',
      icon: Squares2X2Icon,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      name: 'Add Product',
      href: '/admin/products/new',
      icon: ShoppingBagIcon,
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  const statCards = [
    {
      name: 'Total Branches',
      value: stats.totalBranches,
      subValue: `${stats.activeBranches} active`,
      icon: BuildingStorefrontIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Delivery Zones',
      value: stats.totalZones,
      subValue: `${stats.activeZones} published`,
      icon: MapPinIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Categories',
      value: stats.totalCategories,
      subValue: `${stats.activeCategories} active`,
      icon: Squares2X2Icon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'Products',
      value: stats.totalProducts,
      subValue: `${stats.activeProducts} active`,
      icon: ShoppingBagIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      name: 'Total Orders',
      value: stats.totalOrders,
      subValue: `${stats.pendingOrders} pending`,
      icon: ClipboardDocumentListIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      name: 'Today Revenue',
      value: `KWD ${stats.todayRevenue.toFixed(3)}`,
      subValue: `Monthly: KWD ${stats.monthlyRevenue.toFixed(3)}`,
      icon: CurrencyDollarIcon,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your restaurant operations from here</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className={`${action.color} text-white p-4 rounded-lg transition-colors duration-200 flex items-center space-x-3`}
            >
              <action.icon className="w-6 h-6" />
              <span className="font-medium">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.subValue}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((order) => (
              <div key={order} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Order #00{order}</p>
                  <p className="text-sm text-gray-600">Customer Name</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">KWD 12.50{order}</p>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Website Status</span>
              <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Payment Gateway</span>
              <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Delivery Service</span>
              <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Available
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}