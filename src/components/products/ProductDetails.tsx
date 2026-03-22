'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ShoppingBag, Star, Truck, Shield, RotateCcw, Minus, Plus, Crown, Heart,
  ChevronLeft, ChevronRight, ZoomIn,
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { formatPrice, getDiscountPercentage, PRODUCT_TYPE_LABELS, CATEGORY_LABELS } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ProductDetailsProps {
  product: {
    id: string; name: string; slug: string; description: string | null
    price: number; oldPrice: number | null; volume: string | null
    type: string; category: string; image: string | null; images: string[]
    notesTop: string[]; notesMiddle: string[]; notesBase: string[]
    rating: number; reviewCount: number; stock: number
    isBestSeller: boolean; isNew: boolean
    brand: { name: string; slug: string }
  }
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const addFavorite = useFavoritesStore((s) => s.addFavorite)
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite)
  const checkFavorite = useFavoritesStore((s) => s.isFavorite)

  useEffect(() => { setMounted(true) }, [])
  const liked = mounted ? checkFavorite(product.id) : false
  const discount = product.oldPrice ? getDiscountPercentage(product.price, product.oldPrice) : 0

  // Construire la liste des images
  // L'image principale + les images supplémentaires
  const allImages: string[] = []
  if (product.image && !product.image.includes('placeholder')) {
    allImages.push(product.image)
  }
  if (product.images && product.images.length > 0) {
    product.images.forEach((img) => {
      if (img && !allImages.includes(img)) {
        allImages.push(img)
      }
    })
  }

  const hasRealImages = allImages.length > 0
  const totalImages = hasRealImages ? allImages.length : 0

  const goToPrev = () => {
    if (totalImages > 1) {
      setSelectedImage((prev) => (prev - 1 + totalImages) % totalImages)
    }
  }

  const goToNext = () => {
    if (totalImages > 1) {
      setSelectedImage((prev) => (prev + 1) % totalImages)
    }
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id, name: product.name, price: product.price,
      oldPrice: product.oldPrice, image: product.image, volume: product.volume,
      quantity, slug: product.slug, brandName: product.brand.name,
    })
    toast.success(`${product.name} ajouté au panier !`)
    openCart()
  }

  const handleToggleFavorite = () => {
    if (liked) {
      removeFavorite(product.id)
      toast.success('Retiré des favoris')
    } else {
      addFavorite({
        id: product.id, name: product.name, slug: product.slug,
        price: product.price, oldPrice: product.oldPrice, image: product.image,
        volume: product.volume, brandName: product.brand.name,
        rating: product.rating, reviewCount: product.reviewCount,
      })
      toast.success('Ajouté aux favoris ♡')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      {/* ═══════════════════════════════════
          COLONNE GAUCHE : GALERIE PHOTOS
          ═══════════════════════════════════ */}
      <div className="space-y-4">
        {/* Image principale */}
        <div className="relative aspect-square bg-cream rounded-lg overflow-hidden border border-gray-100 group">
          {hasRealImages ? (
            <>
              <Image
                src={allImages[selectedImage]}
                alt={`${product.name} - Photo ${selectedImage + 1}`}
                fill
                className={`object-cover transition-transform duration-500 ${
                  isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                }`}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                onClick={() => setIsZoomed(!isZoomed)}
              />

              {/* Indicateur zoom */}
              {!isZoomed && (
                <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn size={18} className="text-gray-600" />
                </div>
              )}

              {/* Flèches navigation */}
              {totalImages > 1 && !isZoomed && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); goToPrev() }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer shadow-sm"
                  >
                    <ChevronLeft size={20} className="text-gray-700" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); goToNext() }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer shadow-sm"
                  >
                    <ChevronRight size={20} className="text-gray-700" />
                  </button>
                </>
              )}

              {/* Compteur photos */}
              {totalImages > 1 && (
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-600">
                  {selectedImage + 1} / {totalImages}
                </div>
              )}
            </>
          ) : (
            /* Placeholder quand pas de photos */
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Crown className="mx-auto text-primary/15 mb-4" size={80} />
                <p className="text-gray-300 font-playfair text-xl">{product.name}</p>
                <p className="text-gray-200 text-xs mt-2">Photo à venir</p>
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && <span className="badge-new">Nouveau</span>}
            {discount > 0 && <span className="badge-sale">-{discount}%</span>}
            {product.isBestSeller && <span className="badge-best">Best-seller</span>}
          </div>
        </div>

        {/* Miniatures */}
        {hasRealImages && totalImages > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allImages.map((img, index) => (
              <button
                key={index}
                onClick={() => { setSelectedImage(index); setIsZoomed(false) }}
                className={`relative w-20 h-20 rounded-md overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                  selectedImage === index
                    ? 'border-primary shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} - Miniature ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Placeholder miniatures quand pas de photos */}
        {!hasRealImages && (
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="w-20 h-20 rounded-md bg-cream border border-gray-100 flex items-center justify-center shrink-0"
              >
                <Crown className="text-primary/10" size={24} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════
          COLONNE DROITE : INFORMATIONS
          ═══════════════════════════════════ */}
      <div className="space-y-5">
        {/* Marque */}
        <Link href={`/boutique?brand=${product.brand.slug}`} className="text-primary text-sm font-medium hover:underline cursor-pointer">
          {product.brand.name}
        </Link>

        {/* Nom */}
        <h1 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{product.name}</h1>

        {/* Rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
            ))}
          </div>
          <span className="text-sm text-gray-500">{product.rating} ({product.reviewCount} avis)</span>
        </div>

        {/* Prix */}
        <div className="flex items-end gap-3">
          <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <>
              <span className="text-lg text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
              <span className="text-sm font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded">-{discount}%</span>
            </>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 bg-gray-50 rounded-md text-sm text-gray-600 border border-gray-100">
            {PRODUCT_TYPE_LABELS[product.type] || product.type}
          </span>
          <span className="px-3 py-1.5 bg-gray-50 rounded-md text-sm text-gray-600 border border-gray-100">
            {CATEGORY_LABELS[product.category] || product.category}
          </span>
          {product.volume && (
            <span className="px-3 py-1.5 bg-gray-50 rounded-md text-sm text-gray-600 border border-gray-100">
              {product.volume}
            </span>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-gray-500 leading-relaxed">{product.description}</p>
        )}

        {/* Notes olfactives */}
        {(product.notesTop.length > 0 || product.notesMiddle.length > 0 || product.notesBase.length > 0) && (
          <div className="space-y-4 p-5 bg-cream rounded-lg border border-gray-100">
            <h3 className="font-playfair text-lg font-semibold text-gray-900">Notes Olfactives</h3>
            {product.notesTop.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-1.5">🌸 Notes de tête</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.notesTop.map((n) => (
                    <span key={n} className="px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-md text-xs text-primary font-medium">{n}</span>
                  ))}
                </div>
              </div>
            )}
            {product.notesMiddle.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-1.5">🌹 Notes de cœur</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.notesMiddle.map((n) => (
                    <span key={n} className="px-2.5 py-1 bg-pink-50 border border-pink-100 rounded-md text-xs text-pink-600 font-medium">{n}</span>
                  ))}
                </div>
              </div>
            )}
            {product.notesBase.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-1.5">🪵 Notes de fond</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.notesBase.map((n) => (
                    <span key={n} className="px-2.5 py-1 bg-amber-50 border border-amber-100 rounded-md text-xs text-amber-700 font-medium">{n}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bouton Favoris */}
        <button
          onClick={handleToggleFavorite}
          className={`flex items-center gap-2 text-sm font-medium cursor-pointer transition-colors ${
            liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart size={20} className={liked ? 'fill-red-500' : ''} />
          {liked ? 'Dans vos favoris' : 'Ajouter aux favoris'}
        </button>

        {/* Quantité + Panier */}
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-200 rounded-md">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-3 hover:bg-gray-50 cursor-pointer">
              <Minus size={16} />
            </button>
            <span className="px-4 py-3 min-w-[3rem] text-center font-medium text-gray-900">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-3 hover:bg-gray-50 cursor-pointer">
              <Plus size={16} />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <ShoppingBag size={18} />
            {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
          </button>
        </div>

        {/* Avantages */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Truck, title: 'Livraison', desc: 'Gratuite dès 500 DH' },
            { icon: Shield, title: 'Authentique', desc: '100% original' },
            { icon: RotateCcw, title: 'COD', desc: 'Paiement à la livraison' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-2 p-3 bg-cream rounded-md border border-gray-100">
              <item.icon className="text-primary shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-xs font-medium text-gray-900">{item.title}</p>
                <p className="text-[10px] text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}