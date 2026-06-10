import React from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Gift } from 'lucide-react';

const STATUS_COLORS = {
  active: 'bg-green-500/20 text-green-400',
  redeemed: 'bg-blue-500/20 text-blue-400',
  expired: 'bg-red-500/20 text-red-400',
};

export default function AdminGiftCards() {
  const { data: cards = [], isLoading } = useQuery({
    queryKey: ['admin-giftcards'],
    queryFn: () => base44.entities.GiftCard.list('-created_date', 100),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-6 h-6 border-2 border-cream/20 border-t-citrus rounded-full animate-spin" />
      </div>
    );
  }

  const totalValue = cards.reduce((sum, c) => sum + (c.amount || 0), 0);
  const activeCards = cards.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-4">
      <h3 className="text-cream font-heading text-lg font-bold">Gift Cards</h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-2xl p-4">
          <p className="text-cream font-heading text-2xl font-bold">{activeCards}</p>
          <p className="text-cream/40 text-xs font-display">Active Cards</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-4">
          <p className="text-cream font-heading text-2xl font-bold">${totalValue}</p>
          <p className="text-cream/40 text-xs font-display">Total Value</p>
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-10">
          <Gift className="w-10 h-10 text-cream/10 mx-auto mb-3" />
          <p className="text-cream/30 text-sm font-display">No gift cards yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              className="bg-white/5 rounded-xl p-4 flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div>
                <p className="text-cream font-display text-sm font-semibold">{card.recipient_name}</p>
                <p className="text-cream/40 text-xs font-mono">{card.code}</p>
                {card.sender_name && (
                  <p className="text-cream/30 text-xs">From: {card.sender_name}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-cream font-display font-bold">${card.amount}</p>
                <span className={`text-[10px] font-display px-2 py-0.5 rounded-full ${STATUS_COLORS[card.status] || STATUS_COLORS.active}`}>
                  {card.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}