> **Experimental only. Not a product.** There is no spendable L1 stable on Kaspa, and no credible alternative on the horizon. Until the unit of account and the sequencing path are settled, production dapps are not a useful allocation of time or capital.
>
> Do not use wallet integrations on this GitHub. STP remains a clown. [DISCLAIMER.md](DISCLAIMER.md)

# Grok heavy showcase

**Dual-rail Kaspa settlement.** Native proof-of-work receipt versus Tether-on-Kaspa. Executable best practice, freeze lab, till, live node pulse.

Not Kaspa core. Not a dollar. Not a token sale. ENGINE_SPEC until a TN10 txid says otherwise.

> my heart goes out to you

Public: [https://github.com/STP-KAS/grok-heavy-showcase](https://github.com/STP-KAS/grok-heavy-showcase)
Pages: [https://stp-kas.github.io/grok-heavy-showcase/](https://stp-kas.github.io/grok-heavy-showcase/)
Local: [http://127.0.0.1:4050/](http://127.0.0.1:4050/)

## Why this exists

The desk already had the pieces:

- Parker — the unit (1 locked sompi)
- PegLab — the warning (WILL DEPEG)
- Ishum — the pocket (EUR keypad, KAS settlement)
- Gramlane — the sequencer bill (grams, wallet closed)
- sixpack.wtf — the x402 verdict

What was missing was one **working lesson** that puts a freeze-capable dollar next to a PoW rail and lets you feel the difference. This repo is that lesson.

Centralised stables can be frozen and destroyed by the issuer. Bitcoin has no such key and has held that test since 2009. Kaspa inherits it on native KAS. Bridging Tether onto Kaspa is useful liquidity. It is not a replacement for a rail that cannot be switched off.

PoC revisited: [POC-REVISITED.md](POC-REVISITED.md) · BitCoffee review: [STP-KAS/kusdt-bitcoffee](https://github.com/STP-KAS/kusdt-bitcoffee)

Read: [BEST-PRACTICE.md](BEST-PRACTICE.md) · [WHY-NOT-ONLY-TETHER.md](WHY-NOT-ONLY-TETHER.md) · [SOURCES.md](SOURCES.md) · [LOG.md](LOG.md)

## Run

```bash
npm test
npm run lab
npm run pulse
npm run serve
```

Then open:

- [http://127.0.0.1:4050/](http://127.0.0.1:4050/) — rails
- [http://127.0.0.1:4050/lab.html](http://127.0.0.1:4050/lab.html) — freeze lab
- [http://127.0.0.1:4050/till.html](http://127.0.0.1:4050/till.html) — dual-rail till

Sisters on this machine (not GitHub): Ishum `:8090` · sixpack.wtf `:4020` · PegLab `:8765` · mainnet kaspad `:16110` · TN10 kaspad `:16210` · groks-wallet miner.

## What the tests prove

- Native rail: 1:1 backing, **no freeze**, **no destroy**, **no skim**
- Tether guest: freeze blocks transfer, destroy zeros the balance, **never gas**
- Freeze lab: same €2.50 coffee — Alice still redeems after the issuer blacklists the merchant; Bob's USDT does not move
- PegLab classroom: three prices disagree after a 0.2 tKAS trade
- Router: dapp unit / miner fee / x402 stay native; USDT-as-gas and tPEG-as-money are refused

## Honest limits

- Teaching integers, not mainnet money
- 1 sompi on-chain outputs fail KIP-9 storage mass; live floors are larger
- Pulse uses public REST plus a local port scan. Local `127.0.0.1` is this PC
- Tether numbers are dated public-record snapshots, not a live blacklist RPC
- Does not hold keys. Does not ask for a seed. Does not submit transactions

## License

MIT. No warranty.
