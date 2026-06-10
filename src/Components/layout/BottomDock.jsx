import React from 'react';
import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useUI } from '@/lib/UIContext';

export default function BottomDock() {
  const location = useLocation();
  const { actionBar, hideNav } = useUI();

  if (location.pathname.startsWith('/admin') || hideNav) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-transparent pointer-events-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {actionBar && (
        <div className="shrink-0 border-t border-white/5 bg-espresso/95 backdrop-blur-xl px-6 py-5 pointer-events-auto">
          {actionBar}
        </div>
      )}

      <div className="shrink-0 flex justify-center px-4 py-1 bg-transparent">
        <BottomNav />
      </div>
    </div>
  );
}
