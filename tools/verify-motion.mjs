import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
for(const reduced of [false,true]){
 const context=await browser.newContext({reducedMotion:reduced?'reduce':'no-preference'});
 if(!reduced)await context.addInitScript(()=>localStorage.setItem('ap-effects-paused','true'));
 const p=await context.newPage();await p.goto('http://127.0.0.1:4173/cloud');
 const transition=await p.evaluate(()=>getComputedStyle(document.documentElement,'::view-transition-new(root)').animationName);
 assert.equal(transition,'none','motion preferences disable page transition animation');
 await p.locator('.domain-rail a[href="/data"]').click();await p.waitForURL('http://127.0.0.1:4173/data');
 assert.equal(await p.locator('body').evaluate(el=>el.classList.contains('page-leaving')),false);
 if(reduced)assert.equal(await p.locator('.visual-construct>span').first().evaluate(el=>getComputedStyle(el).animationName),'none');
 await context.close();
}
await browser.close();console.log('PASS: reduced-motion and paused-effects navigation');
