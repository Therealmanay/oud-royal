'use client'

import { useState, useRef } from 'react'
import { Star, ChevronLeft, ChevronRight, Send, Quote } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface SiteReview {
  id: string
  name: string
  rating: number
  comment: string
  createdAt: string
}

interface TestimonialsProps {
  reviews: SiteReview[]
}

export default function Testimonials({ reviews }: TestimonialsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    comment: '',
  })
  const [hoveredStar, setHoveredStar] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Veuillez entrer votre nom')
      return
    }
    if (formData.rating === 0) {
      toast.error('Veuillez donner une note')
      return
    }
    if (!formData.comment.trim()) {
      toast.error('Veuillez écrire un commentaire')
      return
    }
    if (formData.comment.trim().length < 10) {
      toast.error('Le commentaire doit faire au moins 10 caractères')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', rating: 0, comment: '' })
        toast.success('Merci pour votre avis !')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Une erreur est survenue')
      }
    } catch {
      toast.error('Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-16 bg-white">
      {/* CSS pour cacher la scrollbar */}
      <style>{`
        .reviews-scroll::-webkit-scrollbar { display: none; }
        .reviews-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="container-custom">
        {/* ═══ TITRE ═══ */}
        <div className="text-center mb-12">
          <p className="text-accent text-xs font-medium uppercase tracking-[0.2em] mb-3">
            Témoignages
          </p>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-gray-900">
            Vos Avis
          </h2>
          <div className="w-12 h-[2px] bg-accent mx-auto mt-4" />
        </div>

        {/* ═══ LISTE DES AVIS APPROUVÉS ═══ */}
        {reviews.length > 0 ? (
          <div className="relative">
            {/* Flèches de navigation */}
            {reviews.length > 3 && (
              <>
                <button
                  onClick={() => scroll('left')}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center hover:shadow-lg transition-all cursor-pointer hidden md:flex"
                >
                  <ChevronLeft size={18} className="text-gray-600" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center hover:shadow-lg transition-all cursor-pointer hidden md:flex"
                >
                  <ChevronRight size={18} className="text-gray-600" />
                </button>
              </>
            )}

            {/* Avis défilables */}
            <div
              ref={scrollRef}
              className="reviews-scroll flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 px-1"
            >
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="min-w-[300px] max-w-[300px] snap-start flex-shrink-0"
                >
                  <div className="h-full p-6 bg-cream border border-gray-100 relative">
                    {/* Icône quote */}
                    <Quote size={20} className="text-accent/20 mb-3" />

                    {/* Étoiles */}
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className={
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-200'
                          }
                        />
                      ))}
                    </div>

                    {/* Commentaire */}
                    <p className="text-sm text-gray-600 leading-relaxed mb-5 italic">
                      &quot;{review.comment}&quot;
                    </p>

                    {/* Auteur */}
                    <div className="mt-auto pt-4 border-t border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">
                        {review.name}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Indicateur de scroll sur mobile */}
            {reviews.length > 1 && (
              <p className="text-center text-[10px] text-gray-300 mt-3 md:hidden">
                ← Glissez pour voir plus →
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">
              Aucun avis pour le moment. Soyez le premier à partager votre expérience !
            </p>
          </div>
        )}

        {/* ═══ SÉPARATEUR ═══ */}
        <div className="divider my-14" />

        {/* ═══ FORMULAIRE ═══ */}
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h3 className="font-playfair text-xl font-bold text-gray-900">
              Partagez votre expérience
            </h3>
            <p className="text-xs text-gray-400 mt-2">
              Votre avis nous aide à nous améliorer
            </p>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              /* ─── Message de succès ─── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 px-6 bg-cream border border-gray-100"
              >
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star size={24} className="text-accent fill-accent" />
                </div>
                <h4 className="font-playfair text-lg font-bold text-gray-900 mb-2">
                  Merci pour votre avis !
                </h4>
                <p className="text-sm text-gray-500 mb-6">
                  Il sera publié après validation par notre équipe.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-accent font-medium hover:underline cursor-pointer"
                >
                  Laisser un autre avis
                </button>
              </motion.div>
            ) : (
              /* ─── Formulaire ─── */
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Nom */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-[0.15em]">
                    Votre nom <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ex : Fatima Z."
                    className="input-field"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-[0.15em]">
                    Email{' '}
                    <span className="text-gray-300 normal-case tracking-normal">
                      (optionnel — visible uniquement par l&apos;admin)
                    </span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="votre@email.com"
                    className="input-field"
                  />
                </div>

                {/* Note */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-2 uppercase tracking-[0.15em]">
                    Votre note <span className="text-accent">*</span>
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() =>
                          setFormData({ ...formData, rating: star })
                        }
                        className="cursor-pointer p-0.5 transition-transform hover:scale-110"
                      >
                        <Star
                          size={28}
                          className={`transition-colors ${
                            star <= (hoveredStar || formData.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-200 hover:text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    {formData.rating > 0 && (
                      <span className="ml-2 text-xs text-gray-400 self-center">
                        {formData.rating}/5
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
                    value={formData.comment}
                    onChange={(e) =>
                      setFormData({ ...formData, comment: e.target.value })
                    }
                    placeholder="Partagez votre expérience avec nos parfums..."
                    rows={4}
                    className="input-field resize-none"
                    required
                  />
                  <p className="text-[10px] text-gray-300 mt-1 text-right">
                    {formData.comment.length} / 500
                  </p>
                </div>

                {/* Bouton */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
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

                <p className="text-[10px] text-gray-300 text-center leading-relaxed">
                  Votre avis sera publié après validation par notre équipe.
                  <br />
                  Votre email ne sera jamais affiché publiquement.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}