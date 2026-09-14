# Why not only Tether

Short form of the freeze argument. Numbers are public-record snapshots, dated. Recheck before quoting as live.

## What Tether can do

USDT is an issuer contract. Two functions matter:

- `addBlackList` — the address can no longer send
- `destroyBlackFunds` — a frozen balance can be deleted

One key. No holder override. Self-custody of USDT does not remove issuer risk; it only removes exchange-custody risk.

## 2026 public record (sampled 14 Sep 2026)

| Measure | Figure | Source |
| --- | --- | --- |
| Wallets frozen or seized (wider tracker) | 11,517 | [eaglevirtual.com/usdt-blacklist](https://eaglevirtual.com/usdt-blacklist) |
| Freeze events ETH+Tron to 12 Aug 2026 | 11,085 events / 11,045 addresses | [Bitquery freeze regime](https://bitquery.io/investigations/tether-blacklist-audit) |
| Value at the moment of freeze (ETH+Tron) | $5.85B | Bitquery, 13 Aug 2026 |
| Balances destroyed | 2,434 addresses, $1.43B USDT | Bitquery |
| 2025 unfreeze rate | 3.6% | [EMM Legal](https://www.emmlegal.com/news/recover-frozen-usdt-a-guide-to-tether-wallet-freezes/) / BlockSec |
| 2025 destroy share of freeze value | 55.6% | BlockSec |
| OFAC designated addresses frozen | 80/80 ETH, 100/100 Tron | Bitquery |
| Single 2026 OFAC-linked freeze | $344M, April 2026 | Tether / OFAC reporting |

Trackers disagree on chain coverage (ETH+Tron vs 39 chains). The direction does not: the switch is used, often, and destruction is a Tether practice.

## What “landed on Kaspa” does not fix

Kasplex, 3 Mar 2026: a stablecoin bridge on Kaspa following Circle and Tether standards, BNB Smart Chain first, TRC20/ERC20 planned. Zealous Swap reported USDC and USDT live on Kasplex L2 the same day.

That is **useful liquidity**. It is also **issuer + bridge**.

- Freeze on the source contract still applies to the bridged inventory if the bridge honours issuer policy.
- Bridge operator risk is extra, not instead.
- Kaspa GHOSTDAG still orders the guest. It does not become the issuer.

Ishum already split this: USDT in does not un-decentralise Kaspa. It imports a king into the money people use. The till must label that.

## What proof of work actually resists

Bitcoin (3 Jan 2009 → this date) has no `addBlackList`. A government can lean on exchanges, miners, developers, and people. It cannot call a function that zeros a UTXO. That is the test. It has held.

Kaspa kept:

- proof of work (kHeavyHash)
- UTXO
- fair launch, no premine, no ICO
- no central issuer

Crescendo (10 BPS) and Toccata (covenants) made it fast and programmable. They did not add an issuer key to native KAS.

A covenant can lock *your* coins to a rule. That is not the same as a company blacklisting *anyone's* coins.

## Dual rail, not a purity contest

Refusing all dollar inventory is how shops stay on Telegram invoices. Hosting only USDT is how a dapp dies on freeze day.

Best practice:

1. Quote EUR/USD on the keypad (Ishum).
2. Settle native KAS / 1-sompi receipt whenever the promise must survive.
3. Offer USDT as a **guest**, labelled, freeze-checked.
4. Never USDT as gas, never as the dapp unit, never as the x402 asset.
5. Keep PegLab as the class that depegs, so nobody ships a 2 tKAS pool as money.

The freeze lab in this repo runs that story with integers. Native redeem succeeds after the issuer freeze. Guest transfer fails. `useAsGas()` throws `NEVER_GAS`.
