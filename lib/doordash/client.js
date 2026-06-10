import { createDoorDashJwt } from './jwt.js';
import { getDoorDashCredentials } from './config.js';

export async function doordashRequest(path, options = {}, env = {}) {
  const credentials = getDoorDashCredentials(env);
  const token = await createDoorDashJwt(credentials);
  const url = `${credentials.apiBaseUrl}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers || {}),
    },
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
