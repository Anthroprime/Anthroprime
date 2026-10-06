(() => {
const root=document.querySelector('[data-learning]');
if(root){
 const data=JSON.parse(root.querySelector('#lesson-data').textContent),mode=root.dataset.learning;
 const nodes=[...root.querySelectorAll('[data-lesson-node]')],canvas=root.querySelector('.lesson-canvas'),svg=root.querySelector('.lesson-edges');
 const scenario=root.querySelector('[data-lesson-scenario]'),control=root.querySelector('[data-lesson-control]'),run=root.querySelector('[data-lesson-run]'),progress=root.querySelector('[data-lesson-progress]');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let timer=0,running=false,selected=0,step=0,visible=true;
 const paused=()=>reduced.matches||document.body.classList.contains('effects-paused');
 const value=()=>scenario.value,enabled=()=>!control||control.checked;
 function path(){if(mode==='data'&&value()==='issue'&&enabled())return [0,1,2];if(mode==='cloud'&&value()==='outage')return enabled()?[0,1,3,4,5]:[0,1,5];if(mode==='ai'&&value()==='autonomy')return [0,1,2,3,5];return data.trace;}
 function halt(message){clearTimeout(timer);timer=0;running=false;run.textContent=paused()?'Next connection →':'Follow the connections ▷';run.setAttribute('aria-pressed','false');if(message)progress.textContent=message;}
 function select(i){selected=i;nodes.forEach((n,j)=>n.setAttribute('aria-pressed',String(i===j)));root.querySelector('[data-lesson-index]').textContent=String(i+1).padStart(2,'0');root.querySelector('[data-lesson-title]').textContent=data.nodes[i].title;root.querySelector('[data-lesson-description]').textContent=data.nodes[i].why;draw();}
 function edgeState(a,b){
  if(mode==='data'&&value()==='issue'&&((a===2&&b===3)||(a===3&&b===4)))return enabled()?'blocked':'risk';
  if(mode==='cloud'&&value()==='outage'){if(a===1&&b===2||a===2&&b===4)return 'blocked';if(a===1&&b===3)return enabled()?'rerouted':'blocked';}
  if(mode==='ai'&&value()==='autonomy'&&(a===3&&b===4||a===4&&b===5))return 'blocked';
  return a===selected||b===selected?'selected':'';
 }
 function draw(){
  const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;
  svg.setAttribute('viewBox',`0 0 ${r.width} ${r.height}`);
  const edges=[...data.edges];if(mode==='ai'&&value()==='autonomy')edges.push([3,5]);
  svg.innerHTML='<defs><marker id="lesson-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="currentColor"/></marker></defs>';
  for(const [a,b] of edges){
   const ar=nodes[a].getBoundingClientRect(),br=nodes[b].getBoundingClientRect();
   const ax=ar.x+ar.width/2-r.x,ay=ar.y+ar.height/2-r.y,bx=br.x+br.width/2-r.x,by=br.y+br.height/2-r.y,dx=bx-ax,dy=by-ay;
   // Intersect the node rectangle so arrows meet its edge rather than its label.
   const af=Math.min(dx?ar.width/2/Math.abs(dx):Infinity,dy?ar.height/2/Math.abs(dy):Infinity),bf=Math.min(dx?br.width/2/Math.abs(dx):Infinity,dy?br.height/2/Math.abs(dy):Infinity);
   const d=`M${ax+dx*af} ${ay+dy*af}L${bx-dx*(bf+.02)} ${by-dy*(bf+.02)}`;
   const state=mode==='ai'&&value()==='autonomy'&&a===3&&b===5?'risk':edgeState(a,b);
   for(const packet of [false,true]){const line=document.createElementNS('http://www.w3.org/2000/svg','path');line.setAttribute('d',d);line.setAttribute('class',`lesson-edge ${state} ${packet?'lesson-packet':''}`);if(!packet)line.setAttribute('marker-end','url(#lesson-arrow)');svg.append(line);}
  }
 }
 function updateScenario(){
  halt('Scenario changed. Select a component or follow the connections.');step=0;
  let result=0;
  if(mode==='data'&&value()==='issue')result=enabled()?1:2;
  if(mode==='cloud'&&value()==='outage')result=enabled()?1:2;
  if(mode==='cyber'&&value()==='incident'||mode==='ai'&&value()==='autonomy')result=1;
  if(mode==='infra')result=['balanced','storage','network','facility'].indexOf(value());
  root.querySelector('[data-lesson-outcome]').textContent=data.result[result];
  root.dataset.scenario=value();root.dataset.control=String(enabled());
  nodes.forEach((n,i)=>{n.classList.remove('node-issue','node-focus');n.querySelector('.node-state')?.remove();let label='';
   if(mode==='data'&&value()==='issue'&&i===2)label=enabled()?'BATCH HELD':'CHECK BYPASSED';
   if(mode==='cloud'&&value()==='outage'&&i===2)label='UNAVAILABLE';
   if(mode==='cloud'&&value()==='outage'&&i===3&&enabled())label='ALTERNATIVE PATH';
   if(mode==='infra'&&i===({storage:1,network:2,facility:4}[value()]))label='CONSTRAINT';
   if(mode==='ai'&&value()==='autonomy'&&i===4)label='REVIEW BYPASSED';
   if(label){const state=document.createElement('span');state.className='node-state';state.textContent=label;n.append(state);n.classList.add(label==='ALTERNATIVE PATH'?'node-focus':'node-issue');}
  });
  select(mode==='infra'?({storage:1,network:2,facility:4}[value()]??0):mode==='data'&&value()==='issue'?2:mode==='cloud'&&value()==='outage'?1:0);
 }
 nodes.forEach((node,i)=>node.addEventListener('click',()=>{halt();step=0;select(i);progress.textContent=`Exploring ${data.nodes[i].title}.`;}));
 function advance(){const order=path();select(order[step]);progress.textContent=`${step+1} of ${order.length} · ${data.nodes[order[step]].title}`;step++;if(step>=order.length){halt('Connections explored. Review the scenario outcome and its dependencies.');step=0;}else if(running)timer=setTimeout(advance,1600);}
 run.addEventListener('click',()=>{if(running){halt('Walkthrough paused. Select a component or continue.');return;}if(paused()||!visible){advance();return;}running=true;run.textContent='Pause walkthrough Ⅱ';run.setAttribute('aria-pressed','true');advance();});
 root.querySelector('[data-lesson-reset]').addEventListener('click',()=>{scenario.selectedIndex=0;if(control)control.checked=true;updateScenario();progress.textContent='Reset to the starting architecture.';});
 scenario.addEventListener('change',updateScenario);control?.addEventListener('change',updateScenario);
 document.addEventListener('ap-effects-change',()=>halt('Motion preference changed. Explore each connection at your pace.'));
 reduced.addEventListener('change',()=>halt());document.addEventListener('visibilitychange',()=>{if(document.hidden)halt('Walkthrough paused while this tab was inactive.');});
 new ResizeObserver(draw).observe(canvas);
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;root.classList.toggle('lesson-dormant',!visible);if(!visible&&running)halt('Walkthrough paused outside the visible area.');},{threshold:.05}).observe(canvas);
 updateScenario();progress.textContent='Select a component or follow the connections.';draw();
}
document.querySelectorAll('[data-story]').forEach(story=>{story.dataset.activeStep='0';story.querySelectorAll('[data-story-step]').forEach(button=>button.addEventListener('click',()=>{story.dataset.activeStep=button.dataset.storyStep;story.querySelectorAll('[data-story-step]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));});
})();
