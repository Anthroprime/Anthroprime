import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
const browser=await chromium.launch({channel:'chrome',headless:true});let checks=0;const scans=[];
const check=(v,m)=>{assert.ok(v,m);checks++;};
try{
 for(const width of [1440,390])for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width,height:1000}});await context.addInitScript(t=>localStorage.setItem('ap-theme',t),theme);const p=await context.newPage();
  for(const route of ['/','/services','/practices','/growth-advisor','/contact']){
   await p.goto('http://127.0.0.1:4173'+route);await p.evaluate(()=>document.fonts.ready);
   if(route==='/'){check(await p.locator('.hero-atmosphere').evaluate(el=>getComputedStyle(el).backgroundImage)==='none','homepage glow removed');await p.waitForFunction(()=>document.querySelector('.people-typewriter').classList.contains('typewriter-complete'));check(await p.locator('.type-letter.is-typed').count()===7,'word reveal completes');check(await p.locator('.typewriter-visual').getAttribute('aria-hidden')==='true','animated letters hidden from screen reader');check(await p.locator('.people-typewriter .visually-hidden').textContent()==='people.','complete accessible word');}
   if(route==='/growth-advisor')check(await p.locator('.map-ring').evaluate(el=>getComputedStyle(el).backgroundImage)==='none','growth center glow removed');
   if(['/services','/practices','/contact'].includes(route)){await p.waitForFunction(()=>document.querySelector('.hero-blend img').complete&&document.querySelector('.hero-blend img').naturalWidth>0);if(theme==='light')check(await p.locator('.hero-blend img').evaluate(el=>getComputedStyle(el).opacity)==='1','light photography not washed out');}
   check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'refinement fits viewport');
   const result=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();scans.push({route,width,theme,violations:result.violations});check(!result.violations.length,`${route} ${theme} contrast/accessibility: ${result.violations.map(v=>v.id).join(',')}`);
   if(width===1440)await p.screenshot({path:`artifacts/refined-${route==='/'?'home':route.slice(1)}-${theme}.png`});
  }
  await context.close();
 }
 const reduced=await browser.newContext({reducedMotion:'reduce'}),rp=await reduced.newPage();await rp.goto('http://127.0.0.1:4173/');check(await rp.locator('.type-letter.is-typed').count()===7,'reduced motion shows word immediately');await reduced.close();
 const plain=await browser.newContext({javaScriptEnabled:false}),np=await plain.newPage();await np.goto('http://127.0.0.1:4173/');check(await np.locator('.type-letter').first().evaluate(el=>getComputedStyle(el).clipPath)==='none','no-JS word visible');await plain.close();
 writeFileSync('artifacts/theme-refinement-qa.json',JSON.stringify({checks,scans},null,2));console.log(`PASS: ${checks} refinement checks; ${scans.length} accessibility scans.`);
}finally{await browser.close();}
