function centsToDollars(value) {
  if (value == null) return null;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return numeric >= 100 ? numeric / 100 : numeric;
}

function slugifyCategory(name = 'Other') {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '') || 'other';
}

function mapMenuItem(item, categoryName, index) {
  const price = centsToDollars(item.price ?? item.base_price);
  const isActive = item.active !== false && item.is_active !== false;
  const isSuspended = item.is_suspended === true || item.suspended === true;

  return {
    id: String(item.merchant_supplied_id || item.id || `${slugifyCategory(categoryName)}-${index}`),
    name: item.name || 'Menu Item',
    tagline: item.subtitle || categoryName || '',
    description: item.description || '',
    category: slugifyCategory(categoryName),
    category_label: categoryName || 'Other',
    price_small: price,
    price_medium: price,
    price_large: price,
    image_url: item.original_image_url || item.image_url || item.photo_url || '',
    is_available: isActive && !isSuspended,
    out_of_stock: !isActive || isSuspended,
    rating: item.sort_id ? Math.min(5, 4 + (item.sort_id % 10) / 10) : null,
    sort_order: item.sort_id ?? index,
    doordash_item_id: item.merchant_supplied_id || item.id,
  };
}

function mapCategoryItems(category, categoryIndex) {
  const categoryName = category.name || category.title || 'Other';
  const items = category.items || category.menu_items || [];

  return items.map((item, itemIndex) =>
    mapMenuItem(item, categoryName, categoryIndex * 1000 + itemIndex),
  );
}

export function mapDoorDashMenuResponse(payload) {
  const categories = [];
  const items = [];

  const menuRoots = [];

  if (Array.isArray(payload?.menu)) {
    menuRoots.push(...payload.menu);
  } else if (payload?.menu?.categories) {
    menuRoots.push(payload.menu);
  } else if (Array.isArray(payload?.menus)) {
    menuRoots.push(...payload.menus);
  } else if (payload?.store?.menu) {
    menuRoots.push(payload.store.menu);
  }

  for (const menu of menuRoots) {
    const menuCategories = menu.categories || menu.menu_categories || [];
    for (const [categoryIndex, category] of menuCategories.entries()) {
      const label = category.name || category.title || 'Other';
      const key = slugifyCategory(label);

      if (!categories.find((entry) => entry.key === key)) {
        categories.push({ key, label });
      }

      items.push(...mapCategoryItems(category, categoryIndex));
    }
  }

  if (items.length === 0 && Array.isArray(payload?.items)) {
    for (const [index, item] of payload.items.entries()) {
      items.push(mapMenuItem(item, item.category || 'Other', index));
    }
  }

  items.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return {
    categories: [{ key: 'all', label: 'All' }, ...categories],
    items,
  };
}
