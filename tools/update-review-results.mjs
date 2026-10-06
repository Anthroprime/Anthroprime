import {readFileSync,writeFileSync} from 'node:fs';
const main=JSON.parse(readFileSync('artifacts/qa-report.json','utf8'));
const learning=JSON.parse(readFileSync('artifacts/learning-qa.json','utf8'));
const finishing=JSON.parse(readFileSync('artifacts/finishing-qa.json','utf8'));
const refinement=JSON.parse(readFileSync('artifacts/theme-refinement-qa.json','utf8'));
const trust=JSON.parse(readFileSync('artifacts/trust-qa.json','utf8'));
const checks=(main.assertions+learning.assertions+finishing.checks+refinement.checks+trust.checks).toLocaleString('en-US');
const scans=main.accessibility.length+learning.scans.length+refinement.scans.length+trust.scans.length;
for(const file of ['README.md','DEVELOPMENT-PLAN.md']){
 let text=readFileSync(file,'utf8');
 text=text.replace(/[\d,]+ checks and \d+ accessibility scans/g,`${checks} checks and ${scans} accessibility scans`);
 text=text.replace('across five pages and four viewport widths','across ten pages and four viewport widths');
 writeFileSync(file,text);
}
