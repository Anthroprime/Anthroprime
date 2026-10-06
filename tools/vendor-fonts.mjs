// One-time asset preparation; production has no Google Fonts dependency.
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
mkdirSync('web/assets/fonts',{recursive:true});
const response=await fetch('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400..700&family=Manrope:wght@400..800&display=swap',{headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'}});
if(!response.ok)throw Error('Font CSS could not be downloaded');
let css=await response.text();
const blocks=css.split('/* latin */').slice(1).map(s=>s.slice(0,s.indexOf('}')+1));
if(blocks.length!==2)throw Error('Expected two Latin font families');
css=blocks.join('\n');
let i=0;
for(const match of [...css.matchAll(/https:\/\/fonts\.gstatic\.com\/[^)]+/g)]){const url=match[0];const name=`font-${++i}.woff2`;const asset=await fetch(url);if(!asset.ok)throw Error('Font download failed');writeFileSync(`web/assets/fonts/${name}`,Buffer.from(await asset.arrayBuffer()));css=css.replace(url,`/assets/fonts/${name}`);}
writeFileSync('web/assets/fonts.css',css);
writeFileSync('web/assets/site.css',readFileSync('web/assets/site.css','utf8').replace(/^@import[^\n]+/,"@import url('/assets/fonts.css');"));
for(const [name,url] of [['DM-Sans','https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/OFL.txt'],['Manrope','https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/OFL.txt']]){const license=await fetch(url);if(!license.ok)throw Error('License download failed');writeFileSync(`web/assets/fonts/${name}-LICENSE.txt`,await license.text());}
console.log(`Vendored ${i} font files and their SIL licenses.`);
