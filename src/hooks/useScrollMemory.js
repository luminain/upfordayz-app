import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Global scroll position store (persists for session)
const scrollPositions = {};

export function useScrollMemory() {
  const location = useLocation();
  const prevPath = useRef(null);

  useEffect(() => {
    const path = location.pathname;

    // Save previous page scroll before switching
    if (prevPath.current && prevPath.current !== path) {
      scrollPositions[prevPath.current] = window.scrollY;
    }

    // Restore or reset
    const saved = scrollPositions[path];
    if (saved !== undefined) {
      requestAnimationFrame(() => window.scrollTo(0, saved));
    } else {
      window.scrollTo(0, 0);
    }

    prevPath.current = path;
  }, [location.pathname]);
}