import prisma from '@/lib/prisma'
import OrdersManager from '@/components/admin/OrdersManager'

interface PageProps {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const { status, search, page } = await searchParams
  const currentPage = parseInt(page || '1')
  const perPage = 20

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {}
  if (status && status !== 'all') {
    where.status = status.toUpperCase()
  }
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: 'insensitive' } },
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search } },
    ]
  }

  const [orders, totalCount, statusCounts] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: { name: true, image: true, brand: { select: { name: true } } },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * perPage,
      take: perPage,
    }),
    prisma.order.count({ where }),
    prisma.order.groupBy({
      by: ['status'],
      _count: true,
    }),
  ])

  const totalPages = Math.ceil(totalCount / perPage)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold gold-gradient-text">
            Commandes
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {totalCount} commande{totalCount > 1 ? 's' : ''} au total
          </p>
        </div>
      </div>

      <OrdersManager
        orders={orders}
        totalPages={totalPages}
        currentPage={currentPage}
        statusCounts={statusCounts}
        currentStatus={status}
        currentSearch={search}
      />
    </div>
  )
}