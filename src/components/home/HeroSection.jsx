import React from 'react';
import { motion } from 'framer-motion';
import HomeHeader from './HomeHeader';

const LOGO = 'https://media.base44.com/images/public/user_6a22870952072000233525e8/92533b0ab_50d1c0_bb82384d7c8e4bbab2038668ef7fdff5mv2_d_1890_1866_s_2.png';
const SMOOTHIE = 'https://media.base44.com/images/public/user_6a22870952072000233525e8/55edff410_UpForDays-6.jpg';
const CAFE_IMG = 'https://media.base44.com/images/public/user_6a22870952072000233525e8/bcf2e526c_Upfordayz-Coffee-Tea-Juice_560f72823555f75ba71544dfe1cc58d2.jpg';
const BARISTA = 'https://media.base44.com/images/public/user_6a22870952072000233525e8/49c79a198_50d1c0_59fd80fbb31d4fbfad6be17f08ff2d7amv2_d_3024_4032_s_4_2.jpg';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-espresso via-espresso to-[#2a2520]">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-citrus/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-latte/8 rounded-full blur-[100px]" />

      {/* Top bar */}
      <div className="relative z-10">
        <HomeHeader />
      </div>

      {/* Logo + Brand */}
      <div className="relative z-10 flex flex-col items-center mt-6">
        <motion.img
          src={LOGO}
          alt="UPFORDAYZ"
          className="w-20 h-20 object-contain"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
        />
        <motion.h1
          className="font-heading text-cream text-4xl md:text-5xl font-bold mt-4 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          UPFORDAYZ
        </motion.h1>
        <motion.p
          className="font-display text-cream/50 text-sm tracking-[0.3em] uppercase mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Cafe & Bakery
        </motion.p>
      </div>

      {/* Hero Images */}
      <div className="relative z-10 flex items-end justify-center gap-4 mt-10 px-6">
        <motion.div
          className="relative w-36 h-52 rounded-3xl overflow-hidden shadow-2xl shadow-black/40"
          initial={{ opacity: 0, y: 60, rotate: -6 }}
          animate={{ opacity: 1, y: 0, rotate: -6 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        >
          <img src={SMOOTHIE} alt="Fresh Smoothie" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 to-transparent" />
        </motion.div>

        <motion.div
          className="relative w-44 h-60 rounded-3xl overflow-hidden shadow-2xl shadow-black/40 z-10"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
        >
          <img src={CAFE_IMG} alt="UPFORDAYZ Cafe" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 to-transparent" />
        </motion.div>

        <motion.div
          className="relative w-36 h-48 rounded-3xl overflow-hidden shadow-2xl shadow-black/40"
          initial={{ opacity: 0, y: 60, rotate: 6 }}
          animate={{ opacity: 1, y: 0, rotate: 6 }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
        >
          <img src={BARISTA} alt="Barista" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 to-transparent" />
        </motion.div>
      </div>

      {/* Tagline */}
      <motion.div
        className="relative z-10 text-center mt-10 px-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.7 }}
      >
        <h2 className="font-heading text-cream text-2xl md:text-3xl font-semibold leading-tight">
          Fresh Coffee, Juice,
          <br />
          <span className="text-citrus">Sandwiches & Pastries</span>
        </h2>
        <p className="text-cream/40 text-sm mt-4 max-w-xs mx-auto leading-relaxed font-body">
          Specialty roasted coffee, 100% fresh squeezed juices, artisan bakery, and vegan eats in San Francisco.
        </p>
      </motion.div>

      <div className="pb-4" />
    </section>
  );
}