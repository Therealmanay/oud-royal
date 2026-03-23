'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Star, Heart, AlertTriangle } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { formatPrice, getDiscountPercentage } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: {
    id: string; name: string; slug: string; price: number; oldPrice: number | null
    image: string | null; volume: string | null; rating: number; reviewCount: number
    isNew: boolean; isBestSeller: boolean; category: string; stock?: number
    brand: { name: string; slug: string }
  }
}

/* ─── Couleur par catégorie ─── */
function getCategoryColor(category: string) {
  switch (category) {
    case 'FEMME':
      return {
        brand: 'text-accent',
        hover: 'group-hover:text-accent',
        button: 'bg-accent hover:bg-accent-dark',
        placeholder: 'text-accent/10',
      }
    case 'HOMME':
      return {
        brand: 'text-blue-royal',
        hover: 'group-hover:text-blue-royal',
        button: 'bg-blue-royal hover:bg-blue-royal-dark',
        placeholder: 'text-blue-royal/10',
      }
    default:
      return {
        brand: 'text-gray-500',
        hover: 'group-hover:text-primary',
        button: 'bg-primary hover:bg-primary-light',
        placeholder: 'text-primary/10',
      }
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const [mounted, setMounted] = useState(false)
  const [imgError, setImgError] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const addFavorite = useFavoritesStore((s) => s.addFavorite)
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite)
  const isFavorite = useFavoritesStore((s) => s.isFavorite)
  const discount = product.oldPrice ? getDiscountPercentage(product.price, product.oldPrice) : 0
  const stock = product.stock ?? 999
  const isOutOfStock = stock === 0
  const isLowStock = stock > 0 && stock <= 10

  const hasImage = product.image && product.image.length > 0 && !imgError
  const colors = getCategoryColor(product.category)

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
    if (isOutOfStock) {
      toast.error('Ce produit est en rupture de stock')
      return
    }
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
      <div className={`card-product ${isOutOfStock ? 'opacity-75' : ''}`}>
        <div className="relative aspect-square bg-cream overflow-hidden">

          {/* ═══ IMAGE DU PRODUIT ═══ */}
          {hasImage ? (
            <Image
              src={product.image!}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className={`font-playfair text-5xl font-bold ${colors.placeholder}`}>
                {product.brand.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Overlay rupture de stock */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
              <span className="bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-2">
                Rupture de stock
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
            {product.isNew && !isOutOfStock && <span className="badge-new">Nouveau</span>}
            {discount > 0 && !isOutOfStock && <span className="badge-sale">-{discount}%</span>}
            {product.isBestSeller && !isOutOfStock && <span className="badge-best">Best</span>}
          </div>

          {/* Bouton favori */}
          <button
            onClick={handleToggleFavorite}
            className="absolute top-2 right-2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer z-20"
          >
            <Heart
              size={16}
              className={liked ? 'text-accent fill-accent' : 'text-gray-400'}
            />
          </button>

          {/* Bouton panier hover */}
          {!isOutOfStock && (
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
              <button
                onClick={handleAddToCart}
                className={`w-full ${colors.button} text-white text-xs font-semibold py-3 flex items-center justify-center gap-2 transition-colors cursor-pointer`}
              >
                <ShoppingBag size={14} />
                Ajouter au panier
              </button>
            </div>
          )}
        </div>

        <div className="p-4">
          <p className={`text-[10px] uppercase tracking-wider font-medium ${colors.brand}`}>{product.brand.name}</p>
          <h3 className={`text-sm font-medium text-gray-900 mt-1 truncate ${colors.hover} transition-colors`}>{product.name}</h3>
          {product.volume && <p className="text-[11px] text-gray-400 mt-0.5">{product.volume}</p>}
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
            ))}
            <span className="text-[10px] text-gray-400 ml-1">({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {isOutOfStock ? (
              <span className="text-sm font-semibold text-red-500">Rupture de stock</span>
            ) : (
              <>
                <span className="text-base font-bold text-gray-900">{formatPrice(product.price)}</span>
                {product.oldPrice && <span className="text-xs text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>}
              </>
            )}
          </div>

          {isLowStock && (
            <div className="flex items-center gap-1 mt-2">
              <AlertTriangle size={12} className="text-orange-500" />
              <span className="text-xs text-orange-500 font-medium">
                Plus que {stock} en stock !
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}