# Restaurant Website

A modern restaurant website with admin panel built with Next.js and TypeScript.

## Features

### Customer Features
- Browse menu categories and products
- View product details with images and descriptions
- Add items to cart
- Responsive design for all devices

### Admin Panel Features
- **Categories Management**: Create, edit, and manage menu categories
- **Products Management**: Add, edit, and organize menu items
- **Orders Management**: View and manage customer orders
- **Users Management**: Manage user accounts and roles
- **Delivery Zones**: Configure delivery areas and zones
- **Branches**: Manage restaurant locations
- **Settings**: Configure restaurant settings

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Heroicons
- **Image Optimization**: Next.js Image component

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/talal97/Restaurant-Website.git
cd Restaurant-Website
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel pages
│   │   ├── categories/    # Category management
│   │   ├── products/      # Product management
│   │   ├── orders/        # Order management
│   │   ├── users/         # User management
│   │   ├── delivery-zones/# Delivery zone management
│   │   ├── branches/      # Branch management
│   │   └── settings/      # Settings
│   ├── categories/        # Customer category pages
│   ├── products/          # Customer product pages
│   └── cart/              # Shopping cart
├── components/            # Reusable React components
├── store/                 # Zustand state management
├── types/                 # TypeScript type definitions
├── data/                  # Mock data
└── public/                # Static assets
```

## Admin Panel

Access the admin panel at `/admin` to manage:

- **Categories**: Organize menu items into categories
- **Products**: Add and edit menu items with images, descriptions, and pricing
- **Orders**: View and manage customer orders
- **Users**: Manage customer accounts and staff
- **Delivery Zones**: Configure delivery areas
- **Branches**: Manage multiple restaurant locations
- **Settings**: Configure restaurant information and preferences

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For any questions or support, please contact [talal97](https://github.com/talal97).