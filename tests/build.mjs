import {webpInfo} from './webp.mjs';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {modules,crew,landscapes,sceneSrc,spriteSrc,thumbSrc,landscapeSrc} from '../js/world-data.js';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
const html=read('index.html'),main=read('js/main.js');
for(const match of main.matchAll(/\$\('#([\w-]+)'\)/g))assert.ok((html+main+read('js/views/living-view.js')).includes(`id="${match[1]}"`),`Missing DOM id: ${match[1]}`);
for(const match of html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g))assert.ok(existsSync(new URL(match[1],root)),`HTML asset: ${match[1]}`);
function scripts(dir){return readdirSync(new URL(dir,root),{withFileTypes:true}).flatMap(e=>e.isDirectory()?scripts(dir+'/'+e.name):[dir+'/'+e.name]);}
for(const file of scripts('js'))for(const match of read(file).matchAll(/from ['"](\.[^'"]+)['"]/g))assert.ok(existsSync(new URL(match[1],new URL(file,root))),`Import: ${file} ${match[1]}`);
for(const src of [...modules.map(m=>sceneSrc(m.id)),...modules.map(m=>thumbSrc(m.id)),...crew.map(c=>spriteSrc(c.id)),...landscapes.map((_,i)=>landscapeSrc(i))])assert.ok(existsSync(new URL(src,root)),src);
const context={URL,self:{registration:{scope:'https://example.org/subpath/'},addEventListener(){}}};vm.createContext(context);vm.runInContext(read('sw.js')+';this.files=STATIC',context);
for(const file of context.files)assert.ok(existsSync(new URL(file,root)),`Offline cache asset: ${file}`);
const manifest=JSON.parse(read('assets/art-manifest.json'));
assert.equal(manifest.assets.length,51);
for(const art of manifest.assets){const bytes=readFileSync(new URL(art.path,root));assert.equal(bytes.length,art.bytes,art.path);assert.equal(createHash('sha256').update(bytes).digest('hex'),art.sha256,art.path);assert.ok(art.bytes<350000,`Oversized image: ${art.path}`);}
const pwa=JSON.parse(read('manifest.webmanifest'));assert.equal(pwa.start_url,'./');assert.equal(pwa.scope,'./');
assert.ok(!read('styles.css').includes('@import'));
console.log(`Production preflight OK: ${modules.length} modules, ${crew.length} directional sheets, ${landscapes.length} landscapes, ${context.files.length} offline URLs; ${manifest.assets.reduce((s,a)=>s+a.bytes,0)} bytes WebP.`);

const extra=JSON.parse(read('assets/living-art-manifest.json'));
assert.equal(extra.assets.length,19);
for(const art of extra.assets){const b=readFileSync(new URL(art.path,root));assert.equal(b.length,art.bytes);assert.equal(createHash('sha256').update(b).digest('hex'),art.sha256,art.path);assert.ok(b.length<350000,art.path);const info=webpInfo(b);assert.equal(info.width,art.width,art.path);assert.equal(info.height,art.height,art.path);assert.equal(info.alpha,art.alpha,art.path);}
console.log(`Living art OK: ${extra.assets.length} WebP, ${extra.assets.reduce((n,a)=>n+a.bytes,0)} bytes; on demand, not shell precache.`);

for(const art of extra.assets){if(art.path.includes('/props/')){assert.equal(art.width,256);assert.equal(art.height,256);assert.equal(art.alpha,true);}if(art.path.includes('/fx/')){assert.equal(art.width,1152);assert.equal(art.height,192);assert.equal(art.width/art.height,6);assert.equal(art.alpha,true);}}
