// PegLab classroom, compressed. Tiny constant-product pool + admin oracle.
// The product is the disagreement of three prices. WILL DEPEG.
// Not USD. Not a token sale. Not the native receipt.

export const WARNING = 'TESTNET TOY. NOT USD. WILL DEPEG.';
export const DEFAULT_ORACLE = 100_000n; // sompi per tPEG
export const POOL_KAS = 200_000_000n; // 2 tKAS
export const POOL_TPEG = 2_000n;

export class DepegError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'DepegError';
    this.code = code;
  }
}

export function genesis() {
  return {
    oracleLive: true,
    oraclePrice: DEFAULT_ORACLE,
    poolTkas: POOL_KAS,
    poolTpeg: POOL_TPEG,
    backing: 1_000_000_000n,
    circulating: 0n,
  };
}

export function inspect(state) {
  const poolPrice = state.poolTpeg === 0n ? null : state.poolTkas / state.poolTpeg;
  let depegBps = null;
  if (state.oracleLive && state.oraclePrice > 0n && poolPrice !== null) {
    const diff = poolPrice > state.oraclePrice ? poolPrice - state.oraclePrice : state.oraclePrice - poolPrice;
    depegBps = (diff * 10_000n) / state.oraclePrice;
  }
  return {
    oraclePrice: state.oraclePrice,
    poolPrice,
    redeemPrice: state.oraclePrice,
    depegBps,
    threePricesAgree: poolPrice === state.oraclePrice,
    cannotDefend: true,
    warning: WARNING,
  };
}

export function setOracle(state, price) {
  const n = typeof price === 'bigint' ? price : BigInt(price);
  if (n <= 0n) throw new DepegError('STALE_ORACLE', 'Oracle is stale or unpriced.');
  return {...state, oraclePrice: n, oracleLive: true};
}

export function sellKas(state, sompiIn) {
  const dx = typeof sompiIn === 'bigint' ? sompiIn : BigInt(sompiIn);
  if (dx <= 0n) throw new DepegError('RANGE', 'Trade must be positive.');
  if (dx >= state.poolTkas) throw new DepegError('POOL', 'Trade would empty the kas side.');
  const k = state.poolTkas * state.poolTpeg;
  const nextKas = state.poolTkas + dx;
  const nextTpeg = k / nextKas;
  const out = state.poolTpeg - nextTpeg;
  if (out <= 0n) throw new DepegError('DUST', 'Trade too small.');
  return {
    state: {
      ...state,
      poolTkas: nextKas,
      poolTpeg: nextTpeg,
    },
    tpegOut: out,
  };
}

export function runDepegLab() {
  let state = genesis();
  const before = inspect(state);
  state = setOracle(state, (DEFAULT_ORACLE * 125n) / 100n); // +25%
  const afterOracle = inspect(state);
  const traded = sellKas(state, 20_000_000n); // 0.2 tKAS already moves the toy
  state = traded.state;
  const after = inspect(state);
  return {
    name: 'peglab-classroom',
    warning: WARNING,
    before,
    afterOracle,
    after,
    trade: {sompiIn: 20_000_000n, tpegOut: traded.tpegOut},
    lesson: 'A 2 tKAS pool is not a peg. Three prices disagree. Do not raise money against tPEG. The unit you would ship is the native receipt.',
  };
}
