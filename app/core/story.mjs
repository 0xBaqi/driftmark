import {initial, decide, days, verify, money} from './engine.mjs';

// An ordered fixture replay. Each yield is a product checkpoint; the view awaits
// its animation before requesting the next one. No funds or external APIs involved.
export function* recovery(mandate) {
  let state = initial();
  const receipt = {mode:'SIMULATED standard deterministic replay fixture — no live funds', scenario:'recovery', chainId:56,
    mandate:{...mandate}, baseline:{...state}, executionLegs:[], verification:null};
  const frame = (phase, title, detail, extra={}) => ({phase, title, detail, state:{...state}, receipt, ...extra});
  yield frame('ready', 'Atlas is funded to work.', '$37.20 operating reserve · 12.4 days · $70 NVIDIA capital.');
  state.reserve = 26000000n;
  receipt.trigger = {type:'service-expense', amount:11200000n, simulated:true};
  receipt.observed = {...state};
  yield frame('expense', '$11.20 research expense.', `Operating reserve drains to $26.00 (8.67 days). ${days(state.reserve,state.burn)<mandate.floor?'Runway crosses the selected mandate floor.':'The selected mandate floor remains satisfied.'}`);
  const decision = decide(state, mandate);
  receipt.decision = decision;
  if (decision.state !== 'ACTION REQUIRED') {
    yield frame(decision.state === 'NEEDS OWNER' ? 'owner' : decision.state === 'BLOCKED' ? 'blocked' : 'no-adjustment',
      decision.state === 'NEEDS OWNER' ? 'Paused for your authorization.' : decision.state === 'BLOCKED' ? 'Execution stopped. $0 adjusted.' : 'No adjustment needed.', decision.reason, {status:decision.state});
    return;
  }
  yield frame('decision', `${money(decision.required)} needed. ${money(decision.adjustment)} executable.`,
    `The tested rail has a $5 minimum. This is the smallest executable adjustment that restores the floor within your mandate.`);
  receipt.quote = {...decision.quote, source:'deterministic fixture, not live', fees:0, slippageBps:0};
  yield frame('quote', 'Quote checked against your rules.', `${money(decision.quote.sell)} NVIDIA → ${money(decision.quote.net)} operating liquidity. Permission, allocation and execution reserve checked.`);
  receipt.executionLegs = [{type:'approval',status:'simulated-confirmed'},{type:'swap',status:'simulated-confirmed'}];
  yield frame('execute', 'Capital moves with a purpose.', 'Approval and swap simulated. Balances stay unconfirmed until verification.');
  yield frame('verify', 'Verify the result. Not just the decision.', 'Checking swap confirmation, transaction history and both balance changes.');
  const before = {...state};
  const after = {...state, reserve:state.reserve+decision.quote.net, equity:state.equity-decision.quote.sell};
  receipt.verification = {mode:'fixture',historyConfirmed:true,swapConfirmed:true,
    balanceDeltas:{reserve:decision.quote.net,equity:-decision.quote.sell},transactionHash:null};
  if (!verify(before,after,decision.quote,receipt.verification)) {
    yield frame('blocked','Verification failed. Balances unconfirmed.','No restored-runway claim can be made.',{status:'BLOCKED'});
    return;
  }
  state = after;
  receipt.final = {...state, mandateState:decide(state,mandate).state, runway:days(state.reserve,state.burn)};
  receipt.recoveryVerified = true;
  const runway = days(state.reserve,state.burn);
  const detail = `${money(state.reserve)} reserve · ${runway} days · ${money(state.equity)} NVIDIA preserved.`;
  yield frame('restore','Recovery verified in simulation.', detail, {status:receipt.final.mandateState});
  yield frame('complete','Recovery verified', `${detail} The selected ${mandate.floor}-day floor is restored.`, {status:receipt.final.mandateState});
}

export function blockedResult(scenario, state) {
  return {mode:'SIMULATED replay of M0 findings',scenario,before:{...state},after:{...state},spent:0n,
    failure:scenario==='x402'
      ? {http:402,code:'payment_rejected',rails:[{asset:'USDC',authorization:'Permit2',stage:'READY_TO_SIGN / signing'},{asset:'U',authorization:'EIP-3009',stage:'READY_TO_SIGN / signing'}],settlement:'rejected',historicalQuota:'~0.399875 after four authorizations; not settled spend'}
      : {code:351703,reason:'Recipient not in address book',requested:'0.1 U',stage:'blocked before funds moved'},
    verification:{fixtureBalanceUnchanged:true,liveEvidence:'M0 reported no settlement; no fresh wallet query'}};
}
