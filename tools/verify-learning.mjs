import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
const browser=await chromium.launch({channel:'chrome',headless:true});
const base='http://127.0.0.1:4173';let count=0;const errors=[],scans=[];
const check=(c,m)=>{assert.ok(c,m);count++;};
try{
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:1000}}),p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));
  for(const route of ['data','cybersecurity','cloud','infrastructure','artificial-intelligence']){
   await p.goto(base+'/'+route);await p.locator('.lesson-canvas').scrollIntoViewIfNeeded();
   const r=await p.locator('.lesson-canvas').boundingBox(),boxes=await p.locator('.lesson-node').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}));
   for(const [i,b] of boxes.entries()){
    check(b.x>=r.x-1&&b.x+b.width<=r.x+r.width+1&&b.y>=r.y-1&&b.y+b.height<=r.y+r.height+1,`${route} ${width}: node ${i} within diagram`);
    for(const other of boxes.slice(i+1))check(!(b.x<other.x+other.width&&b.x+b.width>other.x&&b.y<other.y+other.height&&b.y+b.height>other.y),`${route} ${width}: nodes don't overlap`);
   }
   await p.locator('[data-lesson-node="3"]').focus();await p.keyboard.press('Enter');check(await p.locator('[data-lesson-index]').textContent()==='04','keyboard inspector');
   check(await p.locator('.lesson-node[aria-pressed=true]').count()===1,'single component selection');
  }
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:1440,height:1000}}),p=await context.newPage();
 for(const [route,scenario] of [['data','issue'],['cloud','outage'],['infrastructure','network'],['cybersecurity','incident'],['artificial-intelligence','autonomy']]){
  await p.goto(base+'/'+route);await p.locator('.lesson-canvas').scrollIntoViewIfNeeded();await p.locator('[data-lesson-scenario]').selectOption(scenario);
  const text=await p.locator('[data-lesson-outcome]').textContent();check(text.length>40,'scenario explains its consequence');
  if(route==='data'){check(text.includes('held'),'failed data batch held');check(await p.locator('.lesson-edge.blocked:not(.lesson-packet)').count()===2,'quality gate blocks downstream edges');await p.locator('[data-lesson-control]').uncheck();check((await p.locator('[data-lesson-outcome]').textContent()).includes('unchecked'),'gate bypass explained');check(await p.locator('.lesson-edge.risk:not(.lesson-packet)').count()===2,'unchecked path visually marked');}
  if(route==='cloud'){check(await p.locator('.lesson-edge.rerouted:not(.lesson-packet)').count()===1,'alternative path drawn');check((await p.locator('[data-lesson-node="2"]').textContent()).includes('UNAVAILABLE'),'failed zone marked');await p.locator('[data-lesson-control]').uncheck();check((await p.locator('[data-lesson-outcome]').textContent()).includes('no prepared alternative'),'missing recovery path explained');check(await p.locator('.lesson-edge.rerouted').count()===0,'alternative route removed');}
  if(route==='infrastructure'){check(await p.locator('[data-lesson-node="2"]').evaluate(n=>n.classList.contains('node-issue')),'network constraint highlighted');check((await p.locator('[data-lesson-description]').textContent()).includes('coordination'),'network role explained');}
  if(route==='cybersecurity'){check((await p.locator('.lesson-footnote').textContent()).includes('concurrently'),'security functions correctly described as concurrent');check(await p.locator('.lesson-node').count()===6,'six CSF functions');}
  if(route==='artificial-intelligence'){check((await p.locator('[data-lesson-node="4"]').textContent()).includes('REVIEW BYPASSED'),'review bypass visible');check(await p.locator('.lesson-edge.risk:not(.lesson-packet)').count()===1,'autonomy bypass edge drawn');}
  const axe=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();scans.push({route,scenario,violations:axe.violations});check(!axe.violations.length,`${route} changed-state accessibility: ${axe.violations.map(v=>v.id).join(',')}`);
  await p.locator('[data-lesson-reset]').click();check(await p.locator('[data-lesson-scenario]').evaluate(s=>s.selectedIndex===0),'reset restores scenario');check(await p.locator('.node-issue').count()===0,'reset clears constraints');
 }
 await p.goto(base+'/data');await p.locator('.lesson-canvas').scrollIntoViewIfNeeded();await p.waitForTimeout(100);await p.locator('[data-lesson-run]').click();check(await p.locator('[data-lesson-run]').getAttribute('aria-pressed')==='true','walkthrough starts');await p.locator('[data-effects-toggle]').click();check(await p.locator('[data-lesson-run]').getAttribute('aria-pressed')==='false','global pause stops walkthrough timers');
 for(const route of ['/','/services','/practices','/growth-advisor','/contact']){await p.goto(base+route);await p.locator('[data-story]').scrollIntoViewIfNeeded();await p.waitForFunction(()=>document.querySelector('.story-photo img').complete&&document.querySelector('.story-photo img').naturalWidth>0);check(await p.locator('.story-photo img').evaluate(i=>i.naturalWidth>0),'editorial photograph loaded');await p.locator('[data-story-step="2"]').focus();await p.keyboard.press('Enter');check(await p.locator('[data-story]').getAttribute('data-active-step')==='2','editorial keyboard control updates');check(await p.locator('[data-story-step="2"] .story-step-detail').isVisible(),'selected explanation visible');}
 await p.screenshot({path:'artifacts/contact-story-final.png'});
 await p.goto(base);if(await p.locator('body').evaluate(el=>el.classList.contains('effects-paused')))await p.locator('[data-effects-toggle]').click();
 await p.locator('.run-flow').click();await p.locator('[data-effects-toggle]').click();check(await p.locator('.run-flow').getAttribute('aria-pressed')==='false','global pause cancels architecture walkthrough');
 await p.locator('[data-effects-toggle]').click();await p.locator('#terminal-input').fill('simulate cloud');await p.locator('#terminal-input').press('Enter');await p.locator('[data-effects-toggle]').click();check(!await p.locator('.terminal-scene').evaluate(el=>el.classList.contains('running')),'global pause cancels terminal scenario');
 await context.close();
 const reduced=await browser.newContext({reducedMotion:'reduce'}),rp=await reduced.newPage();await rp.goto(base+'/cloud');await rp.locator('[data-lesson-run]').click();check(await rp.locator('[data-lesson-run]').getAttribute('aria-pressed')==='false','reduced motion uses manual stepping');check((await rp.locator('[data-lesson-progress]').textContent()).startsWith('1 of'),'manual step explains connection');await reduced.close();
 const staticContext=await browser.newContext({javaScriptEnabled:false}),sp=await staticContext.newPage();await sp.goto(base+'/data');check(await sp.locator('.lesson-static').isVisible(),'no-JS component descriptions available');check((await sp.locator('.lesson-static').textContent()).includes('batch is held'),'no-JS scenario explanation available');await staticContext.close();
 check(!errors.length,'no lesson browser errors');writeFileSync('artifacts/learning-qa.json',JSON.stringify({assertions:count,errors,scans},null,2));console.log(`PASS: ${count} learning checks; ${scans.length} scenario accessibility scans.`);
}finally{await browser.close();}
