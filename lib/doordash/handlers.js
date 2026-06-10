import { doordashRequest } from './client.js';
import { getDoorDashCredentials, resolveStore } from './config.js';
import { mapDoorDashMenuResponse } from './menuMapper.js';

async function readJsonBody(req) {
  if (req.body != null) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }

  const chunks = [];

  await new Promise((resolve, reject) => {
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', resolve);
    req.on('error', reject);
  });

  if (chunks.length === 0) return {};

  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function ensureConfigured(env) {
  const credentials = getDoorDashCredentials(env);
  if (!credentials.developerId || !credentials.keyId || !credentials.signingSecret) {
    const error = new Error('DoorDash API credentials are missing. Configure DOORDASH_DEVELOPER_ID, DOORDASH_KEY_ID, and DOORDASH_SECRET.');
    error.status = 503;
    throw error;
  }
}

export async function handleDoorDashApiRequest(req, res, env = process.env) {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const pathname = url.pathname.replace(/^\/api\/doordash/, '') || '/';

  try {
    if (req.method === 'GET' && pathname === '/stores') {
      const { getDoorDashStores } = await import('./config.js');
      return sendJson(res, 200, { stores: Object.values(getDoorDashStores(env)) });
    }

    if (req.method === 'GET' && pathname === '/menu') {
      ensureConfigured(env);
      const storeKey = url.searchParams.get('store') || 'polk_st';
      const store = resolveStore(env, storeKey);

      let payload;
      try {
        payload = await doordashRequest(
          `/marketplace/api/v1/stores/${encodeURIComponent(store.merchantStoreId)}/store_menu`,
          { method: 'GET' },
          env,
        );
      } catch {
        payload = await doordashRequest(
          `/marketplace/api/v1/stores/${encodeURIComponent(store.merchantStoreId)}/menu_details`,
          { method: 'GET' },
          env,
        );
      }

      const mapped = mapDoorDashMenuResponse(payload);
      return sendJson(res, 200, {
        store,
        ...mapped,
      });
    }

    if (req.method === 'POST' && pathname === '/quotes') {
      ensureConfigured(env);
      const body = await readJsonBody(req);
      const store = resolveStore(env, body.storeId || 'polk_st');
      const credentials = getDoorDashCredentials(env);
      const externalDeliveryId = body.externalDeliveryId || `upfordayz-quote-${Date.now()}`;
      const orderValueCents = Math.round(Number(body.orderValue || 0) * 100);

      const quotePayload = {
        external_delivery_id: externalDeliveryId,
        pickup_address: store.pickupAddress,
        pickup_business_name: store.pickupBusinessName,
        pickup_phone_number: store.pickupPhone,
        dropoff_address: body.dropoffAddress,
        dropoff_phone_number: body.customerPhone,
        order_value: orderValueCents,
        currency: 'USD',
      };

      if (credentials.externalBusinessId) {
        quotePayload.pickup_external_business_id = credentials.externalBusinessId;
        quotePayload.pickup_external_store_id = store.externalStoreId;
      }

      const quote = await doordashRequest('/drive/v2/quotes', {
        method: 'POST',
        body: JSON.stringify(quotePayload),
      }, env);

      return sendJson(res, 200, {
        externalDeliveryId,
        fee: quote.fee ? quote.fee / 100 : quote.delivery_fee ? quote.delivery_fee / 100 : 0,
        etaMinutes: quote.delivery_time ?? quote.estimated_pickup_time ?? null,
        quote,
      });
    }

    if (req.method === 'POST' && pathname === '/orders') {
      ensureConfigured(env);
      const body = await readJsonBody(req);
      const store = resolveStore(env, body.storeId || 'polk_st');
      const credentials = getDoorDashCredentials(env);
      const externalDeliveryId = body.externalDeliveryId || `upfordayz-order-${Date.now()}`;
      const orderValueCents = Math.round(Number(body.orderValue || 0) * 100);
      const isDelivery = body.orderType === 'delivery';

      const deliveryPayload = {
        external_delivery_id: externalDeliveryId,
        pickup_address: store.pickupAddress,
        pickup_business_name: store.pickupBusinessName,
        pickup_phone_number: store.pickupPhone,
        dropoff_address: isDelivery ? body.dropoffAddress : store.pickupAddress,
        dropoff_phone_number: body.customerPhone,
        dropoff_contact_given_name: body.customerName,
        dropoff_instructions: body.notes || (isDelivery ? 'Leave at door if no answer.' : 'Pickup order from counter.'),
        order_value: orderValueCents,
        currency: 'USD',
        items: (body.items || []).map((item) => ({
          name: item.name,
          quantity: item.quantity || 1,
          external_id: item.doordash_item_id || item.menu_item_id || item.id,
          price: Math.round(Number(item.price || 0) * 100),
        })),
      };

      if (credentials.externalBusinessId) {
        deliveryPayload.pickup_external_business_id = credentials.externalBusinessId;
        deliveryPayload.pickup_external_store_id = store.externalStoreId;
      }

      if (isDelivery && body.quoteExternalDeliveryId) {
        const accepted = await doordashRequest(
          `/drive/v2/quotes/${encodeURIComponent(body.quoteExternalDeliveryId)}/accept`,
          { method: 'POST', body: JSON.stringify({}) },
          env,
        );
        return sendJson(res, 201, {
          externalDeliveryId: body.quoteExternalDeliveryId,
          order: accepted,
        });
      }

      const order = await doordashRequest('/drive/v2/deliveries', {
        method: 'POST',
        body: JSON.stringify(deliveryPayload),
      }, env);

      return sendJson(res, 201, {
        externalDeliveryId,
        order,
      });
    }

    return sendJson(res, 404, { error: 'DoorDash API route not found' });
  } catch (error) {
    return sendJson(res, error.status || 500, {
      error: error.message || 'DoorDash API request failed',
      details: error.data || null,
    });
  }
}
