import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
const browser=await chromium.launch({channel:'chrome',headless:true});let checks=0;const errors=[];
const check=(c,m)=>{assert.ok(c,m);checks++;};
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000}}),p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/');await p.locator('.theme-toggle').click();
 check(await p.locator('html').getAttribute('data-theme')==='dark','dark theme selected');
 check(await p.locator('.discipline-strip').evaluate(el=>{const rgb=getComputedStyle(el).backgroundColor.match(/\d+/g).map(Number);return rgb.slice(0,3).every(c=>c<80);}),'discipline strip follows dark surfaces');
 await p.locator('.discipline-strip').scrollIntoViewIfNeeded();await p.screenshot({path:'artifacts/dark-strip-final.png'});
 for(const route of ['services','practices','contact']){
  await p.goto('http://127.0.0.1:4173/'+route);await p.waitForFunction(()=>document.querySelector('.hero-blend img').complete&&document.querySelector('.hero-blend img').naturalWidth>0);
  check(await p.locator('.hero-blend img').isVisible(),'blended hero image visible');check(await p.locator('h1').count()===1,'hero retains one heading');
  await p.screenshot({path:`artifacts/${route}-blended-dark.png`});await p.locator('.theme-toggle').click();await p.screenshot({path:`artifacts/${route}-blended-light.png`});await p.locator('.theme-toggle').click();
 }
 await p.goto('http://127.0.0.1:4173/artificial-intelligence');await p.evaluate(()=>document.fonts.ready);
 check(await p.locator('.robot-visual').count()===2,'robot replaces both AI constellation scenes');check(await p.locator('.visual-ai').count()===0,'previous constellation removed');
 await p.locator('[data-robot-wave]').first().click();await p.waitForFunction(()=>document.querySelector('.robot-greeting').textContent.includes('Hello'));check((await p.locator('.robot-greeting').first().textContent()).includes('Hello'),'robot greeting responds');
 check(await p.locator('.robot-visual').first().evaluate(el=>el.classList.contains('is-greeting')),'robot wave state');await p.screenshot({path:'artifacts/ai-robot-final.png'});
 await p.locator('[data-effects-toggle]').click();await p.locator('.robot-visual').first().scrollIntoViewIfNeeded();check(await p.locator('.robot-body').first().evaluate(el=>getComputedStyle(el).animationPlayState)==='paused','robot follows global pause');
 for(const width of [320,390,900,1024]){await p.setViewportSize({width,height:900});for(const route of ['services','practices','artificial-intelligence']){await p.goto('http://127.0.0.1:4173/'+route);check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${route} ${width} finishing layouts fit`);}if(width===390)await p.screenshot({path:'artifacts/ai-robot-mobile-final.png'});}
 await context.close();
 const reduced=await browser.newContext({reducedMotion:'reduce'}),rp=await reduced.newPage();await rp.goto('http://127.0.0.1:4173/artificial-intelligence');check(await rp.locator('.robot-body').first().evaluate(el=>getComputedStyle(el).animationName)==='none','robot respects reduced motion');await reduced.close();
 check(!errors.length,'no finishing browser errors');writeFileSync('artifacts/finishing-qa.json',JSON.stringify({checks,errors},null,2));console.log(`PASS: ${checks} finishing checks.`);
}finally{await browser.close();}
