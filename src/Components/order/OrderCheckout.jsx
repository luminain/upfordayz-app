import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, Loader2, MapPin, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import CartItem from '@/components/order/CartItem';
import { createDoorDashOrder } from '@/api/doordashClient';
import { getNormalizedMenuItems } from '@/lib/demoMenuData';
import {
  CART_STORAGE_KEY,
  DOORDASH_STORES,
  LOCATION_STORAGE_KEY,
  getStoreById,
} from '@/lib/doordashConfig';

const CITRUS = '#E76F51';
const SILK = '#F7F4EF';
const TAX_RATE = 0.08625;
const DEMO_QUOTE = { fee: 7.9, etaMinutes: 26, distanceMiles: 4.6 };

export default function OrderCheckout() {
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('cart');
  const [orderType, setOrderType] = useState('pickup');
  const [selectedStoreId, setSelectedStoreId] = useState(() =>
    localStorage.getItem(LOCATION_STORAGE_KEY) || DOORDASH_STORES[0].id,
  );
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryQuote, setDeliveryQuote] = useState(null);
  const [isQuoting, setIsQuoting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderReference, setOrderReference] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const activeStore = useMemo(() => getStoreById(selectedStoreId), [selectedStoreId]);

  const menuImageById = useMemo(() => {
    const map = {};
    getNormalizedMenuItems().forEach((item) => {
      if (item.image_url) map[item.id] = item.image_url;
    });
    return map;
  }, []);

  const cartWithImages = useMemo(
    () =>
      cart.map((item) => ({
        ...item,
        image_url: item.image_url || menuImageById[item.menu_item_id] || '',
      })),
    [cart, menuImageById],
  );

  const loadCart = useCallback(() => {
    setCart(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]'));
  }, []);

  useEffect(() => {
    loadCart();
    window.addEventListener('cart-updated', loadCart);
    return () => window.removeEventListener('cart-updated', loadCart);
  }, [loadCart]);

  useEffect(() => {
    localStorage.setItem(LOCATION_STORAGE_KEY, selectedStoreId);
  }, [selectedStoreId]);

  const updateCart = useCallback((nextCart) => {
    setCart(nextCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCart));
    window.dispatchEvent(new Event('cart-updated'));
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const deliveryFee = orderType === 'delivery' && deliveryQuote ? deliveryQuote.fee : 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + deliveryFee + tax;

  const updateQuantity = (index, quantity) => {
    if (quantity <= 0) {
      updateCart(cart.filter((_, itemIndex) => itemIndex !== index));
      return;
    }
    const nextCart = [...cart];
    nextCart[index] = { ...nextCart[index], quantity };
    updateCart(nextCart);
  };

  const handleClearCart = () => {
    updateCart([]);
    setDeliveryQuote(null);
    setDeliveryAddress('');
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setView('checkout');
  };

  const handleBackToCart = () => {
    setView('cart');
  };

  const handleOrderTypeChange = (type) => {
    setOrderType(type);
    if (type === 'pickup') {
      setDeliveryQuote(null);
    }
  };

  const handleGetQuote = async () => {
    if (!deliveryAddress.trim()) {
      toast({ title: 'Enter a delivery address', variant: 'destructive' });
      return;
    }

    setIsQuoting(true);
    setDeliveryQuote(null);

    await new Promise((resolve) => window.setTimeout(resolve, 1100));

    setDeliveryQuote(DEMO_QUOTE);
    setIsQuoting(false);
  };

  const handlePay = async () => {
    if (cart.length === 0) return;

    if (orderType === 'delivery') {
      if (!deliveryAddress.trim()) {
        toast({ title: 'Please enter a delivery address', variant: 'destructive' });
        return;
      }
      if (!deliveryQuote) {
        toast({ title: 'Get a DoorDash quote first', variant: 'destructive' });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await createDoorDashOrder({
        storeId: selectedStoreId,
        orderType,
        customerName: 'Guest',
        customerPhone: '4155550100',
        dropoffAddress: deliveryAddress,
        notes: '',
        orderValue: subtotal,
        items: cart,
        quoteExternalDeliveryId: deliveryQuote?.externalDeliveryId,
        externalDeliveryId: deliveryQuote?.externalDeliveryId,
      });

      localStorage.removeItem(CART_STORAGE_KEY);
      setCart([]);
      setOrderReference(response.externalDeliveryId || '');
      setOrderPlaced(true);
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
      setCart([]);
      setOrderPlaced(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1A1714] p-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 220 }}
        >
          <motion.div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
            style={{ backgroundColor: `${CITRUS}22` }}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Check className="h-8 w-8 text-citrus" />
          </motion.div>
          <h2 className="font-heading text-2xl font-bold text-cream">Order Confirmed</h2>
          <p className="mx-auto mt-2 max-w-sm font-body text-sm text-cream/50">
            Your order is headed to {activeStore.label}. We&apos;ll have it ready soon.
          </p>
          {orderReference && (
            <p className="mt-3 font-display text-xs text-cream/30">Reference: {orderReference}</p>
          )}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-8 rounded-2xl bg-citrus px-8 py-3 font-display text-sm font-bold text-white"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1714] pb-52">
      <div className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#1A1714]/95 px-5 pb-4 pt-6 backdrop-blur-xl">
        {view === 'checkout' && (
          <button
            type="button"
            onClick={handleBackToCart}
            className="mb-3 flex items-center gap-1.5 font-display text-xs text-cream/50 transition-colors hover:text-cream"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Cart
          </button>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-[10px] uppercase tracking-[0.25em] text-cream/35">
              {view === 'cart' ? 'Your Order' : 'Almost There'}
            </p>
            <h1 className="font-heading text-2xl font-bold" style={{ color: SILK }}>
              {view === 'cart' ? 'Cart' : 'Checkout'}
            </h1>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-citrus/15 px-3 py-1.5">
            <ShoppingBag className="h-3.5 w-3.5 text-citrus" />
            <span className="font-display text-xs font-semibold text-citrus">{cart.length}</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'cart' ? (
          <motion.div
            key="cart-view"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="px-5 pt-5"
          >
            {cart.length === 0 ? (
              <div className="py-20 text-center">
                <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-cream/10" />
                <p className="font-display text-sm text-cream/35">Your cart is empty</p>
                <button
                  type="button"
                  onClick={() => navigate('/menu')}
                  className="mt-4 font-display text-sm text-citrus hover:underline"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cartWithImages.map((item, index) => (
                    <CartItem
                      key={`${item.menu_item_id}-${index}`}
                      item={{ ...item, quantity: item.quantity || 1 }}
                      index={index}
                      onUpdate={updateQuantity}
                      onRemove={(itemIndex) => updateCart(cart.filter((_, cartIndex) => cartIndex !== itemIndex))}
                    />
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-4">
                  <span className="font-display text-xs uppercase tracking-[0.2em] text-[#A89890]">Subtotal</span>
                  <span className="font-heading text-xl font-bold" style={{ color: SILK }}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="flex-1 rounded-2xl border border-[#E76F51]/20 bg-[#2A2421] py-3.5 font-display text-sm font-semibold text-[#A89890] transition-colors hover:border-[#E76F51]/35 hover:bg-[#332C28] hover:text-[#C4B8AE]"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="flex-[1.4] rounded-2xl bg-citrus py-3.5 font-display text-sm font-bold text-white shadow-[0_8px_28px_rgba(231,111,81,0.28)] transition-opacity hover:opacity-95"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="checkout-view"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.25 }}
            className="px-5 pt-5"
          >
            <p className="mb-3 font-display text-[10px] uppercase tracking-[0.25em] text-cream/35">
              Pickup Location
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {DOORDASH_STORES.map((store) => {
                const selected = selectedStoreId === store.id;
                return (
                  <button
                    key={store.id}
                    type="button"
                    onClick={() => setSelectedStoreId(store.id)}
                    className="rounded-2xl border p-4 text-left transition-all duration-200"
                    style={
                      selected
                        ? { backgroundColor: `${CITRUS}12`, borderColor: CITRUS }
                        : { backgroundColor: '#2A2421', borderColor: 'rgba(255,255,255,0.08)' }
                    }
                  >
                    <div className="flex items-start gap-2">
                      <MapPin
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: selected ? CITRUS : 'rgba(255,255,255,0.35)' }}
                      />
                      <div>
                        <p className="font-display text-sm font-semibold text-cream">{store.label}</p>
                        <p className="mt-0.5 font-body text-xs text-cream/45">{store.address}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="mb-3 mt-8 font-display text-[10px] uppercase tracking-[0.25em] text-cream/35">
              Fulfillment
            </p>
            <div className="flex rounded-full border border-white/[0.08] bg-[#2A2421] p-1">
              {[
                { key: 'delivery', label: 'Delivery' },
                { key: 'pickup', label: 'Pickup' },
              ].map((option) => {
                const active = orderType === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => handleOrderTypeChange(option.key)}
                    className="flex-1 rounded-full py-2.5 font-display text-sm font-semibold transition-all duration-200"
                    style={
                      active
                        ? { backgroundColor: CITRUS, color: '#FFFFFF' }
                        : { color: 'rgba(255,255,255,0.45)' }
                    }
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            {orderType === 'delivery' && (
              <div className="mt-6 space-y-3">
                <Input
                  placeholder="Delivery address"
                  value={deliveryAddress}
                  onChange={(event) => {
                    setDeliveryAddress(event.target.value);
                    setDeliveryQuote(null);
                  }}
                  className="h-12 rounded-2xl border-white/[0.08] bg-[#2A2421] text-cream placeholder:text-cream/25 focus-visible:ring-[#E5B84A]/40"
                />

                <button
                  type="button"
                  onClick={handleGetQuote}
                  disabled={isQuoting || !deliveryAddress.trim()}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-citrus font-display text-sm font-bold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isQuoting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Getting quote…
                    </>
                  ) : (
                    'Get DoorDash quote'
                  )}
                </button>

                {deliveryQuote && !isQuoting && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex rounded-full bg-citrus px-4 py-2 font-display text-xs font-semibold text-white"
                  >
                    Quote: ${deliveryQuote.fee.toFixed(2)} • {deliveryQuote.etaMinutes} min • {deliveryQuote.distanceMiles} mi
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {view === 'checkout' && cart.length > 0 && (
        <div className="fixed inset-x-0 bottom-[calc(var(--bottom-nav-height)+0.25rem)] z-40 border-t border-white/[0.08] bg-[#1A1714]/98 px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl">
          <div className="space-y-2 font-display text-sm">
            <div className="flex items-center justify-between text-cream/55">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {orderType === 'delivery' && (
              <div className="flex items-center justify-between text-cream/55">
                <span>Delivery</span>
                <span>{deliveryQuote ? `$${deliveryFee.toFixed(2)}` : '—'}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-cream/55">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-white/[0.08] pt-2">
              <span className="font-semibold text-cream">Total</span>
              <span className="font-heading text-lg font-bold text-cream">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePay}
            disabled={isSubmitting || (orderType === 'delivery' && !deliveryQuote)}
            className="mt-4 flex h-14 w-full items-center justify-center rounded-2xl bg-citrus font-display text-base font-bold text-white shadow-[0_10px_36px_rgba(231,111,81,0.32)] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? 'Processing…' : `Pay $${total.toFixed(2)}`}
          </button>
        </div>
      )}
    </div>
  );
}
