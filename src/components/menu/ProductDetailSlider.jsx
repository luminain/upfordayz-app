import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Minus, Plus, Star, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

const GOLD = '#E5B84A';
const ESPRESSO_SHOT_PRICE = 1.25;
const MILK_OPTIONS = ['Whole', 'Oat', 'Almond', 'Soy', 'Skim'];

function sweetnessLabel(value) {
  if (value <= 33) return 'Standard';
  if (value <= 66) return 'Balanced';
  return 'Sweet';
}

function getUnitPrice(item, sizeIndex, extraShot) {
  const base = item.basePrice ?? item.price_medium ?? 0;
  let price = base;

  if (item.hasSizes && item.sizes?.[sizeIndex]) {
    price = base + item.sizes[sizeIndex].priceModifier;
  }

  if (item.hasEspressoShot && extraShot) {
    price += ESPRESSO_SHOT_PRICE;
  }

  return price;
}

export default function ProductDetailSlider({ items, initialIndex, onClose, onAddToCart }) {
  const [index, setIndex] = useState(initialIndex);
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedMilk, setSelectedMilk] = useState('Whole');
  const [sweetness, setSweetness] = useState([0]);
  const [extraShot, setExtraShot] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [direction, setDirection] = useState(0);
  const dragStartX = useRef(null);

  const item = items[index];
  const unavailable = item?.out_of_stock || item?.is_available === false;
  const score = item?.score ?? item?.rating;

  const unitPrice = useMemo(
    () => getUnitPrice(item, selectedSize, extraShot),
    [item, selectedSize, extraShot],
  );
  const totalPrice = unitPrice * quantity;

  const resetModifiers = useCallback(() => {
    setSelectedSize(0);
    setSelectedMilk('Whole');
    setSweetness([0]);
    setExtraShot(false);
    setQuantity(1);
  }, []);

  useEffect(() => {
    resetModifiers();
  }, [index, resetModifiers]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const navigateItem = useCallback(
    (dir) => {
      const next = index + dir;
      if (next < 0 || next >= items.length) return;
      setDirection(dir);
      setIndex(next);
    },
    [index, items.length],
  );

  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'ArrowLeft') navigateItem(-1);
      if (event.key === 'ArrowRight') navigateItem(1);
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigateItem, onClose]);

  const handleDragStart = (event) => {
    dragStartX.current = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
  };

  const handleDragEnd = (event) => {
    if (dragStartX.current === null) return;
    const endX = event.type === 'touchend' ? event.changedTouches[0].clientX : event.clientX;
    const diff = dragStartX.current - endX;
    if (Math.abs(diff) > 50) navigateItem(diff > 0 ? 1 : -1);
    dragStartX.current = null;
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  const handleAdd = () => {
    if (unavailable || !item) return;

    const sizeLabel =
      item.hasSizes && item.sizes?.[selectedSize]
        ? item.sizes[selectedSize].label
        : null;

    onAddToCart(item, {
      quantity,
      unitPrice,
      sizeLabel,
      milk: item.hasMilk ? selectedMilk : null,
      sweetness: item.hasSweetness ? sweetnessLabel(sweetness[0]) : null,
      extraShot: item.hasEspressoShot ? extraShot : false,
    });
  };

  if (!item) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.button
        type="button"
        aria-label="Close item details"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-detail-title"
        className="relative z-10 flex max-h-[94vh] flex-col rounded-t-[28px] bg-[#1A1714] shadow-[0_-24px_80px_rgba(0,0,0,0.45)]"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 340 }}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>

        {items.length > 1 && (
          <div className="flex justify-center gap-1.5 px-5 pb-2">
            {items.map((entry, dotIndex) => (
              <motion.div
                key={entry.id}
                className="h-1.5 rounded-full"
                animate={{
                  width: dotIndex === index ? 20 : 6,
                  backgroundColor: dotIndex === index ? GOLD : 'rgba(255,255,255,0.2)',
                }}
                transition={{ duration: 0.25 }}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/15"
        >
          <X className="h-4 w-4" />
        </button>

        {index > 0 && (
          <button
            type="button"
            onClick={() => navigateItem(-1)}
            aria-label="Previous item"
            className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white/70 backdrop-blur-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {index < items.length - 1 && (
          <button
            type="button"
            onClick={() => navigateItem(1)}
            aria-label="Next item"
            className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white/70 backdrop-blur-sm"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-4">
          <div className="relative flex min-h-[180px] items-center justify-center py-3">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={item.id + '-image'}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: 'easeInOut' }}
                className="flex w-full items-center justify-center"
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    draggable={false}
                    className="max-h-[min(34vh,240px)] w-full max-w-[240px] object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.45)]"
                  />
                ) : (
                  <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white/5 text-6xl">
                    ☕
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={item.id + '-header'}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: 'easeInOut' }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 text-left">
                  <h2 id="item-detail-title" className="font-heading text-2xl font-bold text-white">
                    {item.name}
                  </h2>
                  {item.tagline && (
                    <p className="mt-0.5 font-display text-sm" style={{ color: GOLD }}>
                      {item.tagline}
                    </p>
                  )}
                </div>

                {score != null && (
                  <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-3 py-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <div className="text-right">
                      <p className="font-display text-[9px] uppercase tracking-widest text-white/40">Score</p>
                      <p className="font-display text-lg font-bold leading-none text-white">{score}</p>
                    </div>
                  </div>
                )}
              </div>

              <p className="mt-2 font-display text-lg font-bold text-white">${unitPrice.toFixed(2)}</p>

              {item.description && (
                <p className="mt-3 font-body text-sm leading-relaxed text-white/45">{item.description}</p>
              )}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={item.id + '-modifiers'}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="mt-7 space-y-7"
            >
              {item.hasSizes && item.sizes?.length > 0 && (
                <div>
                  <p className="mb-3 font-display text-[10px] uppercase tracking-[0.25em] text-white/40">Size</p>
                  <div className="flex gap-2">
                    {item.sizes.map((size, sizeIndex) => {
                      const selected = selectedSize === sizeIndex;
                      const sizePrice = getUnitPrice(item, sizeIndex, false);
                      return (
                        <button
                          key={size.label}
                          type="button"
                          onClick={() => setSelectedSize(sizeIndex)}
                          className="flex-1 rounded-full py-2.5 font-display text-sm font-medium transition-all duration-200"
                          style={
                            selected
                              ? { backgroundColor: GOLD, color: '#1A1714' }
                              : {
                                  backgroundColor: 'rgba(255,255,255,0.06)',
                                  color: 'rgba(255,255,255,0.55)',
                                  border: '1px solid rgba(255,255,255,0.08)',
                                }
                          }
                        >
                          {size.label}
                          <span className="mt-0.5 block text-[10px] opacity-70">${sizePrice.toFixed(2)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {item.hasMilk && (
                <div>
                  <p className="mb-3 font-display text-[10px] uppercase tracking-[0.25em] text-white/40">Milk</p>
                  <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-0.5">
                    {MILK_OPTIONS.map((milk) => {
                      const selected = selectedMilk === milk;
                      return (
                        <button
                          key={milk}
                          type="button"
                          onClick={() => setSelectedMilk(milk)}
                          className="shrink-0 rounded-full px-4 py-2.5 text-sm font-display font-medium transition-all duration-200"
                          style={
                            selected
                              ? { backgroundColor: GOLD, color: '#1A1714' }
                              : {
                                  backgroundColor: 'rgba(255,255,255,0.06)',
                                  color: 'rgba(255,255,255,0.55)',
                                  border: '1px solid rgba(255,255,255,0.08)',
                                }
                          }
                        >
                          {milk}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {item.hasSweetness && (
                <div>
                  <p className="mb-3 font-display text-[10px] uppercase tracking-[0.25em] text-white/40">
                    Sweetness
                  </p>
                  <div className="flex items-center justify-between text-xs font-display text-white/45">
                    <span>Standard</span>
                    <span className="font-semibold" style={{ color: GOLD }}>
                      {sweetnessLabel(sweetness[0])}
                    </span>
                    <span>Sweet</span>
                  </div>
                  <Slider
                    value={sweetness}
                    onValueChange={setSweetness}
                    max={100}
                    step={1}
                    className="mt-3 [&_.bg-primary]:bg-[#E5B84A] [&_.bg-primary\/20]:bg-white/10 [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-[#E5B84A]/60 [&_[role=slider]]:bg-[#1A1714]"
                  />
                </div>
              )}

              {item.hasEspressoShot && (
                <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={extraShot}
                      onCheckedChange={(checked) => setExtraShot(checked === true)}
                      className="h-5 w-5 rounded-md border-white/20 data-[state=checked]:border-[#E5B84A] data-[state=checked]:bg-[#E5B84A] data-[state=checked]:text-[#1A1714]"
                    />
                    <span className="font-display text-sm font-medium text-white">Add Espresso Shot</span>
                  </div>
                  <span className="font-display text-sm font-semibold" style={{ color: GOLD }}>
                    + ${ESPRESSO_SHOT_PRICE.toFixed(2)}
                  </span>
                </label>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="border-t border-white/[0.08] bg-[#1A1714] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-display text-xs uppercase tracking-[0.2em] text-white/40">Quantity</span>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/15 disabled:opacity-30"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[1.5rem] text-center font-display text-lg font-bold text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-[#1A1714] transition-opacity hover:opacity-90"
                style={{ backgroundColor: GOLD }}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={unavailable}
            className="flex h-14 w-full items-center justify-center rounded-2xl font-display text-base font-bold text-[#1A1714] shadow-[0_8px_32px_rgba(229,184,74,0.35)] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            style={{ backgroundColor: GOLD }}
          >
            {unavailable ? 'Out of Stock' : `Add • $${totalPrice.toFixed(2)}`}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
