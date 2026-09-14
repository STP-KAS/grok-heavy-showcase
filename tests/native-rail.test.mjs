import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  NativeError,
  genesis,
  lock,
  transfer,
  redeem,
  freeze,
  destroy,
  skimPrincipal,
  inspect,
  balanceOf,
  MAX_SOMPI,
} from '../src/native-rail.mjs';

const alice = '11'.repeat(32);
const bob = '22'.repeat(32);
const fee = 263_800n;

const throws = (fn, code) => {
  assert.throws(fn, (err) => err instanceof NativeError && err.code === code);
};

describe('native rail', () => {
  it('has no freeze switch and stays 1:1', () => {
    const snap = inspect(genesis());
    assert.equal(snap.freezeSwitch, false);
    assert.equal(snap.oracle, 'none');
    assert.equal(snap.backedOneToOne, true);
  });

  it('lock transfer redeem keeps backing equal to claims', () => {
    let {state} = lock(genesis(), {owner: alice, sompi: 50_000_000n, sponsorFee: fee});
    state = transfer(state, {from: alice, to: bob, quantity: 50_000_000n}).state;
    const {state: next, released} = redeem(state, {holder: bob, quantity: 20_000_000n, sponsorFee: fee});
    assert.equal(released, 20_000_000n);
    const snap = inspect(next);
    assert.equal(snap.lockedSompi, 30_000_000n);
    assert.equal(snap.circulating, 30_000_000n);
    assert.equal(snap.backedOneToOne, true);
    assert.equal(balanceOf(next, bob), 30_000_000n);
  });

  it('refuses freeze, destroy, skim, over-cap', () => {
    throws(() => freeze(genesis(), alice), 'NO_FREEZE');
    throws(() => destroy(genesis(), alice), 'NO_DESTROY');
    throws(() => skimPrincipal(genesis(), {holder: alice, quantity: 1n}), 'SKIM');
    const full = lock(genesis(), {owner: alice, sompi: MAX_SOMPI, sponsorFee: fee}).state;
    throws(() => lock(full, {owner: alice, sompi: 1n, sponsorFee: fee}), 'OVER_CAP');
  });
});
