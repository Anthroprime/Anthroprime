const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const store = {get(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}},set(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{/* Storage is optional. */}}};
const themeButton=$('.theme-toggle');
function themeLabel(){themeButton?.setAttribute('aria-label',`Switch to ${document.documentElement.dataset.theme==='dark'?'light':'dark'} theme`);}
themeLabel();
themeButton?.addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;try{localStorage.setItem('ap-theme',theme);}catch{}themeLabel();});
const menu=$('.menu-toggle'), navigation=$('#navigation');
function closeMenu(){menu?.setAttribute('aria-expanded','false');navigation?.classList.remove('open');}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));navigation.classList.toggle('open',open);});
navigation?.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
matchMedia('(min-width:851px)').addEventListener('change',event=>{if(event.matches)closeMenu();});

// Diagrams are architectural explanations. No simulated business telemetry.
const architectures={
 ai:{name:'AI',icon:'ai',nodes:[
  ['Knowledge sources','Documents, business systems, and approved datasets provide the context for an intelligent workflow. Ownership and consent are established before ingestion.',['Connectors','Access controls'],14,28],
  ['Retrieval layer','Validated information is indexed for retrieval. The system selects relevant context rather than treating a model as a source of truth.',['RAG','Vector search'],39,28],
  ['Agent orchestration','Purpose-built agents coordinate tools and tasks with bounded permissions, clear escalation paths, and human approval for consequential actions.',['Tool use','Human oversight'],64,28],
  ['Business outcomes','A grounded response or completed workflow reaches the user. Quality is evaluated against the task and the business context.',['Evaluation','Workflow delivery'],88,60],
  ['Model gateway','Models are selected and routed according to capability, privacy, latency, and deployment requirements.',['Model routing','Private inference'],39,72],
  ['Governance & safety','Policies, red-teaming, traceability, and monitoring make intelligence accountable across the workflow.',['AI assurance','Audit trails'],64,72]
 ],edges:[[0,1],[1,2],[2,3],[4,2],[5,2],[5,3]]},
 data:{name:'data',icon:'data',nodes:[
  ['Source systems','ERP, CRM, application events, and approved external datasets are connected with clear ownership and refresh expectations.',['Batch','Streaming'],13,48],
  ['Ingestion','Reliable pipelines collect and validate data, with observability and recovery paths for late or malformed records.',['Pipelines','Schema checks'],37,25],
  ['Lakehouse','A governed storage and processing layer brings structured and unstructured data into a reusable enterprise foundation.',['Storage','Transformation'],61,48],
  ['Decision layer','Curated data products support dashboards, analytics, and machine learning with definitions that teams can trust.',['Analytics','Data products'],86,48],
  ['Data quality','Quality checks, lineage, and ownership make the movement and meaning of data visible.',['Lineage','Quality rules'],37,75]
 ],edges:[[0,1],[1,2],[2,3],[0,4],[4,2]]},
 cloud:{name:'cloud',icon:'cloud',nodes:[
  ['People & applications','Users and applications connect through intentional access boundaries rather than exposed management interfaces.',['Identity','Connectivity'],14,48],
  ['Edge & access','Identity, routing, and policy enforcement establish a secure entry point to cloud workloads.',['Zero trust','Network policy'],38,48],
  ['Cloud workloads','Applications are deployed to the right mix of containers, managed services, and compute for their needs.',['Containers','Managed services'],64,25],
  ['Platform operations','Infrastructure as code, delivery pipelines, and observability provide repeatable operations and recovery.',['IaC','SRE'],64,75],
  ['Resilient data','Storage and recovery design reflect availability targets, data sensitivity, and workload-specific tradeoffs.',['Backup','Recovery'],88,48]
 ],edges:[[0,1],[1,2],[1,3],[2,4],[3,4],[2,3]]},
 cyber:{name:'security',icon:'cyber',nodes:[
  ['Attack surface','An asset and exposure view establishes what matters and where attackers could reach the organisation.',['Discovery','Threat modelling'],15,25],
  ['Prevent & protect','Identity controls, hardening, segmentation, and secure development reduce opportunities for compromise.',['IAM','Hardening'],40,25],
  ['Detect & investigate','Signals are correlated and investigated against realistic adversary behaviour rather than isolated alert counts.',['Detection','Forensics'],66,25],
  ['Respond & recover','Rehearsed playbooks, containment, and tested restoration support coordinated decisions during an incident.',['Playbooks','Recovery'],86,65],
  ['Risk & assurance','Assessments and risk quantification connect technical exposure to business priorities and defensible decisions.',['Audit','Risk modelling'],28,73],
  ['People & culture','Training, exercises, and clear responsibilities turn security controls into everyday practice.',['Awareness','Readiness'],59,73]
 ],edges:[[0,1],[1,2],[2,3],[4,0],[4,5],[5,2],[5,3]]},
 infra:{name:'infrastructure',icon:'infra',nodes:[
  ['Workload requirements','Model size, training or inference needs, residency, and budget determine the capacity profile.',['Sizing','Residency'],14,48],
  ['Capacity validation','GPU availability, provider capability, commercial terms, and delivery timelines are checked before commitment.',['Verification','Sourcing'],39,25],
  ['Compute fabric','Accelerators, interconnects, and storage must work as one system, sized to the intended workload.',['GPU','Interconnect'],64,48],
  ['Operational readiness','Provisioning, testing, monitoring, and support responsibilities are validated before production handover.',['Deployment','Handover'],88,48],
  ['Readiness diagnostic','Power, cooling, network, and operating constraints are examined to identify deployment blockers early.',['Power & cooling','Network'],39,75]
 ],edges:[[0,1],[1,2],[2,3],[0,4],[4,2]]}
};
const architecture=$('.architecture');
if(architecture){
 let mode='ai';
 const tabs=$$('[data-mode]',architecture),panel=$('#architecture-panel'),svg=$('.flow-lines'),nodes=$('.flow-nodes');
 function inspect(index){const cfg=architectures[mode],n=cfg.nodes[index];$('#component-title').textContent=n[0];$('#component-description').textContent=n[1];$('#component-index').textContent=String(index+1).padStart(2,'0');$('.component-tags').replaceChildren(...n[2].map(tag=>{const el=document.createElement('span');el.textContent=tag;return el;}));const link=$('#component-link');link.href=`/services#${mode}`;link.replaceChildren(document.createTextNode(`Explore ${cfg.name} services `));const arrow=document.createElement('span');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');link.append(arrow);$$('.flow-node').forEach((node,i)=>node.setAttribute('aria-pressed',String(i===index)));}
 function render(next){mode=next;const cfg=architectures[mode];tabs.forEach(tab=>{const active=tab.dataset.mode===mode;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});panel.setAttribute('aria-labelledby',`tab-${mode}`);svg.replaceChildren();
  cfg.edges.forEach(([from,to],i)=>{const a=cfg.nodes[from],b=cfg.nodes[to];const d=`M ${a[3]*8} ${a[4]*4} C ${(a[3]+b[3])*4} ${a[4]*4}, ${(a[3]+b[3])*4} ${b[4]*4}, ${b[3]*8} ${b[4]*4}`;for(const cls of ['flow-path','flow-pulse']){const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',d);path.setAttribute('class',cls);path.style.animationDelay=`${i*-.85}s`;svg.append(path);}});
  nodes.replaceChildren(...cfg.nodes.map((n,i)=>{const button=document.createElement('button');button.type='button';button.className='flow-node';button.style.left=`${n[3]}%`;button.style.top=`${n[4]}%`;const source=$(`#tab-${mode} svg`).cloneNode(true);button.append(source,document.createTextNode(n[0]));button.setAttribute('aria-pressed','false');button.setAttribute('aria-controls','component-description');button.addEventListener('click',()=>inspect(i));return button;}));inspect(0);
 }
 tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>render(tab.dataset.mode));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();render(tabs[next].dataset.mode);tabs[next].focus();}});});
 const motion=$('.motion-toggle');const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function setMotion(paused){architecture.classList.toggle('paused',paused);motion.setAttribute('aria-pressed',String(paused));motion.textContent=paused?'Resume motion ▷':'Pause motion Ⅱ';}
 setMotion(reduced.matches||store.get('ap-motion-paused',false));
 reduced.addEventListener('change',event=>setMotion(event.matches||store.get('ap-motion-paused',false)));
 motion.addEventListener('click',()=>{const paused=!architecture.classList.contains('paused');setMotion(paused);store.set('ap-motion-paused',paused);});render('ai');
 document.addEventListener('visibilitychange',()=>architecture.classList.toggle('tab-hidden',document.hidden));
}

const filters=$$('[data-filter]'),services=$$('.service-detail');
if(filters.length){
 let current='all';const input=$('#service-search');
 function filter(){const term=input.value.trim().toLowerCase();let count=0;services.forEach(card=>{const visible=(current==='all'||card.dataset.pillar===current)&&card.dataset.search.includes(term);card.hidden=!visible;if(visible)count++;});$('.result-count').textContent=`${count} ${count===1?'service':'services'}${current!=='all'?` · ${architectures[current].name}`:''}`;$('.no-results').hidden=count>0;filters.forEach(btn=>{btn.classList.toggle('selected',btn.dataset.filter===current);btn.setAttribute('aria-pressed',String(btn.dataset.filter===current));});}
 function hashFilter(scroll=false){const hash=location.hash.slice(1);if(architectures[hash]){current=hash;input.value='';filter();if(scroll)$('#catalogue').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}else if(services.some(s=>s.id===hash)){current='all';filter();const card=document.getElementById(hash);card.open=true;card.scrollIntoView();}}
 filters.forEach(button=>button.addEventListener('click',()=>{current=button.dataset.filter;filter();history.replaceState(null,'',current==='all'?location.pathname:`#${current}`);}));input.addEventListener('input',filter);hashFilter(true);window.addEventListener('hashchange',()=>hashFilter(true));
}

const checks=$$('[data-check]');
if(checks.length){
 let saved=store.get('ap-checklists',[]);if(!Array.isArray(saved))saved=[];
 checks.forEach(check=>check.checked=saved.includes(check.dataset.check));
 function update(){const active=checks.filter(c=>c.checked);$('#checklist-status').textContent=`${active.length} of ${checks.length} actions selected`;$$('.checklist-card').forEach(card=>$('[data-checklist-count]',card).textContent=`${$$('input:checked',card).length}/${$$('input',card).length}`);store.set('ap-checklists',active.map(c=>c.dataset.check));}
 checks.forEach(check=>check.addEventListener('change',update));$('#reset-checklists').addEventListener('click',()=>{checks.forEach(c=>c.checked=false);update();});update();
}

const contact=$('#contactForm');
if(contact){const interest=new URLSearchParams(location.search).get('interest');const select=$('#interest');if(interest){let option=[...select.options].find(o=>o.value===interest);if(!option){option=new Option(interest,interest);select.add(option);}select.value=interest;}}

async function submitNetlify(form,status,success){
 if(!form.reportValidity())return;
 const button=$('button[type=submit]',form),oldText=button.textContent;button.disabled=true;button.textContent='Sending…';status.textContent='';
 try{
  if(location.hostname==='localhost'||location.hostname==='127.0.0.1'||location.protocol==='file:')throw new Error('preview');
  const response=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(form)).toString()});
  if(!response.ok)throw new Error('network');
  status.textContent=success;form.reset();form.dispatchEvent(new Event('reset-complete'));status.focus();
 }catch(error){status.textContent=error.message==='preview'?'This local preview does not send messages. Use the deployed Netlify site, or email hello@anthroprime.com.':'Your request could not be sent. Please try again or email hello@anthroprime.com.';status.focus();}
 finally{button.disabled=false;button.textContent=oldText;}
}
contact?.addEventListener('submit',event=>{event.preventDefault();submitNetlify(contact,$('#form-status'),'Message received. Our team will follow up by email.');});

const schedule=$('#schedule-form');
if(schedule){
 const date=$('#schedule-date'),time=$('#schedule-time'),download=$('#download-calendar'),outlook=$('#outlook-calendar');
 const istDate=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());date.min=istDate();
 function slot(){return date.value&&time.value?new Date(`${date.value}T${time.value}:00+05:30`):null;}
 function update(){const start=slot();const future=start&&start>new Date();date.setCustomValidity(date.value&&date.value<istDate()?'Choose a date today or later.':'');time.setCustomValidity(start&&!future?'Choose a future date and time.':'');download.disabled=!future;outlook.hidden=!future;$('#schedule-slot').value=future?`${date.value} ${time.value} IST`:'';$('#slot-summary').textContent=future?`${new Intl.DateTimeFormat('en-IN',{timeZone:'Asia/Kolkata',weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(start)} · ${time.value} IST`:'Choose a future preferred date and time.';if(future){const end=new Date(start.getTime()+30*60000);outlook.href='https://outlook.office.com/calendar/0/deeplink/compose?'+new URLSearchParams({subject:'Tentative AnthroPrime consultation',startdt:start.toISOString(),enddt:end.toISOString(),body:'Preferred consultation slot. Not confirmed: AnthroPrime will confirm availability by email.'});}}
 const escapeICS=value=>value.replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
 const stamp=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 download.addEventListener('click',()=>{update();const start=slot();if(!start||download.disabled)return;const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//AnthroPrime//Consultation reminder//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:${crypto.randomUUID()}@anthroprime.com`,`DTSTAMP:${stamp(new Date())}`,`DTSTART:${stamp(start)}`,`DTEND:${stamp(new Date(start.getTime()+30*60000))}`,'SUMMARY:Tentative AnthroPrime consultation',`DESCRIPTION:${escapeICS('Preferred consultation slot. AnthroPrime will confirm by email. '+$('#schedule-topic').value)}`,'STATUS:TENTATIVE','END:VEVENT','END:VCALENDAR',''].join('\r\n');const url=URL.createObjectURL(new Blob([ics],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='anthroprime-consultation.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
 date.addEventListener('change',update);time.addEventListener('change',update);schedule.addEventListener('submit',event=>{event.preventDefault();update();submitNetlify(schedule,$('#schedule-status'),'Consultation requested. We will confirm availability by email.');});schedule.addEventListener('reset-complete',update);update();
}
