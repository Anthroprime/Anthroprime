import {readFileSync,writeFileSync} from 'node:fs';
const url='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400..700;1,400..700&display=swap';
const res=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'}});
if(!res.ok)throw Error('Could not load font stylesheet');
const source=await res.text();
const blocks=source.split('/* latin */').slice(1).map(s=>s.slice(0,s.indexOf('}')+1));
if(blocks.length!==2)throw Error('Expected normal and italic serif fonts');
let css=blocks.join('\n');let i=0;
for(const match of [...css.matchAll(/https:\/\/fonts\.gstatic\.com\/[^)]+/g)]){const font=await fetch(match[0]);if(!font.ok)throw Error('Could not download font');const name=`brand-serif-${++i}.woff2`;writeFileSync(`web/assets/fonts/${name}`,Buffer.from(await font.arrayBuffer()));css=css.replace(match[0],`/assets/fonts/${name}`);}
const current=readFileSync('web/assets/fonts.css','utf8').split('/* AnthroPrime brand serif */')[0];
writeFileSync('web/assets/fonts.css',`${current}\n/* AnthroPrime brand serif */\n${css}`);
const license=await fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/OFL.txt');if(!license.ok)throw Error('Font license could not be downloaded');writeFileSync('web/assets/fonts/Cormorant-Garamond-LICENSE.txt',await license.text());
console.log('Added locally hosted Cormorant Garamond, normal and italic.');
