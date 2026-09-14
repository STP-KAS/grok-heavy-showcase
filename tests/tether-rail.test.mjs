import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  TetherError,
  genesis,
  mint,
  transfer,
  freeze,
  destroy,
  unfreeze,
  useAsGas,
  inspect,
  TETHER_RECORD_2026,
} from '../src/tether-rail.mjs';

const bob = '22'.repeat(32);
const merchant = '33'.repeat(32);

const throws = (fn, code) => {
  assert.throws(fn, (err) => err instanceof TetherError && err.code === code);
};

describe('tether guest rail', () => {
  it('imports a freeze switch and never-gas', () => {
    const snap = inspect(genesis());
    assert.equal(snap.freezeSwitch, true);
    assert.equal(snap.canDestroy, true);
    assert.equal(snap.neverGas, true);
    assert.ok(snap.extraRisk.includes('issuer-blacklist'));
    assert.ok(TETHER_RECORD_2026.walletsFrozenOrSeized > 10000);
  });

  it('freeze blocks transfer then destroy zeros the balance', () => {
    let t = mint(genesis(), {to: bob, micro: 2_500_000n}).state;
    t = transfer(t, {from: bob, to: merchant, micro: 2_500_000n}).state;
    t = freeze(t, merchant).state;
    throws(() => transfer(t, {from: merchant, to: bob, micro: 1n}), 'FROZEN');
    const {state: gone, destroyed} = destroy(t, merchant);
    assert.equal(destroyed, 2_500_000n);
    assert.equal(inspect(gone).circulating, 0n);
    throws(() => unfreeze(gone, merchant), 'DESTROYED');
  });

  it('refuses USDT as gas', () => {
    throws(() => useAsGas(), 'NEVER_GAS');
  });
});
