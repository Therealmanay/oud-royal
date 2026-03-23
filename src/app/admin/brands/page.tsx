'use client'

import { useState, useEffect } from 'react'
import { Tag, Globe, Package, Plus, Trash2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Brand {
  id: string
  name: string
  slug: string
  description: string | null
  country: string
  isActive: boolean
  _count: { products: number }
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', description: '', country: 'Émirats Arabes Unis' })

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/admin/brands/list')
      const data = await res.json()
      setBrands(data)
    } catch {
      toast.error('Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBrands() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Marque ajoutée !')
      setForm({ name: '', slug: '', description: '', country: 'Émirats Arabes Unis' })
      setShowForm(false)
      fetchBrands()
    } catch (error: any) {
      toast.error(error.message || 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer la marque "${name}" ?`)) return
    try {
      const res = await fetch(`/api/admin/brands/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Marque supprimée')
      fetchBrands()
    } catch (error: any) {
      toast.error(error.message || 'Erreur')
    }
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold gold-gradient-text">
            Marques
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {brands.length} marque{brands.length > 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-gold text-sm">
          <Plus size={18} />
          Ajouter
        </button>
      </div>

      {/* Formulaire ajout */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card-dark p-6 space-y-4">
          <h3 className="font-heading text-lg font-semibold text-white">Nouvelle Marque</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Nom *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })}
                placeholder="Ex: Lattafa"
                className="input-dark"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Slug *</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="Ex: lattafa"
                className="input-dark"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Pays</label>
              <input
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="input-dark"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Description</label>
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description courte..."
                className="input-dark"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-gold text-sm disabled:opacity-50">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Ajout...</> : 'Ajouter la marque'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-400 hover:text-white">
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Grille des marques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((brand) => (
          <div key={brand.id} className="card-dark p-6 hover:border-gold/30 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                <Tag className="text-gold" size={24} />
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  brand.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {brand.isActive ? 'Active' : 'Inactive'}
                </span>
                {brand._count.products === 0 && (
                  <button
                    onClick={() => handleDelete(brand.id, brand.name)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>

            <h3 className="text-white text-lg font-semibold mb-1">{brand.name}</h3>
            {brand.description && (
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{brand.description}</p>
            )}

            <div className="flex items-center gap-4 pt-4 border-t border-dark-border">
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <Globe size={14} /> {brand.country}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gold">
                <Package size={14} /> {brand._count.products} produit{brand._count.products > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}