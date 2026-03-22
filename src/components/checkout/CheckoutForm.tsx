'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import {
  Loader2,
  ShoppingBag,
  Truck,
  CreditCard,
  Shield,
  ChevronLeft,
  Package,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  Check,
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice, CITIES } from '@/lib/utils'
import toast from 'react-hot-toast'

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'Minimum 2 caractères'),
  lastName: z.string().min(2, 'Minimum 2 caractères'),
  phone: z.string().min(10, 'Numéro invalide').regex(/^[0+]/, 'Numéro invalide'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  address: z.string().min(10, 'Adresse trop courte'),
  city: z.string().min(1, 'Sélectionnez une ville'),
  notes: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { items, getSubtotal, getShippingCost, getTotal, clearCart } = useCartStore()

  const subtotal = getSubtotal()
  const shippingCost = getShippingCost()
  const total = getTotal()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error('Votre panier est vide')
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal,
          shippingCost,
          total,
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Erreur')
      clearCart()
      toast.success('Commande passée avec succès !')
      router.push(`/merci?order=${result.orderNumber}`)
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="text-gray-300" size={36} />
        </div>
        <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-2">
          Votre panier est vide
        </h2>
        <p className="text-gray-400 mb-8">
          Ajoutez des produits avant de passer commande
        </p>
        <Link href="/boutique" className="btn-primary inline-block cursor-pointer">
          Découvrir la boutique
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Retour */}
      <Link
        href="/boutique"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary mb-8 cursor-pointer"
      >
        <ChevronLeft size={16} />
        Continuer mes achats
      </Link>

      {/* Étapes */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {[
          { num: 1, label: 'Panier', done: true },
          { num: 2, label: 'Livraison', done: false, active: true },
          { num: 3, label: 'Confirmation', done: false },
        ].map((step, i) => (
          <div key={step.num} className="flex items-center gap-2">
            {i > 0 && <div className="w-8 sm:w-16 h-px bg-gray-200" />}
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step.done
                    ? 'bg-green-500 text-white'
                    : step.active
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {step.done ? <Check size={14} /> : step.num}
              </div>
              <span
                className={`text-sm hidden sm:block ${
                  step.active ? 'font-medium text-gray-900' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ═══ Colonne gauche : Formulaire ═══ */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section coordonnées */}
            <div className="bg-white border border-gray-100 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <User className="text-primary" size={16} />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Vos coordonnées
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Prénom <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      {...register('firstName')}
                      className="input-field pl-10"
                      placeholder="Votre prénom"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nom <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      {...register('lastName')}
                      className="input-field pl-10"
                      placeholder="Votre nom"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Téléphone <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      {...register('phone')}
                      className="input-field pl-10"
                      placeholder="06 00 00 00 00"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email <span className="text-gray-300">(optionnel)</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      {...register('email')}
                      type="email"
                      className="input-field pl-10"
                      placeholder="votre@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section adresse */}
            <div className="bg-white border border-gray-100 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="text-primary" size={16} />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Adresse de livraison
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Adresse complète <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3.5 text-gray-300" />
                  <textarea
                    {...register('address')}
                    className="input-field pl-10 resize-none"
                    rows={3}
                    placeholder="Numéro, rue, quartier, immeuble..."
                  />
                </div>
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ville <span className="text-red-400">*</span>
                </label>
                <select {...register('city')} className="select-field cursor-pointer">
                  <option value="">Sélectionner votre ville</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Notes <span className="text-gray-300">(optionnel)</span>
                </label>
                <div className="relative">
                  <FileText size={16} className="absolute left-3 top-3.5 text-gray-300" />
                  <textarea
                    {...register('notes')}
                    className="input-field pl-10 resize-none"
                    rows={2}
                    placeholder="Instructions de livraison, horaires préférés..."
                  />
                </div>
              </div>
            </div>

            {/* Méthode de paiement */}
            <div className="bg-white border border-gray-100 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CreditCard className="text-primary" size={16} />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Mode de paiement
                </h2>
              </div>

              <div className="flex items-center gap-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <div className="w-5 h-5 border-2 border-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                </div>
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">💰</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Paiement à la livraison (COD)</p>
                    <p className="text-xs text-gray-500">Payez en espèces à la réception de votre colis</p>
                  </div>
                </div>
                <Check className="text-green-500" size={20} />
              </div>
            </div>
          </div>

          {/* ═══ Colonne droite : Récapitulatif ═══ */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-lg p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Package className="text-primary" size={16} />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Récapitulatif
                </h2>
              </div>

              {/* Produits */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-cream rounded-md flex items-center justify-center shrink-0">
                      <ShoppingBag className="text-primary/20" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-primary font-medium">
                        {item.brandName}
                      </p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-400">Qté: {item.quantity}</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-gray-100 mb-4" />

              {/* Totaux */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sous-total</span>
                  <span className="text-gray-700">{formatPrice(subtotal)}</span>
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

                {subtotal < 500 && (
                  <div className="p-2.5 bg-blue-50 rounded-md">
                    <p className="text-xs text-primary">
                      💡 Plus que <strong>{formatPrice(500 - subtotal)}</strong> pour la livraison gratuite
                    </p>
                  </div>
                )}
              </div>

              <div className="h-px bg-gray-100 mb-4" />

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
              </div>

              {/* Bouton */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <Shield size={18} />
                    Confirmer la commande — {formatPrice(total)}
                  </>
                )}
              </button>

              {/* Assurances */}
              <div className="mt-4 space-y-2">
                {[
                  'Paiement sécurisé à la livraison',
                  'Livraison sous 2-5 jours ouvrés',
                  'Produits 100% authentiques',
                ].map((text) => (
                  <div key={text} className="flex items-center gap-2">
                    <Check size={14} className="text-green-500 shrink-0" />
                    <span className="text-[11px] text-gray-400">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}