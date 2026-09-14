const stepsEl = document.getElementById('steps');
const recEl = document.getElementById('record');
const depegEl = document.getElementById('depeg-out');

const paint = (lab) => {
  const rec = lab.record;
  recEl.textContent = `Tether public record ${rec.asOf}: ${rec.walletsFrozenOrSeized.toLocaleString()} wallets frozen/seized · $${Math.round(rec.valueAtMomentOfFreezeUsd / 1e9 * 100) / 100}B at freeze · ${rec.balancesDestroyed.toLocaleString()} balances destroyed ($${Math.round(rec.usdtDestroyedUsd / 1e6)}M). Unfreeze rate 2025: ${(rec.unfreezeRate2025 * 100).toFixed(1)}%.`;
  stepsEl.innerHTML = '';
  for (const step of lab.steps) {
    const div = document.createElement('div');
    const kind = /freeze|destroy|blocked|never-gas/.test(step.id) ? 'danger' : /bob|guest/.test(step.id) ? 'guest' : '';
    div.className = 'step ' + kind;
    div.innerHTML = `<strong>${step.title}</strong><div class="meta">${step.id}</div>`;
    stepsEl.appendChild(div);
  }
  const v = document.createElement('div');
  v.className = 'step';
  v.innerHTML = `<strong class="ok">Verdict.</strong> native redeem ${lab.verdict.nativeRedeemOk} · guest blocked ${lab.verdict.guestBlocked} · never-gas ${lab.verdict.neverGas}. ${lab.verdict.lesson}`;
  stepsEl.appendChild(v);
};

const loadLab = async () => {
  try {
    const res = await fetch('/api/lab');
    if (res.ok) return res.json();
  } catch {}
  const [freeze, depeg] = await Promise.all([
    fetch('lab.json').then((r) => r.json()),
    fetch('depeg.json').then((r) => r.json()),
  ]);
  return {freeze, depeg};
};

document.getElementById('run').onclick = async () => {
  const data = await loadLab();
  paint(data.freeze);
};

document.getElementById('depeg').onclick = async () => {
  const data = await loadLab();
  depegEl.textContent = JSON.stringify(data.depeg, null, 2);
};

try {
  const data = await loadLab();
  paint(data.freeze);
} catch {
  recEl.textContent = 'Start serve.mjs to run the lab (node serve.mjs → http://127.0.0.1:4050/).';
}
