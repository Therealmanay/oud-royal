import prisma from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Package,
  MapPin,
  BarChart3,
  Crown,
} from 'lucide-react'

export default async function AdminAnalyticsPage() {
  const [
    totalRevenue,
    totalOrders,
    deliveredOrders,
    cancelledOrders,
    topProducts,
    topCities,
    revenueByMonth,
    categoryStats,
  ] = await Promise.all([
    // Revenu total
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ['CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED'] } },
    }),
    // Total commandes
    prisma.order.count(),
    // Commandes livrées
    prisma.order.count({ where: { status: 'DELIVERED' } }),
    // Commandes annulées
    prisma.order.count({ where: { status: 'CANCELLED' } }),
    // Top produits vendus
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, total: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    }),
    // Top villes
    prisma.order.groupBy({
      by: ['city'],
      _count: { id: true },
      _sum: { total: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    }),
    // Commandes par mois (les 6 derniers mois)
    prisma.order.groupBy({
      by: ['status'],
      _count: true,
    }),
    // Stats par catégorie
    prisma.product.groupBy({
      by: ['category'],
      _count: true,
      _avg: { price: true },
    }),
  ])

  // Récupérer les noms des top produits
  const productIds = topProducts.map((p: any) => p.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { brand: true },
  })

  const topProductsWithNames = topProducts.map((tp: any) => {
    const product = products.find((p: any) => p.id === tp.productId)
    return {
      ...tp,
      name: product?.name || 'Produit inconnu',
      brandName: product?.brand?.name || '',
    }
  })

  const conversionRate = totalOrders > 0
    ? ((deliveredOrders / totalOrders) * 100).toFixed(1)
    : '0'

  const cancelRate = totalOrders > 0
    ? ((cancelledOrders / totalOrders) * 100).toFixed(1)
    : '0'

  const avgOrderValue = totalOrders > 0
    ? (totalRevenue._sum.total || 0) / totalOrders
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold gold-gradient-text">
          Statistiques
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Analyses et performances de votre boutique
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Revenu Total',
            value: formatPrice(totalRevenue._sum.total || 0),
            icon: DollarSign,
            color: 'text-green-400',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20',
          },
          {
            label: 'Panier Moyen',
            value: formatPrice(avgOrderValue),
            icon: ShoppingCart,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
          },
          {
            label: 'Taux de Livraison',
            value: `${conversionRate}%`,
            icon: TrendingUp,
            color: 'text-gold',
            bg: 'bg-gold/10',
            border: 'border-gold/20',
          },
          {
            label: 'Taux d\'Annulation',
            value: `${cancelRate}%`,
            icon: Package,
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
          },
        ].map((kpi, index) => (
          <div
            key={index}
            className={`bg-dark-card border ${kpi.border} rounded-xl p-5`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                {kpi.label}
              </span>
              <div className={`w-10 h-10 ${kpi.bg} rounded-lg flex items-center justify-center`}>
                <kpi.icon size={20} className={kpi.color} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Produits */}
        <div className="card-dark p-6">
          <h3 className="font-heading text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Crown className="text-gold" size={20} />
            Top 10 Produits
          </h3>
          <div className="space-y-3">
            {topProductsWithNames.map((product: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-dark-secondary rounded-lg"
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  index < 3 ? 'bg-gold/20 text-gold' : 'bg-dark-card text-gray-500'
                }`}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">{product.brandName}</p>
                </div>
                <div className="text-right">
                  <p className="text-gold text-sm font-bold">
                    {product._sum.quantity} vendus
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatPrice(product._sum.total || 0)}
                  </p>
                </div>
              </div>
            ))}

            {topProductsWithNames.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">
                Aucune vente pour le moment
              </p>
            )}
          </div>
        </div>

        {/* Top Villes */}
        <div className="card-dark p-6">
          <h3 className="font-heading text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MapPin className="text-gold" size={20} />
            Top 10 Villes
          </h3>
          <div className="space-y-3">
            {topCities.map((city: any, index: number) => {
              const maxCount = topCities[0]?._count?.id || 1
              const percentage = ((city._count.id / maxCount) * 100).toFixed(0)

              return (
                <div key={index} className="p-3 bg-dark-secondary rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        index < 3 ? 'bg-gold/20 text-gold' : 'bg-dark-card text-gray-500'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-white text-sm font-medium">
                        {city.city}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-gold text-sm font-bold">
                        {city._count.id} commandes
                      </span>
                      <p className="text-xs text-gray-500">
                        {formatPrice(city._sum.total || 0)}
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-dark-card h-1.5 rounded-full">
                    <div
                      className="bg-gold h-1.5 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}

            {topCities.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">
                Aucune commande pour le moment
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Catégories */}
      <div className="card-dark p-6">
        <h3 className="font-heading text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="text-gold" size={20} />
          Répartition par Catégorie
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categoryStats.map((cat: any) => {
            const labels: Record<string, string> = {
              HOMME: '👨 Homme',
              FEMME: '👩 Femme',
              UNISEX: '🌟 Unisex',
            }
            return (
              <div key={cat.category} className="p-4 bg-dark-secondary rounded-lg text-center">
                <p className="text-2xl mb-2">{labels[cat.category]?.split(' ')[0] || '📦'}</p>
                <p className="text-white font-semibold">
                  {labels[cat.category]?.split(' ')[1] || cat.category}
                </p>
                <p className="text-gold text-2xl font-bold mt-2">{cat._count}</p>
                <p className="text-xs text-gray-500">produits</p>
                <p className="text-xs text-gray-400 mt-1">
                  Prix moyen: {formatPrice(cat._avg.price || 0)}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Statuts */}
      <div className="card-dark p-6">
        <h3 className="font-heading text-lg font-semibold text-white mb-4">
          Répartition des Commandes par Statut
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {revenueByMonth.map((item: any) => {
            const statusLabels: Record<string, { label: string; color: string }> = {
              PENDING: { label: 'En attente', color: 'text-yellow-400' },
              CONFIRMED: { label: 'Confirmées', color: 'text-blue-400' },
              PREPARING: { label: 'Préparation', color: 'text-purple-400' },
              SHIPPED: { label: 'Expédiées', color: 'text-indigo-400' },
              DELIVERED: { label: 'Livrées', color: 'text-green-400' },
              CANCELLED: { label: 'Annulées', color: 'text-red-400' },
              RETURNED: { label: 'Retournées', color: 'text-gray-400' },
            }
            const info = statusLabels[item.status] || { label: item.status, color: 'text-gray-400' }
            return (
              <div key={item.status} className="p-3 bg-dark-secondary rounded-lg text-center">
                <p className={`text-2xl font-bold ${info.color}`}>{item._count}</p>
                <p className="text-xs text-gray-500 mt-1">{info.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}