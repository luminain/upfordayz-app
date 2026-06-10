const DEFAULT_STORES = {
  polk_st: {
    id: 'polk_st',
    label: 'Polk St',
    merchantStoreId: '24381062',
    externalStoreId: '24381062',
    pickupAddress: '1801 Polk St, San Francisco, CA 94109',
    pickupPhone: '+14155550101',
    pickupBusinessName: 'UPFORDAYZ Polk St',
  },
  van_ness: {
    id: 'van_ness',
    label: 'Van Ness',
    merchantStoreId: '894868',
    externalStoreId: '894868',
    pickupAddress: 'Van Ness Ave, San Francisco, CA',
    pickupPhone: '+14155550202',
    pickupBusinessName: 'UPFORDAYZ Van Ness',
  },
};

function readEnv(env, ...keys) {
  for (const key of keys) {
    const value = env[key];
    if (value) return value;
  }
  return undefined;
}

export function getDoorDashCredentials(env = process.env) {
  return {
    developerId: readEnv(env, 'DOORDASH_DEVELOPER_ID', 'VITE_DOORDASH_DEVELOPER_ID'),
    keyId: readEnv(env, 'DOORDASH_KEY_ID', 'VITE_DOORDASH_KEY_ID'),
    signingSecret: readEnv(env, 'DOORDASH_SECRET', 'DOORDASH_SIGNING_SECRET', 'VITE_DOORDASH_SECRET'),
    externalBusinessId: readEnv(env, 'DOORDASH_EXTERNAL_BUSINESS_ID', 'VITE_DOORDASH_EXTERNAL_BUSINESS_ID'),
    apiBaseUrl: readEnv(env, 'DOORDASH_API_BASE_URL') || 'https://openapi.doordash.com',
  };
}

export function getDoorDashStores(env = process.env) {
  const polkStoreId = readEnv(env, 'DOORDASH_POLK_STORE_ID', 'VITE_DOORDASH_POLK_STORE_ID');
  const vanNessStoreId = readEnv(env, 'DOORDASH_VAN_NESS_STORE_ID', 'VITE_DOORDASH_VAN_NESS_STORE_ID');

  return {
    polk_st: {
      ...DEFAULT_STORES.polk_st,
      merchantStoreId: polkStoreId || DEFAULT_STORES.polk_st.merchantStoreId,
      externalStoreId: polkStoreId || DEFAULT_STORES.polk_st.externalStoreId,
    },
    van_ness: {
      ...DEFAULT_STORES.van_ness,
      merchantStoreId: vanNessStoreId || DEFAULT_STORES.van_ness.merchantStoreId,
      externalStoreId: vanNessStoreId || DEFAULT_STORES.van_ness.externalStoreId,
    },
  };
}

export function resolveStore(env, storeKey) {
  const stores = getDoorDashStores(env);
  return stores[storeKey] || stores.polk_st;
}
