'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, ShoppingBag, Trash2, Star } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function FavorisPage() {
  const [mounted, setMounted] = useState(false)
  const items = useFavoritesStore((s) => s.items)
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite)
  const clearFavorites = useFavoritesStore((s) => s.clearFavorites)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white">
          <div className="container-custom py-20 text-center">
            <p className="text-gray-400">Chargement...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const handleAddToCart = (item: typeof items[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      oldPrice: item.oldPrice,
      image: item.image,
      volume: item.volume,
      quantity: 1,
      slug: item.slug,
      brandName: item.brandName,
    })
    toast.success(`${item.name} ajouté au panier`)
    openCart()
  }

  const handleRemove = (id: string, name: string) => {
    removeFavorite(id)
    toast.success(`${name} retiré des favoris`)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* En-tête */}
        <div className="bg-cream border-b border-gray-100 py-8">
          <div className="container-custom">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Heart className="text-red-500" size={28} />
                  Mes Favoris
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  {items.length} parfum{items.length > 1 ? 's' : ''} sauvegardé{items.length > 1 ? 's' : ''}
                </p>
              </div>
              {items.length > 0 && (
                <button
                  onClick={() => {
                    clearFavorites()
                    toast.success('Favoris vidés')
                  }}
                  className="text-sm text-red-400 hover:text-red-600 cursor-pointer"
                >
                  Tout supprimer
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          {items.length === 0 ? (
            /* ═══ Favoris vide ═══ */
            <div className="text-center py-20 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="text-gray-200" size={40} />
              </div>
              <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">
                Aucun favori pour le moment
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Explorez notre collection et ajoutez vos parfums préférés en cliquant sur le cœur
              </p>
              <Link href="/boutique" className="btn-primary inline-flex items-center gap-2 cursor-pointer">
                <ShoppingBag size={18} />
                Découvrir la boutique
              </Link>
            </div>
          ) : (
            /* ═══ Liste des favoris ═══ */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow group">
                  {/* Image */}
                  <Link href={`/produit/${item.slug}`} className="cursor-pointer">
                    <div className="relative aspect-square bg-cream flex items-center justify-center">
                      <span className="font-playfair text-5xl font-bold text-primary/10">
                        {item.brandName.charAt(0)}
                      </span>

                      {/* Bouton supprimer */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleRemove(item.id, item.name)
                        }}
                        className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Heart className="text-red-500 fill-red-500" size={18} />
                      </button>
                    </div>
                  </Link>

                  {/* Infos */}
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-wider text-primary font-medium">
                      {item.brandName}
                    </p>
                    <Link href={`/produit/${item.slug}`} className="cursor-pointer">
                      <h3 className="text-sm font-medium text-gray-900 mt-1 hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    {item.volume && (
                      <p className="text-[11px] text-gray-400 mt-0.5">{item.volume}</p>
                    )}

                    {/* Stars */}
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          className={i < Math.floor(item.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}
                        />
                      ))}
                      <span className="text-[10px] text-gray-400 ml-1">({item.reviewCount})</span>
                    </div>

                    {/* Prix */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-base font-bold text-gray-900">
                        {formatPrice(item.price)}
                      </span>
                      {item.oldPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(item.oldPrice)}
                        </span>
                      )}
                    </div>

                    {/* Bouton ajouter au panier */}
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full mt-3 bg-primary text-white text-xs font-semibold py-2.5 rounded-md flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors cursor-pointer"
                    >
                      <ShoppingBag size={14} />
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}