'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
  const { 
    cartItems, 
    removeFromCart, 
    updateCartItemQuantity, 
    clearCart, 
    getCartTotal,
    selectedZone 
  } = useStore();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const subtotal = getCartTotal();
  const deliveryFee = selectedZone?.deliveryFee || 0.5;
  const total = subtotal + deliveryFee;
  const minimumOrder = selectedZone?.minimumOrder || 5;
  const canCheckout = subtotal >= minimumOrder;

  const handleCheckout = () => {
    if (!canCheckout) return;
    setIsCheckingOut(true);
    // Here you would typically redirect to checkout or payment
    setTimeout(() => {
      alert('Checkout functionality would be implemented here');
      setIsCheckingOut(false);
    }, 1000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <ShoppingBagIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
            <Link 
              href="/"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Shopping Cart ({cartItems.length})
          </h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Size: {item.variant.name}
                    </p>
                    
                    {/* Addons */}
                    {item.addons.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Add-ons:</p>
                        <ul className="text-xs text-gray-600">
                          {item.addons.map((addon) => (
                            <li key={addon.addonId}>• {addon.addon.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Customer Note */}
                    {item.customerNote && (
                      <p className="text-xs text-gray-500 mt-2">
                        Note: {item.customerNote}
                      </p>
                    )}
                    
                    {/* Price */}
                    <p className="font-bold text-primary-600 mt-2">
                      KWD {item.totalPrice.toFixed(3)}
                    </p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end space-y-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        <MinusIcon className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        <PlusIcon className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">KWD {subtotal.toFixed(3)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">KWD {deliveryFee.toFixed(3)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-primary-600">KWD {total.toFixed(3)}</span>
                  </div>
                </div>
              </div>
              
              {/* Minimum Order Warning */}
              {!canCheckout && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Minimum order amount is KWD {minimumOrder.toFixed(3)}. 
                    Add KWD {(minimumOrder - subtotal).toFixed(3)} more to checkout.
                  </p>
                </div>
              )}
              
              {/* Delivery Info */}
              {selectedZone && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Delivering to: {selectedZone.name}<br />
                    Estimated time: {selectedZone.deliveryTime} mins
                  </p>
                </div>
              )}
              
              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={!canCheckout || isCheckingOut}
                className="w-full mt-6 bg-secondary-500 hover:bg-secondary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              
              <Link
                href="/"
                className="block w-full mt-3 text-center text-primary-600 hover:text-primary-700 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}