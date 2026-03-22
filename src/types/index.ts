import { Product, Brand, Order, OrderItem, Review } from '@prisma/client'

export type ProductWithBrand = Product & {
  brand: Brand
}

export type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Product
  })[]
}

export type ProductWithRelations = Product & {
  brand: Brand
  reviews: Review[]
}

export interface CartItem {
  id: string
  name: string
  price: number
  oldPrice?: number | null
  image: string | null
  volume: string | null
  quantity: number
  slug: string
  brandName: string
}

export interface CheckoutFormData {
  firstName: string
  lastName: string
  phone: string
  email?: string
  address: string
  city: string
  notes?: string
}