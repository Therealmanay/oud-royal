import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoriteItem {
  id: string
  name: string
  slug: string
  price: number
  oldPrice: number | null
  image: string | null
  volume: string | null
  brandName: string
  rating: number
  reviewCount: number
}

interface FavoritesStore {
  items: FavoriteItem[]
  addFavorite: (item: FavoriteItem) => void
  removeFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  clearFavorites: () => void
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],

      addFavorite: (item: FavoriteItem) => {
        const items = get().items
        const exists = items.find((i) => i.id === item.id)
        if (!exists) {
          set({ items: [...items, item] })
        }
      },

      removeFavorite: (id: string) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },

      isFavorite: (id: string) => {
        return get().items.some((i) => i.id === id)
      },

      clearFavorites: () => set({ items: [] }),
    }),
    {
      name: 'oud-royal-favorites',
    }
  )
)