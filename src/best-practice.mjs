// Dual-rail best practice for Kaspa.
// Desk law from kaspa-master-file + Ishum + PegLab + Parker + Gramlane.
// Executable so tests can fail a mixed-up pitch.

export const SPECIES = {
  parker: {
    name: 'Parker receipt',
    repo: 'https://github.com/parker2017code/kaspa-explained',
    unit: '1 locked sompi',
    dollarClaim: false,
    freezeSwitch: false,
    niche: 'The unit. Redemption is the product.',
  },
  peglab: {
    name: 'PegLab classroom',
    repo: 'https://github.com/STP-KAS/peglab-stp',
    unit: 'tPEG vs admin oracle vs 2 tKAS pool',
    dollarClaim: false,
    freezeSwitch: true, // admin oracle is a key
    niche: 'The warning. WILL DEPEG.',
  },
  ishum: {
    name: 'Ishum till',
    repo: 'https://github.com/STP-KAS/ishum',
    unit: 'EUR/USD keypad, KAS settlement',
    dollarClaim: false,
    freezeSwitch: false,
    niche: 'The counter. Quotes fiat. Settles native. Desk holds 0 keys.',
  },
  gramlane: {
    name: 'Gramlane',
    repo: 'https://github.com/STP-KAS/gramlane',
    unit: 'prepaid KIP-21 grams',
    dollarClaim: false,
    freezeSwitch: false,
    niche: 'The sequencer bill. Fill once. Wallet stays closed. Not a dollar.',
  },
  x402: {
    name: 'kaspa-x402',
    repo: 'https://github.com/elldeeone/kaspa-x402',
    unit: 'native KAS in x402 v2 envelope',
    dollarClaim: false,
    freezeSwitch: false,
    niche: 'The machine call. Bind this envelope. TN10 only. Not v1. Not mainnet.',
  },
  tetherGuest: {
    name: 'USDT on Kaspa (guest)',
    repo: 'https://x.com/kasplex/status/2028901724279464187',
    unit: 'Tether IOU bridged Kasplex-class',
    dollarClaim: true,
    freezeSwitch: true,
    niche: 'Liquidity guest. Label freeze. Never gas. Never dapp unit.',
  },
  onek: {
    name: '1kUSD research',
    repo: 'https://github.com/NeaBouli/1kUSD',
    unit: 'collateralized USD-target, PSM, no CDP',
    dollarClaim: true,
    freezeSwitch: 'research',
    niche: 'Serious research. Mock oracle. No audit. No mainnet. Do not race it with a thinner copy.',
  },
};

const ROUTES = {
  dapp_unit: {
    rail: 'native',
    allowed: true,
    reason: 'A dapp unit of account that an issuer can freeze is a kill switch on the app.',
  },
  miner_fee: {
    rail: 'native',
    allowed: true,
    reason: 'Miner security budget must not sit under Tether policy. Fee asset is KAS.',
  },
  x402: {
    rail: 'native',
    allowed: true,
    reason: 'kaspa-x402 binds native KAS. A future stable needs its own binding. Do not weld USDT into this envelope.',
  },
  sequencing: {
    rail: 'gramlane',
    allowed: true,
    reason: 'Prepaid grams. Wallet stays closed. Grams are mass, not a dollar.',
  },
  classroom: {
    rail: 'peglab',
    allowed: true,
    reason: 'Teach the depeg. Do not list tPEG as money.',
  },
  merchant_quote: {
    rail: 'display-fiat',
    allowed: true,
    reason: 'Keypad is EUR/USD. Settlement that exists is native KAS. Honest FX banner.',
  },
  merchant_usdt_guest: {
    rail: 'tether-guest',
    allowed: true,
    labelled: true,
    reason: 'Guest IOU for merchants who need dollar inventory today. Freeze UX required. Not gas.',
  },
  kusd_reserved: {
    rail: 'reserved',
    allowed: false,
    reason: 'kUSD is a chair. No reserves, no collateral, no issuer. Keep it off the keypad.',
  },
  tpeg_as_money: {
    rail: 'peglab',
    allowed: false,
    reason: 'tPEG WILL DEPEG. Raising against it is how people get hurt.',
  },
  usdt_as_gas: {
    rail: 'tether-guest',
    allowed: false,
    reason: 'Tether-as-gas puts a freeze-capable issuer under miners. Refused.',
  },
  usdt_as_dapp_unit: {
    rail: 'tether-guest',
    allowed: false,
    reason: 'Skip centralised stablecoins for dapps. Master file pin.',
  },
};

export function route({useCase}) {
  const row = ROUTES[useCase];
  if (!row) {
    return {
      useCase,
      allowed: false,
      rail: null,
      reason: 'Unknown use case. Name the job before picking a rail.',
    };
  }
  return {useCase, ...row};
}

export function assertHonestPitch(pitch) {
  const fails = [];
  if (pitch.tpegIsMoney) fails.push('tPEG is a classroom, not money.');
  if (pitch.usdtIsGas) fails.push('USDT is never gas.');
  if (pitch.usdtIsDappUnit) fails.push('USDT is never the dapp unit of account.');
  if (pitch.gramsAreDollar) fails.push('Grams are KIP-21 mass, not $1.');
  if (pitch.x402IsHttp402) fails.push('HTTP 402 is not x402. Bind elldeeone/kaspa-x402.');
  if (pitch.peglabMainnet) fails.push('PegLab does not go to mainnet as money.');
  if (pitch.receiptIsUsd) fails.push('1 sompi receipt is not USD.');
  if (pitch.onekusdIsProduction) fails.push('1kUSD is research, not production.');
  if (pitch.kaspaHasNoFreezeBecauseBridged) {
    fails.push('Bridging USDT onto Kaspa does not remove the issuer freeze. It imports it.');
  }
  return {
    honest: fails.length === 0,
    fails,
    law: [
      'Parker has the unit.',
      'PegLab has the warning.',
      'Ishum has the pocket.',
      'Gramlane has the sequencer bill.',
      'kaspa-x402 has the machine envelope.',
      'USDT on Kaspa is a labelled guest.',
      'Do not mix them.',
    ],
  };
}

export const WHY_POW = {
  bitcoin: 'Bitcoin has run since 2009 with no issuer kill switch. Seizure requires keys or exchange custody, not a contract function. That is the test Tether does not take.',
  kaspa: 'Kaspa kept proof of work, fair launch, UTXO, no premine. Crescendo made it 10 blocks per second. Toccata made spend rules live. The freeze switch is still absent on native KAS.',
  tether: 'USDT contracts expose addBlackList and destroyBlackFunds. One key. 2026 record: thousands of wallets frozen, over a billion destroyed. Centralised stables can be shut, frozen, or redirected by the issuer under law-enforcement and policy pressure.',
  dualRail: 'Use both, honestly. Native rail for promises that must survive a freeze. Guest USDT for dollar inventory, labelled, never as gas.',
};
