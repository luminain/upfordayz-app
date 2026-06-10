import crypto from 'crypto';

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function getSigningKey(secret) {
  if (!secret) return null;

  try {
    return Buffer.from(secret, 'base64');
  } catch {
    return Buffer.from(secret, 'utf8');
  }
}

export function createDoorDashJwt(credentials) {
  const { developerId, keyId, signingSecret } = credentials;
  if (!developerId || !keyId || !signingSecret) {
    throw new Error('DoorDash credentials are not configured');
  }

  const signingKey = getSigningKey(signingSecret);
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

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', signingKey)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}
