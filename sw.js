const PREFIX=`astraho-world:${new URL(self.registration.scope).pathname}:`;
const VERSION=PREFIX+'v1.2.0';
const ROOMS=['bridge','office','observatory','archive','chaos','restaurant','lounge','garden','training','earth','alchemy','workshop','strategy','security','onsen'];
const PEOPLE=['e','seoah','myr','urd','skuld','2b','marie','yor','amelia','wanda','serena'];
const SCENES=['nebula','ring','meteor','cluster','aurora','gateway','blackhole','planet','galaxy'];
const STATIC=['./','./index.html','./styles.css','./manifest.webmanifest','./js/world-data.js','./js/simulation.js','./js/flight-model.js','./js/flight.js','./js/main.js','./js/state/game-state.js','./js/state/storage.js','./js/state/persistence.js','./assets/ship-map.svg','./assets/ship.webp','./assets/icon-192.png','./assets/icon-512.png','./assets/icon-maskable.png',...ROOMS.flatMap(id=>[`./assets/scenes/${id}.webp`,`./assets/thumbs/${id}.webp`]),...PEOPLE.map(id=>`./assets/sprites/${id}.webp`),...SCENES.map(id=>`./assets/backgrounds/${id}.webp`)];
self.addEventListener('install',event=>event.waitUntil((async()=>{try{const cache=await caches.open(VERSION);await cache.addAll(STATIC);}catch(error){await caches.delete(VERSION);throw error;}})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==VERSION)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url),scope=new URL(self.registration.scope);
 if(event.request.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 event.respondWith((async()=>{const cache=await caches.open(VERSION),hit=await cache.match(event.request);if(hit)return hit;try{return await fetch(event.request);}catch{return event.request.mode==='navigate'?await cache.match(new URL('index.html',scope).href):Response.error();}})());
});
