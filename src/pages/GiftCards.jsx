import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ChevronLeft, Gift, Mail, MessageSquare, Sparkles, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import PageActionBar from '@/components/layout/PageActionBar';

const LOGO = 'https://media.base44.com/images/public/user_6a22870952072000233525e8/92533b0ab_50d1c0_bb82384d7c8e4bbab2038668ef7fdff5mv2_d_1890_1866_s_2.png';
const CAFE_IMG = 'https://media.base44.com/images/public/user_6a22870952072000233525e8/bcf2e526c_Upfordayz-Coffee-Tea-Juice_560f72823555f75ba71544dfe1cc58d2.jpg';
const SMOOTHIE = 'https://media.base44.com/images/public/user_6a22870952072000233525e8/55edff410_UpForDays-6.jpg';

const CARD_THEMES = [
  {
    id: 'polk',
    label: 'Polk St Mornings',
    subtitle: 'A warm start to your day',
    gradient: 'from-[#E76F51] via-[#C25A35] to-[#8B3D20]',
    img: CAFE_IMG,
    accent: '#E76F51',
  },
  {
    id: 'roastery',
    label: 'Premium Roastery',
    subtitle: 'For the coffee connoisseur',
    gradient: 'from-[#4A3020] via-[#2C1E10] to-[#1A1008]',
    img: SMOOTHIE,
    accent: '#D4A574',
  },
  {
    id: 'citrus',
    label: 'Fresh & Vibrant',
    subtitle: 'Bursting with energy',
    gradient: 'from-[#F5A623] via-[#E87E04] to-[#C05F00]',
    img: LOGO,
    accent: '#F5A623',
    isLogo: true,
  },
];

const PRESET_AMOUNTS = [10, 25, 50, 75, 100];

const PREMIUM_FIELD_CLASS =
  'w-full rounded-xl border border-white/[0.05] bg-[#2A2421] py-3.5 pl-11 pr-4 font-body text-[#F7F4EF] placeholder:text-[#6B6360] transition-all duration-200 focus:border-[#E76F51] focus:outline-none focus:shadow-[0_0_12px_rgba(231,111,81,0.2)]';

function PremiumFormField({ label, icon: Icon, multiline = false, className = '', ...props }) {
  const shared = `${PREMIUM_FIELD_CLASS} ${className}`;

  return (
    <div className="space-y-2">
      <label className="block font-display text-[10px] uppercase tracking-[0.25em] text-cream/40">
        {label}
      </label>
      <div className="group relative">
        <Icon
          className={`pointer-events-none absolute left-3.5 h-4 w-4 text-[#8B7E75] transition-colors duration-200 group-focus-within:text-[#E76F51]/80 ${
            multiline ? 'top-3.5' : 'top-1/2 -translate-y-1/2'
          }`}
        />
        {multiline ? (
          <textarea
            {...props}
            className={`${shared} min-h-[112px] resize-none pt-3.5 leading-relaxed`}
          />
        ) : (
          <input {...props} className={shared} />
        )}
      </div>
    </div>
  );
}

export default function GiftCards() {
  const [cardIndex, setCardIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [form, setForm] = useState({ recipientName: '', recipientEmail: '', senderName: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchased, setPurchased] = useState(null);
  const dragStartX = useRef(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const theme = CARD_THEMES[cardIndex];
  const amount = isCustom ? parseFloat(customAmount) || 0 : selectedAmount;

  const swipeCard = (dir) => {
    const next = cardIndex + dir;
    if (next < 0 || next >= CARD_THEMES.length) return;
    setDirection(dir);
    setCardIndex(next);
  };

  const handleDragStart = (e) => {
    dragStartX.current = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
  };
  const handleDragEnd = (e) => {
    if (!dragStartX.current) return;
    const endX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStartX.current - endX;
    if (Math.abs(diff) > 50) swipeCard(diff > 0 ? 1 : -1);
    dragStartX.current = null;
  };

  const handlePurchase = async () => {
    if (!form.recipientName || amount <= 0) {
      toast({ title: 'Please fill in recipient name and select an amount', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    const code = 'UFD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const card = await base44.entities.GiftCard.create({
      amount, balance: amount,
      recipient_name: form.recipientName,
      recipient_email: form.recipientEmail,
      sender_name: form.senderName,
      message: form.message,
      code, status: 'active',
    });
    setPurchased({ ...card, code, amount, theme });
    setIsSubmitting(false);
  };

  if (purchased) {
    return (
      <div className="min-h-screen bg-espresso flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <div className={`relative bg-gradient-to-br ${purchased.theme.gradient} rounded-3xl p-8 shadow-2xl overflow-hidden`}>
            <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <img src={LOGO} alt="UPFORDAYZ" className="w-14 h-14 object-contain mb-4" />
            <h3 className="font-heading text-white text-lg">UPFORDAYZ</h3>
            <p className="text-white/60 text-xs font-display">{purchased.theme.label}</p>
            <p className="font-heading text-white text-4xl font-bold mt-4">${purchased.amount}</p>
            <p className="text-white/70 font-mono text-sm mt-4 tracking-widest">{purchased.code}</p>
          </div>
          <div className="text-center mt-8">
            <Sparkles className="w-6 h-6 text-citrus mx-auto mb-3" />
            <h2 className="font-heading text-cream text-xl font-bold">Gift Card Created!</h2>
            <p className="text-cream/50 text-sm mt-2 font-display">For {purchased.recipient_name}</p>
            <Button onClick={() => { setPurchased(null); navigate('/'); }} className="mt-6 bg-citrus hover:bg-citrus/90 rounded-2xl px-8 font-display">
              Done
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.92 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.92 }),
  };

  return (
    <div className="min-h-screen bg-espresso">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft className="w-5 h-5 text-cream/60" />
        </button>
        <h1 className="font-heading text-cream text-xl font-bold">Gift Cards</h1>
        <div className="w-9" />
      </div>

      <div className="px-6 max-w-lg mx-auto space-y-7">
        {/* Card Slider */}
        <div
          className="relative overflow-hidden select-none"
          style={{ height: 200 }}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={theme.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} rounded-3xl p-6 shadow-xl overflow-hidden`}
            >
              {/* BG image */}
              {!theme.isLogo && (
                <img src={theme.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
              )}
              <div className="relative z-10 flex items-start justify-between h-full">
                <div className="flex flex-col justify-between h-full">
                  <div className="flex items-center gap-2">
                    <img src={LOGO} alt="" className="w-8 h-8 object-contain" />
                    <div>
                      <p className="text-white font-heading text-sm font-bold">UPFORDAYZ</p>
                      <p className="text-white/50 text-[10px] font-display">{theme.label}</p>
                    </div>
                  </div>
                  <div>
                    <motion.p
                      key={amount}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="font-heading text-white text-4xl font-bold"
                    >
                      ${amount || '—'}
                    </motion.p>
                    <p className="text-white/50 text-xs font-display mt-1">{theme.subtitle}</p>
                    {form.recipientName && (
                      <p className="text-white/70 text-xs font-display mt-0.5">For {form.recipientName}</p>
                    )}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots + swipe hint */}
        <div className="flex items-center justify-center gap-1.5">
          {CARD_THEMES.map((_, i) => (
            <button key={i} onClick={() => { setDirection(i > cardIndex ? 1 : -1); setCardIndex(i); }}>
              <div className={`h-1.5 rounded-full transition-all duration-300 ${i === cardIndex ? 'w-6 bg-citrus' : 'w-1.5 bg-white/20'}`} />
            </button>
          ))}
          <span className="text-cream/20 text-[10px] font-display ml-2">← swipe →</span>
        </div>

        {/* Amount */}
        <div>
          <p className="text-cream/40 text-xs font-display uppercase tracking-wider mb-3">Select Amount</p>
          <div className="flex flex-wrap gap-2">
            {PRESET_AMOUNTS.map(amt => (
              <button
                key={amt}
                onClick={() => { setSelectedAmount(amt); setIsCustom(false); }}
                className={`px-5 py-2.5 rounded-2xl font-display text-sm transition-all ${
                  !isCustom && selectedAmount === amt ? 'bg-citrus text-white shadow-lg shadow-citrus/20' : 'bg-white/8 text-cream/50'
                }`}
              >
                ${amt}
              </button>
            ))}
            <button
              onClick={() => setIsCustom(true)}
              className={`px-5 py-2.5 rounded-2xl font-display text-sm transition-all ${isCustom ? 'bg-citrus text-white' : 'bg-white/8 text-cream/50'}`}
            >
              Custom
            </button>
          </div>
          {isCustom && (
            <Input
              type="number"
              placeholder="Enter amount"
              value={customAmount}
              onChange={e => setCustomAmount(e.target.value)}
              className="mt-3 bg-white/8 border-0 text-cream placeholder:text-cream/25 rounded-xl"
            />
          )}
        </div>

        {/* Recipient */}
        <div className="flex flex-col gap-y-4 pb-6">
          <p className="font-display text-xs uppercase tracking-[0.25em] text-cream/40">Recipient Details</p>

          <PremiumFormField
            label="Recipient Name"
            icon={User}
            type="text"
            placeholder="Who is this gift for?"
            value={form.recipientName}
            onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
            autoComplete="name"
          />

          <PremiumFormField
            label="Recipient Email"
            icon={Mail}
            type="email"
            placeholder="name@example.com"
            value={form.recipientEmail}
            onChange={(e) => setForm({ ...form, recipientEmail: e.target.value })}
            autoComplete="email"
          />

          <PremiumFormField
            label="Your Name"
            icon={User}
            type="text"
            placeholder="From you, with love"
            value={form.senderName}
            onChange={(e) => setForm({ ...form, senderName: e.target.value })}
            autoComplete="name"
          />

          <PremiumFormField
            label="Personal Message"
            icon={MessageSquare}
            multiline
            placeholder="Write a note they'll remember…"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={4}
          />
        </div>
      </div>

      <PageActionBar>
        <Button
          onClick={handlePurchase}
          disabled={isSubmitting || amount <= 0}
          className="w-full bg-citrus hover:bg-citrus/90 text-white rounded-2xl h-13 font-display text-base shadow-xl shadow-citrus/20 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : `Purchase $${amount} Gift Card`}
        </Button>
      </PageActionBar>
    </div>
  );
}