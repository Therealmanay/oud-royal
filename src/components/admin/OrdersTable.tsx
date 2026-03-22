'use client'

interface OrdersTableProps {
  orders: Array<{
    id: string
    customer: string
    total: number
    status: string
    date: string
  }>
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                No orders found
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-3 text-sm">{order.id}</td>
                <td className="px-6 py-3 text-sm">{order.customer}</td>
                <td className="px-6 py-3 text-sm font-semibold">${order.total}</td>
                <td className="px-6 py-3 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm">{order.date}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
