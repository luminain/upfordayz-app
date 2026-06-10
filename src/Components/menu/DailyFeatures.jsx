import React from 'react';
import { motion } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export default function DailyFeatures({ items, onAddToCart }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="px-6 pt-6 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-citrus" />
            <span className="font-display text-citrus text-xs tracking-[0.25em] uppercase font-semibold">
              Today's Features
            </span>
          </div>
          <p className="text-cream/30 text-[11px] font-display mt-0.5">
            {format(new Date(), 'EEEE, MMMM d')}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-citrus/10 flex items-center justify-center">
          <span className="text-citrus font-display font-bold text-sm">{items.length}</span>
        </div>
      </div>

      {/* Horizontal scroll cards */}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-2 px-2 pb-3">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            className="shrink-0 w-52 relative rounded-[1.5rem] overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.1 }}
          >
            {/* Background gradient based on category */}
            <div className={`absolute inset-0 ${getCategoryGradient(item.category)}`} />

            {/* Glow blob */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-28 bg-white/8 rounded-full blur-2xl" />

            <div className="relative p-4">
              {/* "Today" badge */}
              <div className="flex items-center gap-1 bg-citrus/20 rounded-full px-2.5 py-1 w-fit mb-3">
                <Sparkles className="w-2.5 h-2.5 text-citrus" />
                <span className="text-citrus text-[10px] font-display font-semibold">Featured Today</span>
              </div>

              {/* Image */}
              <div className="flex justify-center mb-3">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-full shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-3xl">☕</span>
                  </div>
                )}
              </div>

              <h3 className="font-heading text-cream text-lg font-bold text-center leading-tight">
                {item.name}
              </h3>
              {item.tagline && (
                <p className="text-citrus text-[11px] font-display text-center mt-0.5">{item.tagline}</p>
              )}

              {/* Price + Rating row */}
              <div className="flex items-center justify-between mt-3 bg-black/20 rounded-xl px-3 py-2">
                <span className="text-cream font-display font-bold text-sm">
                  ${item.price_medium?.toFixed(2)}
                </span>
                {item.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-cream/70 text-xs font-display">{item.rating}</span>
                  </div>
                )}
              </div>

              {/* Add button */}
              <button
                onClick={() => onAddToCart && onAddToCart(item, 'Medium', item.price_medium)}
                className="w-full mt-3 bg-citrus hover:bg-citrus/90 active:scale-95 transition-all text-white rounded-xl py-2.5 text-xs font-display font-semibold tracking-wide"
              >
                Add to Order
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mt-4 mb-2">
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-cream/20 text-[10px] font-display uppercase tracking-widest">Full Menu</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>
    </div>
  );
}

function getCategoryGradient(category) {
  const map = {
    coffee: 'bg-gradient-to-b from-[#4A3728] to-[#2C1E14]',
    espresso: 'bg-gradient-to-b from-[#3D2B1E] to-[#1E1B18]',
    tea: 'bg-gradient-to-b from-[#2D4A3E] to-[#142A20]',
    juice: 'bg-gradient-to-b from-[#C25A40] to-[#8B3D2A]',
    smoothie: 'bg-gradient-to-b from-[#6B3A7D] to-[#321B3E]',
    pastry: 'bg-gradient-to-b from-[#B88A5E] to-[#8B6F47]',
    sandwich: 'bg-gradient-to-b from-[#4A5730] to-[#384422]',
    bakery: 'bg-gradient-to-b from-[#A57A50] to-[#7A5735]',
    vegan: 'bg-gradient-to-b from-[#3A6640] to-[#2A4E30]',
  };
  return map[category] || map.coffee;
}