import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sizeLabels = ['Small', 'Medium', 'Large'];

export default function MenuItemCard({ item, onAddToCart, onOpen }) {
  const [selectedSize, setSelectedSize] = useState(1); // 0=S, 1=M, 2=L
  const [liked, setLiked] = useState(false);

  const prices = [item.price_small, item.price_medium, item.price_large].filter(Boolean);
  const currentPrice = prices[selectedSize] || prices[0] || item.price_medium;

  const gradients = {
    coffee: 'from-[#4A3728] via-[#3B2A1C] to-[#2C1E14]',
    espresso: 'from-[#3D2B1E] via-[#2E1F14] to-[#1E1B18]',
    tea: 'from-[#2D4A3E] via-[#1E3A2E] to-[#142A20]',
    juice: 'from-[#E76F51]/80 via-[#C25A40] to-[#8B3D2A]',
    smoothie: 'from-[#6B3A7D] via-[#4E2A5E] to-[#321B3E]',
    pastry: 'from-[#D4A574]/60 via-[#B88A5E] to-[#8B6F47]',
    sandwich: 'from-[#5C6B3D] via-[#4A5730] to-[#384422]',
    bakery: 'from-[#C4956A] via-[#A57A50] to-[#7A5735]',
    vegan: 'from-[#4A7A4E] via-[#3A6640] to-[#2A4E30]',
  };

  return (
    <motion.div
      className={`relative rounded-[2rem] bg-gradient-to-b ${gradients[item.category] || gradients.coffee} p-6 overflow-hidden cursor-pointer`}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      onClick={onOpen}
    >
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-48 h-48 bg-white/5 rounded-full blur-3xl" />

      {/* Heart */}
      <button
        onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
        className="absolute top-5 right-5 z-10"
      >
        <Heart
          className={`w-5 h-5 transition-all duration-300 ${liked ? 'text-citrus fill-citrus scale-110' : 'text-white/30'}`}
        />
      </button>

      {/* Image */}
      <div className="relative flex justify-center mb-4">
        <motion.div
          className="relative w-40 h-40"
          whileHover={{ scale: 1.05, rotate: 2 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="absolute inset-4 bg-white/8 rounded-full blur-2xl" />
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="relative w-full h-full object-contain drop-shadow-2xl" />
          ) : (
            <div className="relative w-full h-full rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-4xl">☕</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Name & Tagline */}
      <h3 className="font-heading text-cream text-2xl font-bold text-center">{item.name}</h3>
      {item.tagline && (
        <p className="text-citrus text-sm font-display text-center mt-1">{item.tagline}</p>
      )}
      {item.description && (
        <p className="text-cream/50 text-xs text-center mt-2 leading-relaxed max-w-[240px] mx-auto">
          {item.description}
        </p>
      )}

      {/* Size Selector */}
      {prices.length > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {sizeLabels.slice(0, prices.length).map((size, i) => (
            <button
              key={size}
              onClick={() => setSelectedSize(i)}
              className={`px-5 py-2 rounded-full text-sm font-display transition-all duration-300 ${
                selectedSize === i
                  ? 'bg-citrus text-white shadow-lg shadow-citrus/30'
                  : 'bg-white/10 text-cream/60 hover:bg-white/15'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      )}

      {/* Price & Rating */}
      <div className="flex items-center justify-between mt-5 bg-white/8 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-cream/40" />
          <div>
            <p className="text-cream/40 text-[10px] font-display uppercase tracking-wider">Price</p>
            <p className="text-cream font-display font-bold text-lg">${currentPrice?.toFixed(2)}</p>
          </div>
        </div>
        {item.rating && (
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <div>
              <p className="text-cream/40 text-[10px] font-display uppercase tracking-wider">Score</p>
              <p className="text-cream font-display font-bold text-lg">{item.rating}</p>
            </div>
          </div>
        )}
      </div>

      {/* Add to Cart */}
      <Button
        onClick={(e) => { e.stopPropagation(); onAddToCart && onAddToCart(item, sizeLabels[selectedSize], currentPrice); }}
        className="w-full mt-4 bg-citrus hover:bg-citrus/90 text-white rounded-2xl h-12 font-display text-sm tracking-wide shadow-lg shadow-citrus/20"
      >
        Add to Order
      </Button>
    </motion.div>
  );
}