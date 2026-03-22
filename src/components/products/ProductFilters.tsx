'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useState } from 'react'

interface ProductFiltersProps {
  brands: Array<{ id: string; name: string; slug: string }>
  currentBrand?: string
  currentCategory?: string
  currentSort?: string
  currentSearch?: string
}

export default function ProductFilters({ brands, currentBrand, currentCategory, currentSort, currentSearch }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(currentSearch || '')

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) { params.set(key, value) } else { params.delete(key) }
    params.delete('page')
    router.push(`/boutique?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter('search', search)
  }

  const hasFilters = currentBrand || currentCategory || currentSort || currentSearch

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <input
            type="text"
            placeholder="Rechercher un parfum..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
        </form>

        <select value={currentBrand || ''} onChange={(e) => updateFilter('brand', e.target.value)} className="select-field sm:w-48 cursor-pointer">
          <option value="">Toutes les marques</option>
          {brands.map((b) => <option key={b.id} value={b.slug}>{b.name}</option>)}
        </select>

        <select value={currentCategory || ''} onChange={(e) => updateFilter('category', e.target.value)} className="select-field sm:w-44 cursor-pointer">
          <option value="">Catégorie</option>
          <option value="HOMME">Homme</option>
          <option value="FEMME">Femme</option>
          <option value="UNISEX">Unisex</option>
        </select>

        <select value={currentSort || ''} onChange={(e) => updateFilter('sort', e.target.value)} className="select-field sm:w-44 cursor-pointer">
          <option value="">Trier par</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="newest">Plus récents</option>
          <option value="popular">Populaires</option>
          <option value="rating">Mieux notés</option>
        </select>
      </div>

      {hasFilters && (
        <button
          onClick={() => { router.push('/boutique'); setSearch('') }}
          className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          <X size={12} />
          Effacer les filtres
        </button>
      )}
    </div>
  )
}