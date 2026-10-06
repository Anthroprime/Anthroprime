const typedWord=document.querySelector('.people-typewriter');
if(typedWord){
 const letters=[...typedWord.querySelectorAll('.type-letter')],reduced=matchMedia('(prefers-reduced-motion: reduce)');let timers=[];
 const complete=()=>{timers.forEach(clearTimeout);timers=[];letters.forEach(letter=>{letter.classList.add('is-typed');letter.classList.remove('typing-current');});typedWord.classList.add('typewriter-complete');};
 if(reduced.matches||document.body.classList.contains('effects-paused'))complete();
 else {letters.forEach((letter,i)=>timers.push(setTimeout(()=>{letters.forEach(l=>l.classList.remove('typing-current'));letter.classList.add('is-typed','typing-current');},650+i*145)));timers.push(setTimeout(complete,650+letters.length*145+600));}
 document.addEventListener('ap-effects-change',event=>{if(event.detail)complete();});reduced.addEventListener('change',event=>{if(event.matches)complete();});document.addEventListener('visibilitychange',()=>{if(document.hidden)complete();});
}
document.querySelectorAll('.robot-visual').forEach(robot=>{
 let timer=0;
 const greeting=robot.querySelector('.robot-greeting');
 robot.querySelector('[data-robot-wave]').addEventListener('click',()=>{
  clearTimeout(timer);robot.classList.remove('is-greeting');
  requestAnimationFrame(()=>{greeting.textContent='Hello. Let’s build something useful.';robot.classList.add('is-greeting');timer=setTimeout(()=>robot.classList.remove('is-greeting'),4500);});
 });
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>robot.classList.toggle('robot-offscreen',!entries[0].isIntersecting),{threshold:.05}).observe(robot);
});
