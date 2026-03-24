'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ShoppingBag, Star, Truck, Shield, RotateCcw, Minus, Plus, Crown, Heart,
  ChevronLeft, ChevronRight, ZoomIn, AlertTriangle, Send, Quote, User,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { formatPrice, getDiscountPercentage, PRODUCT_TYPE_LABELS, CATEGORY_LABELS } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ReviewType {
  id: string
  name: string
  rating: number
  comment: string
  createdAt: string
}

interface ProductDetailsProps {
  product: {
    id: string; name: string; slug: string; description: string | null
    price: number; oldPrice: number | null; volume: string | null
    type: string; category: string; image: string | null; images: string[]
    notesTop: string[]; notesMiddle: string[]; notesBase: string[]
    rating: number; reviewCount: number; stock: number
    isBestSeller: boolean; isNew: boolean
    brand: { name: string; slug: string }
    reviews: ReviewType[]
  }
}

/* ─── Helpers pour avatar ─── */
function getAvatarColor(name: string) {
  const colors = [
    'bg-accent/10 text-accent',
    'bg-blue-royal/10 text-blue-royal',
    'bg-amber-100 text-amber-700',
    'bg-emerald-100 text-emerald-700',
    'bg-violet-100 text-violet-700',
    'bg-rose-100 text-rose-600',
    'bg-sky-100 text-sky-700',
    'bg-orange-100 text-orange-700',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', rating: 0, comment: '' })
  const [hoveredStar, setHoveredStar] = useState(0)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  // Reviews scroll
  const reviewsScrollRef = useRef<HTMLDivElement>(null)

  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const addFavorite = useFavoritesStore((s) => s.addFavorite)
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite)
  const checkFavorite = useFavoritesStore((s) => s.isFavorite)

  useEffect(() => { setMounted(true) }, [])
  const liked = mounted ? checkFavorite(product.id) : false
  const discount = product.oldPrice ? getDiscountPercentage(product.price, product.oldPrice) : 0

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
    if (totalImages > 1) setSelectedImage((prev) => (prev - 1 + totalImages) % totalImages)
  }
  const goToNext = () => {
    if (totalImages > 1) setSelectedImage((prev) => (prev + 1) % totalImages)
  }

  const scrollReviews = (direction: 'left' | 'right') => {
    if (reviewsScrollRef.current) {
      reviewsScrollRef.current.scrollBy({
        left: direction === 'left' ? -380 : 380,
        behavior: 'smooth',
      })
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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewForm.name.trim()) { toast.error('Veuillez entrer votre nom'); return }
    if (reviewForm.rating === 0) { toast.error('Veuillez donner une note'); return }
    if (!reviewForm.comment.trim()) { toast.error('Veuillez écrire un commentaire'); return }
    if (reviewForm.comment.trim().length < 10) { toast.error('Commentaire trop court (min 10 caractères)'); return }

    setIsSubmittingReview(true)
    try {
      const res = await fetch('/api/reviews/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reviewForm, productId: product.id }),
      })
      if (res.ok) {
        setReviewSubmitted(true)
        setReviewForm({ name: '', email: '', rating: 0, comment: '' })
        toast.success('Merci pour votre avis !')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Une erreur est survenue')
      }
    } catch {
      toast.error('Une erreur est survenue')
    } finally {
      setIsSubmittingReview(false)
    }
  }

  return (
    <>
      {/* CSS pour cacher la scrollbar */}
      <style>{`
        .reviews-scroll-product::-webkit-scrollbar { display: none; }
        .reviews-scroll-product { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* ═══════════════════════════════════
            COLONNE GAUCHE : GALERIE PHOTOS
            ═══════════════════════════════════ */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-cream rounded-lg overflow-hidden border border-gray-100 group">
            {hasRealImages ? (
              <>
                <Image
                  src={allImages[selectedImage]}
                  alt={`${product.name} - Photo ${selectedImage + 1}`}
                  fill
                  className={`object-cover transition-transform duration-500 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}`}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  onClick={() => setIsZoomed(!isZoomed)}
                />
                {!isZoomed && (
                  <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn size={18} className="text-gray-600" />
                  </div>
                )}
                {totalImages > 1 && !isZoomed && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); goToPrev() }} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer shadow-sm">
                      <ChevronLeft size={20} className="text-gray-700" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); goToNext() }} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer shadow-sm">
                      <ChevronRight size={20} className="text-gray-700" />
                    </button>
                  </>
                )}
                {totalImages > 1 && (
                  <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-600">
                    {selectedImage + 1} / {totalImages}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Crown className="mx-auto text-primary/15 mb-4" size={80} />
                  <p className="text-gray-300 font-playfair text-xl">{product.name}</p>
                  <p className="text-gray-200 text-xs mt-2">Photo à venir</p>
                </div>
              </div>
            )}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isNew && <span className="badge-new">Nouveau</span>}
              {discount > 0 && <span className="badge-sale">-{discount}%</span>}
              {product.isBestSeller && <span className="badge-best">Best-seller</span>}
            </div>
          </div>

          {hasRealImages && totalImages > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((img, index) => (
                <button key={index} onClick={() => { setSelectedImage(index); setIsZoomed(false) }} className={`relative w-20 h-20 rounded-md overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${selectedImage === index ? 'border-primary shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                  <Image src={img} alt={`${product.name} - Miniature ${index + 1}`} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}

          {!hasRealImages && (
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="w-20 h-20 rounded-md bg-cream border border-gray-100 flex items-center justify-center shrink-0">
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
          <Link href={`/boutique?brand=${product.brand.slug}`} className="text-accent text-sm font-medium hover:underline cursor-pointer">
            {product.brand.name}
          </Link>

          <h1 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{product.name}</h1>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
              ))}
            </div>
            <span className="text-sm text-gray-500">{product.rating} ({product.reviewCount} avis)</span>
          </div>

          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
                <span className="text-sm font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded">-{discount}%</span>
              </>
            )}
          </div>

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
                      <span key={n} className="px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-md text-xs text-blue-700 font-medium">{n}</span>
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
            className={`flex items-center gap-2 text-sm font-medium cursor-pointer transition-colors ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
          >
            <Heart size={20} className={liked ? 'fill-red-500' : ''} />
            {liked ? 'Dans vos favoris' : 'Ajouter aux favoris'}
          </button>

          {/* Stock */}
          {product.stock === 0 && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle size={18} className="text-red-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-600">Rupture de stock</p>
                <p className="text-xs text-red-400">Ce produit est temporairement indisponible</p>
              </div>
            </div>
          )}

          {product.stock > 0 && product.stock <= 10 && (
            <div className="flex items-center gap-2 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertTriangle size={18} className="text-orange-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-orange-600">Plus que {product.stock} en stock !</p>
                <p className="text-xs text-orange-400">Dépêchez-vous, il n&apos;en reste presque plus</p>
              </div>
            </div>
          )}

          {product.stock > 10 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm text-green-600 font-medium">En stock</span>
            </div>
          )}

          {/* Quantité + Panier */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-200 rounded-md">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-3 hover:bg-gray-50 cursor-pointer" disabled={product.stock === 0}>
                <Minus size={16} />
              </button>
              <span className="px-4 py-3 min-w-[3rem] text-center font-medium text-gray-900">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))} className="px-3 py-3 hover:bg-gray-50 cursor-pointer" disabled={product.stock === 0}>
                <Plus size={16} />
              </button>
            </div>
            <button onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
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

      {/* ═══════════════════════════════════════════════════
          SECTION AVIS PRODUIT
          ═══════════════════════════════════════════════════ */}
      <div className="mt-16 pt-16">
        {/* Header section */}
        <div className="bg-gray-100 rounded-2xl p-8 sm:p-12">
          <div className="text-center mb-10">
            <p className="text-accent text-xs font-medium uppercase tracking-[0.2em] mb-3">
              Témoignages
            </p>
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-gray-900">
              Avis sur ce produit
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              {product.reviews.length} avis client{product.reviews.length > 1 ? 's' : ''}
            </p>
            <div className="w-12 h-[2px] bg-accent mx-auto mt-4" />
          </div>

          {/* ─── Liste des avis en défilement horizontal ─── */}
          {product.reviews.length > 0 ? (
            <div className="relative">
              {/* Flèches */}
              {product.reviews.length > 2 && (
                <>
                  <button
                    onClick={() => scrollReviews('left')}
                    className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white shadow-lg rounded-full flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all cursor-pointer hidden md:flex border border-gray-100"
                  >
                    <ChevronLeft size={18} className="text-gray-700" />
                  </button>
                  <button
                    onClick={() => scrollReviews('right')}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white shadow-lg rounded-full flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all cursor-pointer hidden md:flex border border-gray-100"
                  >
                    <ChevronRight size={18} className="text-gray-700" />
                  </button>
                </>
              )}

              <div
                ref={reviewsScrollRef}
                className="reviews-scroll-product flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 px-1"
              >
                {product.reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="min-w-[320px] max-w-[320px] snap-start flex-shrink-0"
                  >
                    <div className="h-full bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col">
                      {/* Header carte */}
                      <div className="p-6 pb-0">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${getAvatarColor(review.name)}`}>
                            {getInitials(review.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {review.name}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                              })}
                            </p>
                            <div className="flex gap-0.5 mt-1.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}
                                />
                              ))}
                            </div>
                          </div>
                          <Quote size={24} className="text-accent/15 shrink-0" />
                        </div>
                      </div>

                      {/* Commentaire */}
                      <div className="p-6 pt-4 flex-1 flex flex-col">
                        <p className="text-[13px] text-gray-600 leading-relaxed break-words overflow-wrap-anywhere flex-1">
                          {review.comment}
                        </p>
                        <div className="mt-5 pt-4 border-t border-gray-50">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                              Avis vérifié
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {product.reviews.length > 1 && (
                <p className="text-center text-[10px] text-gray-400 mt-4 md:hidden">
                  ← Glissez pour voir plus →
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">
                Aucun avis pour ce produit.
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Soyez le premier à partager votre expérience !
              </p>
            </div>
          )}
        </div>

        {/* ─── Formulaire d'avis produit ─── */}
        <div className="max-w-xl mx-auto mt-12">
          {!showReviewForm && !reviewSubmitted && (
            <div className="text-center">
              <button
                onClick={() => setShowReviewForm(true)}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <Star size={16} />
                Donner mon avis sur ce produit
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {reviewSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-sm p-8 text-center"
              >
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star size={28} className="text-green-500 fill-green-500" />
                </div>
                <h4 className="font-playfair text-lg font-bold text-gray-900 mb-2">
                  Merci pour votre avis !
                </h4>
                <p className="text-sm text-gray-500 mb-6">
                  Il sera publié après validation par notre équipe.
                </p>
                <button
                  onClick={() => { setReviewSubmitted(false); setShowReviewForm(false) }}
                  className="text-xs text-accent font-medium hover:underline cursor-pointer"
                >
                  Fermer
                </button>
              </motion.div>
            ) : showReviewForm ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-10">
                  <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send size={20} className="text-accent" />
                    </div>
                    <h3 className="font-playfair text-xl font-bold text-gray-900">
                      Votre avis sur {product.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2">
                      Partagez votre expérience
                    </p>
                  </div>

                  <form onSubmit={handleSubmitReview} className="space-y-5">
                    {/* Nom + Email en grille */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-[0.15em]">
                          Votre nom <span className="text-accent">*</span>
                        </label>
                        <input
                          type="text"
                          value={reviewForm.name}
                          onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                          placeholder="Ex : Fatima Z."
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-[0.15em]">
                          Email{' '}
                          <span className="text-gray-300 normal-case tracking-normal text-[9px]">
                            (optionnel)
                          </span>
                        </label>
                        <input
                          type="email"
                          value={reviewForm.email}
                          onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
                          placeholder="votre@email.com"
                          className="input-field"
                        />
                      </div>
                    </div>

                    {/* Note */}
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-2 uppercase tracking-[0.15em]">
                        Votre note <span className="text-accent">*</span>
                      </label>
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-4 py-3 w-fit">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className="cursor-pointer p-0.5 transition-transform hover:scale-125"
                          >
                            <Star
                              size={26}
                              className={`transition-colors ${
                                star <= (hoveredStar || reviewForm.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 hover:text-gray-400'
                              }`}
                            />
                          </button>
                        ))}
                        {reviewForm.rating > 0 && (
                          <span className="ml-3 text-sm text-gray-500 font-medium">
                            {reviewForm.rating}/5
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Commentaire */}
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-[0.15em]">
                        Votre avis <span className="text-accent">*</span>
                      </label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        placeholder="Que pensez-vous de ce parfum ? Tenue, sillage, occasion..."
                        rows={4}
                        className="input-field resize-none"
                        required
                      />
                      <div className="flex justify-between mt-1">
                        <p className="text-[9px] text-gray-300">
                          Visible uniquement après validation
                        </p>
                        <p className="text-[10px] text-gray-300">
                          {reviewForm.comment.length} / 500
                        </p>
                      </div>
                    </div>

                    {/* Boutons */}
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmittingReview ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <Send size={14} />
                            Publier mon avis
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowReviewForm(false); setReviewForm({ name: '', email: '', rating: 0, comment: '' }) }}
                        className="btn-secondary"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}