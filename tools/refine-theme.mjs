import {readFileSync,writeFileSync} from 'node:fs';
let brand=readFileSync('tools/brand-components.mjs','utf8');
brand=brand.replace('<em>people.</em>',`<em class="people-typewriter"><span class="visually-hidden">people.</span><span class="typewriter-visual" aria-hidden="true">${[...'people.'].map(c=>`<span class="type-letter">${c}</span>`).join('')}</span></em>`);
writeFileSync('tools/brand-components.mjs',brand);
