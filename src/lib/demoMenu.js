/** Presentation demo menu — swap off when DoorDash API keys are configured. */

import { getNormalizedMenuItems } from './demoMenuData';

export const DEMO_MENU_CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'coffee', label: 'Coffee' },
  { key: 'signature_drinks', label: 'Signature' },
  { key: 'lattes', label: 'Lattes' },
  { key: 'espresso', label: 'Espresso' },
  { key: 'bakery', label: 'Fresh Bakery' },
  { key: 'deli', label: 'Deli Sandwiches' },
  { key: 'cold', label: 'Iced & Cold' },
];

export function getDemoMenuData() {
  return {
    categories: DEMO_MENU_CATEGORIES,
    items: getNormalizedMenuItems(),
  };
}

export { demoMenuData, normalizeMenuItem } from './demoMenuData';
