var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ../lib/doordash/jwt.js
function base64UrlEncodeBytes(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function base64UrlEncodeString(value) {
  return base64UrlEncodeBytes(new TextEncoder().encode(value));
}
function decodeSigningKey(secret) {
  if (!secret) return null;
  try {
    const binary = atob(secret);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return new TextEncoder().encode(secret);
  }
}
async function createDoorDashJwt(credentials) {
  const { developerId, keyId, signingSecret } = credentials;
  if (!developerId || !keyId || !signingSecret) {
    throw new Error("DoorDash credentials are not configured");
  }
  const signingKey = decodeSigningKey(signingSecret);
  const header = {
    alg: "HS256",
    typ: "JWT",
    "dd-ver": "DD-JWT-V1"
  };
  const now = Math.floor(Date.now() / 1e3);
  const payload = {
    aud: "doordash",
    iss: developerId,
    kid: keyId,
    exp: now + 300,
    iat: now
  };
  const encodedHeader = base64UrlEncodeString(JSON.stringify(header));
  const encodedPayload = base64UrlEncodeString(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    signingKey,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBytes = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(data)
  );
  const signature = base64UrlEncodeBytes(new Uint8Array(signatureBytes));
  return `${data}.${signature}`;
}
var init_jwt = __esm({
  "../lib/doordash/jwt.js"() {
    init_functionsRoutes_0_769502212075221();
    __name(base64UrlEncodeBytes, "base64UrlEncodeBytes");
    __name(base64UrlEncodeString, "base64UrlEncodeString");
    __name(decodeSigningKey, "decodeSigningKey");
    __name(createDoorDashJwt, "createDoorDashJwt");
  }
});

// ../lib/doordash/config.js
var config_exports = {};
__export(config_exports, {
  getDoorDashCredentials: () => getDoorDashCredentials,
  getDoorDashStores: () => getDoorDashStores,
  resolveStore: () => resolveStore
});
function readEnv(env, ...keys) {
  for (const key of keys) {
    const value = env[key];
    if (value) return value;
  }
  return void 0;
}
function getDoorDashCredentials(env = {}) {
  return {
    developerId: readEnv(env, "DOORDASH_DEVELOPER_ID", "VITE_DOORDASH_DEVELOPER_ID"),
    keyId: readEnv(env, "DOORDASH_KEY_ID", "VITE_DOORDASH_KEY_ID"),
    signingSecret: readEnv(env, "DOORDASH_SECRET", "DOORDASH_SIGNING_SECRET", "VITE_DOORDASH_SECRET"),
    externalBusinessId: readEnv(env, "DOORDASH_EXTERNAL_BUSINESS_ID", "VITE_DOORDASH_EXTERNAL_BUSINESS_ID"),
    apiBaseUrl: readEnv(env, "DOORDASH_API_BASE_URL") || "https://openapi.doordash.com"
  };
}
function getDoorDashStores(env = {}) {
  const polkStoreId = readEnv(env, "DOORDASH_POLK_STORE_ID", "VITE_DOORDASH_POLK_STORE_ID");
  const vanNessStoreId = readEnv(env, "DOORDASH_VAN_NESS_STORE_ID", "VITE_DOORDASH_VAN_NESS_STORE_ID");
  return {
    polk_st: {
      ...DEFAULT_STORES.polk_st,
      merchantStoreId: polkStoreId || DEFAULT_STORES.polk_st.merchantStoreId,
      externalStoreId: polkStoreId || DEFAULT_STORES.polk_st.externalStoreId
    },
    van_ness: {
      ...DEFAULT_STORES.van_ness,
      merchantStoreId: vanNessStoreId || DEFAULT_STORES.van_ness.merchantStoreId,
      externalStoreId: vanNessStoreId || DEFAULT_STORES.van_ness.externalStoreId
    }
  };
}
function resolveStore(env, storeKey) {
  const stores = getDoorDashStores(env);
  return stores[storeKey] || stores.polk_st;
}
var DEFAULT_STORES;
var init_config = __esm({
  "../lib/doordash/config.js"() {
    init_functionsRoutes_0_769502212075221();
    DEFAULT_STORES = {
      polk_st: {
        id: "polk_st",
        label: "Polk St",
        merchantStoreId: "24381062",
        externalStoreId: "24381062",
        pickupAddress: "1801 Polk St, San Francisco, CA 94109",
        pickupPhone: "+14155550101",
        pickupBusinessName: "UPFORDAYZ Polk St"
      },
      van_ness: {
        id: "van_ness",
        label: "Van Ness",
        merchantStoreId: "894868",
        externalStoreId: "894868",
        pickupAddress: "Van Ness Ave, San Francisco, CA",
        pickupPhone: "+14155550202",
        pickupBusinessName: "UPFORDAYZ Van Ness"
      }
    };
    __name(readEnv, "readEnv");
    __name(getDoorDashCredentials, "getDoorDashCredentials");
    __name(getDoorDashStores, "getDoorDashStores");
    __name(resolveStore, "resolveStore");
  }
});

// ../lib/doordash/client.js
async function doordashRequest(path, options = {}, env = {}) {
  const credentials = getDoorDashCredentials(env);
  const token = await createDoorDashJwt(credentials);
  const url = `${credentials.apiBaseUrl}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers || {}
    }
  });
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }
  if (!response.ok) {
    const message = data?.message || data?.error || `DoorDash API error (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}
var init_client = __esm({
  "../lib/doordash/client.js"() {
    init_functionsRoutes_0_769502212075221();
    init_jwt();
    init_config();
    __name(doordashRequest, "doordashRequest");
  }
});

// ../lib/doordash/menuMapper.js
function centsToDollars(value) {
  if (value == null) return null;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return numeric >= 100 ? numeric / 100 : numeric;
}
function slugifyCategory(name = "Other") {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "other";
}
function mapMenuItem(item, categoryName, index) {
  const price = centsToDollars(item.price ?? item.base_price);
  const isActive = item.active !== false && item.is_active !== false;
  const isSuspended = item.is_suspended === true || item.suspended === true;
  return {
    id: String(item.merchant_supplied_id || item.id || `${slugifyCategory(categoryName)}-${index}`),
    name: item.name || "Menu Item",
    tagline: item.subtitle || categoryName || "",
    description: item.description || "",
    category: slugifyCategory(categoryName),
    category_label: categoryName || "Other",
    price_small: price,
    price_medium: price,
    price_large: price,
    image_url: item.original_image_url || item.image_url || item.photo_url || "",
    is_available: isActive && !isSuspended,
    out_of_stock: !isActive || isSuspended,
    rating: item.sort_id ? Math.min(5, 4 + item.sort_id % 10 / 10) : null,
    sort_order: item.sort_id ?? index,
    doordash_item_id: item.merchant_supplied_id || item.id
  };
}
function mapCategoryItems(category, categoryIndex) {
  const categoryName = category.name || category.title || "Other";
  const items = category.items || category.menu_items || [];
  return items.map(
    (item, itemIndex) => mapMenuItem(item, categoryName, categoryIndex * 1e3 + itemIndex)
  );
}
function mapDoorDashMenuResponse(payload) {
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
      const label = category.name || category.title || "Other";
      const key = slugifyCategory(label);
      if (!categories.find((entry) => entry.key === key)) {
        categories.push({ key, label });
      }
      items.push(...mapCategoryItems(category, categoryIndex));
    }
  }
  if (items.length === 0 && Array.isArray(payload?.items)) {
    for (const [index, item] of payload.items.entries()) {
      items.push(mapMenuItem(item, item.category || "Other", index));
    }
  }
  items.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  return {
    categories: [{ key: "all", label: "All" }, ...categories],
    items
  };
}
var init_menuMapper = __esm({
  "../lib/doordash/menuMapper.js"() {
    init_functionsRoutes_0_769502212075221();
    __name(centsToDollars, "centsToDollars");
    __name(slugifyCategory, "slugifyCategory");
    __name(mapMenuItem, "mapMenuItem");
    __name(mapCategoryItems, "mapCategoryItems");
    __name(mapDoorDashMenuResponse, "mapDoorDashMenuResponse");
  }
});

// ../lib/doordash/handlers.js
var handlers_exports = {};
__export(handlers_exports, {
  handleDoorDashApiRequest: () => handleDoorDashApiRequest
});
async function readJsonBody(req) {
  if (req.body != null) {
    return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  }
  const chunks = [];
  await new Promise((resolve, reject) => {
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", resolve);
    req.on("error", reject);
  });
  if (chunks.length === 0) return {};
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    const bytes = chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk);
    merged.set(bytes, offset);
    offset += bytes.length;
  }
  const raw = new TextDecoder().decode(merged);
  return raw ? JSON.parse(raw) : {};
}
function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}
function ensureConfigured(env) {
  const credentials = getDoorDashCredentials(env);
  if (!credentials.developerId || !credentials.keyId || !credentials.signingSecret) {
    const error = new Error("DoorDash API credentials are missing. Configure DOORDASH_DEVELOPER_ID, DOORDASH_KEY_ID, and DOORDASH_SECRET.");
    error.status = 503;
    throw error;
  }
}
async function handleDoorDashApiRequest(req, res, env = {}) {
  const url = new URL(req.url ?? "/", "http://localhost");
  const pathname = url.pathname.replace(/^\/api\/doordash/, "") || "/";
  try {
    if (req.method === "GET" && pathname === "/stores") {
      const { getDoorDashStores: getDoorDashStores2 } = await Promise.resolve().then(() => (init_config(), config_exports));
      return sendJson(res, 200, { stores: Object.values(getDoorDashStores2(env)) });
    }
    if (req.method === "GET" && pathname === "/menu") {
      ensureConfigured(env);
      const storeKey = url.searchParams.get("store") || "polk_st";
      const store = resolveStore(env, storeKey);
      let payload;
      try {
        payload = await doordashRequest(
          `/marketplace/api/v1/stores/${encodeURIComponent(store.merchantStoreId)}/store_menu`,
          { method: "GET" },
          env
        );
      } catch {
        payload = await doordashRequest(
          `/marketplace/api/v1/stores/${encodeURIComponent(store.merchantStoreId)}/menu_details`,
          { method: "GET" },
          env
        );
      }
      const mapped = mapDoorDashMenuResponse(payload);
      return sendJson(res, 200, {
        store,
        ...mapped
      });
    }
    if (req.method === "POST" && pathname === "/quotes") {
      ensureConfigured(env);
      const body = await readJsonBody(req);
      const store = resolveStore(env, body.storeId || "polk_st");
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
        currency: "USD"
      };
      if (credentials.externalBusinessId) {
        quotePayload.pickup_external_business_id = credentials.externalBusinessId;
        quotePayload.pickup_external_store_id = store.externalStoreId;
      }
      const quote = await doordashRequest("/drive/v2/quotes", {
        method: "POST",
        body: JSON.stringify(quotePayload)
      }, env);
      return sendJson(res, 200, {
        externalDeliveryId,
        fee: quote.fee ? quote.fee / 100 : quote.delivery_fee ? quote.delivery_fee / 100 : 0,
        etaMinutes: quote.delivery_time ?? quote.estimated_pickup_time ?? null,
        quote
      });
    }
    if (req.method === "POST" && pathname === "/orders") {
      ensureConfigured(env);
      const body = await readJsonBody(req);
      const store = resolveStore(env, body.storeId || "polk_st");
      const credentials = getDoorDashCredentials(env);
      const externalDeliveryId = body.externalDeliveryId || `upfordayz-order-${Date.now()}`;
      const orderValueCents = Math.round(Number(body.orderValue || 0) * 100);
      const isDelivery = body.orderType === "delivery";
      const deliveryPayload = {
        external_delivery_id: externalDeliveryId,
        pickup_address: store.pickupAddress,
        pickup_business_name: store.pickupBusinessName,
        pickup_phone_number: store.pickupPhone,
        dropoff_address: isDelivery ? body.dropoffAddress : store.pickupAddress,
        dropoff_phone_number: body.customerPhone,
        dropoff_contact_given_name: body.customerName,
        dropoff_instructions: body.notes || (isDelivery ? "Leave at door if no answer." : "Pickup order from counter."),
        order_value: orderValueCents,
        currency: "USD",
        items: (body.items || []).map((item) => ({
          name: item.name,
          quantity: item.quantity || 1,
          external_id: item.doordash_item_id || item.menu_item_id || item.id,
          price: Math.round(Number(item.price || 0) * 100)
        }))
      };
      if (credentials.externalBusinessId) {
        deliveryPayload.pickup_external_business_id = credentials.externalBusinessId;
        deliveryPayload.pickup_external_store_id = store.externalStoreId;
      }
      if (isDelivery && body.quoteExternalDeliveryId) {
        const accepted = await doordashRequest(
          `/drive/v2/quotes/${encodeURIComponent(body.quoteExternalDeliveryId)}/accept`,
          { method: "POST", body: JSON.stringify({}) },
          env
        );
        return sendJson(res, 201, {
          externalDeliveryId: body.quoteExternalDeliveryId,
          order: accepted
        });
      }
      const order = await doordashRequest("/drive/v2/deliveries", {
        method: "POST",
        body: JSON.stringify(deliveryPayload)
      }, env);
      return sendJson(res, 201, {
        externalDeliveryId,
        order
      });
    }
    return sendJson(res, 404, { error: "DoorDash API route not found" });
  } catch (error) {
    return sendJson(res, error.status || 500, {
      error: error.message || "DoorDash API request failed",
      details: error.data || null
    });
  }
}
var init_handlers = __esm({
  "../lib/doordash/handlers.js"() {
    init_functionsRoutes_0_769502212075221();
    init_client();
    init_config();
    init_menuMapper();
    __name(readJsonBody, "readJsonBody");
    __name(sendJson, "sendJson");
    __name(ensureConfigured, "ensureConfigured");
    __name(handleDoorDashApiRequest, "handleDoorDashApiRequest");
  }
});

// api/doordash/[[path]].js
async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const headers = Object.fromEntries(request.headers);
  const bodyText = request.method !== "GET" && request.method !== "HEAD" ? await request.text() : void 0;
  const req = {
    method: request.method,
    url: url.pathname + url.search,
    headers,
    body: bodyText
  };
  let statusCode = 200;
  let responseBody = "";
  const responseHeaders = {};
  const res = {
    set statusCode(code) {
      statusCode = code;
    },
    setHeader(name, value) {
      responseHeaders[name] = value;
    },
    end(body) {
      responseBody = body;
    }
  };
  const { handleDoorDashApiRequest: handleDoorDashApiRequest2 } = await Promise.resolve().then(() => (init_handlers(), handlers_exports));
  await handleDoorDashApiRequest2(req, res, env);
  return new Response(responseBody, {
    status: statusCode,
    headers: responseHeaders
  });
}
var init_path = __esm({
  "api/doordash/[[path]].js"() {
    init_functionsRoutes_0_769502212075221();
    __name(onRequest, "onRequest");
  }
});

// ../.wrangler/tmp/pages-5Fubc8/functionsRoutes-0.769502212075221.mjs
var routes;
var init_functionsRoutes_0_769502212075221 = __esm({
  "../.wrangler/tmp/pages-5Fubc8/functionsRoutes-0.769502212075221.mjs"() {
    init_path();
    routes = [
      {
        routePath: "/api/doordash/:path*",
        mountPath: "/api/doordash",
        method: "",
        middlewares: [],
        modules: [onRequest]
      }
    ];
  }
});

// ../node_modules/wrangler/templates/pages-template-worker.ts
init_functionsRoutes_0_769502212075221();

// ../node_modules/path-to-regexp/dist.es2015/index.js
init_functionsRoutes_0_769502212075221();
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
