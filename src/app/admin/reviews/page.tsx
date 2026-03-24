'use client'

import { useState, useEffect } from 'react'
import { Star, CheckCircle, XCircle, MessageSquare, Plus, Trash2, Loader2, Package, Globe, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

interface ProductReview {
  id: string
  name: string
  email: string | null
  rating: number
  comment: string
  isApproved: boolean
  createdAt: string
  product: { id: string; name: string; brand: { name: string } }
}

interface SiteReviewType {
  id: string
  name: string
  email: string | null
  rating: number
  comment: string
  isApproved: boolean
  createdAt: string
}

interface Product {
  id: string
  name: string
  brand: { name: string }
}

export default function AdminReviewsPage() {
  const [productReviews, setProductReviews] = useState<ProductReview[]>([])
  const [siteReviews, setSiteReviews] = useState<SiteReviewType[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'product' | 'site'>('product')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    productId: '',
    rating: '5',
    comment: '',
    isApproved: true,
    type: 'product' as 'product' | 'site',
  })

  const fetchData = async () => {
    try {
      const [revRes, prodRes] = await Promise.all([
        fetch('/api/admin/reviews/list'),
        fetch('/api/products'),
      ])
      const revData = await revRes.json()
      setProductReviews(revData.productReviews || [])
      setSiteReviews(revData.siteReviews || [])
      setProducts(await prodRes.json())
    } catch {
      toast.error('Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        email: form.email || null,
        rating: form.rating,
        comment: form.comment,
        isApproved: form.isApproved,
      }
      if (form.type === 'product') {
        payload.productId = form.productId
      }

      const res = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Avis ajouté !')
      setForm({ name: '', email: '', productId: '', rating: '5', comment: '', isApproved: true, type: 'product' })
      setShowForm(false)
      fetchData()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erreur'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const toggleApproval = async (id: string, currentStatus: boolean, type: 'product' | 'site') => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !currentStatus, type }),
      })
      if (!res.ok) throw new Error()
      toast.success(!currentStatus ? 'Avis approuvé' : 'Avis masqué')
      fetchData()
    } catch {
      toast.error('Erreur')
    }
  }

  const deleteReview = async (id: string, type: 'product' | 'site') => {
    if (!confirm('Supprimer cet avis ?')) return
    try {
      const res = await fetch(`/api/admin/reviews/${id}?type=${type}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Avis supprimé')
      fetchData()
    } catch {
      toast.error('Erreur')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    )
  }

  const productApproved = productReviews.filter((r) => r.isApproved).length
  const productPending = productReviews.filter((r) => !r.isApproved).length
  const siteApproved = siteReviews.filter((r) => r.isApproved).length
  const sitePending = siteReviews.filter((r) => !r.isApproved).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold gold-gradient-text">Avis Clients</h1>
          <p className="text-gray-400 text-sm mt-1">
            {productReviews.length + siteReviews.length} avis au total
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-gold text-sm">
          <Plus size={18} /> Ajouter un avis
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-dark p-4 text-center">
          <p className="text-2xl font-bold text-gold">{productReviews.length}</p>
          <p className="text-xs text-gray-500 mt-1">Avis produits</p>
        </div>
        <div className="card-dark p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">{siteReviews.length}</p>
          <p className="text-xs text-gray-500 mt-1">Avis généraux</p>
        </div>
        <div className="card-dark p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{productApproved + siteApproved}</p>
          <p className="text-xs text-gray-500 mt-1">Approuvés</p>
        </div>
        <div className="card-dark p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">{productPending + sitePending}</p>
          <p className="text-xs text-gray-500 mt-1">En attente</p>
        </div>
      </div>

      {/* Formulaire ajout */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card-dark p-6 space-y-4">
          <h3 className="font-heading text-lg font-semibold text-white">Nouvel Avis</h3>

          {/* Type d'avis */}
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Type d&apos;avis *</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'product', productId: '' })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  form.type === 'product' ? 'bg-gold text-black' : 'bg-dark-secondary text-gray-400 border border-dark-border'
                }`}
              >
                <Package size={16} /> Avis produit
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'site', productId: '' })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  form.type === 'site' ? 'bg-gold text-black' : 'bg-dark-secondary text-gray-400 border border-dark-border'
                }`}
              >
                <Globe size={16} /> Avis général
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Nom du client *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Fatima Z." className="input-dark" required />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Email (optionnel)</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" className="input-dark" />
            </div>
            {form.type === 'product' && (
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Produit *</label>
                <select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} className="select-dark" required>
                  <option value="">Sélectionner un produit</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} - {p.brand.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Note *</label>
              <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="select-dark">
                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                <option value="4">⭐⭐⭐⭐ (4)</option>
                <option value="3">⭐⭐⭐ (3)</option>
                <option value="2">⭐⭐ (2)</option>
                <option value="1">⭐ (1)</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Approuver directement</label>
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input type="checkbox" checked={form.isApproved} onChange={(e) => setForm({ ...form, isApproved: e.target.checked })} className="accent-gold" />
                <span className="text-sm text-gray-300">Oui, approuver</span>
              </label>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Commentaire *</label>
            <textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Un parfum incroyable..." className="input-dark resize-none" rows={3} required />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-gold text-sm disabled:opacity-50">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Ajout...</> : 'Ajouter l\'avis'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-400 hover:text-white cursor-pointer">Annuler</button>
          </div>
        </form>
      )}

      {/* Onglets */}
      <div className="flex gap-1 bg-dark-secondary p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('product')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
            activeTab === 'product' ? 'bg-dark-card text-gold' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Package size={16} />
          Avis Produits ({productReviews.length})
        </button>
        <button
          onClick={() => setActiveTab('site')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
            activeTab === 'site' ? 'bg-dark-card text-gold' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Globe size={16} />
          Avis Généraux ({siteReviews.length})
        </button>
      </div>

      {/* Table des avis produits */}
      {activeTab === 'product' && (
        <div className="card-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border bg-dark-secondary/50">
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase">Client</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase">Produit</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase">Note</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase hidden md:table-cell">Commentaire</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase">Statut</th>
                  <th className="text-right py-3 px-4 text-xs text-gray-500 font-medium uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {productReviews.map((review) => (
                  <tr key={review.id} className="border-b border-dark-border/30 hover:bg-dark-card-hover transition-colors">
                    <td className="py-3 px-4">
                      <span className="text-white text-sm font-medium">{review.name}</span>
                      {review.email && (
                        <span className="flex items-center gap-1 text-[10px] text-gray-600 mt-0.5">
                          <Mail size={10} /> {review.email}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-300">{review.product.name}</p>
                      <p className="text-xs text-gray-600">{review.product.brand.name}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'} />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <p className="text-sm text-gray-400 truncate max-w-xs">{review.comment}</p>
                    </td>
                    <td className="py-3 px-4">
                      <button onClick={() => toggleApproval(review.id, review.isApproved, 'product')} className="cursor-pointer">
                        {review.isApproved ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                            <CheckCircle size={12} /> Approuvé
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                            <XCircle size={12} /> En attente
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => deleteReview(review.id, 'product')} className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {productReviews.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare size={48} className="mx-auto text-gray-700 mb-4" />
              <p className="text-gray-400">Aucun avis produit</p>
            </div>
          )}
        </div>
      )}

      {/* Table des avis généraux */}
      {activeTab === 'site' && (
        <div className="card-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border bg-dark-secondary/50">
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase">Client</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase">Note</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase hidden md:table-cell">Commentaire</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase">Date</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase">Statut</th>
                  <th className="text-right py-3 px-4 text-xs text-gray-500 font-medium uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {siteReviews.map((review) => (
                  <tr key={review.id} className="border-b border-dark-border/30 hover:bg-dark-card-hover transition-colors">
                    <td className="py-3 px-4">
                      <span className="text-white text-sm font-medium">{review.name}</span>
                      {review.email && (
                        <span className="flex items-center gap-1 text-[10px] text-gray-600 mt-0.5">
                          <Mail size={10} /> {review.email}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'} />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <p className="text-sm text-gray-400 truncate max-w-xs">{review.comment}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <button onClick={() => toggleApproval(review.id, review.isApproved, 'site')} className="cursor-pointer">
                        {review.isApproved ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                            <CheckCircle size={12} /> Approuvé
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                            <XCircle size={12} /> En attente
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => deleteReview(review.id, 'site')} className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {siteReviews.length === 0 && (
            <div className="text-center py-12">
              <Globe size={48} className="mx-auto text-gray-700 mb-4" />
              <p className="text-gray-400">Aucun avis général</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}