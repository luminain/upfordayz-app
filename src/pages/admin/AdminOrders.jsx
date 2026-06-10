import React from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, Phone } from 'lucide-react';
import { format } from 'date-fns';

const STATUS_COLORS = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-blue-500/20 text-blue-400',
  preparing: 'bg-purple-500/20 text-purple-400',
  ready: 'bg-green-500/20 text-green-400',
  completed: 'bg-green-500/10 text-green-500/60',
  cancelled: 'bg-red-500/20 text-red-400',
};

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 100),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Order.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-6 h-6 border-2 border-cream/20 border-t-citrus rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-cream font-heading text-lg font-bold">Orders ({orders.length})</h3>
      {orders.length === 0 ? (
        <p className="text-cream/30 text-sm font-display text-center py-10">No orders yet</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              className="bg-white/5 rounded-2xl p-5 space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-cream font-display font-semibold">{order.customer_name}</h4>
                  <div className="flex items-center gap-3 mt-1 text-cream/40 text-xs">
                    {order.customer_phone && (
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{order.customer_phone}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {order.created_date ? format(new Date(order.created_date), 'MMM d, h:mm a') : ''}
                    </span>
                  </div>
                </div>
                <Select
                  value={order.status || 'pending'}
                  onValueChange={(v) => updateMutation.mutate({ id: order.id, status: v })}
                >
                  <SelectTrigger className={`w-32 border-0 rounded-xl text-xs ${STATUS_COLORS[order.status || 'pending']}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(STATUS_COLORS).map(s => (
                      <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 text-xs text-cream/40">
                <span className="capitalize bg-white/5 px-2 py-1 rounded-lg">{order.order_type}</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {order.location === 'polk_st' ? 'Polk St' : 'Valencia St'}
                </span>
              </div>

              {order.items?.length > 0 && (
                <div className="space-y-1">
                  {order.items.map((item, j) => (
                    <div key={j} className="flex items-center justify-between text-sm">
                      <span className="text-cream/70">{item.quantity}x {item.name} ({item.size})</span>
                      <span className="text-cream/50">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-cream/40 text-sm font-display">Total</span>
                <span className="text-cream font-display font-bold text-lg">${order.total?.toFixed(2)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}