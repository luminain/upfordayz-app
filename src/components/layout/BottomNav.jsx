import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Coffee, ShoppingBag, Gift, User } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', path: '/', label: 'Home', icon: Home },
  { id: 'menu', path: '/menu', label: 'Menu', icon: Coffee },
  { id: 'order', path: '/order', label: 'Order', icon: ShoppingBag },
  { id: 'gifts', path: '/gift-cards', label: 'Gifts', icon: Gift },
  { id: 'about', path: '/about', label: 'About', icon: User },
];

const CIRCLE_SIZE = 36;
const ICON_ROW_HEIGHT = 28;

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = NAV_ITEMS.find((item) => item.path === location.pathname)?.id ?? 'home';

  const setActiveTab = (tabId) => {
    const item = NAV_ITEMS.find((navItem) => navItem.id === tabId);
    if (item) navigate(item.path);
  };

  return (
    <div className="w-full max-w-md bg-[#1E1B18]/95 backdrop-blur-md rounded-[22px] border border-white/10 flex items-stretch justify-around px-1 pt-0.5 pb-1 relative shadow-2xl overflow-visible pointer-events-auto">
      {NAV_ITEMS.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="relative flex flex-col items-center flex-1 min-w-0 overflow-visible focus:outline-none group"
          >
            <div
              className="relative flex items-center justify-center shrink-0 mb-0.5"
              style={{ width: CIRCLE_SIZE, height: ICON_ROW_HEIGHT }}
            >
              {isActive && (
                <div
                  className="absolute flex items-center justify-center pointer-events-none"
                  style={{
                    width: CIRCLE_SIZE,
                    height: CIRCLE_SIZE,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <svg
                    className="absolute inset-0 w-full h-full animate-spin [animation-duration:6s]"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      stroke="url(#accentGradient)"
                      strokeWidth="3"
                      fill="transparent"
                      strokeDasharray="60 120"
                    />
                    <defs>
                      <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#E76F51" />
                        <stop offset="100%" stopColor="#F7F4EF" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <motion.div
                    layoutId="activeNavBackground"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-[#E76F51] rounded-full shadow-[0_6px_20px_rgba(231,111,81,0.4)] border-2 border-[#1E1B18]"
                  />
                </div>
              )}

              <IconComponent
                className={`relative z-10 transition-colors duration-300 ${
                  isActive ? 'text-[#F7F4EF]' : 'text-white/40 group-hover:text-white/70'
                }`}
                size={18}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </div>

            <span
              className={`text-[9px] font-medium tracking-wide leading-none transition-colors duration-300 ${
                isActive ? 'text-[#E76F51] font-semibold' : 'text-white/40'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
