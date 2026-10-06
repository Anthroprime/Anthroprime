// One-time migration. The supplied archive is content, not build instructions.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const require = createRequire(new URL('../original/tools/qa/package.json', import.meta.url));
const { JSDOM } = require('jsdom');
const doc = file => new JSDOM(readFileSync(`original/${file}`, 'utf8')).window.document;
const text = el => {if(!el)return '';const copy=el.cloneNode(true);copy.querySelectorAll('br').forEach(br=>br.replaceWith(' '));copy.querySelectorAll('p,h1,h2,h3,h4,li,span,div').forEach(node=>node.append(' '));return copy.textContent.replace(/\s+/g, ' ').trim();};
const services = doc('anthroprime_services.html');
const practices = doc('practices.html');
const growth = doc('strategic-growth-advisor.html');
const home = doc('index.html');
const contact = doc('contact.html');
const data = {
  pillars: [...services.querySelectorAll('.pillar-panel')].map(panel => ({
    id: panel.id.replace('panel-', ''), title: text(panel.querySelector('.pillar-title')),
    description: text(panel.querySelector('.pillar-tagline')),
    services: [...panel.querySelectorAll('.service-card[data-service-id]')].map(card => {
      const detail = services.getElementById(card.dataset.serviceId);
      return { id: card.dataset.serviceId, name: text(card.querySelector('.service-name')),
        description: text(card.querySelector('.service-tagline')),
        groups: [...(detail?.children || [])].map(group => ({ title: text(group.querySelector('.sub-group-title')), items: [...group.querySelectorAll('li')].map(text) })) };
    })
  })),
  securityDetails: [...home.querySelectorAll('.service-page')].map(page => ({ name: text(page.querySelector('h1')), description: text(page.querySelector('.service-hero p')), sections: [...page.querySelectorAll('.section-block')].map(s => ({title:text(s.querySelector('h2')),paragraphs:[...s.querySelectorAll(':scope > p')].map(text),items:[...s.querySelectorAll('.coverage-item,.process-step,:scope > ul > li,.outcome-item,.who-item')].map(text)})), text: text(page) })),
  frameworks: [...practices.querySelectorAll('.framework-card')].map(card => ({name:text(card.querySelector('.framework-name')),type:text(card.querySelector('.framework-badge')),description:text(card.querySelector('.framework-desc')),tags:[...card.querySelectorAll('.framework-pill')].map(text)})),
  checklists: [...practices.querySelectorAll('.checklist-card')].map(card => ({name:text(card.querySelector('.checklist-name')),description:text(card.querySelector('.checklist-desc')),items:[...card.querySelectorAll('.chk-text')].map(text)})),
  maturity: [...practices.querySelectorAll('.ladder-step')].map(step => ({name:text(step.querySelector('.ladder-name')),description:text(step.querySelector('.ladder-desc'))})),
  advisory: [...growth.querySelectorAll('.pillar-card')].map(card => ({name:text(card.querySelector('h3')),description:text(card.querySelector('p'))})),
  advisoryDetails: [...growth.querySelectorAll('.detail-card')].map(card => ({name:text(card.querySelector('h3')),description:text(card.querySelector('.sub')),items:[...card.querySelectorAll('li')].map(text),note:text(card.querySelector('.mandate-note'))})),
  advisorySections: [...growth.querySelectorAll('section')].filter(s => !s.classList.contains('hero') && !s.classList.contains('cta')).map(section => ({title:text(section.querySelector('h2')),blocks:[...section.querySelectorAll('h3,p,ul')].filter(node=>!node.classList.contains('eyebrow')&&!node.closest('.diagram')).map(node=>node.tagName==='UL'?{type:'list',items:[...node.querySelectorAll('li')].map(text)}:{type:node.tagName==='H3'?'heading':'paragraph',text:text(node)})})),
  about: [...home.querySelectorAll('.about-text p')].map(text),
  approach: [...home.querySelectorAll('.a-step')].map(step=>({name:text(step.querySelector('h4')),description:text(step.querySelector('p'))})),
  contactForm: contact.querySelector('#contactForm').outerHTML,
  originalText: Object.fromEntries(['index.html','anthroprime_services.html','practices.html','contact.html','strategic-growth-advisor.html'].map(file=>{const d=doc(file);d.querySelectorAll('script,style').forEach(e=>e.remove());return [file,text(d.body)];}))
};
const cyber=data.pillars.find(p=>p.id==='cyber');
for(const [i,card] of [...services.querySelectorAll('.industry-card')].entries())cyber.services.push({id:`cyber-specialist-${i+1}`,name:text(card.querySelector('.industry-name')),description:text(card.querySelector('.industry-desc')),groups:[{title:'Specialist scope',items:[...card.querySelectorAll('li')].map(text)}]});
for(const [i,detail] of data.securityDetails.entries()){if(cyber.services.some(s=>s.name===detail.name))continue;cyber.services.push({id:`cyber-people-${i+1}`,name:detail.name,description:detail.description,groups:detail.sections.map(section=>({title:section.title,items:[...section.paragraphs,...section.items]}))});}
mkdirSync('content', { recursive:true });
writeFileSync('content/site.json', JSON.stringify(data, null, 2));
console.log(`Migrated ${data.pillars.reduce((n,p)=>n+p.services.length,0)} services, ${data.frameworks.length} frameworks, ${data.checklists.length} checklists, ${data.advisory.length} advisory pillars.`);
