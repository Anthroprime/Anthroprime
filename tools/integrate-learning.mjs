import {readFileSync,writeFileSync} from 'node:fs';
let build=readFileSync('tools/build.mjs','utf8');
if(!build.includes('/assets/learning.css'))build=build.replace('<link rel="stylesheet" href="/assets/pages.css">','<link rel="stylesheet" href="/assets/pages.css"><link rel="stylesheet" href="/assets/learning.css">');
if(!build.includes('/assets/learning.js'))build=build.replace('<script src="/assets/pages.js" defer></script>','<script src="/assets/pages.js" defer></script><script src="/assets/learning.js" defer></script>');
build=build.replace('${body}${domainCollection}', '${body.includes(cta)?body.replace(cta,editorialStory(id)+cta):body+editorialStory(id)}${domainCollection}');
writeFileSync('tools/build.mjs',build);
