import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
const browser=await chromium.launch({channel:'chrome',headless:true});
let checks=0;const scans=[],errors=[],external=[];
const check=(value,label)=>{assert.ok(value,label);checks++;};
try{
 for(const width of [320,390,768,1440])for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
  await context.addInitScript(theme=>localStorage.setItem('ap-theme',theme),theme);
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));page.on('request',request=>{if(new URL(request.url()).origin!=='http://127.0.0.1:4173')external.push(request.url());});
  for(const route of ['/trust','/data-notice','/missing-page']){
   const response=await page.goto('http://127.0.0.1:4173'+route);await page.evaluate(()=>document.fonts.ready);
   check(response.status()===(route==='/missing-page'?404:200),'correct route status');
   check(await page.locator('h1').count()===1,'one page heading');
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no overflow');
   check(!!response.headers()['content-security-policy'],'security headers retained');
   const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();scans.push({route,width,theme,violations:result.violations});check(result.violations.length===0,`${route}: ${result.violations.map(v=>v.id+': '+v.nodes.map(n=>n.target).join(',')).join('; ')}`);
   if(route==='/trust'){check(await page.locator('.assurance-steps li').count()===4,'assessment steps');await page.waitForFunction(()=>document.querySelector('.trust-visual img').naturalWidth>0);}
   if(width===1440)await page.screenshot({path:`artifacts/professional-${route.slice(1)}-${theme}.png`,fullPage:true});
  }
  await context.close();
 }
 const context=await browser.newContext();const page=await context.newPage();
 await page.goto('http://127.0.0.1:4173/data-notice');
 await page.evaluate(()=>{localStorage.setItem('unrelated-key','preserve');['ap-theme','ap-effects-paused','ap-motion-paused','ap-checklists'].forEach(key=>localStorage.setItem(key,'test'));});
 await page.locator('[data-clear-preferences]').click();
 check(await page.evaluate(()=>['ap-theme','ap-effects-paused','ap-motion-paused','ap-checklists'].every(key=>localStorage.getItem(key)===null)),'all site preferences removed');
 check(await page.evaluate(()=>localStorage.getItem('unrelated-key')==='preserve'),'unrelated browser data preserved');
 check((await page.locator('[data-preferences-status]').textContent()).includes('cleared'),'clear announced');
 await page.goto('http://127.0.0.1:4173/contact');check(await page.locator('.form-guidance').count()===2,'guidance adjacent to both forms');check(await page.locator('.domain-collection').count()===0,'focused contact journey');
 await page.goto('http://127.0.0.1:4173/cybersecurity');check(await page.locator('.engagement-strip a').getAttribute('href')==='/trust','cyber engagement guidance');
 await page.goto('http://127.0.0.1:4173/thank-you.html');check(await page.locator('meta[name=robots]').getAttribute('content')==='noindex','confirmation not indexed');check(await page.locator('link[rel=canonical]').getAttribute('href')==='https://www.anthroprime.com/thank-you.html','confirmation canonical');
 check(readFileSync('dist/sitemap.xml','utf8').includes('/data-notice</loc>'),'notice in sitemap');check(readFileSync('dist/_redirects','utf8').includes('/trust /trust.html 200'),'manual deploy route');
 const csp=(await fetch('http://127.0.0.1:4173/')).headers.get('content-security-policy');
 check(csp.includes("object-src 'none'")&&csp.includes("base-uri 'none'"),'object and base restrictions served');
 check(readFileSync('dist/_headers','utf8').includes(csp),'manual-deploy headers match preview policy');
 await context.close();check(errors.length===0,'no browser exceptions');check(external.length===0,'no external requests from new pages');
 writeFileSync('artifacts/trust-qa.json',JSON.stringify({checks,scans,errors,external},null,2));console.log(`Professional review: ${checks} checks, ${scans.length} accessibility scans passed.`);
}finally{await browser.close();}
