import {chromium} from 'playwright';
const browser=await chromium.launch({channel:'chrome',headless:true});
const p=await browser.newPage({viewport:{width:1440,height:1000}});
for(const route of ['data','cybersecurity','cloud','infrastructure']){
 await p.goto('http://127.0.0.1:4173/'+route);await p.evaluate(()=>document.fonts.ready);
 await p.screenshot({path:`artifacts/${route}-hero-review.png`});
 await p.locator('#system').scrollIntoViewIfNeeded();await p.screenshot({path:`artifacts/${route}-system-review.png`});
}
await p.goto('http://127.0.0.1:4173/');await p.locator('#command-center').scrollIntoViewIfNeeded();await p.screenshot({path:'artifacts/readable-terminal.png'});
await p.setViewportSize({width:390,height:844});await p.goto('http://127.0.0.1:4173/cloud');await p.screenshot({path:'artifacts/cloud-mobile-review.png'});
await browser.close();
