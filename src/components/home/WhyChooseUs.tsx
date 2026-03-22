'use client'

import { Truck, Shield, CreditCard, Headphones } from 'lucide-react'

const features = [
  { icon: Shield, title: '100% Authentique', desc: 'Parfums originaux importés des Émirats' },
  { icon: Truck, title: 'Livraison Rapide', desc: 'Partout au Maroc, gratuite dès 500 DH' },
  { icon: CreditCard, title: 'Paiement à la Livraison', desc: 'Payez en cash à la réception' },
  { icon: Headphones, title: 'Support 7j/7', desc: 'WhatsApp disponible pour vous aider' },
]

export default function WhyChooseUs() {
  return (
    <section className="py-12 bg-cream border-y border-gray-100">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <f.icon className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{f.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}