const API_BASE = '/api/doordash';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'DoorDash API request failed');
  }

  return payload;
}

export function fetchDoorDashMenu(storeId) {
  return request(`/menu?store=${encodeURIComponent(storeId)}`);
}

export function fetchDeliveryQuote({
  storeId,
  dropoffAddress,
  customerPhone,
  orderValue,
  externalDeliveryId,
}) {
  return request('/quotes', {
    method: 'POST',
    body: JSON.stringify({
      storeId,
      dropoffAddress,
      customerPhone,
      orderValue,
      externalDeliveryId,
    }),
  });
}

export function createDoorDashOrder(payload) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchDoorDashStores() {
  return request('/stores');
}
