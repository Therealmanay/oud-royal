'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer() {
  const [mounted, setMounted] = useState(false)
  const items = useCartStore((s) => s.items)
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const getSubtotal = useCartStore((s) => s.getSubtotal)
  const getShippingCost = useCartStore((s) => s.getShippingCost)
  const getTotal = useCartStore((s) => s.getTotal)
  const getTotalItems = useCartStore((s) => s.getTotalItems)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  const subtotal = getSubtotal()
  const shippingCost = getShippingCost()
  const total = getTotal()
  const totalItems = getTotalItems()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 z-50"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-playfair text-lg font-bold text-[#1A1A1A]">
                Panier ({totalItems})
              </h2>
              <button onClick={closeCart} className="p-1 hover:text-primary transition-colors">
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <ShoppingBag className="text-gray-200 mb-4" size={56} />
                <h3 className="font-playfair text-lg font-semibold text-[#1A1A1A] mb-2">
                  Votre panier est vide
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                  Découvrez notre collection
                </p>
                <Link href="/boutique" onClick={closeCart} className="btn-primary inline-block">
                  Explorer la boutique
                </Link>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {/* Barre livraison gratuite */}
                  {subtotal < 500 && (
                    <div className="p-3 bg-cream border border-primary/20">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-500">
                          Plus que {formatPrice(500 - subtotal)} pour la livraison gratuite
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 h-1.5">
                        <div
                          className="bg-primary h-1.5 transition-all duration-500"
                          style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {subtotal >= 500 && (
                    <div className="p-3 bg-green-50 border border-green-200 text-center">
                      <p className="text-sm text-green-600 font-medium">✓ Livraison gratuite !</p>
                    </div>
                  )}

                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 py-4 border-b border-gray-50">
                      {/* ═══ IMAGE DU PRODUIT ═══ */}
                      <div className="w-20 h-20 bg-cream shrink-0 rounded overflow-hidden relative">
                        {item.image && item.image.length > 0 ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="text-primary/20" size={24} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-primary">{item.brandName}</p>
                        <h4 className="text-sm font-medium text-[#1A1A1A] truncate">{item.name}</h4>
                        {item.volume && <p className="text-[11px] text-gray-400">{item.volume}</p>}

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-gray-200">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-cream transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-cream transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="self-start p-1 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 px-6 py-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Sous-total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Livraison</span>
                    <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                      {shippingCost === 0 ? 'GRATUITE' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="divider" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>

                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="btn-primary w-full text-center block mt-4"
                  >
                    Commander
                  </Link>
                  <button onClick={closeCart} className="w-full text-center text-xs text-gray-400 hover:text-primary py-2 uppercase tracking-wide">
                    Continuer mes achats
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}