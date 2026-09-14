// Live pulse. Public Kaspa APIs + local desk ports + groks-wallet miner.
// Writes artifacts/node-probe.json. Never holds keys. Never asks for a seed.

import {writeFile} from 'node:fs/promises';
import {createConnection} from 'node:net';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const MINER = 'kaspatest:qzffl5xy9np46gkttyuftqnv2w04pr8g3wsp7c3vv8se3txtelx6q7c0v0ldx';
const PEGLAB = 'kaspatest:qzpvdakagvwfm95g8pv9ndpupjtndgjfhmve08cg3tv5wgfytjzf7cudwwzv0';

const getJson = async (url, timeoutMs = 8000) => {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {signal: ctrl.signal});
    if (!res.ok) return {ok: false, status: res.status, url};
    return {ok: true, status: res.status, url, body: await res.json()};
  } catch (err) {
    return {ok: false, url, error: err.message};
  } finally {
    clearTimeout(t);
  }
};

const getText = async (url, timeoutMs = 5000) => {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {signal: ctrl.signal});
    return {ok: res.ok, status: res.status, url, bytes: Number(res.headers.get('content-length') || 0)};
  } catch (err) {
    return {ok: false, url, error: err.message};
  } finally {
    clearTimeout(t);
  }
};

const portOpen = (port, host = '127.0.0.1', timeoutMs = 400) =>
  new Promise((resolve) => {
    const sock = createConnection({port, host});
    const done = (open) => {
      sock.removeAllListeners();
      sock.destroy();
      resolve({port, host, open});
    };
    sock.setTimeout(timeoutMs);
    sock.once('connect', () => done(true));
    sock.once('timeout', () => done(false));
    sock.once('error', () => done(false));
  });

export async function probe() {
  const started = new Date().toISOString();
  const [
    dag,
    supply,
    price,
    hashrate,
    tn10,
    miner,
    peglab,
    ishum,
    sixpack,
    peglabUi,
  ] = await Promise.all([
    getJson('https://api.kaspa.org/info/blockdag'),
    getJson('https://api.kaspa.org/info/coinsupply'),
    getJson('https://api.kaspa.org/info/price'),
    getJson('https://api.kaspa.org/info/hashrate'),
    getJson('https://api-tn10.kaspa.org/info/blockdag'),
    getJson(`https://api-tn10.kaspa.org/addresses/${MINER}/balance`),
    getJson(`https://api-tn10.kaspa.org/addresses/${PEGLAB}/balance`),
    getText('http://127.0.0.1:8090/'),
    getText('http://127.0.0.1:4020/'),
    getText('http://127.0.0.1:8765/'),
  ]);

  const ports = await Promise.all(
    [16110, 16111, 16210, 16211, 17110, 17210, 18110, 8090, 4020, 8765, 8091].map((p) => portOpen(p)),
  );

  const kas = (sompi) => Number(sompi) / 1e8;
  const pulse = {
    at: started,
    dedication: 'my heart goes out to you',
    warning: 'Public REST + local port scan. Not consensus. Local 127.0.0.1 is this machine, not GitHub.',
    mainnet: {
      network: dag.body?.networkName ?? null,
      daa: dag.body?.virtualDaaScore ?? null,
      blockCount: dag.body?.blockCount ?? null,
      difficulty: dag.body?.difficulty ?? null,
      circulatingSompi: supply.body?.circulatingSupply ?? null,
      maxSompi: supply.body?.maxSupply ?? null,
      priceUsd: price.body?.price ?? null,
      hashrateApi: hashrate.body?.hashrate ?? null,
      hashrateNote: 'api.kaspa.org/info/hashrate number is GH/s-class; ~342 PH/s on 14 Sep 2026.',
    },
    tn10: {
      network: tn10.body?.networkName ?? null,
      daa: tn10.body?.virtualDaaScore ?? null,
      blockCount: tn10.body?.blockCount ?? null,
      miner,
      peglabSponsor: peglab,
      minerKas: miner.body?.balance != null ? kas(miner.body.balance) : null,
      peglabKas: peglab.body?.balance != null ? kas(peglab.body.balance) : null,
    },
    local: {
      ports: Object.fromEntries(ports.map((p) => [p.port, p.open])),
      ishum: ishum.ok,
      sixpack: sixpack.ok,
      peglabUi: peglabUi.ok,
      mainnetNodeRpc: ports.find((p) => p.port === 16110)?.open ?? false,
      tn10NodeRpc: ports.find((p) => p.port === 16210)?.open ?? false,
      minerHint: 'kaspa-miner v0.2.7 -> 127.0.0.1:16210, address kaspatest:qzffl5…v0ldx, ua grokwallet',
    },
    sources: [
      'https://api.kaspa.org/info/blockdag',
      'https://api.kaspa.org/info/coinsupply',
      'https://api.kaspa.org/info/price',
      'https://api.kaspa.org/info/hashrate',
      'https://api-tn10.kaspa.org/info/blockdag',
    ],
  };

  return pulse;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const pulse = await probe();
  const out = path.join(ROOT, 'artifacts', 'node-probe.json');
  await writeFile(out, JSON.stringify(pulse, null, 2));
  console.log(JSON.stringify(pulse, null, 2));
  console.log(`wrote ${out}`);
}
