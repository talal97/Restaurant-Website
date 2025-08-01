import { Branch, DeliveryZone, Category, Product, Settings } from '@/types';

export const mockBranches: Branch[] = [
  {
    id: '1',
    name: 'AseerTime - Khairan',
    address: 'Khairan Area, Kuwait',
    phone: '+965 1234 5678',
    email: 'khairan@aseertime.com',
    isActive: true,
    operatingHours: {
      sunday: { open: '08:00', close: '23:00', isOpen: true },
      monday: { open: '08:00', close: '23:00', isOpen: true },
      tuesday: { open: '08:00', close: '23:00', isOpen: true },
      wednesday: { open: '08:00', close: '23:00', isOpen: true },
      thursday: { open: '08:00', close: '23:00', isOpen: true },
      friday: { open: '08:00', close: '23:00', isOpen: true },
      saturday: { open: '08:00', close: '23:00', isOpen: true },
    },
    deliveryZones: ['1'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'AseerTime - Salmiya',
    address: 'Salmiya Area, Kuwait',
    phone: '+965 1234 5679',
    email: 'salmiya@aseertime.com',
    isActive: true,
    operatingHours: {
      sunday: { open: '08:00', close: '23:00', isOpen: true },
      monday: { open: '08:00', close: '23:00', isOpen: true },
      tuesday: { open: '08:00', close: '23:00', isOpen: true },
      wednesday: { open: '08:00', close: '23:00', isOpen: true },
      thursday: { open: '08:00', close: '23:00', isOpen: true },
      friday: { open: '08:00', close: '23:00', isOpen: true },
      saturday: { open: '08:00', close: '23:00', isOpen: true },
    },
    deliveryZones: ['2'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockDeliveryZones: DeliveryZone[] = [
  {
    id: '1',
    name: 'Al Khairan',
    branchId: '1',
    deliveryFee: 0.25,
    minimumOrder: 5,
    deliveryTime: 75,
    isActive: true,
    deliveryHours: {
      monday: { isOpen: true, from: '08:00', to: '02:30' },
      tuesday: { isOpen: true, from: '08:00', to: '02:30' },
      wednesday: { isOpen: true, from: '08:00', to: '02:30' },
      thursday: { isOpen: true, from: '08:00', to: '02:30' },
      friday: { isOpen: true, from: '08:00', to: '02:30' },
      saturday: { isOpen: true, from: '08:00', to: '02:30' },
      sunday: { isOpen: true, from: '08:00', to: '02:30' }
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Salmiya',
    branchId: '2',
    deliveryFee: 0.5,
    minimumOrder: 8,
    deliveryTime: 45,
    isActive: true,
    deliveryHours: {
      monday: { isOpen: true, from: '08:00', to: '02:30' },
      tuesday: { isOpen: true, from: '08:00', to: '02:30' },
      wednesday: { isOpen: true, from: '08:00', to: '02:30' },
      thursday: { isOpen: true, from: '08:00', to: '02:30' },
      friday: { isOpen: true, from: '08:00', to: '02:30' },
      saturday: { isOpen: true, from: '08:00', to: '02:30' },
      sunday: { isOpen: true, from: '08:00', to: '02:30' }
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Strawberry',
    description: 'Fresh strawberry treats',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400',
    isActive: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'New Items',
    description: 'Latest additions to our menu',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400',
    isActive: true,
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Best Offers',
    description: 'Special deals and discounts',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    isActive: true,
    sortOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Dubai Collection',
    description: 'Premium Dubai-inspired treats',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
    isActive: true,
    sortOrder: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Fresh Juices',
    description: 'Freshly squeezed natural juices',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400',
    isActive: true,
    sortOrder: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Cocktails',
    description: 'Refreshing fruit cocktails',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
    isActive: true,
    sortOrder: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Avocado With Honey And Nuts Juice',
    description: 'Fresh avocado blended with honey and mixed nuts',
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400',
    categoryId: '5',
    isActive: true,
    variants: [
      { id: '1-1', name: 'Small', price: 2.5, isDefault: false },
      { id: '1-2', name: 'Medium', price: 3.0, isDefault: true },
      { id: '1-3', name: 'Large', price: 3.5, isDefault: false },
    ],
    addons: [
      {
        id: '1-addon-1',
        name: 'Extra Honey',
        price: 0.5,
        isRequired: false,
      },
      {
        id: '1-addon-2',
        name: 'Extra Nuts',
        price: 0.75,
        isRequired: false,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Avocado',
    description: 'Pure fresh avocado juice',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400',
    categoryId: '5',
    isActive: true,
    variants: [
      { id: '2-1', name: 'Small', price: 2.0, isDefault: false },
      { id: '2-2', name: 'Medium', price: 2.5, isDefault: true },
      { id: '2-3', name: 'Large', price: 3.0, isDefault: false },
    ],
    addons: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Orange Juice',
    description: 'Freshly squeezed orange juice',
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400',
    categoryId: '5',
    isActive: true,
    variants: [
      { id: '3-1', name: 'Small', price: 1.5, isDefault: false },
      { id: '3-2', name: 'Medium', price: 2.0, isDefault: true },
      { id: '3-3', name: 'Large', price: 2.5, isDefault: false },
    ],
    addons: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Carrot Juice',
    description: 'Fresh carrot juice',
    image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400',
    categoryId: '5',
    isActive: true,
    variants: [
      { id: '4-1', name: 'Baby', price: 0.85, isDefault: true },
      { id: '4-2', name: 'Small', price: 0.95, isDefault: false },
      { id: '4-3', name: 'Medium', price: 1.1, isDefault: false },
      { id: '4-4', name: 'Large', price: 1.2, isDefault: false },
    ],
    addons: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Lemon With Mint',
    description: 'Refreshing lemon juice with fresh mint',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400',
    categoryId: '5',
    isActive: true,
    variants: [
      { id: '5-1', name: 'Small', price: 1.8, isDefault: false },
      { id: '5-2', name: 'Medium', price: 2.2, isDefault: true },
      { id: '5-3', name: 'Large', price: 2.6, isDefault: false },
    ],
    addons: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Banana With Milk',
    description: 'Creamy banana milkshake',
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400',
    categoryId: '5',
    isActive: true,
    variants: [
      { id: '6-1', name: 'Small', price: 2.2, isDefault: false },
      { id: '6-2', name: 'Medium', price: 2.7, isDefault: true },
      { id: '6-3', name: 'Large', price: 3.2, isDefault: false },
    ],
    addons: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockSettings: Settings = {
  id: '1',
  siteName: 'AseerTime',
  logo: '/logo.png',
  bannerImages: [
    'https://images.unsplash.com/photo-1546173159-315724a31696?w=800',
    'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800',
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800',
  ],
  whatsappNumber: '+965 1234 5678',
  currency: 'KWD',
  taxRate: 0,
  defaultDeliveryFee: 0.5,
  updatedAt: new Date(),
};