'use strict';

/**
 * 练了吗 · 静态服务器
 * 零依赖：只用 Node 内置模块，Render 上不需要 build、不需要 npm install。
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8'
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/healthz') {
    return send(res, 200, JSON.stringify({ ok: true, uptime: process.uptime() }), {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    });
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return send(res, 405, 'Method Not Allowed', { allow: 'GET, HEAD' });
  }

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return send(res, 400, 'Bad Request');
  }

  // 归一化，挡住 ../ 之类的越界访问
  let filePath = path.normalize(path.join(ROOT, pathname));
  if (!filePath.startsWith(ROOT)) return send(res, 403, 'Forbidden');

  if (pathname.endsWith('/')) filePath = path.join(filePath, 'index.html');

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      // 单页应用：非静态资源路径统一回 index.html
      if (!path.extname(pathname)) {
        return serveFile(path.join(ROOT, 'index.html'), res, req);
      }
      return send(res, 404, 'Not Found');
    }
    serveFile(filePath, res, req, stat);
  });
});

function serveFile(filePath, res, req, stat) {
  fs.readFile(filePath, (err, buf) => {
    if (err) return send(res, 500, 'Internal Server Error');

    const ext = path.extname(filePath).toLowerCase();
    const etag = '"' + createHash('sha1').update(buf).digest('base64').slice(0, 20) + '"';

    if (req.headers['if-none-match'] === etag) {
      return send(res, 304, '', { etag });
    }

    const isHtml = ext === '.html';
    send(res, 200, req.method === 'HEAD' ? '' : buf, {
      'content-type': MIME[ext] || 'application/octet-stream',
      'content-length': buf.length,
      etag,
      // HTML 每次回源，静态资源靠 ETag 校验
      'cache-control': isHtml ? 'no-cache' : 'public, max-age=0, must-revalidate',
      'x-content-type-options': 'nosniff'
    });
  });
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`练了吗 running at http://localhost:${PORT}`);
});
