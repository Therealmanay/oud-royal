import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductDetails from '@/components/products/ProductDetails'
import ProductGrid from '@/components/products/ProductGrid'
import prisma from '@/lib/prisma'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { brand: true },
  })
  if (!product) return { title: 'Produit non trouvé' }
  return {
    title: `${product.name} - ${product.brand.name}`,
    description: product.description || `Découvrez ${product.name} de ${product.brand.name}`,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  if (!slug) {
    return notFound()
  }

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!product) {
    return notFound()
  }

  const similarProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: product.id },
      OR: [
        { brandId: product.brandId },
        { category: product.category },
      ],
    },
    include: { brand: true },
    take: 4,
  })

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="container-custom py-6">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <a href="/" className="hover:text-primary transition-colors cursor-pointer">Accueil</a>
            <span>/</span>
            <a href="/boutique" className="hover:text-primary transition-colors cursor-pointer">Boutique</a>
            <span>/</span>
            <span className="text-gray-700">{product.name}</span>
          </nav>

          <ProductDetails product={product} />

          {similarProducts.length > 0 && (
            <div className="mt-20 border-t border-gray-100 pt-12">
              <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
                Vous aimerez aussi
              </h2>
              <ProductGrid products={similarProducts} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}