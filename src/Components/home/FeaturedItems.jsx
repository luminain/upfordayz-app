import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FEATURED = [
  {
    name: 'Mocha',
    tagline: 'Chocolate & creamy',
    price: '$5',
    rating: 4.8,
    gradient: 'from-[#4A3728] to-[#2C1E14]',
    image: '/images/mocha.png',
  },
  {
    name: 'Espresso',
    tagline: 'Strong & bold',
    price: '$4',
    rating: 4.9,
    gradient: 'from-[#5C3D2E] to-[#3B2416]',
    image: '/images/espresso.png',
  },
  {
    name: 'Latte',
    tagline: 'Soft & milky',
    price: '$5.50',
    rating: 4.7,
    gradient: 'from-[#6B5B4D] to-[#3D3027]',
    image: '/images/latte.png',
  },
];

export default function FeaturedItems() {
  const navigate = useNavigate();

  return (
    <section className="bg-cream dark:bg-espresso px-6 py-16">
      <div className="max-w-lg mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="font-display text-citrus text-xs tracking-[0.3em] uppercase">Featured</span>
            <h2 className="font-heading text-espresso dark:text-cream text-2xl font-bold mt-1">
              Popular Drinks
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-citrus hover:text-citrus/80 font-display text-xs gap-1"
            onClick={() => navigate('/menu')}
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="flex gap-4 overflow-x-auto hide-scrollbar scroll-smooth-touch pb-4 -mx-2 px-2">
          {FEATURED.map((item, i) => (
            <motion.div
              key={item.name}
              className={`shrink-0 w-44 rounded-3xl bg-gradient-to-b ${item.gradient} p-4 pb-5 cursor-pointer`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/menu')}
            >
              <div className="relative w-full aspect-square flex items-center justify-center mb-3">
                <div className="absolute inset-2 bg-white/5 rounded-full blur-xl" />
                <img
                  src={item.image}
                  alt={item.name}
                  className="relative w-28 h-28 object-cover rounded-full shadow-lg"
                />
              </div>
              <h3 className="font-heading text-cream text-lg font-bold">{item.name}</h3>
              <p className="text-citrus text-xs font-display mt-0.5">{item.tagline}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-cream font-display font-semibold text-sm">{item.price}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-cream/70 text-xs">{item.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}