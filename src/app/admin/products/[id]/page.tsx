import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import ProductForm from '@/components/admin/ProductForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  const resolvedParams = await params
  const id = resolvedParams.id

  if (!id) {
    return notFound()
  }

  const [product, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { brand: true },
    }),
    prisma.brand.findMany({ where: { isActive: true } }),
  ])

  if (!product) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold gold-gradient-text">
          Modifier: {product.name}
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          {product.brand.name} • {product.volume}
        </p>
      </div>
      <ProductForm product={product} brands={brands} />
    </div>
  )
}