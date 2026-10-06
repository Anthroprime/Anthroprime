import {readFileSync,writeFileSync} from 'node:fs';
let css=readFileSync('web/assets/pages.css','utf8').replaceAll('var(--border)','var(--line)');writeFileSync('web/assets/pages.css',css);
let tests=readFileSync('tools/verify.mjs','utf8').replace("const pages=['/','/services','/practices','/growth-advisor','/contact'];", "const pages=['/','/services','/practices','/growth-advisor','/contact','/artificial-intelligence','/data','/cybersecurity','/cloud','/infrastructure'];");
tests=tests.replace(" // On narrow screens", `
 // Dedicated discipline pages have interactive stages, preserved scope and photography.
 const domainContext=await browser.newContext({viewport:{width:1440,height:1000}});const domainTab=await domainContext.newPage();
 for(const route of ['/artificial-intelligence','/data','/cybersecurity','/cloud','/infrastructure']){
  await domainTab.goto(base+route);
  check(await domainTab.locator('.domain-rail [aria-current=page]').getAttribute('href')===route,'discipline navigation current state');
  check(await domainTab.locator('.domain-scope details').count()>0,'dedicated service scope');
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
 // On narrow screens`);
tests=tests.replace('all five pages at','all ten pages at');
writeFileSync('tools/verify.mjs',tests);
