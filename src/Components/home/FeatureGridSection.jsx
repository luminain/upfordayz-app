import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Leaf, Truck, Clock } from 'lucide-react';

const GOLD = '#E5B84A';

const FEATURES = [
  {
    icon: Coffee,
    title: 'Single Origin',
    description: 'Rotating Ethiopian & Colombian beans, roasted weekly.',
  },
  {
    icon: Leaf,
    title: 'Cold-Pressed',
    description: 'Organic juice, no concentrate, never pasteurized.',
  },
  {
    icon: Truck,
    title: 'DoorDash Drive',
    description: 'Live delivery quotes from both shops.',
  },
  {
    icon: Clock,
    title: 'Open 6am–8pm',
    description: 'Daily, with kitchen prep starting 4am.',
  },
];

export default function FeatureGridSection() {
  return (
    <section className="bg-gradient-to-b from-[#2a2520] to-espresso px-5 pt-2 pb-14">
      <div className="max-w-lg mx-auto grid grid-cols-2 gap-3 sm:gap-4 md:max-w-4xl md:grid-cols-4">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl bg-[#2A2421] border border-white/[0.08] p-4 sm:p-5 flex flex-col"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 shrink-0"
                style={{ backgroundColor: `${GOLD}18` }}
              >
                <Icon className="w-5 h-5" style={{ color: GOLD }} strokeWidth={1.75} />
              </div>
              <h3 className="font-heading text-cream text-sm sm:text-base font-semibold leading-snug">
                {feature.title}
              </h3>
              <p className="text-cream/45 text-[11px] sm:text-xs mt-1.5 leading-relaxed font-body">
                {feature.description}
              </p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
