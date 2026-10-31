import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {modules} from '../js/world-data.js';
import {roomScene,lifeRooms} from '../js/views/living-view.js';
test('living view maps four new rooms and eleven original rooms with low-tier fallback',()=>{assert.equal(lifeRooms.length,4);for(const m of modules){assert.ok(roomScene(m.id).includes(lifeRooms.includes(m.id)?'life-scenes':'scenes'));assert.ok(roomScene(m.id,'low').includes('thumbs'));}});
test('optional art is cached only on demand, survives activation, and tolerates cache failure',async()=>{
 for(const failing of [false,true]){const listeners={},stores=new Map(),deleted=[];let network=0;const prefix='astraho-world:/subpath/:';
 const api={URL,Response,fetch:async()=>{network++;return new Response('art');},caches:{open:async name=>{if(name.endsWith('art-v1')&&failing)throw Error('quota');if(!stores.has(name)){const entries=new Map();stores.set(name,{addAll:async()=>{},match:async r=>entries.get(r.url),put:async(r,v)=>entries.set(r.url,v)});}return stores.get(name);},keys:async()=>[prefix+'old',prefix+'art-v1','astraho-world:/other/:old'],delete:async key=>deleted.push(key)},self:{registration:{scope:'https://local.test/subpath/'},addEventListener:(k,v)=>listeners[k]=v,clients:{claim:async()=>{}}}};
 vm.createContext(api);vm.runInContext(readFileSync(new URL('../sw.js',import.meta.url),'utf8'),api);
 let pending;listeners.install({waitUntil:p=>pending=p});await pending;assert.equal(network,0);listeners.activate({waitUntil:p=>pending=p});await pending;assert.deepEqual(deleted,[prefix+'old']);
 for(let i=0;i<2;i++){listeners.fetch({request:{method:'GET',url:'https://local.test/subpath/assets/hero/astraho-exterior-hero.webp'},respondWith:p=>pending=p});assert.equal(await (await pending).clone().text(),'art');}
 assert.equal(network,failing?2:1);
 }
});
