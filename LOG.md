# Log

What we did, why, sources. Newest first.

## 2026-09-16 morning — third 10h cap

**Did**

- `:4050` died on the tool runtime cap again. Restarted `node serve.mjs`.
- Mainnet `:16110`, TN10 `:16210`, miner, sixpack `:4020`, PegLab `:8765` still up. Ishum `:8090` still down.
- `npm test` **10/10**.
- Pulse 2026-09-16T02:04Z:
  - mainnet DAA **541,039,860**, KAS/USD **0.03246**
  - TN10 miner **~2,205,959 tKAS** (evening 15 Sep ~1.66M)
  - PegLab sponsor still ~293,973 tKAS

**Why:** same babysit. The miner balance is the continuing PoW argument.

**Sources:** `src/node-probe.mjs`; local ports; `npm test`.

---

## 2026-09-15 evening — second 10h cap, miner still working

**Did**

- `:4050` died on the tool runtime cap again. Restarted `node serve.mjs`.
- Mainnet kaspad `:16110` and TN10 kaspad `:16210` still up. Miner still up. sixpack `:4020` and PegLab `:8765` still up.
- Ishum `:8090` is **down** this pass (was up this morning). Showcase till does not depend on it.
- `npm test` **10/10**. Freeze lab unchanged.
- Pulse 2026-09-15T16:04Z:
  - mainnet DAA **540,679,700**, KAS/USD **0.03315**
  - TN10 miner **~1,656,389 tKAS** (morning ~1.03M)
  - PegLab sponsor **~293,973 tKAS** (was ~274k)

**Why:** keep the public lesson clickable. The miner balance is the overnight proof-of-work argument in numbers.

**Sources:** `src/node-probe.mjs`; local listen ports; `npm test`.

---

## 2026-09-15 morning — server restart after 10h cap

**Did**

- `:4050` died on the tool runtime cap (~10h). Mainnet kaspad, TN10 kaspad, miner, Ishum `:8090`, sixpack `:4020`, PegLab `:8765` were still up. Restarted `node serve.mjs`.
- Re-ran `npm test` **10/10**. Freeze lab verdict unchanged: native redeem after issuer freeze, USDT guest blocked, never-gas.
- Fresh pulse 2026-09-15T06:02Z:
  - mainnet DAA **540,318,504**, KAS/USD **0.03502**, supply ~27.701B
  - TN10 miner `kaspatest:qzffl5…v0ldx` **~1,031,278 tKAS** (was ~360k last night — CPU miner kept working)
  - PegLab sponsor still ~273,973 tKAS
  - both node RPCs up

**Why:** a dead local till is a dead demo. The overnight miner gain is the PoW rail doing what Tether cannot: keep producing without an issuer key.

**Sources:** `src/node-probe.mjs` → api.kaspa.org + api-tn10; local port scan; `npm test`.

---

## 2026-09-14 — Pages live, local till up

**Did**

- Enabled GitHub Pages from `/docs`. Site **200**: https://stp-kas.github.io/grok-heavy-showcase/
- Local `node serve.mjs` on **http://127.0.0.1:4050/** — `/`, `/lab.html`, `/till.html`, `/api/lab`, `/api/pulse` all 200
- `/api/lab` verdict: nativeRedeemOk true, guestBlocked true, neverGas true
- `/api/pulse` live: mainnet DAA 539958420, KAS/USD 0.03486, TN10 miner ~360,513 tKAS, both kaspads up
- Pointer committed on kaspa-master-file: `GROK-HEAVY-SHOWCASE.md`
- Issue #1 + comment

**Why:** a best practice nobody can click is a manifesto. Pages is the public click. :4050 is the live pulse against this PC's node, miner, Ishum, sixpack, PegLab.

**Sources:** GitHub Pages API `status: built`; local HTTP 200s; api.kaspa.org via `/api/pulse`.

---

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
- Freeze-check a real guest USDT contract if a public `isBlackListed` exists
- GitHub Pages for the UI
- Wire Ishum's live :8090 keypad into this page instead of the teaching till
- Report a short pointer from kaspa-master-file / sixpack.wtf to this repo
