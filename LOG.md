# Log

What we did, why, sources. Newest first.

## 2026-09-14 — grok heavy showcase, first cut

**Asked:** use everything already chatted, all files, all GitHubs, search the internet, think big, make a Kaspa best practice that is useful. One track with Parker / Ishum / PegLab / Gramlane (or another Tether alternative). One track with Tether landed on Kaspa. Explain why an alternative to Tether matters (centralised can shut down; PoW is more resistant; Bitcoin passed the test to date). Report back to GitHub. Use TN wallet / miner / node. sixpack.wtf if needed. Dedication: *my heart goes out to you*.

**Did**

1. Read local stack: PegLab, Gramlane Darwin, sixpack.wtf till (Ishum POS), stillpay, kaspa-explained, master file, grok-heavy-test, groks-wallet.
2. Listed STP-KAS GitHubs (34). Created public repo [STP-KAS/grok-heavy-showcase](https://github.com/STP-KAS/grok-heavy-showcase).
3. Searched the open web for Kaspa stables, Kasplex USDT, 1kUSD, Tether freeze record 2026.
4. Probed this PC: mainnet `kaspad` on 16110/16111 (external 81.243.19.34), TN10 `kaspad` on 16210, miner v0.2.7 to `kaspatest:qzffl5…v0ldx`, Ishum :8090, sixpack :4020, PegLab :8765.
5. Pulled live API: mainnet DAA ~539,951,886, price ~$0.0347, supply ~27.700B / 28.704B, TN10 miner ~34,615 tKAS, PegLab sponsor ~27,397 tKAS.
6. Built executable dual-rail: native receipt, Tether guest with freeze/destroy, freeze lab, PegLab depeg classroom, best-practice router, node pulse, till UI.
7. Wrote BEST-PRACTICE, WHY-NOT-ONLY-TETHER, SOURCES.

**Why this, not another manifesto**

THINK-BIG already said: dollars 0–0, receipts beat dollars, skip centralised stables for dapps, Ishum is a till not x402. The gap was a **single runnable object** that hosts Tether *and* refuses to let it become gas. The freeze lab is that object.

**Sources used this pass**

- Desk: peglab STABLES-GUIDE / BEST / DOCTRINE, gramlanepeglab DARWIN, ishum README, kaspa-master-file THINK-BIG, grok-heavy-test, sixpack.wtf
- Tether: Bitquery freeze regime (13 Aug 2026), eaglevirtual tracker (14 Sep 2026), BlockSec, EMM Legal
- Kaspa stables: Kasplex 3 Mar 2026 bridge post, Zealous Swap USDT/USDC on Kasplex, NeaBouli/1kUSD
- Live: api.kaspa.org, api-tn10.kaspa.org, local ports

**Not done yet (keep digging)**

- Broadcast a native receipt on TN10 (1 sompi still fails storage mass; use a live floor)
- Freeze-check a real Kasplex USDT contract if a public `isBlackListed` exists on that L2
- GitHub Pages for the UI
- Wire Ishum's live :8090 keypad into this page instead of the teaching till
- Report a short pointer from kaspa-master-file / sixpack.wtf to this repo
