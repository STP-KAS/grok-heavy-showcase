import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {runFreezeLab} from '../src/freeze-lab.mjs';
import {runDepegLab} from '../src/depeg-lab.mjs';
import {route, assertHonestPitch} from '../src/best-practice.mjs';

describe('freeze lab', () => {
  it('native redeems after the issuer freezes the guest', () => {
    const lab = runFreezeLab();
    assert.equal(lab.verdict.nativeRedeemOk, true);
    assert.equal(lab.verdict.guestMoveOk, false);
    assert.equal(lab.verdict.guestBlocked, true);
    assert.equal(lab.verdict.neverGas, true);
    assert.equal(lab.dedication, 'my heart goes out to you');
    assert.equal(lab.steps.length, 9);
  });
});

describe('depeg classroom', () => {
  it('three prices disagree after a tiny trade', () => {
    const lab = runDepegLab();
    assert.equal(lab.before.threePricesAgree, true);
    assert.equal(lab.after.threePricesAgree, false);
    assert.ok(lab.after.depegBps > 0n);
    assert.match(lab.warning, /WILL DEPEG/);
  });
});

describe('best practice router', () => {
  it('keeps dapp unit, gas, and 402 on the native rail', () => {
    assert.equal(route({useCase: 'dapp_unit'}).rail, 'native');
    assert.equal(route({useCase: 'miner_fee'}).allowed, true);
    assert.equal(route({useCase: 'usdt_as_gas'}).allowed, false);
    assert.equal(route({useCase: 'usdt_as_dapp_unit'}).allowed, false);
    assert.equal(route({useCase: 'merchant_usdt_guest'}).allowed, true);
    assert.equal(route({useCase: 'tpeg_as_money'}).allowed, false);
  });

  it('rejects a mixed-up pitch', () => {
    const bad = assertHonestPitch({
      tpegIsMoney: true,
      usdtIsGas: true,
      receiptIsUsd: true,
      kaspaHasNoFreezeBecauseBridged: true,
    });
    assert.equal(bad.honest, false);
    assert.ok(bad.fails.length >= 4);
    const good = assertHonestPitch({});
    assert.equal(good.honest, true);
    assert.equal(good.law.length, 7);
  });
});
