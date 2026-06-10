export const DOORDASH_STORES = [
  {
    id: 'polk_st',
    label: 'Polk St',
    address: '1422 Polk St',
    merchantStoreId: import.meta.env.VITE_DOORDASH_POLK_STORE_ID || '24381062',
  },
  {
    id: 'van_ness',
    label: 'Van Ness St',
    address: '2100 Van Ness Ave',
    merchantStoreId: import.meta.env.VITE_DOORDASH_VAN_NESS_STORE_ID || '894868',
  },
];

export function getStoreById(storeId) {
  return DOORDASH_STORES.find((store) => store.id === storeId) ?? DOORDASH_STORES[0];
}

export const CART_STORAGE_KEY = 'upfordayz_cart';
export const LOCATION_STORAGE_KEY = 'upfordayz_active_store';
