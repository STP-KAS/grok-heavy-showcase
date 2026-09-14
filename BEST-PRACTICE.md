# Kaspa dual-rail best practice

**Not Kaspa core. Not a dollar. Not a token sale.**  
Desk law, made executable in `src/best-practice.mjs`. Freeze: 14 Sep 2026.

> my heart goes out to you

Parker has the unit. PegLab has the warning. Ishum has the pocket. Gramlane has the sequencer bill. kaspa-x402 has the machine envelope. USDT on Kaspa is a labelled guest. **Do not mix them.**

---

## The job

Kaspa is proof-of-work cash with spend rules live (Toccata, 30 Jun 2026) and 10 blocks per second (Crescendo, 5 May 2025). Merchants still quote euros. Dapps still need a unit that cannot be switched off. Liquidity still lives in Tether.

The useful answer is **two rails**, labelled:

| Rail | What it is | Freeze switch | Use |
| --- | --- | --- | --- |
| **N · native** | KAS + 1-sompi receipt (Parker) + grams (Gramlane) | No | Dapp unit, miner fee, x402, sequencing, anything that must survive an issuer |
| **T · Tether guest** | USDT bridged onto Kaspa (Kasplex-class, BNB Smart Chain launch 3 Mar 2026) | Yes (`addBlackList`, `destroyBlackFunds`) | Merchant dollar inventory, labelled. Never gas. Never dapp unit |

A third object exists only as school: **PegLab tPEG**. Tiny pool. Admin oracle. **WILL DEPEG.** Keep it.

---

## Why an alternative to Tether is not optional

Tether is useful. It is also a company with a contract key.

- The USDT contract can freeze an address and destroy the frozen balance. The holder has no override.
- Public 2026 record (Ethereum + Tron and wider trackers): **11k+ wallets** frozen or seized, **~$5.6–5.8B** immobilised at freeze, **~$1.43B** destroyed, **3.6%** 2025 unfreeze rate, **100%** of OFAC-designated addresses hit. Sources: [SOURCES.md](SOURCES.md).
- Bridging USDT onto Kaspa does **not** remove that key. Kasplex said the bridge follows Circle and Tether standards. The unit remains Tether policy. Kaspa only sequences the guest.
- If USDT were the fee asset, a freeze would halt the till and starve miners. Ishum already refused that. This repo tests it (`NEVER_GAS`).

Proof of work does not have that switch.

- **Bitcoin** has run since January 2009 with no issuer. Seizure requires keys or a custodian, not `addBlackList`. That is the test. It has held to date.
- **Kaspa** kept the same security model: work, UTXO, fair launch, no premine. Native KAS cannot be blacklisted by a company. That is why the native rail exists, even when the keypad quotes EUR.

Use Tether where you need dollar inventory today. Do not let it become the only language the app speaks.

---

## Species (steal, don't flatten)

| Species | Repo | Niche | Not |
| --- | --- | --- | --- |
| Parker receipt | [parker2017code/kaspa-explained](https://github.com/parker2017code/kaspa-explained) | 1 unit = 1 locked sompi. Sponsor pays fees. Name ≠ authenticity. | USD |
| PegLab | [STP-KAS/peglab-stp](https://github.com/STP-KAS/peglab-stp) | Classroom that depegs. 2 tKAS pool. | Money |
| Ishum | [STP-KAS/ishum](https://github.com/STP-KAS/ishum) | Self-hosted till. Quotes EUR. Settles KAS. Desk holds 0 keys. | x402 |
| Gramlane | [STP-KAS/gramlane](https://github.com/STP-KAS/gramlane) | Prepaid grams. Wallet stays closed. HTTP 402 for agents. | A dollar |
| kaspa-x402 | [elldeeone/kaspa-x402](https://github.com/elldeeone/kaspa-x402) `v1.0.0-rc.1` | x402 v2 envelope, native KAS, TN10 only | v1, mainnet, USDT |
| USDT guest | Kasplex bridge, 3 Mar 2026 | Liquidity. Label freeze. | Gas, dapp unit |
| 1kUSD | [NeaBouli/1kUSD](https://github.com/NeaBouli/1kUSD) | Collateralized PSM research, Kaspa-primary ADR | Production |

Cite Parker as **GitHub only**.

---

## Router (executable)

`route({useCase})` in `src/best-practice.mjs`:

| useCase | Allowed | Rail |
| --- | --- | --- |
| `dapp_unit` | yes | native |
| `miner_fee` | yes | native |
| `x402` | yes | native |
| `sequencing` | yes | gramlane |
| `classroom` | yes | peglab |
| `merchant_quote` | yes | display-fiat |
| `merchant_usdt_guest` | yes, labelled | tether-guest |
| `kusd_reserved` | **no** | chair with no capital |
| `tpeg_as_money` | **no** | |
| `usdt_as_gas` | **no** | |
| `usdt_as_dapp_unit` | **no** | |

Honest pitch test: `assertHonestPitch`. A deck that needs PegLab's UI without the WILL DEPEG banner is the bug.

---

## What to ship Monday

1. Keep Ishum a till. Live desk: `http://127.0.0.1:8090/pos`. This showcase till is the lesson on freeze vs PoW.
2. Keep sixpack.wtf the x402 verdict. Do not invent a fourth 402 envelope.
3. Keep PegLab on TN10. Dedicated sponsor, not groks-wallet.
4. Native receipt stays ENGINE_SPEC until a TN10 txid exists. 1 sompi outputs fail KIP-9 storage mass; teaching unit is 1:1 in spec, live floor is larger (kaspa-x402 uses 10,000,000 sompi class).
5. Host USDT only with freeze UX. Never as gas.
6. Do not race 1kUSD with a thinner copy.

Pins: SilverScript **v1.0.0**, rusty-kaspa **v2.0.1**, Toccata **live**, DAGKnight **not shipped**, KCC-20 **Draft**. Referee: [kaspaexplained.com/status](https://kaspaexplained.com/status).
