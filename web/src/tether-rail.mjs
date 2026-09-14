// Tether guest rail. Centralised USD IOU landed on Kaspa.
// Models issuer freeze + destroy, plus a Kasplex-class bridge hop.
// Guest only. Never gas. Never dapp unit of account. Never miner fee.
// ENGINE_SPEC. Not a Tether product. Not a licensed issuer.

export const RAIL = 'tether-guest';
export const DECIMALS = 6;
export const MICRO = 1_000_000n; // 1 USDT
export const ISSUER = 'tether-limited';
export const BRIDGE = 'kasplex-class-bep20'; // 3 Mar 2026: Kasplex launched a Circle/Tether-standard stable bridge on BNB Smart Chain

export class TetherError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'TetherError';
    this.code = code;
  }
}

const hex32 = (value, label = 'bytes') => {
  if (typeof value !== 'string' || !/^[0-9a-f]{64}$/i.test(value)) {
    throw new TetherError('BAD_HEX', `Expected 32-byte hex for ${label}.`);
  }
  return value.toLowerCase();
};

const u = (value, {min = 0n, label = 'amount'} = {}) => {
  const n = typeof value === 'bigint' ? value : BigInt(value);
  if (n < min) throw new TetherError('RANGE', `${label} out of range.`);
  return n;
};

const copyMap = (m) => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, v]));
const copySet = (s) => [...s];

export function genesis() {
  return {
    rail: RAIL,
    issuer: ISSUER,
    bridge: BRIDGE,
    freezeSwitch: true,
    canDestroy: true,
    neverGas: true,
    balances: {},
    frozen: [],
    destroyed: [],
    minted: 0n,
    burned: 0n,
    freezeEvents: 0,
    destroyEvents: 0,
  };
}

export function inspect(state) {
  const circulating = Object.values(state.balances).reduce((n, x) => n + x, 0n);
  return {
    rail: RAIL,
    issuer: state.issuer,
    bridge: state.bridge,
    freezeSwitch: true,
    canDestroy: true,
    neverGas: true,
    extraRisk: ['issuer-blacklist', 'issuer-destroy', 'bridge-operator', 'source-chain-halt'],
    circulating,
    minted: state.minted,
    burned: state.burned,
    frozen: copySet(state.frozen),
    destroyed: copySet(state.destroyed),
    freezeEvents: state.freezeEvents,
    destroyEvents: state.destroyEvents,
    warning: 'GUEST IOU. TETHER PRINTS, FREEZES, DESTROYS. KASPA SEQUENCES. THE UNIT IS TETHER POLICY.',
  };
}

export function mint(state, {to, micro}) {
  const qty = u(micro, {min: 1n, label: 'mint'});
  const dst = hex32(to, 'to');
  const balances = copyMap(state.balances);
  balances[dst] = (balances[dst] ?? 0n) + qty;
  return {
    state: {
      ...state,
      balances,
      minted: state.minted + qty,
    },
    minted: qty,
  };
}

export function isFrozen(state, who) {
  return state.frozen.includes(hex32(who, 'who'));
}

export function balanceOf(state, who) {
  const id = hex32(who, 'who');
  return state.balances[id] ?? 0n;
}

export function transfer(state, {from, to, micro}) {
  const qty = u(micro, {min: 1n, label: 'transfer'});
  const src = hex32(from, 'from');
  const dst = hex32(to, 'to');
  if (src === dst) throw new TetherError('SELF', 'Transfer to self is not a move.');
  if (state.frozen.includes(src)) {
    throw new TetherError('FROZEN', 'Sender is on the issuer blacklist. Transfer refused.');
  }
  if (state.frozen.includes(dst)) {
    throw new TetherError('FROZEN', 'Receiver is on the issuer blacklist. Transfer refused.');
  }
  const have = state.balances[src] ?? 0n;
  if (have < qty) throw new TetherError('BUDGET', 'Sender does not have that many USDT.');
  const balances = copyMap(state.balances);
  balances[src] = have - qty;
  if (balances[src] === 0n) delete balances[src];
  balances[dst] = (balances[dst] ?? 0n) + qty;
  return {
    state: {...state, balances},
    moved: qty,
  };
}

export function freeze(state, who) {
  const id = hex32(who, 'who');
  if (state.frozen.includes(id)) throw new TetherError('ALREADY', 'Address is already frozen.');
  return {
    state: {
      ...state,
      frozen: [...state.frozen, id],
      freezeEvents: state.freezeEvents + 1,
    },
    frozen: id,
    held: state.balances[id] ?? 0n,
  };
}

export function unfreeze(state, who) {
  const id = hex32(who, 'who');
  if (!state.frozen.includes(id)) throw new TetherError('NOT_FROZEN', 'Address is not frozen.');
  if (state.destroyed.includes(id)) {
    throw new TetherError('DESTROYED', 'Destroyed balances cannot be restored by unfreeze.');
  }
  return {
    state: {
      ...state,
      frozen: state.frozen.filter((x) => x !== id),
    },
    unfrozen: id,
  };
}

export function destroy(state, who) {
  const id = hex32(who, 'who');
  if (!state.frozen.includes(id)) {
    throw new TetherError('NOT_FROZEN', 'Issuer can only destroy a balance that is already frozen.');
  }
  const held = state.balances[id] ?? 0n;
  const balances = copyMap(state.balances);
  delete balances[id];
  return {
    state: {
      ...state,
      balances,
      burned: state.burned + held,
      destroyed: state.destroyed.includes(id) ? state.destroyed : [...state.destroyed, id],
      destroyEvents: state.destroyEvents + 1,
    },
    destroyed: held,
  };
}

export function useAsGas() {
  throw new TetherError(
    'NEVER_GAS',
    'USDT is never the miner-fee asset. A freeze-capable issuer must not sit under GHOSTDAG security budget.',
  );
}

// 2026 public record (sources in SOURCES.md). Snapshot, not live RPC.
export const TETHER_RECORD_2026 = {
  asOf: '2026-09-14',
  walletsFrozenOrSeized: 11517,
  freezeEventsEthTron: 11085,
  valueAtMomentOfFreezeUsd: 5_847_780_552,
  balancesDestroyed: 2434,
  usdtDestroyedUsd: 1_434_776_099,
  unfreezeRate2025: 0.036,
  destroyShareOf2025Freezes: 0.556,
  ofacHitRate: 1.0,
  note: 'Issuer contract has addBlackList and destroyBlackFunds. One key. No holder override. Bridging USDT onto Kaspa imports this switch.',
};
