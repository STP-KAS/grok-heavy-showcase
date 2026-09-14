const el = (id) => document.getElementById(id);
const fmt = (n) => {
  if (n == null || n === '…') return '—';
  const x = Number(n);
  if (!Number.isFinite(x)) return String(n);
  if (x >= 1e9) return (x / 1e9).toFixed(3) + 'B';
  if (x >= 1e6) return (x / 1e6).toFixed(2) + 'M';
  if (x >= 1e3) return (x / 1e3).toFixed(1) + 'k';
  return x.toPrecision(4);
};

const loadPulse = async () => {
  try {
    const res = await fetch('/api/pulse');
    if (res.ok) return res.json();
  } catch {}
  const res = await fetch('pulse.json');
  return res.json();
};
try {
  const p = await loadPulse();
  el('daa').textContent = p.mainnet?.daa ?? '—';
  el('price').textContent = p.mainnet?.priceUsd != null ? '$' + Number(p.mainnet.priceUsd).toFixed(4) : '—';
  el('miner').textContent = p.tn10?.minerKas != null ? Math.round(p.tn10.minerKas).toLocaleString() + ' tKAS' : '—';
  const n = p.local || {};
  el('nodes').textContent = `mn ${n.mainnetNodeRpc ? 'up' : 'down'} · tn10 ${n.tn10NodeRpc ? 'up' : 'down'}`;
} catch {
  el('daa').textContent = 'offline';
  el('price').textContent = 'offline';
  el('miner').textContent = 'offline';
  el('nodes').textContent = 'serve.mjs not running';
}
