import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
// import { useQuery } from '@tanstack/react-query';
// import { fetchDoorDashMenu } from '@/api/doordashClient';
import {
  CART_STORAGE_KEY,
  DOORDASH_STORES,
  LOCATION_STORAGE_KEY,
  getStoreById,
} from '@/lib/doordashConfig';
import { getDemoMenuData } from '@/lib/demoMenu';
import { buildCartLineDisplay, cartItemsMatch } from '@/lib/cartUtils';
import { useUI } from '@/lib/UIContext';
import MenuListView from '../components/menu/MenuListView';
import ProductDetailSlider from '../components/menu/ProductDetailSlider';

/** Set to false once DoorDash API keys are configured for live menu sync. */
const USE_DEMO_MENU = true;

export default function Menu() {
  const [activeStoreId, setActiveStoreId] = useState(() =>
    localStorage.getItem(LOCATION_STORAGE_KEY) || DOORDASH_STORES[0].id,
  );
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const { setHideNav } = useUI();

  const activeStore = useMemo(() => getStoreById(activeStoreId), [activeStoreId]);

  useEffect(() => {
    localStorage.setItem(LOCATION_STORAGE_KEY, activeStoreId);
  }, [activeStoreId]);

  useEffect(() => {
    setHideNav(isDetailOpen);
    return () => setHideNav(false);
  }, [isDetailOpen, setHideNav]);

  // Live DoorDash menu sync — re-enable when API keys are configured:
  // const { data, isLoading, isError, error, refetch } = useQuery({
  //   queryKey: ['doordashMenu', activeStoreId],
  //   queryFn: () => fetchDoorDashMenu(activeStoreId),
  //   staleTime: 60_000,
  //   retry: 1,
  //   enabled: !USE_DEMO_MENU,
  // });

  const demoData = useMemo(() => getDemoMenuData(), []);
  const categories = USE_DEMO_MENU
    ? demoData.categories
    : [{ key: 'all', label: 'All' }];
  const menuItems = USE_DEMO_MENU ? demoData.items : [];

  const filtered = menuItems.filter((item) => {
    const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
    const searchMatch = !searchQuery || item.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const handleOpenDetail = (item) => {
    const idx = filtered.findIndex((entry) => entry.id === item.id);
    setActiveProduct({ items: filtered, index: idx >= 0 ? idx : 0 });
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setActiveProduct(null);
  };

  const handleAddToCart = useCallback((item, config) => {
    if (item.out_of_stock || item.is_available === false) {
      toast.error(`${item.name} is out of stock`);
      return;
    }

    const {
      quantity = 1,
      unitPrice,
      sizeLabel,
      milk,
      sweetness,
      extraShot,
    } = config;

    const modifierParts = buildCartLineDisplay({ sizeLabel, milk, sweetness, extraShot });

    const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    const matchConfig = {
      menuItemId: item.id,
      storeId: activeStoreId,
      sizeLabel: sizeLabel ?? null,
      milk,
      sweetness,
      extraShot,
    };

    const existingIndex = cart.findIndex((entry) => cartItemsMatch(entry, matchConfig));

    if (existingIndex >= 0) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + quantity;
    } else {
      cart.push({
        menu_item_id: item.id,
        doordash_item_id: item.doordash_item_id,
        name: item.name,
        image_url: item.image_url || item.image || '',
        size_label: sizeLabel ?? null,
        size: modifierParts.length ? modifierParts.join(' · ') : 'Standard',
        milk,
        sweetness,
        extra_shot: extraShot,
        price: unitPrice,
        quantity,
        store_id: activeStoreId,
      });
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));

    const detail = modifierParts.length
      ? `${modifierParts.join(' · ')} · $${unitPrice.toFixed(2)}`
      : `$${unitPrice.toFixed(2)}`;

    const merged = existingIndex >= 0;
    const mergedQty = merged ? cart[existingIndex].quantity : quantity;

    toast.success(merged ? `${item.name} updated` : `${item.name} added!`, {
      description: mergedQty > 1 ? `${mergedQty}× · ${detail}` : detail,
      duration: 2000,
    });
  }, [activeStoreId]);

  return (
    <div className="relative bg-[#F2EDE8] pb-40">
      <div className="sticky top-0 z-30 bg-[#F2EDE8]/95 backdrop-blur-xl px-5 pt-6 pb-3 border-b border-[#E8E0D8]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[#8B6F5E] text-[10px] font-display uppercase tracking-[0.25em]">Live Menu</p>
            <h1 className="font-heading text-[#2C1E14] text-xl font-bold">{activeStore.label}</h1>
          </div>
          <div className="flex gap-2">
            {DOORDASH_STORES.map((store) => (
              <button
                key={store.id}
                type="button"
                onClick={() => setActiveStoreId(store.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-display font-semibold transition-all ${
                  store.id === activeStoreId
                    ? 'bg-[#2C1E14] text-white'
                    : 'bg-[#E8E0D8] text-[#8B6F5E]'
                }`}
              >
                {store.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <MenuListView
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        items={filtered}
        isLoading={false}
        onOpenDetail={handleOpenDetail}
      />

      <AnimatePresence>
        {isDetailOpen && activeProduct && (
          <ProductDetailSlider
            items={activeProduct.items}
            initialIndex={activeProduct.index}
            onClose={handleCloseDetail}
            onAddToCart={(item, config) => {
              handleAddToCart(item, config);
              handleCloseDetail();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
