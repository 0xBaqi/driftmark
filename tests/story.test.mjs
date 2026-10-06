import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,defaultMandate,days} from '../app/core/engine.mjs';
import {recovery,blockedResult} from '../app/core/story.mjs';

test('recovery follows expense, quote, execution and verification before crediting reserve',()=>{
  const frames=[...recovery(defaultMandate())];
  assert.deepEqual(frames.map(f=>f.phase),['ready','expense','decision','quote','execute','verify','restore','complete']);
  assert.equal(days(frames[0].state.reserve,frames[0].state.burn),12.4);
  for(const f of frames.slice(1,6)){assert.equal(f.state.reserve,26000000n);assert.equal(f.state.equity,70000000n);}
  const last=frames.at(-1);
  assert.equal(last.state.reserve,31000000n);assert.equal(last.state.equity,65000000n);
  assert.equal(last.status,'HEALTHY');assert.equal(last.receipt.final.mandateState,'WATCH');
  assert.equal(last.receipt.recoveryVerified,true);assert.equal(last.receipt.trigger.amount,11200000n);
  assert.equal(last.receipt.decision.required,4000000n);assert.equal(last.receipt.decision.adjustment,5000000n);
  assert.equal(last.receipt.verification.transactionHash,null);
});
test('authorization boundary stops recovery before quote or capital movement',()=>{
  for(const mandate of [{...defaultMandate(),approval:true},{...defaultMandate(),max:4000000n},{...defaultMandate(),auditAcknowledged:false}]){
    const frames=[...recovery(mandate)],last=frames.at(-1);
    assert.equal(last.phase,'owner');assert.equal(last.state.reserve,26000000n);assert.equal(last.state.equity,70000000n);
    assert.deepEqual(last.receipt.executionLegs,[]);assert.equal(last.receipt.verification,null);
  }
});
test('a changed mandate cannot produce a false restored-runway claim',()=>{
  const frames=[...recovery({...defaultMandate(),floor:12})];
  assert.equal(frames.at(-1).phase,'blocked');assert.equal(frames.at(-1).receipt.recoveryVerified,undefined);
  assert.equal(frames.at(-1).state.reserve,26000000n);
});
test('a satisfied mandate stops without selling any NVIDIA',()=>{
  const frames=[...recovery({...defaultMandate(),floor:6})];
  assert.equal(frames.at(-1).state.equity,70000000n);assert.deepEqual(frames.at(-1).receipt.executionLegs,[]);
});
test('both blocked findings preserve all balances and report zero settled spend',()=>{
  for(const scenario of ['x402','address']){
    const state=initial(),result=blockedResult(scenario,state);
    assert.deepEqual(result.before,result.after);assert.deepEqual(state,initial());assert.equal(result.spent,0n);
    if(scenario==='x402'){assert.equal(result.failure.code,'payment_rejected');assert.deepEqual(result.failure.rails.map(r=>r.authorization),['Permit2','EIP-3009']);}
    else assert.equal(result.failure.code,351703);
  }
});
