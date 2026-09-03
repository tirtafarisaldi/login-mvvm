import http from 'http';
import https from 'https';
import type { NextApiRequest, NextApiResponse } from 'next';

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'transfer-encoding',
  'te',
  'trailer',
  'upgrade',
  'host',
  'content-length',
]);

function forwardHeaders(req: NextApiRequest): Record<string, string> {
  const headers: Record<string, string> = {};
  const upstreamHeaders: Record<string, string> = {
    'x-api-key': process.env.restapiKey || 'secret',
    Cookie: req.headers.cookie || '',
  };
  if (req.headers.authorization) {
    upstreamHeaders.Authorization = req.headers.authorization;
  }
  if (req.headers['content-type']) {
    upstreamHeaders['Content-Type'] = req.headers['content-type'];
  }

  for (const [key, value] of Object.entries(req.headers)) {
    const lower = key.toLowerCase();
    if (HOP_BY_HOP.has(lower)) continue;
    if (value === undefined) continue;
    headers[key] = Array.isArray(value) ? value.join(', ') : value;
  }
  // apply the authoritative upstream auth/api-key values on top
  Object.assign(headers, upstreamHeaders);
  return headers;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const endpoint = new URL(
    process.env.restapiEndpoint || 'http://localhost:3000'
  );
  const URI = (req.url || '').replace(/\/api*/, '') || '/';

  const httpModule = endpoint.protocol === 'https:' ? https : http;

  const upstream = httpModule.request(
    {
      hostname: endpoint.hostname,
      port: endpoint.port || (endpoint.protocol === 'https:' ? 443 : 80),
      path: URI,
      method: req.method,
      headers: forwardHeaders(req),
    },
    (upstreamRes) => {
      const setCookie = upstreamRes.headers['set-cookie'];
      if (setCookie) res.setHeader('Set-Cookie', setCookie);
      res.statusCode = upstreamRes.statusCode || 200;
      for (const [key, value] of Object.entries(upstreamRes.headers)) {
        const lower = key.toLowerCase();
        if (HOP_BY_HOP.has(lower) || lower === 'set-cookie') continue;
        if (value === undefined) continue;
        res.setHeader(key, Array.isArray(value) ? value.join(', ') : value);
      }
      upstreamRes.pipe(res);
    }
  );

  upstream.on('error', (error: NodeJS.ErrnoException) => {
    if (!res.headersSent) {
      res.status(502).json({
        status: 502,
        message: `bad gateway: ${error.code || error.message}`,
      });
    } else {
      res.end();
    }
  });

  req.pipe(upstream);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
