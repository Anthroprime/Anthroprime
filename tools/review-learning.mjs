import {chromium} from 'playwright';
const browser=await chromium.launch({channel:'chrome',headless:true});
const p=await browser.newPage({viewport:{width:1440,height:1000}});
for(const route of ['data','cybersecurity','cloud','infrastructure']){
 await p.goto('http://127.0.0.1:4173/'+route);await p.evaluate(()=>document.fonts.ready);await p.locator('#why-it-matters').scrollIntoViewIfNeeded();await p.screenshot({path:`artifacts/${route}-learning-review.png`});
}
await p.goto('http://127.0.0.1:4173/practices');await p.locator('[data-story]').scrollIntoViewIfNeeded();await p.waitForFunction(()=>document.querySelector('.story-photo img').complete&&document.querySelector('.story-photo img').naturalWidth>0);await p.screenshot({path:'artifacts/practice-story-review.png'});
await p.setViewportSize({width:390,height:844});await p.goto('http://127.0.0.1:4173/data');await p.locator('.lesson-workbench').scrollIntoViewIfNeeded();await p.screenshot({path:'artifacts/data-lesson-mobile.png'});
await browser.close();
