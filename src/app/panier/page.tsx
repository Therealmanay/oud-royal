'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const clearCart = useCartStore((s) => s.clearCart)
  const getSubtotal = useCartStore((s) => s.getSubtotal)
  const getShippingCost = useCartStore((s) => s.getShippingCost)
  const getTotal = useCartStore((s) => s.getTotal)

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

  const subtotal = getSubtotal()
  const shippingCost = getShippingCost()
  const total = getTotal()

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
                  <ShoppingBag className="text-primary" size={28} />
                  Mon Panier
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  {items.length} article{items.length > 1 ? 's' : ''}
                </p>
              </div>
              {items.length > 0 && (
                <button
                  onClick={() => {
                    clearCart()
                    toast.success('Panier vidé')
                  }}
                  className="text-sm text-red-400 hover:text-red-600 cursor-pointer"
                >
                  Vider le panier
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          {items.length === 0 ? (
            /* ═══ Panier vide ═══ */
            <div className="text-center py-20 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="text-gray-200" size={40} />
              </div>
              <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">
                Votre panier est vide
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Découvrez notre collection de parfums orientaux et trouvez votre fragrance idéale
              </p>
              <Link href="/boutique" className="btn-primary inline-flex items-center gap-2 cursor-pointer">
                <ShoppingBag size={18} />
                Découvrir la boutique
              </Link>
            </div>
          ) : (
            /* ═══ Panier avec articles ═══ */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Colonne gauche : Articles */}
              <div className="lg:col-span-2 space-y-4">
                {/* Barre livraison gratuite */}
                {subtotal < 500 && (
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Truck size={16} className="text-primary" />
                        Plus que <strong className="text-primary">{formatPrice(500 - subtotal)}</strong> pour la livraison gratuite
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {subtotal >= 500 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-sm text-green-600 font-medium">✓ Livraison gratuite débloquée !</p>
                  </div>
                )}

                {/* Liste des articles */}
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 sm:gap-6 p-4 sm:p-6 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    {/* Image placeholder */}
                    <Link href={`/produit/${item.slug}`} className="cursor-pointer shrink-0">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-cream rounded-lg flex items-center justify-center">
                        <span className="font-playfair text-3xl sm:text-4xl font-bold text-primary/10">
                          {item.brandName.charAt(0)}
                        </span>
                      </div>
                    </Link>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-primary font-medium">
                            {item.brandName}
                          </p>
                          <Link href={`/produit/${item.slug}`} className="cursor-pointer">
                            <h3 className="text-sm sm:text-base font-medium text-gray-900 hover:text-primary transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          {item.volume && (
                            <p className="text-xs text-gray-400 mt-0.5">{item.volume}</p>
                          )}
                        </div>

                        {/* Supprimer */}
                        <button
                          onClick={() => {
                            removeItem(item.id)
                            toast.success(`${item.name} retiré du panier`)
                          }}
                          className="p-2 text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Prix + Quantité */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-200 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-base sm:text-lg font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-400">
                              {formatPrice(item.price)} / unité
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Continuer les achats */}
                <Link
                  href="/boutique"
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary mt-4 cursor-pointer"
                >
                  ← Continuer mes achats
                </Link>
              </div>

              {/* Colonne droite : Récapitulatif */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-100 rounded-lg p-6 sticky top-24">
                  <h2 className="font-playfair text-lg font-bold text-gray-900 mb-6">
                    Récapitulatif
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Sous-total ({items.reduce((sum, i) => sum + i.quantity, 0)} articles)
                      </span>
                      <span className="text-gray-700 font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Truck size={14} />
                        Livraison
                      </span>
                      <span className={shippingCost === 0 ? 'text-green-600 font-medium' : 'text-gray-700'}>
                        {shippingCost === 0 ? 'GRATUITE' : formatPrice(shippingCost)}
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 mb-4" />

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full btn-primary flex items-center justify-center gap-2 text-center cursor-pointer"
                  >
                    Passer la commande
                    <ArrowRight size={16} />
                  </Link>

                  {/* Assurances */}
                  <div className="mt-6 space-y-2">
                    {[
                      '💰 Paiement à la livraison',
                      '🚚 Livraison sous 2-5 jours',
                      '✅ Produits 100% authentiques',
                    ].map((text) => (
                      <p key={text} className="text-[11px] text-gray-400 text-center">
                        {text}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}