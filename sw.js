const PREFIX=`astraho-world:${new URL(self.registration.scope).pathname}:`;
const VERSION=PREFIX+'v1.3.0';
const ART=PREFIX+'art-v1';
const OPTIONAL=/^assets\/(?:hero|life-scenes|mockups|props|fx)\/[a-z0-9-]+\.webp$/;
const ROOMS=['bridge','office','observatory','archive','chaos','restaurant','lounge','garden','training','earth','alchemy','workshop','strategy','security','onsen'];
const PEOPLE=['e','seoah','myr','urd','skuld','2b','marie','yor','amelia','wanda','serena'];
const SCENES=['nebula','ring','meteor','cluster','aurora','gateway','blackhole','planet','galaxy'];
const STATIC=['./','./index.html','./styles.css','./manifest.webmanifest','./js/world-data.js','./js/simulation.js','./js/flight-model.js','./js/flight.js','./js/main.js','./js/views/living-view.js','./js/state/game-state.js','./js/state/storage.js','./js/state/persistence.js','./assets/ship-map.svg','./assets/ship.webp','./assets/icon-192.png','./assets/icon-512.png','./assets/icon-maskable.png',...ROOMS.flatMap(id=>[`./assets/scenes/${id}.webp`,`./assets/thumbs/${id}.webp`]),...PEOPLE.map(id=>`./assets/sprites/${id}.webp`),...SCENES.map(id=>`./assets/backgrounds/${id}.webp`)];
self.addEventListener('install',event=>event.waitUntil((async()=>{try{const cache=await caches.open(VERSION);await cache.addAll(STATIC);}catch(error){await caches.delete(VERSION);throw error;}})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==VERSION&&key!==ART)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url),scope=new URL(self.registration.scope);
 if(event.request.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 event.respondWith((async()=>{const cache=await caches.open(VERSION),hit=await cache.match(event.request);if(hit)return hit;const relative=url.pathname.slice(scope.pathname.length),optional=OPTIONAL.test(relative),art=optional?await caches.open(ART).catch(()=>null):null;const cached=await art?.match(event.request).catch(()=>null);if(cached)return cached;try{const response=await fetch(event.request);if(optional&&response.ok&&art)await art.put(event.request,response.clone()).catch(()=>{});return response;}catch{return event.request.mode==='navigate'?await cache.match(new URL('index.html',scope).href):Response.error();}})());
});
