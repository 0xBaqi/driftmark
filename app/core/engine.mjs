// All monetary calculations use integer USD micro-units. Token amounts stay in native base units.
export const USD=1000000n;
export const money=n=>'$'+(Number(n)/Number(USD)).toFixed(2);
export const days=(reserve,burn)=>burn>0n?Number((reserve*100n+burn/2n)/burn)/100:0;
export const initial=()=>({reserve:37200000n,equity:70000000n,gas:958310243020398n,burn:3000000n});
export const defaultMandate=()=>({floor:10,max:10000000n,minEquityBps:5000n,approval:false,auditAcknowledged:true});
export function decide(state,mandate,quote={minimum:5000000n,net:5000000n,sell:5000000n,valid:true}){
 const required=state.burn*BigInt(mandate.floor)>state.reserve?state.burn*BigInt(mandate.floor)-state.reserve:0n;
 const base={required,minimum:quote.minimum,adjustment:0n,quote,state:'HEALTHY',reason:'Atlas can operate within its mandate.'};
 if(!required)return {...base,state:days(state.reserve,state.burn)<mandate.floor+2?'WATCH':'HEALTHY'};
 const adjustment=required>quote.minimum?required:quote.minimum;
 if(!quote.valid||state.gas<=0n)return {...base,adjustment,state:'BLOCKED',reason:'A valid executable quote and BNB execution reserve are required.'};
 if(!mandate.auditAcknowledged)return {...base,adjustment,state:'NEEDS OWNER',reason:'NVDAB audit coverage is unavailable. Owner acknowledgement required.'};
 if(adjustment>mandate.max||quote.sell>mandate.max||mandate.approval)return {...base,adjustment,state:'NEEDS OWNER',reason:mandate.approval?'Owner approval is required before a stock sale.':`${money(adjustment>quote.sell?adjustment:quote.sell)} is needed; the autonomous limit is ${money(mandate.max)}.`};
 if(quote.sell<adjustment||quote.net<required)return {...base,adjustment,state:'BLOCKED',reason:'The executable quote does not restore the runway floor. Refresh the quote.'};
 const afterEquity=state.equity-quote.sell,afterReserve=state.reserve+quote.net;
 if(afterEquity<0n||afterEquity*10000n<(afterEquity+afterReserve)*mandate.minEquityBps)return {...base,adjustment,state:'NEEDS OWNER',reason:'Recovery would breach the minimum NVIDIA allocation.'};
 return {...base,adjustment,state:'ACTION REQUIRED',reason:`Move ${money(quote.sell)} of NVIDIA exposure into operating liquidity.`};
}
export function verify(before,after,quote,evidence){return evidence.historyConfirmed&&evidence.swapConfirmed&&after.reserve-before.reserve===quote.net&&before.equity-after.equity===quote.sell;}
export const serialize=value=>JSON.stringify(value,(_,v)=>typeof v==='bigint'?v.toString():v,2);
export const m0={fixture:true,current:false,balances:{USDC:'5.77720879',U:'0.250200161469125604',NVDAB:'0.024940642253004837',BNB:'0.000958310243020398'},representations:[{asset:'NVDA',symbol:'NVDAB',provider:'bStocks',decimals:18},{asset:'NVDA',symbol:'NVDAon',provider:'Ondo',decimals:18}],ratio:'Fetch token/share ratio; never assume 1:1'};
