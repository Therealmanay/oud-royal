'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, Star, Heart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { formatPrice, getDiscountPercentage } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: {
    id: string; name: string; slug: string; price: number; oldPrice: number | null
    image: string | null; volume: string | null; rating: number; reviewCount: number
    isNew: boolean; isBestSeller: boolean; category: string
    brand: { name: string; slug: string }
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const [mounted, setMounted] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const addFavorite = useFavoritesStore((s) => s.addFavorite)
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite)
  const isFavorite = useFavoritesStore((s) => s.isFavorite)
  const discount = product.oldPrice ? getDiscountPercentage(product.price, product.oldPrice) : 0

  useEffect(() => { setMounted(true) }, [])

  const liked = mounted ? isFavorite(product.id) : false

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (liked) {
      removeFavorite(product.id)
      toast.success('Retiré des favoris')
    } else {
      addFavorite({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        oldPrice: product.oldPrice,
        image: product.image,
        volume: product.volume,
        brandName: product.brand.name,
        rating: product.rating,
        reviewCount: product.reviewCount,
      })
      toast.success('Ajouté aux favoris ♡')
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id, name: product.name, price: product.price,
      oldPrice: product.oldPrice, image: product.image, volume: product.volume,
      quantity: 1, slug: product.slug, brandName: product.brand.name,
    })
    toast.success(`${product.name} ajouté au panier`)
    openCart()
  }

  return (
    <Link href={`/produit/${product.slug}`} className="group block cursor-pointer">
      <div className="card-product">
        <div className="relative aspect-square bg-cream overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-playfair text-5xl font-bold text-primary/10">
              {product.brand.name.charAt(0)}
            </span>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && <span className="badge-new">Nouveau</span>}
            {discount > 0 && <span className="badge-sale">-{discount}%</span>}
            {product.isBestSeller && <span className="badge-best">Best</span>}
          </div>

          {/* Bouton favori */}
          <button
            onClick={handleToggleFavorite}
            className="absolute top-2 right-2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Heart
              size={16}
              className={liked ? 'text-red-500 fill-red-500' : 'text-gray-400'}
            />
          </button>

          {/* Bouton panier hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full bg-primary text-white text-xs font-semibold py-3 flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors cursor-pointer rounded-md"
            >
              <ShoppingBag size={14} />
              Ajouter au panier
            </button>
          </div>
        </div>

        <div className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-primary font-medium">{product.brand.name}</p>
          <h3 className="text-sm font-medium text-gray-900 mt-1 truncate group-hover:text-primary transition-colors">{product.name}</h3>
          {product.volume && <p className="text-[11px] text-gray-400 mt-0.5">{product.volume}</p>}
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
            ))}
            <span className="text-[10px] text-gray-400 ml-1">({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-base font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.oldPrice && <span className="text-xs text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}