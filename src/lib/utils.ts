import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return `${price.toFixed(0)} DH`
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `OR-${timestamp}-${random}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function getDiscountPercentage(price: number, oldPrice: number): number {
  if (!oldPrice || oldPrice <= price) return 0
  return Math.round(((oldPrice - price) / oldPrice) * 100)
}

export const ORDER_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'En attente', color: 'bg-yellow-500/20 text-yellow-400' },
  CONFIRMED: { label: 'Confirmée', color: 'bg-blue-500/20 text-blue-400' },
  PREPARING: { label: 'En préparation', color: 'bg-purple-500/20 text-purple-400' },
  SHIPPED: { label: 'Expédiée', color: 'bg-indigo-500/20 text-indigo-400' },
  DELIVERED: { label: 'Livrée', color: 'bg-green-500/20 text-green-400' },
  CANCELLED: { label: 'Annulée', color: 'bg-red-500/20 text-red-400' },
  RETURNED: { label: 'Retournée', color: 'bg-gray-500/20 text-gray-400' },
}

export const CITIES: string[] = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tanger',
  'Agadir',
  'Meknès',
  'Oujda',
  'Kénitra',
  'Tétouan',
  'Salé',
  'Nador',
  'Mohammedia',
  'El Jadida',
  'Béni Mellal',
  'Taza',
  'Khouribga',
  'Settat',
  'Larache',
  'Khémisset',
  'Guelmim',
  'Berrechid',
  'Safi',
  'Errachidia',
  'Essaouira',
  'Al Hoceima',
  'Ouarzazate',
  'Dakhla',
  'Laâyoune',
  'Tan-Tan',
  'Ifrane',
  'Chefchaouen',
]

export const PRODUCT_TYPE_LABELS: Record<string, string> = {
  EAU_DE_PARFUM: 'Eau de Parfum',
  EXTRAIT_DE_PARFUM: 'Extrait de Parfum',
  EAU_DE_TOILETTE: 'Eau de Toilette',
  PARFUM: 'Parfum',
}

export const CATEGORY_LABELS: Record<string, string> = {
  HOMME: 'Homme',
  FEMME: 'Femme',
  UNISEX: 'Unisex',
}