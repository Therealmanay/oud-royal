'use client'

import { useState, useRef } from 'react'
import { Star, ChevronLeft, ChevronRight, Send, Quote, User } from 'lucide-react'
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

/* Génère une couleur d'avatar à partir du nom */
function getAvatarColor(name: string) {
  const colors = [
    'bg-accent/10 text-accent',
    'bg-blue-royal/10 text-blue-royal',
    'bg-amber-100 text-amber-700',
    'bg-emerald-100 text-emerald-700',
    'bg-violet-100 text-violet-700',
    'bg-rose-100 text-rose-600',
    'bg-sky-100 text-sky-700',
    'bg-orange-100 text-orange-700',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
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
      const scrollAmount = 380
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
    <section className="py-20 bg-gray-100">
      {/* CSS pour cacher la scrollbar */}
      <style>{`
        .reviews-scroll::-webkit-scrollbar { display: none; }
        .reviews-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="container-custom">
        {/* ═══ TITRE ═══ */}
        <div className="text-center mb-14">
          <p className="text-accent text-xs font-medium uppercase tracking-[0.2em] mb-3">
            Témoignages
          </p>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-gray-900">
            Ce que disent nos clients
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
                  className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white shadow-lg rounded-full flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all cursor-pointer hidden md:flex border border-gray-100"
                >
                  <ChevronLeft size={18} className="text-gray-700" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white shadow-lg rounded-full flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all cursor-pointer hidden md:flex border border-gray-100"
                >
                  <ChevronRight size={18} className="text-gray-700" />
                </button>
              </>
            )}

            {/* Avis défilables */}
            <div
              ref={scrollRef}
              className="reviews-scroll flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 px-1"
            >
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="min-w-[320px] max-w-[320px] snap-start flex-shrink-0"
                >
                  <div className="h-full bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col">
                    {/* Header carte */}
                    <div className="p-6 pb-0">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${getAvatarColor(review.name)}`}>
                          {getInitials(review.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {review.name}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                            })}
                          </p>
                          {/* Étoiles */}
                          <div className="flex gap-0.5 mt-1.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-200'
                                }
                              />
                            ))}
                          </div>
                        </div>
                        {/* Icône quote */}
                        <Quote size={24} className="text-accent/15 shrink-0" />
                      </div>
                    </div>

                    {/* Commentaire */}
                    <div className="p-6 pt-4 flex-1 flex flex-col">
                      <p className="text-[13px] text-gray-600 leading-relaxed break-words overflow-wrap-anywhere flex-1">
                        {review.comment}
                      </p>

                      {/* Barre accent en bas */}
                      <div className="mt-5 pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                            Avis vérifié
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Indicateur de scroll sur mobile */}
            {reviews.length > 1 && (
              <p className="text-center text-[10px] text-gray-400 mt-4 md:hidden">
                ← Glissez pour voir plus →
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">
              Aucun avis pour le moment.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Soyez le premier à partager votre expérience !
            </p>
          </div>
        )}

        {/* ═══ SÉPARATEUR ═══ */}
        <div className="my-16" />

        {/* ═══ FORMULAIRE ═══ */}
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={20} className="text-accent" />
              </div>
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
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star size={28} className="text-green-500 fill-green-500" />
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
                  {/* Nom + Email en grille */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-[0.15em]">
                        Email{' '}
                        <span className="text-gray-300 normal-case tracking-normal text-[9px]">
                          (optionnel)
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
                  </div>

                  {/* Note */}
                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-2 uppercase tracking-[0.15em]">
                      Votre note <span className="text-accent">*</span>
                    </label>
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-4 py-3 w-fit">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          onClick={() =>
                            setFormData({ ...formData, rating: star })
                          }
                          className="cursor-pointer p-0.5 transition-transform hover:scale-125"
                        >
                          <Star
                            size={26}
                            className={`transition-colors ${
                              star <= (hoveredStar || formData.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 hover:text-gray-400'
                            }`}
                          />
                        </button>
                      ))}
                      {formData.rating > 0 && (
                        <span className="ml-3 text-sm text-gray-500 font-medium">
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
                    <div className="flex justify-between mt-1">
                      <p className="text-[9px] text-gray-300">
                        Visible uniquement après validation
                      </p>
                      <p className="text-[10px] text-gray-300">
                        {formData.comment.length} / 500
                      </p>
                    </div>
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
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}