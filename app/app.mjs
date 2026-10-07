import {initial,defaultMandate,decide,days,money,serialize,m0} from './core/engine.mjs';
import {recovery,blockedResult} from './core/story.mjs';
const $=s=>document.querySelector(s);
let state=initial(),mandate=defaultMandate(),receipt={},running=false,events=0;
let display={reserve:Number(state.reserve),equity:Number(state.equity)};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const names={ready:'Observe',expense:'Expense',decision:'Decide',quote:'Quote',execute:'Execute',verify:'Verify',restore:'Restore',complete:'Recovery verified','no-adjustment':'No adjustment needed',owner:'Awaiting owner',blocked:'Stopped'};
function statusView(status){
  const key=status.toLowerCase().replaceAll(' ','-');
  if(document.body.dataset.state===key)return;
  document.body.dataset.state=key;
  $('#status').textContent=status;$('#mobile-policy').textContent=status;
  $('#summary').textContent={HEALTHY:'Funded to work. Free to focus.',WATCH:'Within the floor. Less room for surprises.','ACTION REQUIRED':'Below the floor. A recovery is required.',BLOCKED:'Execution stopped. Your capital stays put.','NEEDS OWNER':'Paused at your authorization boundary.'}[status];
  $('#foot-state').textContent={HEALTHY:'Mandate satisfied',WATCH:'Mandate satisfied · narrow buffer','ACTION REQUIRED':'Mandate breached',BLOCKED:'Blocked · $0 moved','NEEDS OWNER':'Owner approval required'}[status];
}
function paint(){
  const runway=display.reserve/Number(state.burn), max=Math.max(20,mandate.floor*1.4);
  $('#days').textContent=runway.toFixed(1);$('#mobile-runway').textContent=runway.toFixed(2)+' days · $'+(display.reserve/1e6).toFixed(2);
  $('#reserve').textContent='$'+(display.reserve/1e6).toFixed(2);
  $('#equity').textContent='$'+(display.equity/1e6).toFixed(2);
  $('#runway-fill').style.width=Math.min(100,runway/max*100)+'%';
  $('#floor-marker').style.left=Math.min(100,mandate.floor/max*100)+'%';
  $('#floor-marker span').textContent=mandate.floor+' DAY FLOOR';
  $('.scale span:last-child').textContent=max.toFixed(0)+' days';
  $('#runway').classList.toggle('breached',runway<mandate.floor);
  $('.operating').style.setProperty('--liquidity',Math.min(100,display.reserve/70000000*100)+'%');
  $('.investment').style.setProperty('--liquidity',Math.min(100,display.equity/100000000*100)+'%');
}
function render(override){
  display={reserve:Number(state.reserve),equity:Number(state.equity)};paint();statusView(override||decide(state,mandate).state);
  $('#mandate-floor').textContent=mandate.floor+' days';$('#mandate-max').textContent=money(mandate.max)+' / action';
  $('#sale-permission').textContent=mandate.approval?'Ask owner before sale':'Within mandate';
  $('#mandate-copy').textContent=`“Keep Atlas funded for at least ${mandate.floor} days. Hold NVIDIA for the long term. Make small adjustments when needed.”`;
  $('#receipt').textContent=serialize(receipt);
}
function event(title,description,icon='↗'){
  events++;const el=document.createElement('div');el.className='event';
  const badge=document.createElement('span');badge.className='event-icon';badge.textContent=icon;
  const body=document.createElement('div'),h=document.createElement('h3'),p=document.createElement('p'),time=document.createElement('time');
  h.textContent=title;p.textContent=description;time.textContent='SIMULATED';body.append(h,p);el.append(badge,body,time);$('#events').prepend(el);$('#activity-count').textContent=String(events).padStart(2,'0');
}
function stage(phase,title,detail){
  document.body.dataset.phase=phase;$('#story-phase').textContent=names[phase]||'Ready';$('#mobile-phase').textContent=names[phase]||'Ready';
  $('.orbit-icon').textContent=phase==='complete'?'✓':phase==='blocked'?'×':phase==='owner'?'Ⅱ':'↗';
  $('#story-title').textContent=title;$('#explanation').textContent=detail;
  const index=['ready','expense','decision','quote','execute','verify','restore','complete'].indexOf(phase);
  document.querySelectorAll('#progress span').forEach((el,i)=>{const order=[0,2,3,4,5][i];el.classList.toggle('done',index>order);el.classList.toggle('current',index===order);if(index===order)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
}
// One completion-driven timeline; reduced motion and hidden tabs finish directly.
function transition(next,duration,status){
  const start={...display},end={reserve:Number(next.reserve),equity:Number(next.equity)};state={...next};
  if(reduced.matches||document.hidden){display=end;paint();statusView(status||decide(state,mandate).state);return Promise.resolve();}
  return new Promise(resolve=>{let began;
    function tick(now){began??=now;const t=Math.min(1,(now-began)/duration),ease=t*t*(3-2*t);
      display={reserve:start.reserve+(end.reserve-start.reserve)*ease,equity:start.equity+(end.equity-start.equity)*ease};paint();
      if(document.body.dataset.phase==='expense')statusView(decide({...state,reserve:BigInt(Math.round(display.reserve))},mandate).state);
      if(t<1&&!reduced.matches&&!document.hidden)requestAnimationFrame(tick);else{display=end;paint();statusView(status||decide(state,mandate).state);resolve();}
    }requestAnimationFrame(tick);
  });
}
async function dwell(duration){
  if(reduced.matches||document.hidden)return;
  const animation=$('#phase-line').animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration,easing:'linear',fill:'forwards'});
  const finish=()=>animation.finish();document.addEventListener('visibilitychange',finish,{once:true});reduced.addEventListener('change',finish,{once:true});
  try{await animation.finished;}finally{animation.cancel();document.removeEventListener('visibilitychange',finish);reduced.removeEventListener('change',finish);}
}
async function transfer(){
  if(reduced.matches||document.hidden)return;
  const from=$('.investment').getBoundingClientRect(),to=$('.operating').getBoundingClientRect(),pulse=$('#transfer');
  const dx=to.left+to.width/2-(from.left+from.width/2),dy=to.top-from.top;
  const animation=pulse.animate([{opacity:0,transform:'translate(-50%,-50%) scale(.85)'},{opacity:1,offset:.15},{opacity:1,offset:.8},{opacity:0,transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(1)`}],{duration:1800,easing:'cubic-bezier(.4,0,.2,1)'});
  const finish=()=>animation.finish();document.addEventListener('visibilitychange',finish,{once:true});reduced.addEventListener('change',finish,{once:true});
  try{await animation.finished;}finally{document.removeEventListener('visibilitychange',finish);reduced.removeEventListener('change',finish);}
}
function reset(){state=initial();receipt={mode:'FIXTURE — no live funds',observed:state,mandate,m0Context:m0};$('#events').replaceChildren();events=0;stage('ready','Built to keep going.','Standard deterministic replay: $37.20 reserve, $70 NVIDIA, $11.20 expense. Your selected mandate determines the outcome.');event('Atlas is ready to work','12.4 days at $3 per day. NVIDIA capital and BNB execution reserve have separate jobs.','✓');render();}
$('#reset').onclick=()=>{if(!running)reset();};
$('#scenario').onchange=()=>{const v=$('#scenario').value;$('#scenario-description').textContent={recovery:'Standard deterministic replay resets balances to $37.20 reserve / $70 NVIDIA, then spends $11.20. Your selected mandate determines recovery, owner pause, block, or no adjustment.',owner:'Atlas has $15 reserve. Restoring the default floor needs $15; the default autonomous limit is $10.',x402:'Both tested payment rails reached signing but returned payment_rejected. $0 settled.',address:'A 0.1 U transfer hits the address-book policy. Blocked before funds move.'}[v];$('#play').firstChild.textContent=v==='recovery'?'Run the recovery story ':'Run this scenario ';};
async function play(){
  if(running)return;running=true;['#play','#hero-play','#reset','#scenario','#setup'].forEach(s=>$(s).disabled=true);
  $('#runway').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});
  try{
    const scenario=$('#scenario').value;state=initial();render();$('#events').replaceChildren();events=0;$('#activity-count').textContent='00';
    if(scenario==='recovery'){
      for(const frame of recovery(mandate)){
        receipt=frame.receipt;stage(frame.phase,frame.title,frame.detail);event(frame.title,frame.detail,['complete','restore'].includes(frame.phase)?'✓':frame.phase==='expense'?'−':'↗');
        if(frame.phase==='expense'||frame.phase==='restore')await transition(frame.state,frame.phase==='expense'?2600:2000,frame.status);
        else{state=frame.state;render(frame.status);}
        $('#receipt').textContent=serialize(receipt);
        if(frame.phase==='execute'){if(matchMedia('(max-width:650px)').matches&&!reduced.matches)$('.operating').scrollIntoView({behavior:'smooth',block:'start'});await transfer();}
        else if(!['expense','restore','complete','no-adjustment','owner','blocked'].includes(frame.phase))await dwell(frame.phase==='verify'?2100:frame.phase==='decision'?2400:1400);
      }
    }else if(scenario==='owner'){
      state.reserve=15000000n;const decision=decide(state,mandate);receipt={mode:'SIMULATED fixture replay',scenario,mandate:{...mandate},observed:{...state},decision,spent:0n};
      const phase=decision.state==='NEEDS OWNER'?'owner':decision.state==='BLOCKED'?'blocked':'decision';
      stage(phase,decision.state==='NEEDS OWNER'?'Your authorization is the boundary.':decision.state,decision.reason);event(decision.state,decision.reason,'Ⅱ');render(decision.state);
    }else{
      receipt={mode:'SIMULATED replay of M0 findings',scenario,observed:{...state},spent:0n};
      stage('quote',scenario==='x402'?'Authorization is not settlement.':'Recipient policy check.',scenario==='x402'?'USDC and U reached signing. Payment still needs to settle.':'0.1 U requested. Checking the recipient before a transfer.');render();await dwell(1800);
      receipt=blockedResult(scenario,state);stage('blocked','Blocked. $0 moved.',scenario==='x402'?'Both payment rails returned payment_rejected. No settlement. No automatic retry.':'The recipient is not in the wallet address book. Transfer stopped before funds moved.');
      event('Blocked. $0 spent.',$('#explanation').textContent,'×');render('BLOCKED');
    }
  }catch(error){receipt.error={message:'Replay interrupted; no live funds moved.'};stage('blocked','Replay stopped.','Reset the fixture to try again. No live funds moved.');render('BLOCKED');console.error(error);}
  finally{running=false;['#play','#hero-play','#reset','#scenario','#setup'].forEach(s=>$(s).disabled=false);$('#receipt').textContent=serialize(receipt);}
}
$('#play').onclick=play;$('#hero-play').onclick=()=>{$('#scenario').value='recovery';$('#scenario').onchange();play();};

$('#download').onclick=()=>{const url=URL.createObjectURL(new Blob([serialize(receipt)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='driftmark-fixture-receipt.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
const form=$('#agent-form');function review(){const f=new FormData(form);$('#review').textContent=`Atlas may spend approved USDC / U on research. Maintain ${f.get('floor')} days runway. Adjust up to $${f.get('max')} per action, preserve the strategy’s NVIDIA allocation${f.has('approval')?', and ask before stock sales':''}. All funding is simulated.`;const strategy=f.get('strategy');$('#funding-preview').textContent={Reserve:'$70 operating liquidity + $30 NVIDIA + separate BNB reserve.',Balanced:'$37.20 operating liquidity + $70 NVIDIA + separate BNB reserve.',Growth:'$30 operating liquidity + $100 NVIDIA + separate BNB reserve.'}[strategy];}
$('#setup').onclick=()=>{review();$('#onboarding').showModal();};$('#close-dialog').onclick=()=>$('#onboarding').close();form.oninput=review;form.onsubmit=e=>{e.preventDefault();const f=new FormData(form);mandate={...defaultMandate(),floor:Number(f.get('floor')),max:BigInt(f.get('max'))*1000000n,approval:f.has('approval'),auditAcknowledged:f.has('audit')};const strategy=f.get('strategy');mandate.minEquityBps={Reserve:2000n,Balanced:5000n,Growth:6000n}[strategy];$('#mandate .tag').textContent=strategy;$('#mandate dl div:nth-child(3) dd').textContent=Number(mandate.minEquityBps)/100+'% of investable treasury';reset();state.reserve={Reserve:70000000n,Balanced:37200000n,Growth:30000000n}[strategy];state.equity={Reserve:30000000n,Balanced:70000000n,Growth:100000000n}[strategy];receipt.observed={...state};$('#events').replaceChildren();events=0;event('Atlas created in simulation',`${strategy} mandate · ${mandate.floor}-day floor · no wallet funded.`,'✓');render();$('#onboarding').close();};
reset();if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});
