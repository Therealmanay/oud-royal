import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { formatPrice, ORDER_STATUS_LABELS } from '@/lib/utils'
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Package,
  Clock,
} from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            include: { brand: true },
          },
        },
      },
      statusHistory: {
        orderBy: { createdAt: 'desc' as const },
      },
    },
  })
  return order
}

type OrderData = NonNullable<Awaited<ReturnType<typeof getOrder>>>

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params
  const order = await getOrder(id)

  if (!order) {
    return notFound()
  }

  const statusInfo =
    ORDER_STATUS_LABELS[order.status] || {
      label: order.status,
      color: 'bg-gray-500',
    }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gold transition-colors"
      >
        <ArrowLeft size={16} />
        Retour aux commandes
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold gold-gradient-text">
            Commande {order.orderNumber}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <span
          className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${statusInfo.color}`}
        >
          {statusInfo.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-dark p-6">
            <h3 className="font-heading text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Package size={20} className="text-gold" />
              Produits commandés
            </h3>
            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-dark-secondary rounded-lg"
                >
                  <div className="w-16 h-16 bg-dark-card rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                    🧴
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.product.brand.name} • {item.product.volume}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">x{item.quantity}</p>
                    <p className="text-gold font-bold">
                      {formatPrice(item.total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-dark-border space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Sous-total</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Livraison</span>
                <span>
                  {order.shippingCost === 0
                    ? 'Gratuite'
                    : formatPrice(order.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-dark-border">
                <span>Total</span>
                <span className="text-gold">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="card-dark p-6">
            <h3 className="font-heading text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock size={20} className="text-gold" />
              Historique
            </h3>
            <div className="space-y-3">
              {order.statusHistory.map((entry: any) => {
                const info =
                  ORDER_STATUS_LABELS[entry.status] || {
                    label: entry.status,
                    color: 'bg-gray-500',
                  }
                return (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 p-3 bg-dark-secondary rounded-lg"
                  >
                    <span
                      className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${info.color}`}
                    />
                    <div>
                      <p className="text-white text-sm font-medium">
                        {info.label}
                      </p>
                      {entry.comment && (
                        <p className="text-xs text-gray-400 mt-1">
                          {entry.comment}
                        </p>
                      )}
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(entry.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="space-y-6">
          <div className="card-dark p-6">
            <h3 className="font-heading text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User size={20} className="text-gold" />
              Client
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Nom complet</p>
                <p className="text-white font-medium">
                  {order.firstName} {order.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Téléphone</p>
                <a
                  href={`tel:${order.phone}`}
                  className="text-gold font-medium flex items-center gap-1"
                >
                  <Phone size={14} />
                  {order.phone}
                </a>
              </div>
              {order.email && (
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-white">{order.email}</p>
                </div>
              )}
            </div>
          </div>

          <div className="card-dark p-6">
            <h3 className="font-heading text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-gold" />
              Livraison
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Ville</p>
                <p className="text-white">{order.city}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Adresse</p>
                <p className="text-white text-sm">{order.address}</p>
              </div>
              {order.notes && (
                <div>
                  <p className="text-xs text-gray-500">Notes</p>
                  <p className="text-gray-400 text-sm">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="card-dark p-6 text-center">
            <p className="text-sm text-gray-400 mb-3">💵 Méthode de paiement</p>
            <p className="text-gold font-bold text-lg">
              Paiement à la livraison
            </p>
          </div>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${order.phone.replace(/\s/g, '')}?text=Bonjour ${order.firstName}, concernant votre commande ${order.orderNumber}...`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-green-500 transition-colors"
          >
            <Phone size={18} />
            Contacter sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}