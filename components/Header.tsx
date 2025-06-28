'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { ShoppingCartIcon, MapPinIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { selectedBranch, selectedZone, getCartItemsCount, settings } = useStore();
  const cartItemsCount = getCartItemsCount();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">AT</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              {settings?.siteName || 'AseerTime'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium">
              Home
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-primary-600 font-medium">
              Menu
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 font-medium">
              Contact
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Location Selector */}
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <MapPinIcon className="w-4 h-4" />
              <span>
                {selectedZone ? selectedZone.name : 'Select Location'}
              </span>
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-primary-600">
              <ShoppingCartIcon className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            <Link href="/account" className="p-2 text-gray-700 hover:text-primary-600">
              <UserIcon className="w-6 h-6" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary-600"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/categories"
                className="text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Menu
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Mobile Location */}
              <div className="flex items-center space-x-2 text-sm text-gray-600 pt-2 border-t border-gray-200">
                <MapPinIcon className="w-4 h-4" />
                <span>
                  {selectedZone ? selectedZone.name : 'Select Location'}
                </span>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}