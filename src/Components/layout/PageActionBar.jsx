import React, { useEffect } from 'react';
import { useUI } from '@/lib/UIContext';

export default function PageActionBar({ children }) {
  const { setActionBar } = useUI();

  useEffect(() => {
    setActionBar(children);
    return () => setActionBar(null);
  }, [children, setActionBar]);

  return null;
}
