import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {modules,crew,landscapes,sceneSrc,spriteSrc,thumbSrc,landscapeSrc} from '../js/world-data.js';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
const html=read('index.html'),main=read('js/main.js');
for(const match of main.matchAll(/\$\('#([\w-]+)'\)/g))assert.ok((html+main).includes(`id="${match[1]}"`),`Missing DOM id: ${match[1]}`);
for(const match of html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g))assert.ok(existsSync(new URL(match[1],root)),`HTML asset: ${match[1]}`);
for(const file of readdirSync(new URL('js',root)))for(const match of read('js/'+file).matchAll(/from ['"](\.[^'"]+)['"]/g))assert.ok(existsSync(new URL(match[1],new URL('js/'+file,root))),`Import: ${file} ${match[1]}`);
for(const src of [...modules.map(m=>sceneSrc(m.id)),...modules.map(m=>thumbSrc(m.id)),...crew.map(c=>spriteSrc(c.id)),...landscapes.map((_,i)=>landscapeSrc(i))])assert.ok(existsSync(new URL(src,root)),src);
const context={URL,self:{registration:{scope:'https://example.org/subpath/'},addEventListener(){}}};vm.createContext(context);vm.runInContext(read('sw.js')+';this.files=STATIC',context);
for(const file of context.files)assert.ok(existsSync(new URL(file,root)),`Offline cache asset: ${file}`);
const manifest=JSON.parse(read('assets/art-manifest.json'));
assert.equal(manifest.assets.length,51);
for(const art of manifest.assets){const bytes=readFileSync(new URL(art.path,root));assert.equal(bytes.length,art.bytes,art.path);assert.equal(createHash('sha256').update(bytes).digest('hex'),art.sha256,art.path);assert.ok(art.bytes<350000,`Oversized image: ${art.path}`);}
const pwa=JSON.parse(read('manifest.webmanifest'));assert.equal(pwa.start_url,'./');assert.equal(pwa.scope,'./');
assert.ok(!read('styles.css').includes('@import'));
console.log(`Production preflight OK: ${modules.length} modules, ${crew.length} directional sheets, ${landscapes.length} landscapes, ${context.files.length} offline URLs; ${manifest.assets.reduce((s,a)=>s+a.bytes,0)} bytes WebP.`);
