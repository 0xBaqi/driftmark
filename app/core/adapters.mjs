// Server-side adapter contracts. No credentials or live signing in the product shell.
export class UnconfiguredAdapter { async run(){throw new Error('BLOCKED: live adapter is not configured');} }
export const adapters={rwaData:new UnconfiguredAdapter(),marketQuote:new UnconfiguredAdapter(),agenticWallet:new UnconfiguredAdapter(),walletVerification:new UnconfiguredAdapter(),x402:new UnconfiguredAdapter()};
// rwaData: underlying asset, representation, decimals, timestamp, token/share ratio.
// marketQuote: native sell amount, approved output asset, min output, fee, expiry, chain=56.
// agenticWallet: separately record approval and swap legs; never infer settlement.
// walletVerification: corroborate transaction history and balance deltas.
// x402: authorization and settlement are separate; rejected settlement has zero spent.
