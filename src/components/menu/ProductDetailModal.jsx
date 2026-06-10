import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Heart, ShoppingBag, X } from 'lucide-react';

const CATEGORY_COLORS = {
  coffee:   { bg: '#4A3728', glow: 'rgba(74,55,40,0.8)',   accent: '#C8956C' },
  espresso: { bg: '#2E1F14', glow: 'rgba(46,31,20,0.9)',   accent: '#D4845A' },
  tea:      { bg: '#2D4A3E', glow: 'rgba(45,74,62,0.8)',   accent: '#7BC4A8' },
  juice:    { bg: '#8B3D2A', glow: 'rgba(231,111,81,0.7)', accent: '#E76F51' },
  smoothie: { bg: '#321B3E', glow: 'rgba(107,58,125,0.7)', accent: '#B07FCC' },
  pastry:   { bg: '#8B6F47', glow: 'rgba(212,165,116,0.6)',accent: '#D4A574' },
  sandwich: { bg: '#384422', glow: 'rgba(92,107,61,0.7)',  accent: '#8FA85A' },
  bakery:   { bg: '#7A5735', glow: 'rgba(196,149,106,0.7)',accent: '#C4956A' },
  vegan:    { bg: '#2A4E30', glow: 'rgba(74,122,78,0.7)',  accent: '#6DB96E' },
};

const SIZE_KEYS = ['price_small', 'price_medium', 'price_large'];
const SIZE_LABELS = ['Small', 'Medium', 'Large'];

export default function ProductDetailModal({ items, initialIndex, onClose, onAddToCart }) {
  const [index, setIndex] = useState(initialIndex);
  const [selectedSize, setSelectedSize] = useState(1);
  const [liked, setLiked] = useState(false);
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const item = items[index];
  const colors = CATEGORY_COLORS[item?.category] || CATEGORY_COLORS.coffee;

  // Reset size when item changes
  useEffect(() => {
    setSelectedSize(1);
    setLiked(false);
  }, [index]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const go = useCallback((dir) => {
    const next = index + dir;
    if (next < 0 || next >= items.length) return;
    setDirection(dir);
    setIndex(next);
  }, [index, items.length]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [go, onClose]);

  // Touch/drag handling
  const dragStartX = useRef(null);

  const handleDragStart = (e) => {
    dragStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
    setIsDragging(true);
  };

  const handleDragEnd = (e) => {
    if (dragStartX.current === null) return;
    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStartX.current - endX;
    if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
    dragStartX.current = null;
    setIsDragging(false);
  };

  const availableSizes = SIZE_KEYS.map((k, i) => ({ label: SIZE_LABELS[i], price: item?.[k] })).filter(s => s.price);
  const currentPrice = availableSizes[selectedSize]?.price || availableSizes[0]?.price;

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  if (!item) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Dynamic background */}
      <motion.div
        className="absolute inset-0"
        animate={{ backgroundColor: colors.bg }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ backgroundColor: colors.bg }}
      />

      {/* Ambient radial glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ background: `radial-gradient(ellipse 70% 60% at 50% 38%, ${colors.glow} 0%, transparent 70%)` }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between px-6 pt-12 pb-4">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <motion.p
          key={item.category}
          className="text-white/50 text-xs font-display uppercase tracking-[0.25em]"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {item.category}
        </motion.p>

        <button
          onClick={() => setLiked(l => !l)}
          className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
        >
          <Heart className={`w-5 h-5 transition-all duration-300 ${liked ? 'text-citrus fill-citrus' : 'text-white/50'}`} />
        </button>
      </div>

      {/* Counter */}
      <div className="relative z-20 flex justify-center gap-1.5 pb-2">
        {items.map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full transition-all duration-300"
            animate={{
              width: i === index ? 20 : 6,
              backgroundColor: i === index ? '#E76F51' : 'rgba(255,255,255,0.25)',
            }}
            style={{ height: 6 }}
          />
        ))}
      </div>

      {/* Swipeable product image area */}
      <div
        className="relative z-10 flex-1 flex items-center justify-center overflow-hidden select-none"
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Left arrow */}
        {index > 0 && (
          <button
            onClick={() => go(-1)}
            className="absolute left-4 z-20 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-white/70" />
          </button>
        )}

        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={item.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Product image with glow */}
            <div className="relative flex items-center justify-center">
              <motion.div
                className="absolute w-72 h-72 rounded-full blur-[80px] opacity-60"
                animate={{ backgroundColor: colors.accent }}
                transition={{ duration: 0.6 }}
              />
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="relative w-64 h-64 object-contain drop-shadow-2xl z-10 pointer-events-none"
                  draggable={false}
                />
              ) : (
                <div className="relative w-64 h-64 rounded-full bg-white/10 flex items-center justify-center z-10">
                  <span className="text-8xl">☕</span>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Right arrow */}
        {index < items.length - 1 && (
          <button
            onClick={() => go(1)}
            className="absolute right-4 z-20 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 text-white/70" />
          </button>
        )}
      </div>

      {/* Glassmorphism info panel */}
      <motion.div
        className="relative z-20 mx-4 mb-8 rounded-[2rem] overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="p-6">
          {/* Name + tagline */}
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id + '-text'}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="font-heading text-white text-2xl font-bold">{item.name}</h2>
              {item.tagline && (
                <p className="font-display text-sm mt-0.5" style={{ color: colors.accent }}>
                  {item.tagline}
                </p>
              )}
              {item.description && (
                <p className="text-white/50 text-xs mt-2 leading-relaxed">{item.description}</p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Size pills */}
          {availableSizes.length > 1 && (
            <div className="flex gap-2 mt-5">
              {availableSizes.map((s, i) => (
                <button
                  key={s.label}
                  onClick={() => setSelectedSize(i)}
                  className="flex-1 py-2.5 rounded-full text-sm font-display transition-all duration-300"
                  style={
                    selectedSize === i
                      ? { backgroundColor: '#E76F51', color: '#fff', boxShadow: '0 4px 16px rgba(231,111,81,0.35)' }
                      : { backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.55)' }
                  }
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Price + Rating */}
          <div className="flex items-center justify-between mt-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={item.id + '-price-' + selectedSize}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-white/40 text-[10px] font-display uppercase tracking-widest">Price</p>
                <p className="text-white text-2xl font-display font-bold">${currentPrice?.toFixed(2)}</p>
              </motion.div>
            </AnimatePresence>

            {item.rating && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={item.id + '-rating'}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.25 }}
                >
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <div>
                    <p className="text-white/40 text-[10px] font-display uppercase tracking-widest">Score</p>
                    <p className="text-white text-2xl font-display font-bold">{item.rating}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Add to Order button */}
          <button
            onClick={() => {
              const size = availableSizes[selectedSize]?.label || 'Medium';
              onAddToCart(item, size, currentPrice);
            }}
            className="w-full mt-5 py-4 rounded-2xl text-white font-display text-sm tracking-wide transition-all duration-200 active:scale-[0.98]"
            style={{
              backgroundColor: '#E76F51',
              boxShadow: '0 8px 24px rgba(231,111,81,0.35)',
            }}
          >
            Add to Order
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}