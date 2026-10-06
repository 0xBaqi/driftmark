# DRIFTMARK DevEx journal

## Evidence policy

M0 findings below come from the supplied project handoff and locally retained scripts/captures. They are historical observations, not freshly re-executed claims. M1 behavior is explicitly simulated. No fabricated transaction hashes, settlement success, Agent Studio integration, or live balances.

## M0 — infrastructure findings

| Integration / finding | Observed outcome | Product consequence |
| --- | --- | --- |
| Binance RWA authentication | Successful when `/build` is included in the signed canonical path | Keep URL/signature construction aligned, including query string |
| NVIDIA discovery | Ondo NVDAon and bStocks NVDAB on BSC | Separate underlying NVDA from provider/token representation |
| Pricing and decimals | Pricing works; both representations use 18 decimals | Store native base units; normalize using actual token/share ratio |
| Economic equivalence | Ratios are not exactly one token per share | Reference valuation and executable liquidation value must remain distinct |
| Token audit | NVDAB unsupported by Binance audit skill | Fail closed or require explicit owner acknowledgement; unsupported is not safe |
| RWA liquidation | Tested quote route had a $5 minimum | Choose an executable adjustment within mandate; minimum is historical, not universal |
| Route discovery | NVDAon → NVDAB → USDT; NVDAB → USDT direct | Record actual route and approved final payment asset; USDT is not automatically USDC/U |
| Agentic Wallet purchase | 6 USDC → NVDAB executed after BNB funding | Execution reserve is separate; spot BSC mainnet execution was demonstrated in M0 |
| Post-trade verification | Order list by orderId was empty despite confirmed execution | Require transaction history plus balances; approval/swap may be separate legs |
| Reserve composition | 0.25 USDC → U succeeded | Reserve conversion is not an expense |
| x402 / USDC Permit2 | READY_TO_SIGN, signing succeeded, HTTP 402 payment_rejected | BLOCKED, no settled payment; authorization is not settlement |
| x402 / U EIP-3009 | READY_TO_SIGN, signing succeeded, HTTP 402 payment_rejected | BLOCKED, not a working integration |
| x402 quota | Approximately 0.399875 after four ~$0.10 authorizations, no settlement | Authorization budget may be consumed independently of financial runway; avoid automatic retry |
| Transfer #015A | 0.1 U blocked with code 351703; recipient absent from wallet address book | BLOCKED_BY_WALLET_POLICY, zero funds moved; never claim expense settled |

Historical wallet fixture only: 5.77720879 USDC; 0.250200161469125604 U; 0.024940642253004837 NVDAB; 0.000958310243020398 BNB. This is not a current production balance. A $5 liquidation in this tiny wallet cannot be represented as preserving a 50–70% equity mandate.

## M1 — 2026-10-06

Inspected the existing project before edits. It was an experiment folder without Git history or an application package. Preserved root scripts/results. Backed up original scripts privately, replaced literal credentials with environment lookups, and ignored `.env`, private backups, and raw x402 captures. No secret values were printed intentionally or committed.

Implemented a desktop-first responsive web/PWA using native modules and CSS, avoiding a build dependency where no framework existed. Runway, Mandate, Activity are primary. A separate operating/investment/execution reserve model prevents gas or reserve conversions from inflating service spend.

Decision engine uses BigInt micro-USD for fixture economics. Recovery uses fixture net proceeds, not reference price. Seven initial tests cover 12.4-day baseline, minimum execution sizing, owner cap, insufficient net proceeds, tiny-wallet allocation breach, audit/gas gating, and separate settlement evidence.

Signature recovery: explicit $30 reserve + $70 equity fixture; $4 expense; 8.67 days; $5 minimum adjustment; simulated approval/swap; history/balance fixture verification; $31 reserve, 10.33 days, WATCH. Failure stories animate authorization/request → policy/settlement block with $0 spend. Technical receipts identify the fixture, assumptions, legs, and missing live transaction evidence.

## Integration backlog / honest boundaries

- Fresh mainnet balances and normalized underlying exposure; timestamp and freshness checks.
- Quote approval for an actually approved operating asset, including fees, minimum output, route, expiry and slippage.
- Server-side execution with limits, explicit audit acknowledgement, durable idempotency and permissions.
- Independent history and balance reconciliation; submitted or approved is never settled.
- Real x402 remains BLOCKED until provider settlement and quota behavior are resolved.
- Real funding/onboarding, persistent mandates, authorization budget model and owner approval workflow.
- Public repository and HTTPS deployment destination not supplied; local preview is not a public submission.
- Agent Studio only if a technically real role emerges.
## M1 validation

Nine engine tests pass, including rounding and a quote whose actual sell amount exceeds the autonomous cap. Browser checks confirmed: recovery ends at 10.33 days/$31 reserve/$65 equity; x402 and address-book failures show $0 spent with reserve unchanged; $15 recovery versus $10 cap yields NEEDS OWNER; local onboarding creates Atlas. Mobile layout checked at a narrow viewport with equal document/client widths (no horizontal overflow). Browser error log was empty. Native OS PWA installation and offline relaunch were not exercised.

## Public release — 2026-10-06

Prepared a fresh sanitized Git history for 0xBaqi/driftmark. The initial commit contains 24 allowlisted files, including useful environment-configured M0 scripts, tests, documentation, and static-hosting configuration. No original credential-bearing scripts, environment values, signed x402 captures, session data, local agent skills or deployment sessions are included. Checked committed blobs against the known M0 credential values and verified the committed file list against the scanned allowlist.

Deployed the static judge-facing shell to https://driftmark-chi.vercel.app in Vercel production. Anonymous root and module requests return 200; .env, original experiment paths, x402 paid-response and private backup paths return 404. The public demo remains explicitly simulated. No live financial execution was enabled.
