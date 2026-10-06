'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Order, OrderStatus } from '@/types'

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Čakajúca',
  paid: 'Zaplatená',
  shipped: 'Odoslaná',
  delivered: 'Doručená',
  cancelled: 'Zrušená',
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-sand text-stone',
  paid: 'bg-sage-pale text-sage-deep',
  shipped: 'bg-[#e0e8f8] text-[#3a6aaa]',
  delivered: 'bg-[#d8f8d8] text-[#2a7a2a]',
  cancelled: 'bg-[#f8d8d8] text-[#aa3a3a]',
}

export default function OrdersTable({ orders: initialOrders }: { orders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders)

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const supabase = createClient()
    await supabase.from('orders').update({ status }).eq('id', orderId)
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    )
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      {orders.length === 0 ? (
        <div className="text-center py-16 text-stone text-sm">Žiadne objednávky</div>
      ) : (
        <table className="w-full text-sm">
          <thead className="border-b border-sand">
            <tr>
              <th className="text-left px-5 py-3 text-xs text-stone-light font-normal">#</th>
              <th className="text-left px-5 py-3 text-xs text-stone-light font-normal">Zákazník</th>
              <th className="text-right px-5 py-3 text-xs text-stone-light font-normal">Suma</th>
              <th className="text-left px-5 py-3 text-xs text-stone-light font-normal">Platba</th>
              <th className="text-left px-5 py-3 text-xs text-stone-light font-normal">Stav</th>
              <th className="text-left px-5 py-3 text-xs text-stone-light font-normal">Dátum</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-sand/50 hover:bg-off/50">
                <td className="px-5 py-3 font-mono text-xs text-stone-light">
                  #{order.id.slice(0, 8)}
                </td>
                <td className="px-5 py-3">
                  <div className="text-ink">{order.customer_first_name} {order.customer_last_name}</div>
                  <div className="text-xs text-stone-light">{order.customer_email}</div>
                </td>
                <td className="px-5 py-3 text-right font-medium text-ink">
                  {order.total.toFixed(2)} €
                </td>
                <td className="px-5 py-3 text-stone capitalize">
                  {order.payment_method === 'card' ? '💳 Karta' : '📄 Faktúra'}
                </td>
                <td className="px-5 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                    className={`text-xs px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${STATUS_COLORS[order.status]}`}
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-3 text-xs text-stone-light">
                  {new Date(order.created_at).toLocaleDateString('sk-SK')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
