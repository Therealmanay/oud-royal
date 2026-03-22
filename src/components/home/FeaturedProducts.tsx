import Link from 'next/link'
import prisma from '@/lib/prisma'
import ProductGrid from '@/components/products/ProductGrid'

export default async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: { brand: true },
    take: 8,
    orderBy: { sold: 'desc' },
  })

  if (products.length === 0) return null

  return (
    <section className="py-16 bg-cream">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-2">
              Sélection
            </p>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
              Nos Coups de Cœur
            </h2>
          </div>
          <Link
            href="/boutique"
            className="hidden sm:block text-sm font-medium text-primary hover:text-primary-dark transition-colors uppercase tracking-wide"
          >
            Tout voir →
          </Link>
        </div>

        <ProductGrid products={products} />

        <div className="text-center mt-10 sm:hidden">
          <Link href="/boutique" className="btn-outline-primary inline-block">
            Voir toute la collection
          </Link>
        </div>
      </div>
    </section>
  )
}