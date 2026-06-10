import React from 'react';
import { MapPin } from 'lucide-react';

const LOCATIONS = [
  { id: 'polk', name: 'Polk St', isOpen: true },
  { id: 'valencia', name: 'Valencia St', isOpen: true },
];

export default function HomeHeader() {
  const openCount = LOCATIONS.filter(l => l.isOpen).length;

  const scrollToLocations = () => {
    const el = document.getElementById('home-bottom-locations');
    if (el) window.scrollTo({ top: el.offsetTop - 20, behavior: 'smooth' });
  };

  return (
    <div className="flex items-center justify-end px-6 pt-6 pb-2">
      {/* Location selector only */}
      <button
        onClick={scrollToLocations}
        className="flex items-center gap-1.5 bg-white/8 rounded-full px-3 py-1.5 hover:bg-white/12 transition-colors"
      >
        <MapPin className="w-3.5 h-3.5 text-citrus" />
        <span className="text-[11px] text-cream/70 font-display font-medium">
          {openCount} Location{openCount !== 1 ? 's' : ''}
        </span>
      </button>
    </div>
  );
}