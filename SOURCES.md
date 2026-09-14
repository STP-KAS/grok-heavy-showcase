# Sources

Sampled **14 Sep 2026**. Recheck live endpoints before quoting as current.

## This desk (prior work)

- [parker2017code/kaspa-explained](https://github.com/parker2017code/kaspa-explained) — receipts, TN10/TN12 evidence, education
- [STP-KAS/peglab-stp](https://github.com/STP-KAS/peglab-stp) — WILL DEPEG classroom, STABLES-GUIDE, BEST.md
- [STP-KAS/ishum](https://github.com/STP-KAS/ishum) — till, three rails, never Tether-as-gas
- [STP-KAS/gramlane](https://github.com/STP-KAS/gramlane) / [gramlanepeglab](https://github.com/STP-KAS/gramlanepeglab) — Darwin scorecard
- [STP-KAS/kaspa-master-file](https://github.com/STP-KAS/kaspa-master-file) — pins, THINK-BIG, skip centralised stables for dapps
- [STP-KAS/grok-heavy-test](https://github.com/STP-KAS/grok-heavy-test) / [sixpack.wtf](https://sixpack.wtf) — kaspa-x402 independent pass
- [STP-KAS/groks-wallet](https://github.com/STP-KAS/groks-wallet) — TN10 node + miner
- [STP-KAS/tn10-hard-test](https://github.com/STP-KAS/tn10-hard-test) — 36-repo hard test

## Kaspa live / law

- [kaspaexplained.com/status](https://kaspaexplained.com/status) — live vs roadmap
- [kaspa.org/features](https://kaspa.org/features) — PoW, fair launch, 10 BPS
- [api.kaspa.org](https://api.kaspa.org/info/blockdag) — mainnet DAG, supply, price, hashrate
- [api-tn10.kaspa.org](https://api-tn10.kaspa.org/info/blockdag) — testnet-10
- Toccata: KIPs 16/17/20/21 Active, DAA 474,165,565 (~30 Jun 2026)
- Crescendo: KIP-14, 10 BPS live 5 May 2025
- SilverScript v1.0.0 (9 Sep 2026, `3ed9733`)
- rusty-kaspa v2.0.1

## Tether freeze record

- [Bitquery, The Tether Freeze Regime](https://bitquery.io/investigations/tether-blacklist-audit) — 13 Aug 2026 on-chain pull, ETH+Tron
- [eaglevirtual USDT blacklist](https://eaglevirtual.com/usdt-blacklist) — 14 Sep 2026 tracker
- [BlockSec USDT blacklist 2026](https://blocksec.com/blog/usdt-blacklist-explained-2026)
- [EMM Legal, challenge a freeze](https://www.emmlegal.com/news/recover-frozen-usdt-a-guide-to-tether-wallet-freezes/)
- [CryptoTicker, blacklist as contract fact](https://cryptoticker.io/en/usdt-blacklist-check-address/)

## Tether on Kaspa

- [Kasplex, 3 Mar 2026](https://x.com/kasplex/status/2028901724279464187) — stablecoin bridge, Circle/Tether standards, BEP20 first
- [Kaspa Daily](https://x.com/DailyKaspa/status/2028924498053878134)
- [Zealous Swap](https://x.com/ZealousSwap) — USDC/USDT live on Kasplex L2 via Kurve
- Igra / Hyperlane / KasKad — USDT/USDC lending on Kaspa L2 (May 2026 reporting)

## Other Kaspa dollar research

- [NeaBouli/1kUSD](https://github.com/NeaBouli/1kUSD) — PSM, no CDP, Kaspa Toccata primary, not production
- [1kUSD site](https://neabouli.github.io/1kUSD/)
- Kash/Djed ([Kash-Protocol/kashd](https://github.com/Kash-Protocol/kashd)) — separate chain experiment, not this desk
- PegLab STABLES-GUIDE: Terra death spiral, Sky PSM, Liquity redemption, GENIUS/MiCA

## Local this pass (14 Sep 2026 evening)

- Mainnet `kaspad` `--listen=0.0.0.0:16111` `--rpclisten=127.0.0.1:16110` `--externalip=81.243.19.34:16111`
- TN10 `kaspad` `--testnet --netsuffix=10` RPC `127.0.0.1:16210`
- Miner `kaspa-miner-v0.2.7` → `kaspatest:qzffl5xy9np46gkttyuftqnv2w04pr8g3wsp7c3vv8se3txtelx6q7c0v0ldx` ua `grokwallet`
- Ishum `127.0.0.1:8090` · sixpack.wtf `127.0.0.1:4020` · PegLab `127.0.0.1:8765`
- This showcase `127.0.0.1:4050`
