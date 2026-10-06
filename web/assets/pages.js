// Preserve native navigation and progressive cross-document transitions.
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const loader=document.querySelector('.page-loading-bar');
let navigationTimer=0;
const resetNavigation=()=>{document.body.classList.remove('page-leaving');loader?.classList.remove('loading');document.body.removeAttribute('aria-busy');};
addEventListener('pageshow',resetNavigation);
document.addEventListener('click',event=>{
 const anchor=event.target.closest('a[href]');
 if(!anchor||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||anchor.target||anchor.hasAttribute('download'))return;
 const url=new URL(anchor.href,location.href);
 if(url.origin!==location.origin||!/^https?:$/.test(url.protocol)||(url.pathname===location.pathname&&url.search===location.search))return;
 clearTimeout(navigationTimer);
 loader?.classList.add('loading');
 if(reducedMotion.matches||document.body.classList.contains('effects-paused'))return;
 // Native View Transitions handle the arrival. A brief exit bridges older browsers.
 event.preventDefault();document.body.classList.add('page-leaving');
 clearTimeout(navigationTimer);
 navigationTimer=setTimeout(()=>location.assign(url.href),140);
 setTimeout(resetNavigation,3500);
});
const stagesElement=document.querySelector('#system-data');
if(stagesElement){
 const stages=JSON.parse(stagesElement.textContent);
 document.querySelectorAll('[data-system-stage]').forEach(button=>button.addEventListener('click',()=>{
  const i=Number(button.dataset.systemStage);
  document.querySelectorAll('[data-system-stage]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  document.querySelector('#system-title').textContent=stages[i][0];
  document.querySelector('#system-description').textContent=stages[i][1];
  document.querySelector('#system-label').textContent=`0${i+1} / ${stages[i][0].toUpperCase()}`;
  document.querySelector('.system-art').dataset.selectedStage=i;
 }));
}
