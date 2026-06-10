function base64UrlEncodeBytes(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
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

export async function createDoorDashJwt(credentials) {
  const { developerId, keyId, signingSecret } = credentials;
  if (!developerId || !keyId || !signingSecret) {
    throw new Error('DoorDash credentials are not configured');
  }

  const signingKey = decodeSigningKey(signingSecret);
  const header = {
    alg: 'HS256',
    typ: 'JWT',
    'dd-ver': 'DD-JWT-V1',
  };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    aud: 'doordash',
    iss: developerId,
    kid: keyId,
    exp: now + 300,
    iat: now,
  };

  const encodedHeader = base64UrlEncodeString(JSON.stringify(header));
  const encodedPayload = base64UrlEncodeString(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    signingKey,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signatureBytes = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    new TextEncoder().encode(data),
  );

  const signature = base64UrlEncodeBytes(new Uint8Array(signatureBytes));
  return `${data}.${signature}`;
}
