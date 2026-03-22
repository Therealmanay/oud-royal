import prisma from '@/lib/prisma'
import { Users, Phone, MapPin, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default async function AdminCustomersPage() {
  const customers = await prisma.order.groupBy({
    by: ['phone', 'firstName', 'lastName', 'city'],
    _count: { id: true },
    _sum: { total: true },
    orderBy: { _sum: { total: 'desc' } },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold gold-gradient-text">
          Clients
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          {customers.length} client{customers.length > 1 ? 's' : ''} unique
          {customers.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border bg-dark-secondary/50">
                <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase">
                  Client
                </th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase">
                  Téléphone
                </th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase">
                  Ville
                </th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase">
                  Commandes
                </th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase">
                  Total Dépensé
                </th>
                <th className="text-right py-3 px-4 text-xs text-gray-500 font-medium uppercase">
                  Contact
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer: any, index: number) => (
                <tr
                  key={index}
                  className="border-b border-dark-border/30 hover:bg-dark-card-hover transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold font-bold text-sm">
                        {customer.firstName[0]}
                        {customer.lastName[0]}
                      </div>
                      <span className="text-white text-sm font-medium">
                        {customer.firstName} {customer.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <Phone size={12} />
                      {customer.phone}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <MapPin size={12} />
                      {customer.city}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-white font-medium flex items-center gap-1">
                      <ShoppingBag size={12} className="text-gold" />
                      {customer._count.id}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gold font-bold text-sm">
                      {formatPrice(customer._sum.total || 0)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={`https://wa.me/${customer.phone.replace(/\s/g, '')}?text=Bonjour ${customer.firstName}, merci pour votre fidélité chez Oud Royal!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-green-600/20 border border-green-600/30 text-green-400 hover:bg-green-600/30 transition-all"
                    >
                      <Phone size={14} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {customers.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-400">Aucun client pour le moment</p>
          </div>
        )}
      </div>
    </div>
  )
}