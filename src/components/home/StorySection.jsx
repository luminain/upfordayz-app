import React from 'react';
import { motion } from 'framer-motion';

const ROASTER = 'https://media.base44.com/images/public/user_6a22870952072000233525e8/ec9ed4c3b_50d1c0_6c51dd5867ba4685829d0b21066a3efcmv2.jpg';
const CAFE_INTERIOR = 'https://media.base44.com/images/public/user_6a22870952072000233525e8/bcf2e526c_Upfordayz-Coffee-Tea-Juice_560f72823555f75ba71544dfe1cc58d2.jpg';

export default function StorySection() {
  return (
    <section className="relative bg-cream dark:bg-espresso px-6 py-20 overflow-hidden">
      {/* Decorative circle */}
      <div className="absolute -right-20 top-10 w-64 h-64 border border-citrus/10 rounded-full" />
      <div className="absolute -left-10 bottom-20 w-40 h-40 border border-latte/10 rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7 }}
        className="max-w-lg mx-auto"
      >
        <span className="font-display text-citrus text-xs tracking-[0.3em] uppercase">Our Story</span>
        <h2 className="font-heading text-espresso dark:text-cream text-3xl md:text-4xl font-bold mt-3 leading-tight">
          What makes our
          <br />
          coffee <span className="text-citrus italic">special?</span>
        </h2>
      </motion.div>

      <motion.div
        className="relative mt-10 max-w-lg mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="relative rounded-3xl overflow-hidden shadow-xl">
          <img src={ROASTER} alt="Sam's roasting facility" className="w-full h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <p className="text-cream/90 text-sm font-heading italic">
              "Sam's relentless pursuit for perfectly balanced and unique blends."
            </p>
          </div>
        </div>
      </motion.div>

      <motion.p
        className="text-espresso/70 dark:text-cream/60 text-sm leading-relaxed mt-8 max-w-lg mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        We pride ourselves on giving each customer a unique and exceptional experience.
        UPFORDAYZ brings a different approach to coffee roasting and brewing — from bean to cup,
        every detail matters.
      </motion.p>

      {/* Juice section */}
      <motion.div
        className="mt-16 max-w-lg mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="flex items-center gap-6">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-citrus/20 shadow-lg shrink-0">
            <img
              src="https://media.base44.com/images/public/user_6a22870952072000233525e8/55edff410_UpForDays-6.jpg"
              alt="Fresh juice"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-heading text-espresso dark:text-cream text-2xl font-bold">
              100% <span className="text-citrus">Fresh</span> Squeezed
            </h3>
            <p className="text-espresso/60 dark:text-cream/50 text-sm mt-2 leading-relaxed">
              Every juice is made to order with the freshest fruits — no concentrates, no shortcuts.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}