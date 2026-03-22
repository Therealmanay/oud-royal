'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    id: 1,
    title: 'Nouvelle Collection',
    subtitle: 'Découvrez les dernières fragrances orientales',
    cta: 'Voir la collection',
    href: '/boutique?filter=new',
    bg: 'from-blue-900 to-blue-700',
    accent: 'Printemps 2025',
  },
  {
    id: 2,
    title: 'Lattafa - Best Sellers',
    subtitle: 'Khamrah, Asad, Raghba... Les incontournables',
    cta: 'Découvrir Lattafa',
    href: '/boutique?brand=lattafa',
    bg: 'from-gray-900 to-gray-700',
    accent: 'Top ventes',
  },
  {
    id: 3,
    title: 'Livraison Gratuite',
    subtitle: 'Dès 500 DH d\'achat partout au Maroc',
    cta: 'En profiter maintenant',
    href: '/boutique',
    bg: 'from-primary-dark to-primary',
    accent: 'Offre spéciale',
  },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (index: number) => setCurrent(index)
  const goPrev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  const goNext = () => setCurrent((prev) => (prev + 1) % slides.length)

  return (
    <section className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] overflow-hidden bg-gray-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 bg-gradient-to-r ${slides[current].bg} flex items-center`}
        >
          <div className="container-custom relative z-10">
            <div className="max-w-xl">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full mb-4"
              >
                {slides[current].accent}
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
              >
                {slides[current].title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/80 text-base sm:text-lg mb-8 max-w-md"
              >
                {slides[current].subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href={slides[current].href}
                  className="inline-block bg-white text-gray-900 font-semibold px-8 py-3 rounded-md text-sm hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  {slides[current].cta}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Flèches */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              i === current ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  )
}