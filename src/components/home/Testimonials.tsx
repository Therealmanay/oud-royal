'use client'

import { Star } from 'lucide-react'

const testimonials = [
  { name: 'Fatima Z.', city: 'Casablanca', text: 'Khamrah est devenu mon parfum signature ! La tenue est incroyable.' },
  { name: 'Ahmed M.', city: 'Rabat', text: 'Asad de Lattafa, rapport qualité-prix imbattable. Je recommande !' },
  { name: 'Salma B.', city: 'Marrakech', text: 'Service rapide et parfums 100% originaux. Jamais déçue !' },
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-gray-900">
            Avis de nos clients
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="p-6 bg-cream rounded-lg">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">&quot;{t.text}&quot;</p>
              <p className="text-sm font-semibold text-gray-900">{t.name}</p>
              <p className="text-xs text-gray-400">{t.city}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}