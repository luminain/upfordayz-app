import { loadEnv } from 'vite';
import { handleDoorDashApiRequest } from '../lib/doordash/handlers.js';

function createApiMiddleware(env) {
  return async (req, res, next) => {
    if (!req.url?.startsWith('/api/doordash')) {
      next();
      return;
    }

    await handleDoorDashApiRequest(req, res, env);
  };
}

export default function viteDoorDashApi() {
  let env = process.env;

  return {
    name: 'vite-doordash-api',
    config(_, { mode }) {
      env = loadEnv(mode, process.cwd(), '');
      env = { ...process.env, ...env };
    },
    configureServer(server) {
      server.middlewares.use(createApiMiddleware(env));
    },
    configurePreviewServer(server) {
      server.middlewares.use(createApiMiddleware(env));
    },
  };
}
