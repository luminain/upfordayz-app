export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const headers = Object.fromEntries(request.headers);
  const bodyText = request.method !== 'GET' && request.method !== 'HEAD'
    ? await request.text()
    : undefined;

  const req = {
    method: request.method,
    url: url.pathname + url.search,
    headers,
    body: bodyText,
  };

  let statusCode = 200;
  let responseBody = '';
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
    },
  };

  const { handleDoorDashApiRequest } = await import('../../../lib/doordash/handlers.js');
  await handleDoorDashApiRequest(req, res, env);

  return new Response(responseBody, {
    status: statusCode,
    headers: responseHeaders,
  });
}
