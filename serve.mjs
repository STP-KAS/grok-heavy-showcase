import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {probe} from './src/node-probe.mjs';
import {runFreezeLab} from './src/freeze-lab.mjs';
import {runDepegLab} from './src/depeg-lab.mjs';
import {SPECIES, route, WHY_POW} from './src/best-practice.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.join(ROOT, 'web');
const PORT = Number(process.env.PORT || 4050);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.md': 'text/plain; charset=utf-8',
};

const json = (value) =>
  JSON.stringify(value, (_k, v) => (typeof v === 'bigint' ? v.toString() : v));

const send = (res, status, body, type = 'application/json; charset=utf-8') => {
  res.writeHead(status, {
    'content-type': type,
    'cache-control': 'no-store',
    'access-control-allow-origin': '*',
  });
  res.end(body);
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  try {
    if (url.pathname === '/api/pulse') {
      send(res, 200, json(await probe()));
      return;
    }
    if (url.pathname === '/api/lab') {
      send(res, 200, json({freeze: runFreezeLab(), depeg: runDepegLab(), why: WHY_POW, species: SPECIES}));
      return;
    }
    if (url.pathname === '/api/route') {
      send(res, 200, json(route({useCase: url.searchParams.get('useCase') || ''})));
      return;
    }
    let file = url.pathname === '/' ? '/index.html' : url.pathname;
    const srcRoot = path.join(ROOT, 'src');
    const abs = file.startsWith('/src/')
      ? path.normalize(path.join(srcRoot, file.slice('/src/'.length)))
      : path.normalize(path.join(WEB, file));
    if (!abs.startsWith(WEB) && !abs.startsWith(srcRoot)) {
      send(res, 403, 'forbidden', 'text/plain');
      return;
    }
    if (!fs.existsSync(abs) || fs.statSync(abs).isDirectory()) {
      send(res, 404, 'not found', 'text/plain');
      return;
    }
    const type = TYPES[path.extname(abs)] || 'application/octet-stream';
    send(res, 200, fs.readFileSync(abs), type);
  } catch (err) {
    send(res, 500, json({error: err.message}));
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`grok-heavy-showcase http://127.0.0.1:${PORT}/`);
  console.log('pulse  /api/pulse');
  console.log('lab    /api/lab');
});
