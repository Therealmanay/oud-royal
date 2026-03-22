'use client';

import {
  ShoppingCart,
  DollarSign,
  Package,
  Users,
  Clock,
  TrendingUp,
  CalendarDays,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  todayOrders: number;
  totalRevenue: number;
  monthRevenue: number;
  totalProducts: number;
  totalCustomers: number;
}

export default function StatsCards({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: 'Revenu Total',
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
    },
    {
      label: 'Revenu du Mois',
      value: formatPrice(stats.monthRevenue),
      icon: TrendingUp,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      label: 'Total Commandes',
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: 'text-gold',
      bg: 'bg-gold/10',
      border: 'border-gold/20',
    },
    {
      label: "Commandes Aujourd'hui",
      value: stats.todayOrders.toString(),
      icon: CalendarDays,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      label: 'En Attente',
      value: stats.pendingOrders.toString(),
      icon: Clock,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
    },
    {
      label: 'Produits',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
    },
    {
      label: 'Clients',
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: 'text-pink-400',
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-dark-card border ${card.border} rounded-xl p-5 transition-all duration-300 hover:scale-[1.02]`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              {card.label}
            </span>
            <div
              className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center`}
            >
              <card.icon size={20} className={card.color} />
            </div>
          </div>
          <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}