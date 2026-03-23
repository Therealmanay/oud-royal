import Link from 'next/link'
import Image from 'next/image'
import prisma from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { Plus, Edit, Eye, Package } from 'lucide-react'
import DeleteProductButton from '@/components/admin/DeleteProductButton'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { brand: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold gold-gradient-text">
            Produits
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {products.length} produit{products.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="btn-gold text-sm"
        >
          <Plus size={18} />
          Ajouter un produit
        </Link>
      </div>

      <div className="card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border bg-dark-secondary/50">
                <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase">Produit</th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase">Marque</th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase">Prix</th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase">Stock</th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase">Vendus</th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase">Statut</th>
                <th className="text-right py-3 px-4 text-xs text-gray-500 font-medium uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: any) => (
                <tr key={product.id} className="border-b border-dark-border/30 hover:bg-dark-card-hover transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {/* Image du produit */}
                      <div className="w-12 h-12 bg-dark-secondary rounded-lg overflow-hidden relative flex-shrink-0">
                        {product.image && product.image.length > 0 ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            🧴
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.volume}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-400">{product.brand.name}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <span className="text-gold font-bold text-sm">{formatPrice(product.price)}</span>
                      {product.oldPrice && (
                        <span className="text-xs text-gray-500 line-through ml-2">{formatPrice(product.oldPrice)}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-sm font-medium ${
                      product.stock > 10 ? 'text-green-400' : product.stock > 0 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-400">{product.sold}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {product.isFeatured && <span className="px-2 py-0.5 bg-gold/20 text-gold text-xs rounded-full">Vedette</span>}
                      {product.isBestSeller && <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">Best</span>}
                      {product.isNew && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">New</span>}
                      {!product.isActive && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">Inactif</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/produit/${product.slug}`}
                        target="_blank"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark-card border border-dark-border text-gray-400 hover:text-gold hover:border-gold transition-all"
                        title="Voir"
                      >
                        <Eye size={14} />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark-card border border-dark-border text-gray-400 hover:text-blue-400 hover:border-blue-400 transition-all"
                        title="Modifier"
                      >
                        <Edit size={14} />
                      </Link>
                      <DeleteProductButton
                        productId={product.id}
                        productName={product.name}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-400">Aucun produit pour le moment</p>
          </div>
        )}
      </div>
    </div>
  )
}