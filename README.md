# DRIFTMARK

[Open the judge-facing demo](https://driftmark-chi.vercel.app) · [Public source](https://github.com/0xBaqi/driftmark)

Financial runway for autonomous agents. M1 is a responsive, installable fixture-first web product with a deterministic policy engine. It is not a trading optimizer.

## Run locally

Node.js 20+; no dependency installation required.

```
npm run dev
npm test
```

Open http://localhost:4173. The server serves only `app/`; it cannot serve the root credentials, experiments, or private captures. The app includes a manifest and offline shell. External fonts are optional; local fallback fonts work offline.

## Judge walkthrough

1. Atlas opens at 12.4 days: $37.20 operating reserve, $70 NVIDIA reference exposure, separate BNB execution reserve.
2. Run the recovery story. This explicitly loads a $30 / $70 fixture.
3. A simulated $4 expense leaves $26 and 8.67 days. The $4 shortfall meets a tested $5 route minimum, so the adjustment is $5.
4. Simulated approval and swap legs precede fixture history/balance verification. $31 reserve yields 10.33 days; $65 NVIDIA remains. WATCH means the floor is met with less than two additional days of buffer.
5. Replay x402 or address-book failures: zero settled spend. Review the receipt.
6. Create Atlas to explore a local mandate. Reserve/Balanced/Growth set fixture composition and minimum equity allocation. Reload resets the demo; no wallet is funded and nothing is persisted.

## Architecture

`app/core/engine.mjs` owns fixed-point USD math (BigInt micro-units), threshold decisions, investment allocation, audit acknowledgement, permissions, quote net proceeds, and verification. Native token amounts remain BigInt/base-unit values; M0 decimal strings are evidence only. NVDA is distinct from NVDAB/NVDAon representation; no 1:1 ratio is assumed.

`app/app.mjs` orchestrates fixture state transitions and renders plain-English activity. The receipt exposes observations, trigger, mandate, shortfall, rail minimum, quote assumptions, legs, and verification. Simulated transaction hashes are never invented.

`app/core/adapters.mjs` documents the five integration boundaries and rejects every unconfigured call. No live service is wired. A production server must own credentials, fresh quotes, token/share normalization, payment authorization limits, approved-asset checks, slippage/expiry validation, simulation where available, idempotency, durable receipts, and independent wallet reconciliation before enabling execution. No custom contract or Agent Studio claim.

## M0 preservation and credentials

All original root experiment filenames and captured results remain. Original script bytes are backed up under ignored `work/private-m0/`. Runtime scripts now read `BINANCE_RWA_API_KEY` and `BINANCE_RWA_SECRET_KEY`; local `.env` is ignored. Run a read-only experiment with `node --env-file=.env nvda-price.mjs` on a supporting Node version. Never expose these variables through browser builds.

Raw x402 captures are ignored because signed authorizations and headers can be sensitive. Preserve them privately; publish the redacted DEVEX findings. The original folder had no `.git` directory. Do not publish private backups, .env, or raw payment captures. Rotate embedded credentials before eventual public release if they were shared elsewhere.

## Delivery status

Local M1 shell and deterministic demo: implemented. Mainnet M0 experiments: historical evidence, not fresh queries. Live recovery: not yet integrated or verified. Public repository: https://github.com/0xBaqi/driftmark. Judge-facing Vercel demo: https://driftmark-chi.vercel.app. Anonymous access verified; private experiment paths return 404. GitHub is connected to Vercel for automatic production deployment from main. Static hosting can publish `app/` directly over HTTPS; never publish the entire experiment folder. No new real transfer, trade, or paid authorization was attempted in M1.
