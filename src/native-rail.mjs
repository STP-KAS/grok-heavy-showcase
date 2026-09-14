// Native PoW rail. Parker rules, PegLab honesty.
// One unit = one locked sompi. No dollar oracle. No freeze switch.
// Sponsor pays fees. Principal cannot be skimmed.
// ENGINE_SPEC. Not SCRIPT_ENFORCED. Not USD. Not tPEG.

export const RAIL = 'native';
export const NETWORK = 'testnet-10';
export const MAX_SOMPI = 1_000_000_000n; // 10 tKAS teaching cap
export const MAX_FEE = 3_000_000n;
export const SERIES_NAME = 'grok-heavy-native-v1';
export const SPONSOR_FEE = 263_800n; // native 1-in 2-out floor class

export class NativeError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'NativeError';
    this.code = code;
  }
}

const hex32 = (value, label = 'bytes') => {
  if (typeof value !== 'string' || !/^[0-9a-f]{64}$/i.test(value)) {
    throw new NativeError('BAD_HEX', `Expected 32-byte hex for ${label}.`);
  }
  return value.toLowerCase();
};

const u = (value, {min = 1n, max = MAX_SOMPI, label = 'amount'} = {}) => {
  const n = typeof value === 'bigint' ? value : BigInt(value);
  if (n < min || n > max) throw new NativeError('RANGE', `${label} out of range.`);
  return n;
};

const copyUnits = (units) => units.map((x) => ({owner: x.owner, quantity: x.quantity}));
const circulating = (state) => state.units.reduce((n, x) => n + x.quantity, 0n);

const take = (units, owner, quantity) => {
  const next = [];
  let need = quantity;
  for (const row of units) {
    if (row.owner !== owner || need === 0n) {
      next.push({...row});
      continue;
    }
    if (row.quantity <= need) {
      need -= row.quantity;
    } else {
      next.push({owner, quantity: row.quantity - need});
      need = 0n;
    }
  }
  if (need > 0n) throw new NativeError('BUDGET', 'Holder does not have that many sompi.');
  return next.filter((row) => row.quantity > 0n);
};

export function genesis({seriesId = 'aa'.repeat(32)} = {}) {
  return {
    rail: RAIL,
    seriesId: hex32(seriesId, 'seriesId'),
    seriesName: SERIES_NAME,
    lockedSompi: 0n,
    units: [],
    sponsorFeesPaid: 0n,
    freezeSwitch: false,
    issuer: null,
  };
}

export function inspect(state) {
  const circ = circulating(state);
  return {
    rail: RAIL,
    network: NETWORK,
    seriesId: state.seriesId,
    seriesName: SERIES_NAME,
    lockedSompi: state.lockedSompi,
    circulating: circ,
    backedOneToOne: circ === state.lockedSompi,
    oracle: 'none',
    freezeSwitch: false,
    canIssuerHalt: false,
    sponsorFeesPaid: state.sponsorFeesPaid,
    units: copyUnits(state.units),
    warning: 'RECEIPT. ONE UNIT = ONE LOCKED SOMPI. NOT USD. NOT tPEG. NO FREEZE SWITCH.',
  };
}

export function lock(state, {owner, sompi, sponsorFee = SPONSOR_FEE}) {
  const qty = u(sompi, {label: 'lock'});
  const fee = u(sponsorFee, {min: 1n, max: MAX_FEE, label: 'sponsorFee'});
  if (state.lockedSompi + qty > MAX_SOMPI) throw new NativeError('OVER_CAP', 'Backing cap is 10 tKAS.');
  return {
    state: {
      ...state,
      lockedSompi: state.lockedSompi + qty,
      units: [...copyUnits(state.units), {owner: hex32(owner, 'owner'), quantity: qty}],
      sponsorFeesPaid: state.sponsorFeesPaid + fee,
    },
    locked: qty,
    fee,
  };
}

export function transfer(state, {from, to, quantity}) {
  const qty = u(quantity, {label: 'transfer'});
  const src = hex32(from, 'from');
  const dst = hex32(to, 'to');
  if (src === dst) throw new NativeError('SELF', 'Transfer to self is not a move.');
  const rest = take(state.units, src, qty);
  return {
    state: {
      ...state,
      units: [...rest, {owner: dst, quantity: qty}],
    },
    moved: qty,
  };
}

export function redeem(state, {holder, quantity, sponsorFee = SPONSOR_FEE}) {
  const qty = u(quantity, {label: 'redeem'});
  const fee = u(sponsorFee, {min: 1n, max: MAX_FEE, label: 'sponsorFee'});
  const owner = hex32(holder, 'holder');
  const rest = take(state.units, owner, qty);
  return {
    state: {
      ...state,
      lockedSompi: state.lockedSompi - qty,
      units: rest,
      sponsorFeesPaid: state.sponsorFeesPaid + fee,
    },
    released: qty,
    fee,
  };
}

export function freeze(_state, _who) {
  throw new NativeError('NO_FREEZE', 'Native PoW rail has no issuer freeze switch.');
}

export function destroy(_state, _who) {
  throw new NativeError('NO_DESTROY', 'Native PoW rail cannot destroy a holder balance.');
}

export function skimPrincipal(_state, _args) {
  throw new NativeError('SKIM', 'Sponsor pays fees. Principal is not a fee source.');
}

export function balanceOf(state, owner) {
  const id = hex32(owner, 'owner');
  return state.units.filter((x) => x.owner === id).reduce((n, x) => n + x.quantity, 0n);
}
