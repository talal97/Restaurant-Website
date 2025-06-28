'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { mockCategories, mockSettings, mockBranches, mockDeliveryZones } from '@/data/mockData';
import BannerSlider from '@/components/BannerSlider';
import BrandSection from '@/components/BrandSection';
import CategoryGrid from '@/components/CategoryGrid';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  const { setCategories, setSettings, setBranches, setZones } = useStore();

  useEffect(() => {
    // Initialize mock data
    setCategories(mockCategories);
    setSettings(mockSettings);
    setBranches(mockBranches);
    setZones(mockDeliveryZones);
  }, [setCategories, setSettings, setBranches, setZones]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Banner Slider */}
        <BannerSlider />
        
        {/* Brand Section */}
        <BrandSection />
        
        {/* Categories Grid */}
        <CategoryGrid />
      </main>
      
      <Footer />
    </div>
  );
}