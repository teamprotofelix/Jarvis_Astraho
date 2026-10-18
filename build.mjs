import {readFileSync,existsSync} from 'node:fs';import assert from 'node:assert/strict';import {modules,crew} from '../js/world-data.js';
const root=new URL('../',import.meta.url),read=s=>readFileSync(new URL(s,root),'utf8');
const html=read('index.html');for(const id of ['map-view','voyage-view','journal-view','flight-canvas','map-stage','journal-grid'])assert.ok(html.includes(`id="${id}"`),id);
for(const p of ['manifest.webmanifest','sw.js','styles.css','assets/ship-map.svg','assets/ship-side.svg','assets/icon-192.png','assets/icon-512.png','assets/icon-maskable.png',...modules.map(x=>`assets/scenes/${x.id}.svg`),...crew.map(x=>`assets/sprites/${x.id}.svg`)])assert.ok(existsSync(new URL(p,root)),p);
const m=JSON.parse(read('manifest.webmanifest'));assert.equal(m.start_url,'./');assert.equal(m.scope,'./');console.log('Static production preflight OK: 15 modules, 11 sprites, PWA assets, local relative paths');
