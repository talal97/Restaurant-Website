'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useStore } from '@/store/useStore';
import { mockProducts } from '@/data/mockData';
import { Product, ProductVariant, ProductAddon, CartItem } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeftIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { v4 as uuidv4 } from 'uuid';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { addToCart } = useStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<{[key: string]: any}>({});
  const [quantity, setQuantity] = useState(1);
  const [customerNote, setCustomerNote] = useState('');

  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      // Set default variant
      const defaultVariant = foundProduct.variants.find(v => v.isDefault) || foundProduct.variants[0];
      setSelectedVariant(defaultVariant);
    }
  }, [productId]);

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  const handleAddonChange = (addon: ProductAddon, selected: boolean) => {
    setSelectedAddons(prev => ({
      ...prev,
      [addon.id]: selected ? addon : null
    }));
  };

  const calculateTotalPrice = () => {
    if (!selectedVariant) return 0;
    
    let total = selectedVariant.price;
    
    // Add addon prices
    Object.values(selectedAddons).forEach(addon => {
      if (addon) {
        total += addon.price;
      }
    });
    
    return total * quantity;
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    
    const cartItem: CartItem = {
      id: uuidv4(),
      productId: product.id,
      product,
      variantId: selectedVariant.id,
      variant: selectedVariant,
      addons: Object.values(selectedAddons)
        .filter(addon => addon)
        .map(addon => ({
          addonId: addon.id,
          addon,
          selectedOptions: [] // For future expansion
        })),
      quantity,
      customerNote,
      totalPrice: calculateTotalPrice()
    };
    
    addToCart(cartItem);
    router.push('/cart');
  };

  const canAddToCart = () => {
    if (!selectedVariant) return false;
    
    // Check if all required addons are selected
    const requiredAddons = product?.addons.filter(addon => addon.isRequired) || [];
    return requiredAddons.every(addon => selectedAddons[addon.id]);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <button onClick={() => router.back()} className="text-primary-600 hover:text-primary-700">
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Product Image */}
          <div className="aspect-square sm:aspect-video lg:aspect-square relative bg-primary-50">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="p-6">
            {/* Product Title & Description */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            {product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
                <div className="space-y-2">
                  {product.variants.map((variant) => (
                    <label
                      key={variant.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="variant"
                          value={variant.id}
                          checked={selectedVariant?.id === variant.id}
                          onChange={() => handleVariantChange(variant)}
                          className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                        <span className="ml-3 font-medium text-gray-900">
                          {variant.name}
                        </span>
                      </div>
                      <span className="font-bold text-primary-600">
                        KWD {variant.price.toFixed(3)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Addons */}
            {product.addons.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Add-ons</h3>
                <div className="space-y-2">
                  {product.addons.map((addon) => (
                    <label
                      key={addon.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!!selectedAddons[addon.id]}
                          onChange={(e) => handleAddonChange(addon, e.target.checked)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <div className="ml-3">
                          <span className="font-medium text-gray-900">
                            {addon.name}
                            {addon.isRequired && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-primary-600">
                        +KWD {addon.price.toFixed(3)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Note */}
            <div className="mb-6">
              <label htmlFor="note" className="block text-lg font-semibold text-gray-900 mb-3">
                Customer Instructions / Note
              </label>
              <textarea
                id="note"
                rows={3}
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="Any special instructions for your order..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center justify-between">
              {/* Quantity Selector */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="text-xl font-semibold w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!canAddToCart()}
                className="flex-1 ml-6 bg-secondary-500 hover:bg-secondary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Add to Cart - KWD {calculateTotalPrice().toFixed(3)}
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}