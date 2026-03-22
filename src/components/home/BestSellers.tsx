import Link from 'next/link'
import prisma from '@/lib/prisma'
import ProductGrid from '@/components/products/ProductGrid'

export default async function BestSellers() {
  const products = await prisma.product.findMany({
    where: { isActive: true, isBestSeller: true },
    include: { brand: true },
    take: 4,
    orderBy: { sold: 'desc' },
  })

  if (products.length === 0) return null

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-2">
              Top ventes
            </p>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/boutique?sort=popular"
            className="hidden sm:block text-sm font-medium text-primary hover:text-primary-dark transition-colors uppercase tracking-wide"
          >
            Tout voir →
          </Link>
        </div>

        <ProductGrid products={products} />
      </div>
    </section>
  )
}