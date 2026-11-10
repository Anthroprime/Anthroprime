import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {mkdirSync,writeFileSync,readFileSync,existsSync} from 'node:fs';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const base='http://127.0.0.1:4173';
let server;
try{await fetch(base);}catch{server=spawn(process.execPath,['tools/serve.mjs'],{stdio:'ignore'});for(let i=0;i<40;i++){try{await fetch(base);break;}catch{await new Promise(r=>setTimeout(r,100));}}}
mkdirSync('artifacts',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const errors=[],report=[];
const pages=['/','/services','/practices','/growth-advisor','/contact','/labs','/artificial-intelligence','/data','/cybersecurity','/cloud','/infrastructure'];
let count=0;
const check=(condition,message)=>{assert.ok(condition,message);count++;};
try{
 for(const viewport of [{width:1440,height:1000},{width:390,height:844},{width:320,height:720},{width:768,height:1024}]){
  for(const route of pages){
   const context=await browser.newContext({viewport});await context.addInitScript(()=>localStorage.setItem('ap-theme','dark'));const page=await context.newPage();page.on('pageerror',err=>errors.push(`${route}: ${err.message}`));
   await page.goto(base+route);await page.evaluate(()=>document.fonts.ready);
   check(await page.locator('h1').count()===1,`${route}: exactly one h1`);
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${route}: no horizontal overflow at ${viewport.width}`);
   const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();report.push({route,width:viewport.width,theme:'dark',violations:axe.violations});
   check(!axe.violations.length,`${route} ${viewport.width}: accessibility issues: ${axe.violations.map(v=>v.id+': '+v.nodes.map(n=>n.target).join(',')).join('; ')}`);
   await page.screenshot({path:`artifacts/${route==='/'?'home':route.slice(1)}-${viewport.width}.png`,fullPage:true});
   await page.locator('.theme-toggle').click();check(await page.locator('html').getAttribute('data-theme')==='light','theme toggle');
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'light theme overflow');
   if(viewport.width===1440||viewport.width===390){const light=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();report.push({route,width:viewport.width,theme:'light',violations:light.violations});check(!light.violations.length,`${route} light accessibility: ${light.violations.map(v=>v.id).join(',')}`);}
   if(viewport.width===390){await page.locator('.menu-toggle').click();check(await page.locator('#navigation').isVisible(),'mobile nav opens');await page.keyboard.press('Escape');check(await page.locator('.menu-toggle').getAttribute('aria-expanded')==='false','mobile nav Escape');}
   await context.close();
  }
 }

 const labsContext=await browser.newContext({javaScriptEnabled:false});
 const labsPage=await labsContext.newPage();
 await labsPage.goto(base);
 await labsPage.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Labs',exact:true}).click();
 check(labsPage.url()===base+'/labs','Labs is reachable from the main navigation without JavaScript');
 check(await labsPage.locator('#navigation a[aria-current=page]').getAttribute('href')==='/labs','Labs is marked as the current page');
 for(const [name,url] of [['Anthroprime ECOD','https://ecod.anthroprime.com/'],['Anthroprime LMS','https://lms.anthroprime.com/'],['Anthroprime AI','https://anthroprime.ai/']]){
  check(await labsPage.getByRole('link',{name,exact:true}).getAttribute('href')===url,`${name} links to its site`);
 }
 await labsContext.close();

 // Dedicated discipline pages have interactive stages, preserved scope and photography.
 const domainContext=await browser.newContext({viewport:{width:1440,height:1000}});const domainTab=await domainContext.newPage();
 for(const route of ['/artificial-intelligence','/data','/cybersecurity','/cloud','/infrastructure']){
  await domainTab.goto(base+route);
  check(await domainTab.locator('.domain-rail [aria-current=page]').getAttribute('href')===route,'discipline navigation current state');
  check(await domainTab.locator('.domain-scope details').count()>0,'dedicated service scope');
  await domainTab.locator('.discipline-photo img').scrollIntoViewIfNeeded();
  await domainTab.waitForFunction(()=>document.querySelector('.discipline-photo img').complete&&document.querySelector('.discipline-photo img').naturalWidth>0);
  check(await domainTab.locator('.discipline-photo img').evaluate(img=>img.complete&&img.naturalWidth>0),'locally hosted photograph loads');
  check(await domainTab.locator('link[rel=canonical]').getAttribute('href')==='https://www.anthroprime.com'+route,'dedicated canonical URL');
  const before=await domainTab.locator('#system-description').textContent();
  await domainTab.locator('[data-system-stage="1"]').click();
  check(await domainTab.locator('#system-description').textContent()!==before,'system narration changes');
  check(await domainTab.locator('.system-art').getAttribute('data-selected-stage')==='1','system visual responds');
  await domainTab.locator('[data-system-stage="2"]').focus();await domainTab.keyboard.press('Enter');
  check(await domainTab.locator('[data-system-stage="2"]').getAttribute('aria-pressed')==='true','keyboard system interaction');
 }
 await domainTab.goto(base);check(await domainTab.locator('.terminal-shortcuts button').first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=12),'terminal shortcuts have readable text');
 await domainTab.locator('.domain-rail a[href="/data"]').click();await domainTab.waitForURL(base+'/data');check(await domainTab.locator('.page-loading-bar').evaluate(el=>!el.classList.contains('loading')),'navigation feedback resets on arrival');
 await domainTab.goBack();check(await domainTab.locator('body').evaluate(el=>!el.classList.contains('page-leaving')),'back navigation restores page');
 await domainContext.close();
 // On narrow screens, every component remains inside the stage without colliding.
 const narrow=await browser.newContext({viewport:{width:320,height:720}});const narrowPage=await narrow.newPage();await narrowPage.goto(base);
 for(const mode of ['ai','data','cloud','cyber','infra']){await narrowPage.locator(`[data-mode="${mode}"]`).click();const bounds=await narrowPage.locator('.lab-canvas').boundingBox();const boxes=await narrowPage.locator('.flow-node').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}));for(const [i,box] of boxes.entries()){check(box.x>=bounds.x-1&&box.x+box.width<=bounds.x+bounds.width+1&&box.y>=bounds.y-1&&box.y+box.height<=bounds.y+bounds.height+1,`${mode} node ${i} stays inside mobile stage`);for(const other of boxes.slice(i+1)){check(!(box.x<other.x+other.width&&box.x+box.width>other.x&&box.y<other.y+other.height&&box.y+box.height>other.y),`${mode} mobile nodes do not overlap`);}}}await narrow.close();
 const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();
 await page.goto(base);
 check(await page.locator('.brand img').first().getAttribute('src')==='/assets/company-logo.jpg','supplied company logo');
 check(await page.locator('html').getAttribute('data-theme')==='light','original ivory theme is default');
 check((await page.locator('h1').textContent()).includes('starts with people.'),'original human-first headline');
 await page.locator('.ambient-toggle').click();check(await page.locator('body').evaluate(el=>el.classList.contains('effects-paused')),'pause all visual effects');
 const sphereState=await page.locator('canvas').evaluate(c=>c.toDataURL());await page.locator('[data-hero-mode=data]').click();check(await page.locator('#hero-domain').textContent()==='02 / DATA & ANALYTICS','hero domain updates');check(await page.locator('#hero-domain-link').getAttribute('href')==='/services#data','hero links to selected domain');check((await page.locator('canvas').evaluate(c=>c.toDataURL()))!==sphereState,'canvas morphs to a distinct architecture');
 await page.locator('#capability-tab-cloud').click();check(await page.locator('#capability-panel-cloud').isVisible(),'capability showcase switches');check(!await page.locator('#capability-panel-ai').isVisible(),'inactive capability hidden');await page.locator('#capability-tab-cloud').focus();await page.keyboard.press('ArrowDown');check(await page.locator('#capability-tab-cyber').getAttribute('aria-selected')==='true','capability keyboard controls');
 await page.locator('.run-flow').click();check(await page.locator('.flow-node.walkthrough-active').count()===1,'walkthrough highlights the current step');check((await page.locator('#walkthrough-status').textContent()).startsWith('1 of'),'walkthrough explains step');await page.locator('.run-flow').click();check(await page.locator('.flow-node.walkthrough-active').count()===0,'walkthrough pauses cleanly');
 await page.locator('#project-goal').selectOption('cloud');await page.locator('#project-stage').selectOption('Scaling an existing capability');await page.locator('label:has([name=priority][value="Performance and resilience"])').click();check((await page.locator('#builder-recommendation').textContent()).includes('Cloud'),'brief builder matches goal');await page.locator('#builder-contact').click();check(await page.locator('#interest').inputValue()==='Cloud Strategy & Architecture','brief builder passes service interest');check((await page.locator('#message').inputValue()).includes('Scaling an existing capability')&&(await page.locator('#message').inputValue()).includes('Performance and resilience'),'brief builder passes project context');check(await page.locator('body').evaluate(el=>el.classList.contains('effects-paused')),'motion preference persists across pages');
 await page.goto(base);
 check(await page.locator('.observatory').evaluate(el=>{const s=getComputedStyle(el);return s.backgroundColor==='rgba(0, 0, 0, 0)'&&s.boxShadow==='none'&&parseFloat(s.borderTopWidth)===0;}),'hero diagram is embedded without a card');
 const command=page.locator('#terminal-input');await command.fill('help');await command.press('Enter');check((await page.locator('#terminal-output').textContent()).includes('AVAILABLE COMMANDS'),'terminal command discovery');
 await command.fill('explore data');await command.press('Enter');check(await page.locator('[data-hero-mode=data]').getAttribute('aria-pressed')==='true','terminal synchronizes hero scene');check(await page.locator('#capability-tab-data').getAttribute('aria-selected')==='true','terminal synchronizes capability scene');check(await page.locator('#tab-data').getAttribute('aria-selected')==='true','terminal synchronizes architecture');
 await command.fill('simulate security');await command.press('Enter');await page.waitForFunction(()=>document.querySelector('#terminal-session-status').textContent==='WORKFLOW COMPLETE',{},{timeout:10000});check(await page.locator('.terminal-stage.complete').count()===4,'terminal scenario progresses through four stages');check((await page.locator('#terminal-output').textContent()).includes('Following a conceptual architecture. No real systems are connected.'),'terminal clearly labels illustrative workflows');
 await command.fill('simulate ai');await command.press('Enter');await command.fill('stop');await command.press('Enter');check(!await page.locator('.terminal-scene').evaluate(el=>el.classList.contains('running')),'terminal simulation stops');
 await command.fill('explore sec');await command.press('Tab');check(await command.inputValue()==='explore security','terminal command completion');await command.press('Enter');await command.press('ArrowUp');check(await command.inputValue()==='explore security','terminal command history');
 await command.fill('<img src=x onerror=alert(1)>');await command.press('Enter');check(await page.locator('#terminal-output img').count()===0,'terminal treats input as text');check((await page.locator('#terminal-output').textContent()).includes('Command not found'),'unknown command guidance');
 await command.fill('theme dark');await command.press('Enter');check(await page.locator('html').getAttribute('data-theme')==='dark','terminal theme command');await command.fill('theme light');await command.press('Enter');
 await page.locator('#terminal-clear').click();check(await page.locator('#terminal-output .terminal-line').count()===1,'terminal clear control');
 for(const mode of ['ai','data','cloud','cyber','infra']){await page.locator(`[data-mode="${mode}"]`).click();check(await page.locator(`#tab-${mode}`).getAttribute('aria-selected')==='true',`${mode} selected`);const before=await page.locator('#component-title').textContent();await page.locator('.flow-node').nth(1).click();check(await page.locator('#component-title').textContent()!==before,`${mode} component inspector`);check(await page.locator('.flow-node[aria-pressed=true]').count()===1,'single selected component');}
 await page.locator('#tab-ai').focus();await page.keyboard.press('ArrowRight');check(await page.locator('#tab-data').getAttribute('aria-selected')==='true','keyboard diagram tabs');await page.keyboard.press('End');check(await page.locator('#tab-infra').getAttribute('aria-selected')==='true','End tab');await page.locator('.motion-toggle').click();check(await page.locator('.architecture').evaluate(el=>el.classList.contains('paused')),'pause diagram');
 await page.goto(base+'/services#cloud');check(await page.locator('.service-detail:visible').count()===3,'service hash filters cloud');await page.locator('#service-search').fill('migration');check(await page.locator('.service-detail:visible').count()>0,'service search');await page.locator('#service-search').fill('no-result-xzq');check(await page.locator('.no-results').isVisible(),'empty search state');await page.locator('#service-search').fill('');await page.locator('[data-filter=all]').click();check(await page.locator('.service-detail:visible').count()===27,'all original services present');await page.locator('.service-detail summary').first().click();check(await page.locator('.service-detail').first().getAttribute('open')!==null,'service scope opens');
 await page.goto(base+'/practices');await page.locator('[data-check]').first().check();check((await page.locator('#checklist-status').textContent()).startsWith('1 of'),'checklist count');await page.reload();check(await page.locator('[data-check]').first().isChecked(),'checklist persists');await page.locator('#reset-checklists').click();check(!await page.locator('[data-check]').first().isChecked(),'checklist resets');
 await page.goto(base+'/contact?interest=AI%20Security%20%26%20Red-Teaming');check(await page.locator('#interest').inputValue()==='AI Security & Red-Teaming','service inquiry prefill');
 await page.locator('#fullName').fill('QA Example');await page.locator('#workEmail').fill('qa@example.com');await page.locator('#company').fill('Example');await page.locator('#message').fill('Testing local preview, no data is sent.');await page.locator('#consent').check();await page.locator('#submitBtn').click();await page.waitForFunction(()=>document.querySelector('#form-status').textContent.includes('local preview'));check((await page.locator('#form-status').textContent()).includes('does not send'),'honest local form state');
 const tomorrow=new Date(Date.now()+86400000*2).toISOString().slice(0,10);await page.locator('#schedule-date').fill(tomorrow);await page.locator('#schedule-time').selectOption('11:00');check(await page.locator('#download-calendar').isEnabled(),'valid slot calendar enabled');const downloadEvent=page.waitForEvent('download');await page.locator('#download-calendar').click();const download=await downloadEvent;await download.saveAs('artifacts/consultation.ics');const ics=readFileSync('artifacts/consultation.ics','utf8');check(ics.includes('STATUS:TENTATIVE'),'calendar tentative');check(ics.includes('T053000Z'),'IST to UTC conversion');await page.locator('#schedule-name').fill('QA');await page.locator('#schedule-email').fill('qa@example.com');await page.locator('#schedule-form [name=Consent]').check();await page.locator('#schedule-form button[type=submit]').click();check((await page.locator('#schedule-status').textContent()).includes('does not send'),'scheduler local request state');
 // Intercept at a non-local test origin: verify POST payload and error/success states without sending real messages.
 await page.route('https://qa.anthroprime.test/**',async route=>{const request=route.request();if(request.method()==='POST'){const payload=new URLSearchParams(request.postData());check(payload.get('form-name')==='contact','Netlify form-name preserved');check(payload.get('Company')==='Example','Netlify payload preserves fields');await route.fulfill({status:500,body:'Test error'});}else{const target=new URL(request.url());const response=await fetch(base+target.pathname);await route.fulfill({status:response.status,contentType:response.headers.get('content-type'),body:Buffer.from(await response.arrayBuffer())});}});
 await page.goto('https://qa.anthroprime.test/contact.html');await page.locator('#fullName').fill('QA');await page.locator('#workEmail').fill('qa@example.com');await page.locator('#company').fill('Example');await page.locator('#message').fill('Mock submission');await page.locator('#consent').check();await page.locator('#submitBtn').click();await page.waitForFunction(()=>document.querySelector('#form-status').textContent.includes('could not be sent'));check(await page.locator('#submitBtn').isEnabled(),'failed form can retry');check(await page.locator('#fullName').inputValue()==='QA','error retains input');
 await page.route('https://qa.anthroprime.test/',route=>route.fulfill({status:200,body:'Mock success'}));await page.locator('#submitBtn').click();await page.waitForFunction(()=>document.querySelector('#form-status').textContent.includes('Message received'));check(await page.locator('#fullName').inputValue()==='','success resets form');
 await context.close();
 const reduced=await browser.newContext({reducedMotion:'reduce',viewport:{width:390,height:844}});const reducedPage=await reduced.newPage();await reducedPage.goto(base);check(await reducedPage.locator('.architecture').evaluate(el=>el.classList.contains('paused')),'reduced motion starts paused');check(await reducedPage.locator('.flow-pulse').first().evaluate(el=>getComputedStyle(el).animationName)==='none','reduced motion animation off');await reduced.close();
 const noJS=await browser.newContext({javaScriptEnabled:false});const staticPage=await noJS.newPage();await staticPage.goto(base+'/services');check(await staticPage.locator('.service-detail').count()===27,'service content available without JS');await staticPage.locator('.service-detail summary').first().click();check(await staticPage.locator('.service-detail').first().getAttribute('open')!==null,'native details work without JS');await staticPage.goto(base+'/contact');check(await staticPage.locator('#contactForm').getAttribute('action')==='/thank-you.html','native form fallback');await noJS.close();
 // Every local static href/src points to a valid artifact or route; anchors exist.
 for(const route of pages){const context=await browser.newContext();const p=await context.newPage();await p.goto(base+route);const links=await p.locator('a[href],script[src],link[href],img[src]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')||n.getAttribute('src')));for(const link of new Set(links)){if(!link||/^(https?:|mailto:|data:)/.test(link))continue;const url=new URL(link,base+route);if(url.pathname===route&&url.hash){if(['ai','cloud','data','cyber','infra'].includes(url.hash.slice(1)))continue;check(await p.locator(`[id="${url.hash.slice(1)}"]`).count()>0,`anchor ${link}`);}else{const response=await fetch(base+url.pathname);check(response.ok,`local asset/link ${link}`);}}await context.close();}
 // All catalogue descriptions and scopes survive the content migration.
 const source=JSON.parse(readFileSync('content/site.json','utf8'));const html=readFileSync('dist/anthroprime_services.html','utf8');const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 for(const pillar of source.pillars)for(const service of pillar.services){check(html.includes(escape(service.name))&&html.includes(escape(service.description)),`preserved ${service.name}`);for(const group of service.groups)for(const item of group.items)check(html.includes(escape(item)),`preserved scope ${item}`);}
 check(errors.length===0,`Browser errors: ${errors.join('; ')}`);
 writeFileSync('artifacts/qa-report.json',JSON.stringify({assertions:count,errors,accessibility:report},null,2));
 console.log(`PASS: ${count} assertions; ${report.length} accessibility scans; ${pages.length} pages at 320, 390, 768 and 1440 pixels; no browser errors.`);
}finally{writeFileSync('artifacts/accessibility.json',JSON.stringify(report,null,2));await browser.close();server?.kill();}
