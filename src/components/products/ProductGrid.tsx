'use client'

import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Array<{
    id: string
    name: string
    slug: string
    price: number
    oldPrice: number | null
    image: string | null
    volume: string | null
    rating: number
    reviewCount: number
    isNew: boolean
    isBestSeller: boolean
    category: string
    brand: {
      name: string
      slug: string
    }
  }>
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
        <p className="text-gray-400 text-sm mt-2">
          Essayez de modifier vos filtres
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}