import {mkdirSync,writeFileSync} from 'node:fs';
mkdirSync('web/assets/photos',{recursive:true});
const photos=[['infrastructure','klWUhr-wPJ8','imgix'],['data','40XgDxBfYXM','Jordan Harrison'],['cloud','QtGUJyNWY9g','Sergei A'],['security','Skf7HxARcoc','Markus Spiske']];
for(const [name,id,author] of photos){
 const source=`https://unsplash.com/photos/${id}`;
 const html=await (await fetch(source)).text();
 const matches=[...html.matchAll(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+[^"<>\s]*/g)];
 const url=matches.map(m=>m[0].replaceAll('&amp;','&')).find(u=>u.includes('photo-'));
 if(!url)throw new Error(`No image found: ${source}`);
 const clean=new URL(url);clean.search='?auto=format&fit=crop&w=1600&q=82&fm=jpg';
 const response=await fetch(clean);if(!response.ok)throw new Error(`Image download ${response.status}`);
 writeFileSync(`web/assets/photos/${name}.jpg`,Buffer.from(await response.arrayBuffer()));
 console.log(name,clean.origin+clean.pathname);
}
writeFileSync('web/assets/photos/CREDITS.md','# Photography\n\nLocally hosted photographs used under the [Unsplash License](https://unsplash.com/license). Stock photography illustrates technology themes; it does not depict AnthroPrime facilities or client projects.\n\n'+photos.map(([name,id,author])=>`- ${name}.jpg — ${author}: https://unsplash.com/photos/${id}`).join('\n')+'\n');
