# Oud Royal E-Commerce Platform

A luxury oud fragrance e-commerce platform built with Next.js 16, TypeScript, Prisma, and Tailwind CSS.

## Features

- **Product Catalog**: Browse luxury oud fragrances with detailed product pages
- **Shopping Cart**: Persistent cart with Zustand state management
- **Checkout System**: Complete checkout flow with order management
- **Admin Dashboard**: Manage products, orders, and customers
- **User Authentication**: NextAuth integration for secure login
- **Database**: PostgreSQL with Prisma ORM
- **Image Management**: Cloudinary integration for image hosting
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── api/            # API routes
│   ├── admin/          # Admin dashboard pages
│   ├── boutique/       # Product listing
│   ├── produit/        # Product detail
│   ├── panier/         # Shopping cart
│   ├── checkout/       # Checkout flow
│   └── merci/          # Order confirmation
├── components/         # React components
│   ├── layout/         # Header, Footer, Navigation
│   ├── home/           # Hero, Featured products
│   ├── products/       # Product cards, grid, filters
│   ├── cart/           # Cart drawer, items
│   ├── checkout/       # Checkout form
│   ├── admin/          # Admin components
│   └── ui/             # shadcn/ui components
├── lib/                # Utilities
│   ├── prisma.ts       # Database client
│   ├── auth.ts         # Authentication config
│   ├── utils.ts        # Helper functions
│   └── cloudinary.ts   # Image handling
├── store/              # Zustand stores
│   └── cartStore.ts    # Cart state management
├── types/              # TypeScript types
├── public/             # Static files
├── prisma/             # Database schema
└── styles/             # Global styles
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```
DATABASE_URL="your-postgresql-url"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
```

3. Set up the database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

## Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building

Build for production:
```bash
npm run build
npm start
```

## API Routes

- `GET/POST /api/products` - Product management
- `GET/POST /api/orders` - Order management
- `POST /api/auth/[...nextauth]` - Authentication endpoints

## Technologies Used

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **Image Hosting**: Cloudinary
- **UI Components**: shadcn/ui

## License

MIT
