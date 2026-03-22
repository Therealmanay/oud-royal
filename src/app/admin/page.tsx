import prisma from '@/lib/prisma';
import StatsCards from '@/components/admin/StatsCards';
import RecentOrders from '@/components/admin/RecentOrders';

export default async function AdminDashboard() {
  const [
    totalOrders,
    pendingOrders,
    totalRevenue,
    totalProducts,
    totalCustomers,
    recentOrders,
    todayOrders,
    monthRevenue,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ['CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED'] } },
    }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.groupBy({
      by: ['phone'],
      _count: true,
    }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        items: { include: { product: { select: { name: true, brand: { select: { name: true } } } } } },
      },
    }),
    prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: { in: ['CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED'] },
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
  ]);

  const stats = {
    totalOrders,
    pendingOrders,
    todayOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    monthRevenue: monthRevenue._sum.total || 0,
    totalProducts,
    totalCustomers: totalCustomers.length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold gold-gradient-text">
          Dashboard
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Bienvenue dans votre panneau d&apos;administration Oud Royal
        </p>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Recent Orders */}
      <div className="card-dark p-6">
        <h2 className="font-heading text-xl font-semibold text-white mb-5">
          Dernières Commandes
        </h2>
        <RecentOrders orders={recentOrders} />
      </div>
    </div>
  );
}