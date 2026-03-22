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
  if (filter === 'new') pageTitle = 'Nouveautés'
  if (filter === 'promo') pageTitle = 'Promotions'
  if (category === 'HOMME') pageTitle = 'Parfums Homme'
  if (category === 'FEMME') pageTitle = 'Parfums Femme'
  if (category === 'UNISEX') pageTitle = 'Parfums Unisex'
  if (brand) {
    const found = allBrands.find((b: { slug: string; name: string }) => b.slug === brand)
    if (found) pageTitle = found.name
  }

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
        <div className="bg-cream border-b border-gray-100 py-8">
          <div className="container-custom">
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-gray-900">
              {pageTitle}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
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
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer ${
                    n === currentPage
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-primary/10 hover:text-primary'
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