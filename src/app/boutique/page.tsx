import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductGrid from '@/components/products/ProductGrid'
import ProductFilters from '@/components/products/ProductFilters'
import prisma from '@/lib/prisma'

export const metadata = {
  title: 'Boutique',
}

interface BoutiquePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

/* ─── Couleur du header par catégorie ─── */
function getCategoryTheme(category?: string) {
  switch (category) {
    case 'FEMME':
      return {
        bg: 'bg-accent-soft',
        border: 'border-accent/10',
        titleColor: 'text-accent-dark',
      }
    case 'HOMME':
      return {
        bg: 'bg-blue-royal-soft',
        border: 'border-blue-royal/10',
        titleColor: 'text-blue-royal',
      }
    default:
      return {
        bg: 'bg-cream',
        border: 'border-gray-100',
        titleColor: 'text-gray-900',
      }
  }
}

/* ─── Couleur pagination par catégorie ─── */
function getPaginationColors(category?: string) {
  switch (category) {
    case 'FEMME':
      return {
        active: 'bg-accent text-white',
        inactive: 'bg-gray-50 text-gray-600 hover:bg-accent/10 hover:text-accent',
      }
    case 'HOMME':
      return {
        active: 'bg-blue-royal text-white',
        inactive: 'bg-gray-50 text-gray-600 hover:bg-blue-royal/10 hover:text-blue-royal',
      }
    default:
      return {
        active: 'bg-primary text-white',
        inactive: 'bg-gray-50 text-gray-600 hover:bg-primary/10 hover:text-primary',
      }
  }
}

export default async function BoutiquePage({ searchParams }: BoutiquePageProps) {
  const params = await searchParams

  const brand = typeof params.brand === 'string' ? params.brand : undefined
  const category = typeof params.category === 'string' ? params.category : undefined
  const sort = typeof params.sort === 'string' ? params.sort : undefined
  const search = typeof params.search === 'string' ? params.search : undefined
  const filter = typeof params.filter === 'string' ? params.filter : undefined
  const type = typeof params.type === 'string' ? params.type : undefined
  const page = typeof params.page === 'string' ? params.page : '1'

  const currentPage = parseInt(page)
  const perPage = 12

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { isActive: true }

  if (brand) {
    where.brand = { slug: brand }
  }
  if (category) {
    where.category = category
  }
  if (type) {
    where.type = type
  }
  if (filter === 'new') {
    where.isNew = true
  }
  if (filter === 'promo') {
    where.oldPrice = { not: null }
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = { createdAt: 'desc' }
  if (sort === 'price-asc') orderBy = { price: 'asc' }
  if (sort === 'price-desc') orderBy = { price: 'desc' }
  if (sort === 'newest') orderBy = { createdAt: 'desc' }
  if (sort === 'popular') orderBy = { sold: 'desc' }
  if (sort === 'rating') orderBy = { rating: 'desc' }

  const [products, allBrands, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { brand: true },
      orderBy,
      skip: (currentPage - 1) * perPage,
      take: perPage,
    }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    prisma.product.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / perPage)

  // Titre dynamique
  let pageTitle = 'Notre Boutique'
  let pageSubtitle = ''
  if (filter === 'new') { pageTitle = 'Nouveautés'; pageSubtitle = 'Les derniers arrivages' }
  if (filter === 'promo') { pageTitle = 'Promotions'; pageSubtitle = 'Offres exceptionnelles' }
  if (category === 'HOMME') { pageTitle = 'Parfums Homme'; pageSubtitle = 'Puissance & élégance masculine' }
  if (category === 'FEMME') { pageTitle = 'Parfums Femme'; pageSubtitle = 'Féminité & raffinement' }
  if (category === 'UNISEX') { pageTitle = 'Parfums Unisex'; pageSubtitle = 'L\'art du partage' }
  if (brand) {
    const found = allBrands.find((b: { slug: string; name: string }) => b.slug === brand)
    if (found) { pageTitle = found.name; pageSubtitle = 'Collection complète' }
  }

  const theme = getCategoryTheme(category)
  const paginationColors = getPaginationColors(category)

  const buildPageUrl = (pageNum: number) => {
    const p = new URLSearchParams()
    if (brand) p.set('brand', brand)
    if (category) p.set('category', category)
    if (sort) p.set('sort', sort)
    if (search) p.set('search', search)
    if (filter) p.set('filter', filter)
    if (type) p.set('type', type)
    p.set('page', pageNum.toString())
    return `/boutique?${p.toString()}`
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className={`${theme.bg} border-b ${theme.border} py-10`}>
          <div className="container-custom">
            <h1 className={`font-playfair text-2xl sm:text-3xl font-bold ${theme.titleColor}`}>
              {pageTitle}
            </h1>
            {pageSubtitle && (
              <p className="text-sm text-gray-400 mt-1 italic">{pageSubtitle}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              {totalCount} produit{totalCount > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="container-custom py-6">
          <Suspense fallback={<div className="h-16" />}>
            <ProductFilters
              brands={allBrands}
              currentBrand={brand}
              currentCategory={category}
              currentSort={sort}
              currentSearch={search}
            />
          </Suspense>

          <div className="mt-6">
            <ProductGrid products={products} />
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <a
                  key={n}
                  href={buildPageUrl(n)}
                  className={`w-10 h-10 flex items-center justify-center text-sm font-medium cursor-pointer ${
                    n === currentPage
                      ? paginationColors.active
                      : paginationColors.inactive
                  }`}
                >
                  {n}
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}