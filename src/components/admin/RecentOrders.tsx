'use client';

import Link from 'next/link';
import { Eye, Phone } from 'lucide-react';
import { formatPrice, ORDER_STATUS_LABELS } from '@/lib/utils';

interface Order {
  id: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  total: number;
  status: string;
  createdAt: Date;
  items: {
    quantity: number;
    product: {
      name: string;
      brand: { name: string };
    };
  }[];
}

export default function RecentOrders({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        Aucune commande pour le moment.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-dark-border">
            <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase tracking-wider">
              Commande
            </th>
            <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase tracking-wider">
              Client
            </th>
            <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase tracking-wider hidden md:table-cell">
              Produits
            </th>
            <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase tracking-wider">
              Total
            </th>
            <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase tracking-wider">
              Statut
            </th>
            <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase tracking-wider hidden lg:table-cell">
              Date
            </th>
            <th className="text-right py-3 px-4 text-xs text-gray-500 font-medium uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const statusInfo =
              ORDER_STATUS_LABELS[order.status] || { label: order.status, color: 'bg-gray-500' };

            return (
              <tr
                key={order.id}
                className="border-b border-dark-border/50 hover:bg-dark-card-hover transition-colors"
              >
                <td className="py-3 px-4">
                  <span className="text-gold font-mono text-sm font-medium">
                    {order.orderNumber}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="text-white text-sm font-medium">
                      {order.firstName} {order.lastName}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Phone size={10} />
                      {order.phone}
                    </p>
                    <p className="text-xs text-gray-600">{order.city}</p>
                  </div>
                </td>
                <td className="py-3 px-4 hidden md:table-cell">
                  <div className="space-y-1">
                    {order.items.slice(0, 2).map((item, i) => (
                      <p key={i} className="text-xs text-gray-400">
                        {item.quantity}x {item.product.name}
                      </p>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-xs text-gray-600">
                        +{order.items.length - 2} autres
                      </p>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-gold font-bold text-sm">
                    {formatPrice(order.total)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </td>
                <td className="py-3 px-4 hidden lg:table-cell">
                  <span className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark-card border border-dark-border text-gray-400 hover:text-gold hover:border-gold transition-all"
                      title="Voir détails"
                    >
                      <Eye size={14} />
                    </Link>
                    <a
                      href={`https://wa.me/${order.phone.replace(/\s/g, '')}?text=Bonjour ${order.firstName}, concernant votre commande ${order.orderNumber} chez Oud Royal...`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-600/20 border border-green-600/30 text-green-400 hover:bg-green-600/30 transition-all"
                      title="Contacter via WhatsApp"
                    >
                      <Phone size={14} />
                    </a>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* View All Link */}
      <div className="text-center mt-6">
        <Link
          href="/admin/orders"
          className="text-gold text-sm hover:underline"
        >
          Voir toutes les commandes →
        </Link>
      </div>
    </div>
  );
}