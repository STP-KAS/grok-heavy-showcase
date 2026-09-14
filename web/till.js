import {
  genesis as nGenesis,
  lock,
  transfer as nTransfer,
  redeem,
  freeze as nFreeze,
  inspect as nInspect,
  balanceOf as nBal,
} from '/src/native-rail.mjs';
import {
  genesis as tGenesis,
  mint,
  transfer as tTransfer,
  freeze as tFreeze,
  destroy as tDestroy,
  inspect as tInspect,
  balanceOf as tBal,
} from '/src/tether-rail.mjs';

const ALICE = '11'.repeat(32);
const BOB = '22'.repeat(32);
const MERCHANT = '33'.repeat(32);

let euros = '2.50';
let n = nGenesis({seriesId: 'cd'.repeat(32)});
let t = tGenesis();
t = mint(t, {to: BOB, micro: 50_000_000n}).state;
n = lock(n, {owner: ALICE, sompi: 500_000_000n}).state;
const log = [];
const note = (line) => {
  log.unshift(line);
  document.getElementById('ledger').textContent = log.slice(0, 12).join('\n');
};

const pad = document.getElementById('pad');
['1','2','3','4','5','6','7','8','9','C','0','.'].forEach((k) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = k;
  b.onclick = () => {
    if (k === 'C') euros = '0';
    else if (k === '.' && euros.includes('.')) return;
    else euros = (euros === '0' || euros === '0.00') && k !== '.' ? k : euros + k;
    document.getElementById('display').innerHTML = `${euros} <small>EUR</small>`;
  };
  pad.appendChild(b);
});

const sompiFor = () => {
  const eur = Number(euros);
  if (!Number.isFinite(eur) || eur <= 0) return 0n;
  return BigInt(Math.round(eur * 28_800_000));
};
const usdtFor = () => {
  const eur = Number(euros);
  if (!Number.isFinite(eur) || eur <= 0) return 0n;
  return BigInt(Math.round(eur * 1_000_000));
};

document.getElementById('pay-n').onclick = () => {
  try {
    const qty = sompiFor();
    n = nTransfer(n, {from: ALICE, to: MERCHANT, quantity: qty}).state;
    note(`NATIVE pay ${qty} sompi · merchant ${nBal(n, MERCHANT)} · freezeSwitch=${nInspect(n).freezeSwitch}`);
  } catch (err) {
    note(`NATIVE fail ${err.code}: ${err.message}`);
  }
};

document.getElementById('pay-t').onclick = () => {
  try {
    const qty = usdtFor();
    t = tTransfer(t, {from: BOB, to: MERCHANT, micro: qty}).state;
    note(`USDT guest pay ${qty} micro · merchant ${tBal(t, MERCHANT)} · freezeSwitch=${tInspect(t).freezeSwitch}`);
  } catch (err) {
    note(`USDT fail ${err.code}: ${err.message}`);
  }
};

document.getElementById('freeze').onclick = () => {
  try {
    t = tFreeze(t, MERCHANT).state;
    note(`ISSUER freeze merchant on USDT. Guest held ${tBal(t, MERCHANT)}.`);
  } catch (err) {
    note(`freeze fail ${err.code}: ${err.message}`);
  }
  try {
    nFreeze(n, MERCHANT);
  } catch (err) {
    note(`NATIVE freeze refused ${err.code} (this is the point).`);
  }
  try {
    const qty = nBal(n, MERCHANT);
    if (qty > 0n) {
      n = redeem(n, {holder: MERCHANT, quantity: qty}).state;
      note(`NATIVE redeem still works. Released ${qty} sompi.`);
    }
  } catch (err) {
    note(`redeem fail ${err.code}`);
  }
  try {
    tDestroy(t, MERCHANT);
    note('ISSUER destroy: guest balance gone.');
  } catch (err) {
    note(`destroy ${err.code}: ${err.message}`);
  }
};

note('Alice funded native. Bob funded USDT guest. Quote EUR. Pick a rail.');

try {
  const p = await fetch('/api/pulse').then((r) => r.json());
  if (p.mainnet?.priceUsd) {
    document.getElementById('fx').textContent =
      `Live KAS/USD ${Number(p.mainnet.priceUsd).toFixed(4)} · teaching keypad is not that rate · TN10 miner ${Math.round(p.tn10.minerKas).toLocaleString()} tKAS`;
  }
} catch {
  /* local pulse optional */
}
