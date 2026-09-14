// Freeze lab. The aha: same coffee, two rails, one issuer switch.
// Alice pays native receipt. Bob pays USDT guest. Tether freezes Bob.
// Alice still redeems. Bob cannot move. If USDT were gas, the till dies.
// ENGINE_SPEC. Uses teaching-scale integers. Not a live Tether freeze.

import * as native from './native-rail.mjs';
import * as tether from './tether-rail.mjs';
import {route} from './best-practice.mjs';

export const ALICE = '11'.repeat(32);
export const BOB = '22'.repeat(32);
export const MERCHANT = '33'.repeat(32);
export const COFFEE_EUR_CENTS = 250n; // €2.50
export const COFFEE_SOMPI = 72_000_000n; // teaching FX, not a live rate
export const COFFEE_USDT = 2_500_000n; // 2.50 USDT at 6 decimals

const jsonSafe = (value) => {
  if (typeof value === 'bigint') return value.toString();
  if (Array.isArray(value)) return value.map(jsonSafe);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, jsonSafe(v)]));
  }
  return value;
};

export function runFreezeLab() {
  const steps = [];
  const push = (id, title, data) => steps.push({id, title, ...jsonSafe(data)});

  push('quote', 'Till quotes €2.50. Two rails offered. Labels stay honest.', {
    quote: {eurCents: COFFEE_EUR_CENTS, display: 'EUR 2.50'},
    nativeQuoteSompi: COFFEE_SOMPI,
    tetherQuoteMicro: COFFEE_USDT,
    dappUnit: route({useCase: 'dapp_unit'}).rail,
    minerFee: route({useCase: 'miner_fee'}).rail,
    x402: route({useCase: 'x402'}).rail,
    merchantUsdt: route({useCase: 'merchant_usdt_guest'}).allowed,
  });

  let n = native.genesis({seriesId: 'ab'.repeat(32)});
  const locked = native.lock(n, {owner: ALICE, sompi: COFFEE_SOMPI});
  n = locked.state;
  push('alice-lock', 'Alice locks sompi. 1 unit = 1 locked sompi. No oracle.', {
    locked: locked.locked,
    freezeSwitch: native.inspect(n).freezeSwitch,
    backedOneToOne: native.inspect(n).backedOneToOne,
  });

  const paidN = native.transfer(n, {from: ALICE, to: MERCHANT, quantity: COFFEE_SOMPI});
  n = paidN.state;
  push('alice-pay', 'Alice pays the merchant on the native rail. PoW sequences it.', {
    moved: paidN.moved,
    merchantNative: native.balanceOf(n, MERCHANT),
    aliceNative: native.balanceOf(n, ALICE),
  });

  let t = tether.genesis();
  t = tether.mint(t, {to: BOB, micro: COFFEE_USDT}).state;
  const paidT = tether.transfer(t, {from: BOB, to: MERCHANT, micro: COFFEE_USDT});
  t = paidT.state;
  push('bob-pay', 'Bob pays the merchant with USDT guest. Kaspa still sequences. The unit is Tether policy.', {
    moved: paidT.moved,
    merchantUsdt: tether.balanceOf(t, MERCHANT),
    bobUsdt: tether.balanceOf(t, BOB),
    extraRisk: tether.inspect(t).extraRisk,
  });

  const froze = tether.freeze(t, MERCHANT);
  t = froze.state;
  push('issuer-freeze', 'Issuer blacklists the merchant. Guest rail stops. Native rail does not notice.', {
    frozen: froze.frozen,
    heldOnGuest: froze.held,
    nativeStillLiquid: native.balanceOf(n, MERCHANT),
    nativeCanRedeem: true,
    guestCanTransfer: false,
  });

  let nativeRedeemOk = false;
  let guestMoveOk = false;
  let guestError = null;
  let gasError = null;

  const redeemed = native.redeem(n, {holder: MERCHANT, quantity: COFFEE_SOMPI});
  n = redeemed.state;
  nativeRedeemOk = redeemed.released === COFFEE_SOMPI;
  push('alice-redeem', 'Merchant redeems native sompi. Sponsor paid the fee. Principal intact.', {
    released: redeemed.released,
    nativeEmpty: native.inspect(n).circulating === 0n,
    backedOneToOne: native.inspect(n).backedOneToOne,
  });

  try {
    tether.transfer(t, {from: MERCHANT, to: BOB, micro: 1n});
    guestMoveOk = true;
  } catch (err) {
    guestError = {code: err.code, message: err.message};
  }
  push('guest-blocked', 'Merchant tries to move the USDT. Issuer switch wins.', {
    guestMoveOk,
    guestError,
  });

  try {
    tether.useAsGas();
  } catch (err) {
    gasError = {code: err.code, message: err.message};
  }
  push('never-gas', 'If USDT were gas, a freeze would halt the till and starve miners. Refused.', {
    gasError,
  });

  const destroyed = tether.destroy(t, MERCHANT);
  t = destroyed.state;
  push('destroy', 'Issuer destroys the frozen guest balance. Native redeem already finished.', {
    destroyed: destroyed.destroyed,
    guestCirculating: tether.inspect(t).circulating,
    nativeCirculating: native.inspect(n).circulating,
  });

  const verdict = {
    nativeRedeemOk,
    guestMoveOk,
    guestBlocked: guestError?.code === 'FROZEN',
    neverGas: gasError?.code === 'NEVER_GAS',
    nativeHasNoFreeze: true,
    lesson: 'Host USDT as a labelled guest. Never as gas, never as the dapp unit, never as the miner fee. Keep a PoW rail that no issuer can switch off.',
  };

  return {
    name: 'grok-heavy-freeze-lab',
    warning: 'ENGINE_SPEC. Teaching integers. Not a live Tether freeze. Not SCRIPT_ENFORCED.',
    dedication: 'my heart goes out to you',
    record: tether.TETHER_RECORD_2026,
    verdict,
    steps,
    native: jsonSafe(native.inspect(n)),
    tether: jsonSafe(tether.inspect(t)),
  };
}
