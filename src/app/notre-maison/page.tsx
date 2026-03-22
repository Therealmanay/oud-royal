import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Shield, MapPin, Phone, Heart, Truck, Star } from 'lucide-react'

export const metadata = { title: 'Notre Maison' }

export default function NotreMaisonPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <div className="bg-cream py-16 text-center">
          <div className="container-custom max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-4">À propos</p>
            <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Notre Maison
            </h1>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
              OUD ROYAL est votre destination premium pour les parfums orientaux les plus exquis des maisons émiraties. Nous sélectionnons avec soin chaque fragrance pour vous offrir le meilleur de la parfumerie arabe.
            </p>
          </div>
        </div>

        {/* Valeurs */}
        <div className="container-custom py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Shield, title: 'Authenticité', desc: '100% de nos parfums sont authentiques, importés directement des Émirats Arabes Unis.' },
              { icon: Truck, title: 'Maroc entier', desc: 'Livraison dans toutes les villes du Maroc. Gratuite dès 500 DH d\'achat.' },
              { icon: Heart, title: 'Passion', desc: 'Chaque parfum est sélectionné avec soin par nos experts en parfumerie orientale.' },
            ].map((item) => (
              <div key={item.title} className="text-center p-8 bg-cream rounded-lg">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-primary" size={24} />
                </div>
                <h3 className="font-playfair text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chiffres */}
        <div className="bg-gray-900 py-16">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '200+', label: 'Parfums' },
                { value: '15K+', label: 'Clients satisfaits' },
                { value: '4.8/5', label: 'Note moyenne' },
                { value: '4', label: 'Maisons partenaires' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="container-custom py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Une question ?
            </h2>
            <p className="text-gray-500 mb-8">
              Notre équipe est disponible pour vous aider à trouver le parfum idéal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center justify-center gap-2 cursor-pointer">
                WhatsApp
              </a>
              <a href="tel:+212600000000" className="btn-secondary inline-flex items-center justify-center gap-2 cursor-pointer">
                <Phone size={16} />
                Appeler
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}