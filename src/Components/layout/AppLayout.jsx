import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import BottomDock from './BottomDock';
import { useScrollMemory } from '@/hooks/useScrollMemory';
import { useUI } from '@/lib/UIContext';
import { getPageBottomPadding, isFullscreenEmbedRoute } from '@/lib/bottomDockLayout';

export default function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isFullscreenEmbed = isFullscreenEmbedRoute(location.pathname);
  useScrollMemory();
  const { hideNav, setActionBar } = useUI();
  const bottomPadding = getPageBottomPadding(location.pathname, hideNav);

  useEffect(() => {
    setActionBar(null);
  }, [location.pathname, setActionBar]);

  return (
    <div className="flex flex-col min-h-dvh bg-espresso overflow-x-hidden">
      {isFullscreenEmbed ? (
        <main className="flex-1 w-full">
          <Outlet />
        </main>
      ) : (
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className={`flex-1 w-full ${bottomPadding} ${isAdmin ? '' : 'opacity-70'}`}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      )}
      {!isAdmin && <BottomDock />}
    </div>
  );
}
