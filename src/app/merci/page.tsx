'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ShoppingBag, MessageCircle } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Suspense } from 'react'

function MerciContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order') || 'N/A'

  return (
    <div className="text-center max-w-lg mx-auto">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="text-green-500" size={40} />
      </div>

      <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        Merci pour votre commande !
      </h1>

      <p className="text-gray-500 mb-6">
        Votre commande a été enregistrée avec succès. Nous vous contacterons bientôt pour confirmer la livraison.
      </p>

      <div className="bg-cream border border-gray-100 rounded-lg p-6 mb-8">
        <p className="text-sm text-gray-400 mb-1">Numéro de commande</p>
        <p className="text-2xl font-bold text-primary">{orderNumber}</p>
      </div>

      <div className="bg-cream border border-gray-100 rounded-lg p-6 mb-8 text-left">
        <h3 className="font-semibold text-gray-900 mb-3">Prochaines étapes :</h3>
        <ol className="text-sm text-gray-500 space-y-2">
          <li className="flex gap-2">
            <span className="text-primary font-bold">1.</span>
            Vous recevrez un appel de confirmation
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">2.</span>
            Votre commande sera préparée et expédiée
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">3.</span>
            Payez en cash à la livraison
          </li>
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/boutique" className="btn-primary inline-flex items-center justify-center gap-2 cursor-pointer">
          <ShoppingBag size={18} />
          Continuer les achats
        </Link>
        <a
          href="https://wa.me/212600000000"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <MessageCircle size={18} />
          Nous contacter
        </a>
      </div>
    </div>
  )
}

export default function MerciPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white flex items-center">
        <div className="container-custom py-20">
          <Suspense fallback={<div className="text-center text-gray-400">Chargement...</div>}>
            <MerciContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}