/** Normalize optional cart option values for strict equality checks. */
function normalizeOption(value) {
  if (value === undefined || value === null || value === '') return null;
  return value;
}

/**
 * Returns true when two cart lines represent the same configured menu item.
 * Matches: menu item id, store, size label, milk, sweetness, espresso shot.
 */
export function cartItemsMatch(existing, { menuItemId, storeId, sizeLabel, milk, sweetness, extraShot }) {
  if (existing.menu_item_id !== menuItemId) return false;
  if (existing.store_id !== storeId) return false;

  const existingSizeLabel = normalizeOption(existing.size_label);
  const existingMilk = normalizeOption(existing.milk);
  const existingSweetness = normalizeOption(existing.sweetness);
  const existingExtra = Boolean(existing.extra_shot);

  return (
    normalizeOption(sizeLabel) === existingSizeLabel &&
    normalizeOption(milk) === existingMilk &&
    normalizeOption(sweetness) === existingSweetness &&
    Boolean(extraShot) === existingExtra
  );
}

export function buildCartLineDisplay({ sizeLabel, milk, sweetness, extraShot }) {
  return [
    sizeLabel,
    milk ? `${milk} milk` : null,
    sweetness && sweetness !== 'Standard' ? sweetness : null,
    extraShot ? '+Espresso Shot' : null,
  ].filter(Boolean);
}
