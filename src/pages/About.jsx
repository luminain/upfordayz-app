import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, ExternalLink, Coffee, Leaf, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ROASTER = 'https://media.base44.com/images/public/user_6a22870952072000233525e8/ec9ed4c3b_50d1c0_6c51dd5867ba4685829d0b21066a3efcmv2.jpg';
const INTERIOR = 'https://media.base44.com/images/public/user_6a22870952072000233525e8/bcf2e526c_Upfordayz-Coffee-Tea-Juice_560f72823555f75ba71544dfe1cc58d2.jpg';
const BARISTA = 'https://media.base44.com/images/public/user_6a22870952072000233525e8/49c79a198_50d1c0_59fd80fbb31d4fbfad6be17f08ff2d7amv2_d_3024_4032_s_4_2.jpg';
const SMOOTHIE = 'https://media.base44.com/images/public/user_6a22870952072000233525e8/55edff410_UpForDays-6.jpg';
const LOGO = 'https://media.base44.com/images/public/user_6a22870952072000233525e8/92533b0ab_50d1c0_bb82384d7c8e4bbab2038668ef7fdff5mv2_d_1890_1866_s_2.png';

const locations = [
  {
    name: 'Polk Street',
    address: '1801 Polk Street, San Francisco',
    hours: '6:30 AM - 5:00 PM · Everyday',
    phone: '+1 (415) 555-0101',
    mapUrl: 'https://maps.google.com/?q=1801+Polk+Street+San+Francisco',
  },
  {
    name: 'Valencia Street',
    address: '1198 Valencia Street, San Francisco',
    hours: '7:00 AM - 5:00 PM · Everyday',
    phone: '+1 (415) 555-0102',
    mapUrl: 'https://maps.google.com/?q=1198+Valencia+Street+San+Francisco',
  },
];

const features = [
  { icon: Coffee, title: 'Specialty Roasting', desc: 'In-house roasted beans for the perfect cup every time' },
  { icon: Apple, title: '100% Fresh Juices', desc: 'Squeezed to order, never from concentrate' },
  { icon: Leaf, title: 'Vegan Friendly', desc: 'Full range of plant-based eats and dairy alternatives' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-cream dark:bg-espresso">
      {/* Hero */}
      <div className="relative h-80 overflow-hidden">
        <img src={ROASTER} alt="Roasting facility" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/30 via-espresso/50 to-espresso" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="font-display text-citrus text-xs tracking-[0.3em] uppercase">Our Story</span>
            <h1 className="font-heading text-cream text-3xl font-bold mt-2">
              About UPFORDAYZ
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="px-6 py-10 max-w-lg mx-auto space-y-12">
        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-start gap-4 mb-6">
            <img src={LOGO} alt="Logo" className="w-14 h-14 object-contain shrink-0" />
            <div>
              <h2 className="font-heading text-espresso dark:text-cream text-xl font-bold">
                Sam's Vision
              </h2>
              <p className="text-espresso/60 dark:text-cream/50 text-sm leading-relaxed mt-2">
                UPFORDAYZ brings a different approach to coffee roasting and brewing, showcasing Sam's
                relentless pursuit for perfectly balanced and unique blends. We pride ourselves on giving
                each customer a unique and exceptional experience — from specialty roasted coffee to
                100% fresh squeezed juices, artisan bakery items, and vegan eats.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl overflow-hidden h-36">
              <img src={INTERIOR} alt="Cafe interior" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden h-36">
              <img src={BARISTA} alt="Our team" className="w-full h-full object-cover" />
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              className="flex items-start gap-4 bg-white/50 dark:bg-white/5 rounded-2xl p-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="p-3 rounded-xl bg-citrus/10 shrink-0">
                <feat.icon className="w-5 h-5 text-citrus" />
              </div>
              <div>
                <h3 className="font-display text-espresso dark:text-cream font-semibold text-sm">{feat.title}</h3>
                <p className="text-espresso/50 dark:text-cream/40 text-xs mt-1 leading-relaxed">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Locations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-espresso dark:text-cream text-2xl font-bold mb-6">
            Our Locations
          </h2>
          <div className="space-y-4">
            {locations.map((loc, i) => (
              <motion.div
                key={loc.name}
                className="bg-espresso dark:bg-white/5 rounded-3xl p-6 text-cream"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <h3 className="font-heading text-xl font-bold">{loc.name}</h3>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-citrus shrink-0" />
                    <span className="text-cream/70 text-sm">{loc.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-citrus shrink-0" />
                    <span className="text-cream/70 text-sm">{loc.hours}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <a href={`tel:${loc.phone}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-cream/20 text-cream hover:bg-cream/10 rounded-xl gap-1.5 font-display text-xs">
                      <Phone className="w-3.5 h-3.5" /> Call
                    </Button>
                  </a>
                  <a href={loc.mapUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button size="sm" className="w-full bg-citrus hover:bg-citrus/90 rounded-xl gap-1.5 font-display text-xs">
                      <ExternalLink className="w-3.5 h-3.5" /> Map
                    </Button>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}