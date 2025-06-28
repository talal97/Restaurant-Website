export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  operatingHours: OperatingHours;
  deliveryZones: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OperatingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  isOpen: boolean;
  open: string;
  close: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  branchId: string;
  deliveryFee: number;
  minimumOrder: number;
  deliveryTime: number; // in minutes
  isActive: boolean;
  deliveryHours: DeliveryHours;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DeliveryHours {
  monday: DeliveryDayHours;
  tuesday: DeliveryDayHours;
  wednesday: DeliveryDayHours;
  thursday: DeliveryDayHours;
  friday: DeliveryDayHours;
  saturday: DeliveryDayHours;
  sunday: DeliveryDayHours;
}

export interface DeliveryDayHours {
  isOpen: boolean;
  from: string;
  to: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  categoryId: string;
  isActive: boolean;
  variants: ProductVariant[];
  addons: ProductAddon[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
  isRequired: boolean;
  options?: AddonOption[];
}

export interface AddonOption {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId: string;
  variant: ProductVariant;
  addons: {
    addonId: string;
    addon: ProductAddon;
    selectedOptions: AddonOption[];
  }[];
  quantity: number;
  customerNote?: string;
  totalPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  branchId: string;
  zoneId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed';
  estimatedDeliveryTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Settings {
  id: string;
  siteName: string;
  logo: string;
  bannerImages: string[];
  whatsappNumber: string;
  currency: string;
  taxRate: number;
  defaultDeliveryFee: number;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}