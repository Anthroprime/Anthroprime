(() => {
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const domainNames={ai:'Artificial intelligence',data:'Data & analytics',cloud:'Cloud engineering',cyber:'Cybersecurity',infra:'AI infrastructure'};
const domainCopy={ai:'Intelligence, with intention. Systems that reason, retrieve, and act with your people in the loop.',data:'Clarity, connected. Trusted foundations turn information into a decision advantage.',cloud:'Room to evolve. Resilient platforms built around the way your teams work.',cyber:'Confidence, by design. Strong defenses, informed decisions, and a culture of readiness.',infra:'Power, with assurance. Verified capacity for the next generation of intelligent workloads.'};
let effectsPaused=reduced.matches;
try{effectsPaused=effectsPaused||localStorage.getItem('ap-effects-paused')==='true';}catch{}
function setEffects(paused,persist=true){effectsPaused=paused;document.body.classList.toggle('effects-paused',paused);$$('[data-effects-toggle],.ambient-toggle').forEach(button=>{button.setAttribute('aria-pressed',String(paused));button.textContent=button.matches('.ambient-toggle')?(paused?'Play animation ▷':'Pause animation Ⅱ'):(paused?'Resume visual effects':'Pause visual effects');});if(persist)try{localStorage.setItem('ap-effects-paused',String(paused));}catch{}document.dispatchEvent(new CustomEvent('ap-effects-change',{detail:paused}));}
setEffects(effectsPaused,false);
$$('[data-effects-toggle],.ambient-toggle').forEach(button=>button.addEventListener('click',()=>setEffects(!effectsPaused)));
reduced.addEventListener('change',event=>setEffects(event.matches,false));

// A responsive 3D point field morphs between five different architectural forms.
// No libraries, network calls, simulated metrics, or offscreen animation loops.
const canvas=$('#observatory-canvas');
if(canvas){
 const ctx=canvas.getContext('2d');
 if(ctx){
  const count=110,particles=Array.from({length:count},()=>({x:0,y:0,z:0}));
  let mode='ai',width=0,height=0,raf=0,phase=0,last=0,visible=true,paused=effectsPaused,mouseX=0,mouseY=0;
  const target=(i)=>{
   const t=i/count,a=t*Math.PI*2;
   if(mode==='ai'){const z=1-2*t,r=Math.sqrt(Math.max(0,1-z*z)),longitude=i*2.399963;return {x:Math.cos(longitude)*r*143,y:z*143,z:Math.sin(longitude)*r*143};}
   if(mode==='data'){const lane=i%5,u=Math.floor(i/5)/21;return {x:(u-.5)*300,y:Math.sin(u*Math.PI*3+lane*.42+phase)*34+(lane-2)*27,z:Math.cos(u*Math.PI*2+lane)*45};}
   if(mode==='cloud'){const layer=i%4,j=Math.floor(i/4),angle=j/27*Math.PI*2;return {x:Math.cos(angle)*135,y:(layer-1.5)*52,z:Math.sin(angle)*85};}
   if(mode==='cyber'){const ring=i%4,j=Math.floor(i/4),angle=j/28*Math.PI*2;const radius=53+ring*29;return {x:Math.cos(angle)*radius,y:Math.sin(angle)*radius,z:Math.sin(angle*2+phase*.4)*20};}
   const col=i%5,row=Math.floor(i/5)%11,depth=Math.floor(i/55);return {x:(col-2)*48,y:(row-5)*25,z:(depth-.5)*75};
  };
  function resize(){const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,1.6);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);cancelAnimationFrame(raf);raf=0;draw(0,true);synchronize();}
  function draw(time,still=false){
   const elapsed=last?Math.min((time-last)/1000,.04):.016;last=time;if(!still)phase+=elapsed*.46;
   ctx.clearRect(0,0,width,height);const scale=Math.min(width/390,height/325);const cy=height*.48;
   const halo=ctx.createRadialGradient(width/2,cy,0,width/2,cy,Math.min(width,height)*.6);halo.addColorStop(0,'rgba(142,160,224,.09)');halo.addColorStop(1,'rgba(142,160,224,0)');ctx.fillStyle=halo;ctx.fillRect(0,0,width,height);
   const ry=phase*.38+mouseX*.42,rx=mouseY*.2,cos=Math.cos(ry),sin=Math.sin(ry);
   const points=particles.map((p,i)=>{const goal=target(i);const smooth=still?1:Math.min(elapsed*3.8,1);p.x+=(goal.x-p.x)*smooth;p.y+=(goal.y-p.y)*smooth;p.z+=(goal.z-p.z)*smooth;const x=p.x*cos+p.z*sin,z=p.z*cos-p.x*sin,y=p.y*Math.cos(rx)-z*Math.sin(rx);const perspective=500/(500-z);return {x:width/2+x*scale*perspective,y:cy+y*scale*perspective,z,alpha:.32+(z+150)/520};});
   for(let i=0;i<count;i++)for(const offset of [1,5,13]){const j=(i+offset)%count,a=points[i],b=points[j];const distance=Math.hypot(a.x-b.x,a.y-b.y);if(distance>64*scale||distance<5)continue;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(142,160,224,${Math.max(.02,.15*(1-distance/(70*scale)))})`;ctx.lineWidth=.65;ctx.stroke();if(!still&&i%11===0){const progress=(phase*.8+i*.08)%1;ctx.beginPath();ctx.arc(a.x+(b.x-a.x)*progress,a.y+(b.y-a.y)*progress,1.2,0,Math.PI*2);ctx.fillStyle='rgba(201,177,144,.8)';ctx.fill();}}
   points.forEach((p,i)=>{ctx.beginPath();ctx.arc(p.x,p.y,i%9===0?2.4:1.25,0,Math.PI*2);ctx.fillStyle=i%9===0?`rgba(201,177,144,${p.alpha})`:`rgba(174,188,240,${p.alpha})`;ctx.fill();if(i%18===0){ctx.beginPath();ctx.arc(p.x,p.y,5+Math.sin(phase*2+i)*2,0,Math.PI*2);ctx.strokeStyle='rgba(201,177,144,.13)';ctx.lineWidth=.7;ctx.stroke();}});
   if(!still&&!paused&&visible&&!document.hidden)raf=requestAnimationFrame(draw);else raf=0;
  }
  function synchronize(){cancelAnimationFrame(raf);raf=0;last=0;if(!paused&&visible&&!document.hidden)raf=requestAnimationFrame(draw);else draw(0,true);}
  const button=$('.ambient-toggle');
  function motionState(){document.body.classList.toggle('effects-paused',paused);button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'Play animation ▷':'Pause animation Ⅱ';synchronize();}
  document.addEventListener('ap-effects-change',event=>{paused=event.detail;motionState();});
  $$('.orbit-label[data-hero-mode]').forEach((button,index)=>button.addEventListener('click',()=>{mode=button.dataset.heroMode;$$('[data-hero-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));$('#hero-domain').textContent=`0${index+1} / ${domainNames[mode].toUpperCase()}`;$('#hero-domain-description').textContent=domainCopy[mode];const link=$('#hero-domain-link');link.href=`/services#${mode}`;link.setAttribute('aria-label',`Explore ${domainNames[mode].toLowerCase()} services`);if(paused)synchronize();}));
  canvas.addEventListener('pointermove',event=>{if(event.pointerType==='touch')return;const r=canvas.getBoundingClientRect();mouseX=(event.clientX-r.left)/r.width-.5;mouseY=(event.clientY-r.top)/r.height-.5;});canvas.addEventListener('pointerleave',()=>{mouseX=0;mouseY=0;});
  new ResizeObserver(resize).observe(canvas);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;synchronize();},{threshold:.05}).observe(canvas);document.addEventListener('visibilitychange',synchronize);motionState();
 }
}

const capabilityTabs=$$('[data-capability]');
function showCapability(index){capabilityTabs.forEach((tab,i)=>{const active=i===index;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;const panel=document.getElementById(tab.getAttribute('aria-controls'));panel.classList.toggle('active',active);panel.hidden=!active;});}
if(capabilityTabs.length){const narrow=matchMedia('(max-width:850px)');const orientation=()=>$('.capability-selector').setAttribute('aria-orientation',narrow.matches?'horizontal':'vertical');narrow.addEventListener('change',orientation);orientation();capabilityTabs.forEach((tab,i)=>{tab.addEventListener('click',()=>showCapability(i));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(i+1)%capabilityTabs.length;if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(i-1+capabilityTabs.length)%capabilityTabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=capabilityTabs.length-1;if(next!==undefined){event.preventDefault();showCapability(next);capabilityTabs[next].focus();}});});showCapability(0);}

const builder=$('#project-builder');
if(builder){
 const services={ai:['AI strategy & assurance','Agentic AI for Business'],data:['Data foundations & decision intelligence','Data Architecture & Engineering'],cloud:['Cloud strategy & a resilient platform','Cloud Strategy & Architecture'],cyber:['Risk clarity & security readiness','Information Security Auditing'],infra:['Workload sizing & verified capacity','Capacity Readiness Diagnostic']};
 function update(){const mode=$('#project-goal').value,stage=$('#project-stage').value,priority=$('[name=priority]:checked',builder).value;const entry=services[mode];$('#builder-recommendation').textContent=entry[0];$('#builder-context').textContent=`${stage}. Focused on ${priority.toLowerCase()}, with ${domainNames[mode].toLowerCase()} expertise shaped around your context.`;const brief=`Our goal: ${$('#project-goal').selectedOptions[0].textContent}.\nOur stage: ${stage}.\nOur priority: ${priority}.\n\nPlease help us define the right starting point.`;$('#builder-contact').href='/contact?'+new URLSearchParams({interest:entry[1],brief});}
 builder.addEventListener('change',update);builder.addEventListener('submit',event=>{event.preventDefault();location.href=$('#builder-contact').href;});update();
}
const brief=new URLSearchParams(location.search).get('brief');if(brief&&$('#message'))$('#message').value=brief.slice(0,4000);

const walkthrough=$('.run-flow');
if(walkthrough){
 let timer=0,running=false,index=0;
 const routes={ai:[0,1,4,2,5,3],data:[0,1,4,2,3],cloud:[0,1,2,3,4],cyber:[4,0,1,5,2,3],infra:[0,4,1,2,3]};
 const explanations={ai:['Approve the business knowledge that informs the workflow.','Retrieve relevant context rather than relying on model memory.','Route the task to a model appropriate for the workload.','Coordinate the tools and actions within agreed permissions.','Evaluate safety, policy, and human escalation requirements.','Deliver a grounded response or supported business action.'],data:['Connect the source systems and define ownership.','Collect and validate incoming records.','Check quality, lineage, and the meaning of the data.','Transform information into a governed enterprise foundation.','Publish trusted data for analytics and decisions.'],cloud:['Establish the people and applications that need access.','Verify identities and enforce access policies.','Run workloads on the right compute and services.','Observe, deploy, and maintain the platform reliably.','Protect availability with tested storage and recovery design.'],cyber:['Connect technical exposure to business priorities.','Discover the assets and pathways that matter.','Reduce opportunities for compromise.','Build awareness and clear responsibilities.','Investigate signals against realistic adversary behavior.','Contain incidents and restore operations with practiced playbooks.'],infra:['Define the model, workload, residency, and budget needs.','Identify power, cooling, network, and operating constraints.','Verify capacity, delivery expectations, and provider capability.','Connect accelerators, interconnects, and storage.','Validate deployment and hand over operating responsibilities.']};
 const status=$('#walkthrough-status'),progress=$('.walkthrough-progress');
 function stop(message){clearTimeout(timer);timer=0;running=false;walkthrough.textContent='Run a walkthrough ▷';walkthrough.setAttribute('aria-pressed','false');$$('.flow-node').forEach(node=>node.classList.remove('walkthrough-active'));if(message)status.textContent=message;}
 function run(){const mode=$('[data-mode][aria-selected=true]').dataset.mode,route=routes[mode],step=route[index],nodes=$$('.flow-node');nodes.forEach(n=>n.classList.remove('walkthrough-active'));nodes[step].click();nodes[step].classList.add('walkthrough-active');status.textContent=`${index+1} of ${route.length} · ${explanations[mode][index]}`;const pct=Math.round((index+1)/route.length*100);progress.style.setProperty('--flow-progress',`${pct}%`);progress.setAttribute('aria-valuenow',String(pct));index++;if(index<route.length)timer=setTimeout(run,1700);else timer=setTimeout(()=>stop('Walkthrough complete. Select any component to explore its role.'),1700);}
 walkthrough.setAttribute('aria-pressed','false');walkthrough.addEventListener('click',()=>{if(running){stop('Walkthrough paused. Select a component or run it again.');return;}running=true;index=0;walkthrough.textContent='Pause walkthrough Ⅱ';walkthrough.setAttribute('aria-pressed','true');run();});
 $$('[data-mode]').forEach(tab=>{tab.addEventListener('click',()=>{stop('See how an illustrative workflow moves through the architecture.');progress.style.setProperty('--flow-progress','0%');progress.setAttribute('aria-valuenow','0');});tab.addEventListener('keydown',event=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(event.key))stop('Choose a component or run the new architecture walkthrough.');});});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&running)stop('Walkthrough paused. Run it again when you are ready.');});
 document.addEventListener('ap-effects-change',event=>{if(event.detail&&running)stop('Walkthrough paused with visual effects. Run it again when you are ready.');});
}

// Scroll adds subtle movement; content is never hidden while waiting for JS.
if(!reduced.matches&&'IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target);}}),{threshold:.12});$$('.section-heading,.conviction,.advisory-feature,.framework-card,.checklist-card').forEach(el=>{el.classList.add('scroll-reveal');observer.observe(el);});}
let scrollPending=false;
function scrollProgress(){const range=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty('--scroll-progress',range>0?String(Math.min(1,scrollY/range)):'0');scrollPending=false;}
addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(scrollProgress);}},{passive:true});addEventListener('resize',scrollProgress);scrollProgress();
// Light and illustrated depth follow the pointer while text and controls stay stable.
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduced.matches){$$('.capability-scenes,.terminal-shell').forEach(surface=>{let frame=0;surface.addEventListener('pointermove',event=>{if(frame||effectsPaused)return;frame=requestAnimationFrame(()=>{const r=surface.getBoundingClientRect(),x=(event.clientX-r.left)/r.width,y=(event.clientY-r.top)/r.height;surface.style.setProperty('--pointer-x',`${x*100}%`);surface.style.setProperty('--pointer-y',`${y*100}%`);surface.style.setProperty('--depth-x',`${(y-.5)*-10}deg`);surface.style.setProperty('--depth-y',`${(x-.5)*12}deg`);frame=0;});});surface.addEventListener('pointerleave',()=>{surface.style.setProperty('--depth-x','0deg');surface.style.setProperty('--depth-y','0deg');});});}
})();
