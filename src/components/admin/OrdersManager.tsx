'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Eye,
  Phone,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { formatPrice, ORDER_STATUS_LABELS } from '@/lib/utils';

interface Props {
  orders: any[];
  totalPages: number;
  currentPage: number;
  statusCounts: { status: string; _count: number }[];
  currentStatus?: string;
  currentSearch?: string;
}

const statuses = [
  { value: 'all', label: 'Toutes' },
  { value: 'PENDING', label: 'En attente' },
  { value: 'CONFIRMED', label: 'Confirmées' },
  { value: 'PREPARING', label: 'Préparation' },
  { value: 'SHIPPED', label: 'Expédiées' },
  { value: 'DELIVERED', label: 'Livrées' },
  { value: 'CANCELLED', label: 'Annulées' },
];

export default function OrdersManager({
  orders,
  totalPages,
  currentPage,
  statusCounts,
  currentStatus,
  currentSearch,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(currentSearch || '');

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`/admin/orders?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', searchTerm || null);
  };

  const getStatusCount = (status: string) => {
    if (status === 'all') {
      return statusCounts.reduce((sum, s) => sum + s._count, 0);
    }
    return statusCounts.find((s) => s.status === status)?._count || 0;
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search + Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par n° commande, nom, téléphone..."
            className="input-dark pl-10"
          />
        </form>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => updateParam('status', s.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              (currentStatus || 'all') === s.value
                ? 'bg-gold/20 border border-gold/40 text-gold'
                : 'bg-dark-card border border-dark-border text-gray-400 hover:text-white'
            }`}
          >
            {s.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                (currentStatus || 'all') === s.value
                  ? 'bg-gold/30 text-gold'
                  : 'bg-dark-secondary text-gray-500'
              }`}
            >
              {getStatusCount(s.value)}
            </span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border bg-dark-secondary/50">
                <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase">
                  Commande
                </th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase">
                  Client
                </th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase hidden lg:table-cell">
                  Produits
                </th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase">
                  Total
                </th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase">
                  Statut
                </th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium uppercase hidden md:table-cell">
                  Date
                </th>
                <th className="text-right py-3 px-4 text-xs text-gray-500 font-medium uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const statusInfo =
                  ORDER_STATUS_LABELS[order.status] || {
                    label: order.status,
                    color: 'bg-gray-500',
                  };

                return (
                  <tr
                    key={order.id}
                    className="border-b border-dark-border/30 hover:bg-dark-card-hover transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="text-gold font-mono text-sm font-medium">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-white text-sm font-medium">
                        {order.firstName} {order.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{order.phone}</p>
                      <p className="text-xs text-gray-600">{order.city}</p>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      {order.items.slice(0, 2).map((item: any, i: number) => (
                        <p key={i} className="text-xs text-gray-400">
                          {item.quantity}x {item.product.name}
                        </p>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-xs text-gray-600">
                          +{order.items.length - 2} autres
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gold font-bold text-sm">
                        {formatPrice(order.total)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value)
                        }
                        className={`text-xs font-medium px-2 py-1.5 rounded-lg border-0 cursor-pointer ${statusInfo.color} text-white`}
                      >
                        {statuses
                          .filter((s) => s.value !== 'all')
                          .map((s) => (
                            <option
                              key={s.value}
                              value={s.value}
                              className="bg-dark-primary text-white"
                            >
                              {s.label}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
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
                        >
                          <Eye size={14} />
                        </Link>
                        <a
                          href={`https://wa.me/${order.phone.replace(/\s/g, '')}?text=Bonjour ${order.firstName}, votre commande ${order.orderNumber} chez Oud Royal...`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-600/20 border border-green-600/30 text-green-400 hover:bg-green-600/30 transition-all"
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
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <Filter size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-400">Aucune commande trouvée</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Link
            href={`/admin/orders?page=${Math.max(1, currentPage - 1)}&${searchParams.toString()}`}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-dark-card border border-dark-border text-gray-400 hover:text-gold hover:border-gold transition-all"
          >
            <ChevronLeft size={18} />
          </Link>
          <span className="text-sm text-gray-400 px-4">
            Page {currentPage} / {totalPages}
          </span>
          <Link
            href={`/admin/orders?page=${Math.min(totalPages, currentPage + 1)}&${searchParams.toString()}`}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-dark-card border border-dark-border text-gray-400 hover:text-gold hover:border-gold transition-all"
          >
            <ChevronRight size={18} />
          </Link>
        </div>
      )}
    </div>
  );
}