import React from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Coffee, ShoppingBag, Gift, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 100),
  });

  const { data: menuItems = [] } = useQuery({
    queryKey: ['admin-menu'],
    queryFn: () => base44.entities.MenuItem.list(),
  });

  const { data: giftCards = [] } = useQuery({
    queryKey: ['admin-giftcards'],
    queryFn: () => base44.entities.GiftCard.list(),
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const stats = [
    { label: 'Menu Items', value: menuItems.length, icon: Coffee, color: 'bg-citrus/20 text-citrus' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'bg-blue-500/20 text-blue-400' },
    { label: 'Pending', value: pendingOrders, icon: ShoppingBag, color: 'bg-yellow-500/20 text-yellow-400' },
    { label: 'Revenue', value: `$${totalRevenue.toFixed(0)}`, icon: DollarSign, color: 'bg-green-500/20 text-green-400' },
    { label: 'Gift Cards', value: giftCards.length, icon: Gift, color: 'bg-purple-500/20 text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="bg-white/5 rounded-2xl p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color} mb-3`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <p className="text-cream font-heading text-2xl font-bold">{stat.value}</p>
            <p className="text-cream/40 text-xs font-display mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <h3 className="text-cream font-heading text-lg font-bold mb-4">Recent Orders</h3>
        <div className="space-y-2">
          {orders.slice(0, 5).map(order => (
            <div key={order.id} className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-cream font-display text-sm font-semibold">{order.customer_name}</p>
                <p className="text-cream/40 text-xs">{order.items?.length || 0} items · {order.order_type}</p>
              </div>
              <div className="text-right">
                <p className="text-cream font-display font-bold">${order.total?.toFixed(2)}</p>
                <span className={`text-[10px] font-display px-2 py-0.5 rounded-full ${
                  order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400'
                  : order.status === 'completed' ? 'bg-green-500/20 text-green-400'
                  : 'bg-white/10 text-cream/50'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-cream/30 text-sm font-display text-center py-8">No orders yet</p>
          )}
        </div>
      </div>
    </div>
  );
}