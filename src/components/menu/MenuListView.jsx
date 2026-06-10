import React from 'react';
import { Search, Plus } from 'lucide-react';

export default function MenuListView({
  categories, activeCategory, onCategoryChange,
  searchQuery, onSearchChange,
  items, isLoading,
  onOpenDetail,
}) {
  return (
    <div className="bg-[#F2EDE8]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#F2EDE8] px-5 pt-6 pb-3">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5B8AE]" />
          <input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white text-[#2C1E14] placeholder:text-[#C5B8AE] rounded-2xl pl-11 pr-4 py-3 text-sm font-display border-0 outline-none shadow-sm"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => onCategoryChange(cat.key)}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-display font-medium transition-all duration-200 ${
                activeCategory === cat.key
                  ? 'bg-[#2C1E14] text-white shadow'
                  : 'bg-[#E8E0D8] text-[#8B6F5E] hover:bg-[#DDD4CA]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-5 space-y-3 mt-2 pb-8">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-7 h-7 border-2 border-[#E76F51]/30 border-t-[#E76F51] rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-[#B0A09A] text-sm py-20 font-display">No items found</p>
        ) : (
          items.map(item => (
            <MenuListRow
              key={item.id}
              item={item}
              onOpen={() => onOpenDetail(item)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function MenuListRow({ item, onOpen }) {
  const price = item.price_small || item.price_medium;
  const unavailable = item.out_of_stock || item.is_available === false;

  return (
    <div
      onClick={onOpen}
      className={`flex items-center gap-4 bg-white rounded-3xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${unavailable ? 'opacity-60' : ''}`}
    >
      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-transparent">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">☕</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-heading text-[#1E1410] text-base font-bold leading-tight truncate">{item.name}</h3>
          {unavailable && (
            <span className="shrink-0 rounded-full bg-[#FBECE8] px-2 py-0.5 text-[10px] font-display font-semibold uppercase tracking-wide text-[#B45309]">
              Out of Stock
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-[#9E8E84] text-xs mt-1 leading-relaxed line-clamp-2 font-body">{item.description}</p>
        )}
        <p className="text-[#E76F51] font-display font-bold text-sm mt-1.5">${price?.toFixed(2)}</p>
      </div>

      <button
        onClick={(event) => {
          event.stopPropagation();
          if (!unavailable) onOpen();
        }}
        disabled={unavailable}
        aria-label={`Customize ${item.name}`}
        className="w-11 h-11 rounded-full bg-[#FBECE8] flex items-center justify-center flex-shrink-0 hover:bg-[#E76F51] hover:text-white transition-colors group disabled:opacity-40 disabled:hover:bg-[#FBECE8]"
      >
        <Plus className="w-5 h-5 text-[#E76F51] group-hover:text-white" />
      </button>
    </div>
  );
}