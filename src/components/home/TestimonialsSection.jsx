import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Mussa A.',
    handle: '@mussa_sf',
    text: 'Mussa makes every visit feel like coming home. The hospitality here is unmatched — he remembered my order after just one visit!',
    rating: 5,
    tag: '☕ Regular',
    bg: 'from-[#2C1E14] to-[#3B2A1C]',
  },
  {
    name: 'Randy K.',
    handle: '@randy_eats',
    text: "The sandwiches here are next level. Randy's favorite is the turkey avocado — I drive across town just for it. Best in SF, no contest.",
    rating: 5,
    tag: '🥪 Sandwich Fan',
    bg: 'from-[#1A2E20] to-[#243D2A]',
  },
  {
    name: 'Sam R.',
    handle: '@samroasts',
    text: "Sam's custom roast blends are extraordinary. He worked with me to dial in exactly the flavor profile I wanted. True artisan craft.",
    rating: 5,
    tag: '🌱 Custom Roast',
    bg: 'from-[#2A1A10] to-[#3D2516]',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-espresso px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <span className="font-display text-citrus text-xs tracking-[0.3em] uppercase">Reviews</span>
        <h2 className="font-heading text-cream text-2xl font-bold mt-2">What People Say</h2>
      </motion.div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
        {/* Large top card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`rounded-3xl bg-gradient-to-br ${REVIEWS[0].bg} p-6 border border-white/5`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-0.5">
              {[...Array(REVIEWS[0].rating)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-xs bg-white/10 text-cream/60 font-display px-2.5 py-1 rounded-full">
              {REVIEWS[0].tag}
            </span>
          </div>
          <p className="text-cream/80 text-sm leading-relaxed font-body italic">"{REVIEWS[0].text}"</p>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-citrus/20 flex items-center justify-center">
              <span className="text-citrus text-xs font-bold">{REVIEWS[0].name[0]}</span>
            </div>
            <div>
              <p className="text-cream text-xs font-display font-semibold">{REVIEWS[0].name}</p>
              <p className="text-cream/30 text-[10px] font-display">{REVIEWS[0].handle}</p>
            </div>
          </div>
        </motion.div>

        {/* Two smaller cards side by side */}
        <div className="grid grid-cols-2 gap-4">
          {REVIEWS.slice(1).map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className={`rounded-3xl bg-gradient-to-br ${review.bg} p-4 border border-white/5`}
            >
              <div className="flex gap-0.5 mb-2">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-[10px] bg-white/10 text-cream/50 font-display px-2 py-0.5 rounded-full">
                {review.tag}
              </span>
              <p className="text-cream/70 text-xs leading-relaxed font-body italic mt-2">"{review.text}"</p>
              <div className="mt-3 flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-citrus/20 flex items-center justify-center">
                  <span className="text-citrus text-[9px] font-bold">{review.name[0]}</span>
                </div>
                <div>
                  <p className="text-cream text-[10px] font-display font-semibold">{review.name}</p>
                  <p className="text-cream/30 text-[9px] font-display">{review.handle}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}