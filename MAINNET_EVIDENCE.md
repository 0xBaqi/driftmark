# Mainnet evidence index

Prepared 2026-10-06 from retained local scripts, captures and the historical DEVEX journal only. No transaction, signature, paid request or fresh wallet query was performed. Chain: **BNB Smart Chain mainnet, chain ID 56 (eip155:56)**. Demo balances are not current wallet balances.

## Classification and provenance

|Item|Classification|Retained evidence and limits|
|-|-|-|
|Historical x402 rejection response|LIVE PROVEN|Both privately retained x402-paid-response.json and x402-paid-u-response.json contain payment\_rejected; corresponding retained response headers report HTTP 402. This proves rejection responses only, not settlement, signing provenance or a balance reconciliation.|
|x402 USDC/Permit2 and U/EIP-3009 integration|BLOCKED/DOCUMENTED|Journal reports signing followed by rejection and approximately 0.399875 authorization quota after four attempts. Quota is not settled spend; no successful payment is proven.|
|Address-book transfer|BLOCKED/DOCUMENTED|Journal reports 0.1 U blocked with code 351703 before movement. No independent retained primary response found; the historical event remains journal-only.|
|6 USDC â†’ NVDAB purchase|LIVE PROVEN â€” ON-CHAIN |BSC mainnet swap transaction `0x074345b7d4aa31831007abc9d58795c8c40c38e9ea5419152ba9c91c17fcdfe7` succeeded in block `126039587` on 2026-10-06 at 09:54:38 UTC. BscScan shows 6 USDC entering the Binance DEX Router route and `0.024940642253004837` NVIDIA Corp (NVDAB) transferred from the Binance DEX Router to the wallet. NVDAB contract: `0x02fca66c1d1afb4e2a7884261eb00f63598a7436`. This proves the BSC mainnet tokenized-stock purchase; it does not by itself prove which wallet client initiated the transaction. |
|Approval and swap legs / gas|LIVE PROVEN â€” ON-CHAIN |USDC approval transaction `0xf2ccd46980886c0128c34ac734aeb35fcf9886130fa479e9871e0407cd96c993` succeeded in block `126039587`, approving USDC for the Binance DEX Router, with transaction fee `0.000004225101685440 BNB`. The subsequent successful swap transaction `0x074345b7d4aa31831007abc9d58795c8c40c38e9ea5419152ba9c91c17fcdfe7` interacted with the Binance DEX Router and had transaction fee `0.000040905820731112 BNB`. Combined on-chain transaction fees: `0.000045130922416552 BNB`.|
|0.25 USDC â†’ U conversion|NOT PROVEN|Journal reports success and a subsequent 0.250200161469125604 U snapshot. No transaction hash, timestamp or verified conversion delta found. Conversion is not service expense.|
|Agentic Wallet execution provenance|NOT PROVEN|Journal attributes the purchase and wallet operations to Agentic Wallet. No retained tool receipt linking a wallet action/order to a transaction hash was located. On-chain activity alone would not prove which wallet tool executed it.|
|Discovery, normalization, pricing, route and $5 minimum|NOT PROVEN|Reproducible read-only script inputs and journal observations are retained; scripts alone do not prove historical successful responses. quote-nvdaon.mjs currently quotes NVDAB â†’ USDT despite its historical name. No experiments rerun in this pass.|
|Recovery, owner pause, verification and failure replay|DETERMINISTIC DEMO|app/core/story.mjs and tests/story.test.mjs. Default replay: $37.20 â†’ $26 after $11.20 expense â†’ $31 after $5 simulated adjustment; $70 â†’ $65 NVIDIA. Policy WATCH, outcome Recovery verified. Transaction hash is null. Both failure replays preserve balances and settle $0.|
|Live recovery, successful x402 self-funding, autonomous runtime, Agent Studio, current balances|NOT PROVEN|Not implemented/verified by this static fixture app.|

## Token addresses retained in source

These identify script/capture inputs, not proof of a trade, issuer authenticity or fresh contract validation.

|Asset|BSC address|Source|
|-|-|-|
|bStocks NVDAB|0x02fca66c1d1afb4e2a7884261eb00f63598a7436|token-decimals.mjs; quote-nvdaon.mjs input|
|Ondo NVDAon|0xa9ee28c80f960b889dfbd1902055218cba016f75|token-decimals.mjs|
|USDT|0x55d398326f99059ff775485246999027b3197955|quote-nvdaon.mjs output asset|
|USDC|0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d|Retained x402 payment offer; does not identify the purchase input receipt|
|U|0xcE24439F2D9C6a2289F741120FE202248B666666|Historical x402 payment offer / operating-reserve experiment input|

## Sanitized capture record

Retained private response bodies x402-paid-response.json and x402-paid-u-response.json have identical SHA-256: bbe671b3b57c01d8c9d56571c95a1e73cd0123b92bb7964c93138006b5d3d6a3. Sanitized finding: payment\_rejected. The identical bodies do not independently establish the asset used or Agentic Wallet signing provenance. Raw captures/headers are intentionally excluded because they may contain reusable payment authorization or session material. A checksum supports local traceability, not independent public verification.

## Missing historical records for the builder

Recover already-existing approval, purchase and conversion transaction hashes/receipts, timestamps, token transfer amounts, gasUsed and effectiveGasPrice, plus sanitized wallet-tool records if available. Link those exact hashes to BscScan only after matching retained evidence. Gas in BNB = gasUsed Ã— effectiveGasPrice / 10^18, summed across the relevant legs; do not infer it from the remaining balance. No hashes or gas totals are invented here, and no new transaction is needed to fill these historical gaps.

The builder must write the final DevEx report firsthand. [DEVEX.md](DEVEX.md) remains a historical journal/raw evidence source, not an AI-authored final submission.
