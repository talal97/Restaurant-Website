import { create } from 'zustand';
import { Branch, DeliveryZone, Category, Product, CartItem, Settings } from '@/types';

interface StoreState {
  // App State
  selectedBranch: Branch | null;
  selectedZone: DeliveryZone | null;
  
  // Data
  branches: Branch[];
  zones: DeliveryZone[];
  categories: Category[];
  products: Product[];
  settings: Settings | null;
  
  // Cart
  cartItems: CartItem[];
  
  // Actions
  setSelectedBranch: (branch: Branch | null) => void;
  setSelectedZone: (zone: DeliveryZone | null) => void;
  setBranches: (branches: Branch[]) => void;
  setZones: (zones: DeliveryZone[]) => void;
  setCategories: (categories: Category[]) => void;
  setProducts: (products: Product[]) => void;
  setSettings: (settings: Settings) => void;
  
  // Cart Actions
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

export const useStore = create<StoreState>((set, get) => ({
  // Initial State
  selectedBranch: null,
  selectedZone: null,
  branches: [],
  zones: [],
  categories: [],
  products: [],
  settings: null,
  cartItems: [],
  
  // Actions
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
  setSelectedZone: (zone) => set({ selectedZone: zone }),
  setBranches: (branches) => set({ branches }),
  setZones: (zones) => set({ zones }),
  setCategories: (categories) => set({ categories }),
  setProducts: (products) => set({ products }),
  setSettings: (settings) => set({ settings }),
  
  // Cart Actions
  addToCart: (item) => {
    const { cartItems } = get();
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => 
        cartItem.productId === item.productId && 
        cartItem.variantId === item.variantId &&
        JSON.stringify(cartItem.addons) === JSON.stringify(item.addons)
    );
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += item.quantity;
      updatedItems[existingItemIndex].totalPrice = 
        updatedItems[existingItemIndex].quantity * 
        (item.totalPrice / item.quantity);
      set({ cartItems: updatedItems });
    } else {
      set({ cartItems: [...cartItems, item] });
    }
  },
  
  removeFromCart: (itemId) => {
    const { cartItems } = get();
    set({ cartItems: cartItems.filter(item => item.id !== itemId) });
  },
  
  updateCartItemQuantity: (itemId, quantity) => {
    const { cartItems } = get();
    const updatedItems = cartItems.map(item => {
      if (item.id === itemId) {
        const unitPrice = item.totalPrice / item.quantity;
        return {
          ...item,
          quantity,
          totalPrice: unitPrice * quantity
        };
      }
      return item;
    });
    set({ cartItems: updatedItems });
  },
  
  clearCart: () => set({ cartItems: [] }),
  
  getCartTotal: () => {
    const { cartItems } = get();
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  },
  
  getCartItemsCount: () => {
    const { cartItems } = get();
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  },
}));