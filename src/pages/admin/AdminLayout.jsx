import React from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Coffee, ShoppingBag, Gift, Settings, ChevronLeft, LayoutDashboard } from 'lucide-react';

const adminNav = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/menu', icon: Coffee, label: 'Menu' },
  { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { path: '/admin/gift-cards', icon: Gift, label: 'Gift Cards' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-espresso">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-espresso/95 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-1.5 rounded-lg hover:bg-white/5">
              <ChevronLeft className="w-4 h-4 text-cream/40" />
            </button>
            <div>
              <h1 className="font-heading text-cream text-lg font-bold">Admin Panel</h1>
              <p className="text-cream/30 text-[10px] font-display uppercase tracking-wider">UPFORDAYZ Management</p>
            </div>
          </div>
          <Settings className="w-4 h-4 text-cream/30" />
        </div>
      </div>

      {/* Nav tabs */}
      <div className="sticky top-[73px] z-20 bg-espresso/95 backdrop-blur-xl px-6 py-2 border-b border-white/5">
        <div className="flex gap-1 max-w-4xl mx-auto overflow-x-auto hide-scrollbar">
          {adminNav.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display shrink-0 transition-all ${
                  isActive ? 'bg-citrus text-white' : 'text-cream/40 hover:bg-white/5'
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <Outlet />
      </div>
    </div>
  );
}