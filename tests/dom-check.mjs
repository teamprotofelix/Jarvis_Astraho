// Optional non-rendering DOM integration. Usage:
// node --experimental-vm-modules tests/dom-check.mjs /absolute/path/to/linkedom/esm/index.js
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const {parseHTML}=await import(pathToFileURL(process.argv[2]));
const root=new URL('../',import.meta.url),{window,document}=parseHTML(readFileSync(new URL('index.html',root),'utf8'));
const $=s=>document.querySelector(s);let focused=document.body;const frames=[];const observers=[];
Object.defineProperty(document,'activeElement',{get:()=>focused});
window.HTMLElement.prototype.focus=function(){focused=this;};window.HTMLElement.prototype.scrollIntoView=function(){};
Object.defineProperty($('#map-stage'),'clientWidth',{get:()=>parseFloat($('#map-stage').style.width)||1200});Object.defineProperty($('#map-scroll'),'clientWidth',{value:360});
Object.defineProperty($('#journal-filter'),'value',{value:'all',writable:true});
$('#flight-canvas').getBoundingClientRect=()=>({width:360,height:430});
$('#flight-canvas').getContext=()=>new Proxy({},{get:()=>()=>{}});$('#exp-canvas').getContext=()=>new Proxy({},{get:()=>()=>{}});$('#exp-canvas').getBoundingClientRect=()=>({width:360,height:320});
class ImageStub{complete=false;naturalWidth=0;naturalHeight=0;}
class IntersectionStub{constructor(cb){this.cb=cb;observers.push(this);}observe(element){this.element=element;}set(value){this.cb([{isIntersecting:value}]);}}
const context=vm.createContext({structuredClone,TextEncoder,Blob,setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,document,window,console,URL,Image:ImageStub,IntersectionObserver:IntersectionStub,navigator:{},matchMedia:()=>({matches:false}),requestAnimationFrame:cb=>frames.push(cb),innerWidth:360,devicePixelRatio:1,performance:{now:()=>0}});
const modules=new Map();function load(url){if(!modules.has(url.href))modules.set(url.href,new vm.SourceTextModule(readFileSync(url,'utf8'),{context,identifier:url.href}));return modules.get(url.href);}
const entry=load(new URL('js/main.js',root));await entry.link((specifier,ref)=>load(new URL(specifier,ref.identifier)));await entry.evaluate();
let clock=0;function advance(count){for(let i=0;i<count;i++){clock+=34;const fn=frames.shift();assert.ok(fn,'single RAF remains scheduled');fn(clock);}assert.equal(frames.length,1);}
function click(selector){const el=$(selector);assert.ok(el,selector);el.focus();el.dispatchEvent(new window.Event('click',{bubbles:true}));}
function key(type,key){const e=new window.Event(type,{cancelable:true});e.key=key;window.dispatchEvent(e);}
const checks=[];function check(name,fn){fn();checks.push(name);console.log('OK',name);}
check('boot builds all 15 rooms and 11 directional sprites',()=>{assert.equal(document.querySelectorAll('.map-room').length,15);assert.equal(document.querySelectorAll('.crew-sprite').length,11);assert.equal($('#observer-title').textContent,'E');advance(2);});
check('resident selection, authored talk and follow controls',()=>{click('.crew-pill[data-person="myr"]');assert.equal($('#observer-title').textContent,'미르');click('#talk-person');assert.match($('#talk-response').textContent,/은재/);click('#follow-person');assert.equal($('#follow-person').getAttribute('aria-pressed'),'true');});
check('room image, activity response, background inertness and focus restoration',()=>{click('.module-card[data-room="garden"]');assert.equal($('#dialog-backdrop').hidden,false);assert.equal($('.app-shell').inert,true);assert.match($('.dialog-image img').src,/garden(?:-life)?.webp/);click('[data-room-action="garden"]');assert.match($('#room-response').textContent,/위그드라실/);key('keydown','Escape');assert.equal($('#dialog-backdrop').hidden,true);assert.equal($('.app-shell').inert,false);assert.equal(document.activeElement.dataset.room,'garden');});
check('room resident dialogue and previous/next navigation',()=>{click('.module-card[data-room="bridge"]');click('[data-room-person="seoah"]');assert.match($('#room-response').textContent,/에온/);click('[data-nav-room="office"]');assert.equal($('#detail-title').textContent,'함장 집무실');click('#dialog-close');});
check('captain visit queues gradual travel and selects follow camera',()=>{const before=$('.crew-sprite[data-person="e"]').style.top;click('.module-card[data-room="onsen"]');click('[data-visit="onsen"]');assert.equal($('#observer-title').textContent,'E');assert.equal($('#dialog-backdrop').hidden,true);assert.match($('#talk-response').textContent,/이동을 예약/);assert.equal($('.crew-sprite[data-person="e"]').style.top,before);advance(80);assert.notEqual($('.crew-sprite[data-person="e"]').style.top,before);});
check('explicit pause freezes resident position and resumes',()=>{click('#motion-toggle');const before=$('.crew-sprite[data-person="e"]').style.top;advance(40);assert.equal($('.crew-sprite[data-person="e"]').style.top,before);click('#motion-toggle');advance(40);assert.notEqual($('.crew-sprite[data-person="e"]').style.top,before);});
check('flight navigation, manual focus and keyboard steering',()=>{click('[data-view="voyage"]');observers.find(o=>o.element.id==='flight-wrap').set(true);click('#manual-btn');assert.equal(document.activeElement.id,'flight-wrap');assert.equal($('#manual-pad').hidden,false);const x=parseFloat($('#flight-ship').style.left);key('keydown','d');advance(12);key('keyup','d');assert.ok(parseFloat($('#flight-ship').style.left)>x);});
check('modal pause clears held flight input',()=>{key('keydown','a');click('#help-button');advance(10);click('#dialog-close');const x=$('#flight-ship').style.left;advance(10);assert.equal($('#flight-ship').style.left,x);});
check('blur/focus clears held keys and respects manual mode',()=>{$('#flight-wrap').focus();key('keydown','d');window.dispatchEvent(new window.Event('blur'));advance(10);window.dispatchEvent(new window.Event('focus'));const x=$('#flight-ship').style.left;advance(10);assert.equal($('#flight-ship').style.left,x);assert.equal($('#mode-label').textContent,'MANUAL');});
check('sector change and auto controls update HUD',()=>{const sector=$('#sector-name').textContent;click('#next-sector');assert.notEqual($('#sector-name').textContent,sector);click('#auto-btn');assert.equal($('#mode-label').textContent,'AUTOPILOT');assert.equal($('#manual-pad').hidden,true);});
check('journal opens authored entry and filters module',()=>{click('[data-view="journal"]');assert.equal(document.querySelectorAll('.journal-card').length,12);$('#journal-filter').value='earth';$('#journal-filter').dispatchEvent(new window.Event('change'));assert.equal(document.querySelectorAll('.journal-card').length,1);click('.journal-card');assert.match($('#detail-title').textContent,/빗소리/);click('#dialog-close');});
check('map zoom and speed are operable after switching back',()=>{click('[data-view="map"]');const width=parseFloat($('#map-stage').style.width);click('#zoom-in');assert.ok(parseFloat($('#map-stage').style.width)>width);click('#sim-speed');assert.equal($('#sim-speed').textContent,'2× 생활');assert.ok(document.querySelectorAll('[aria-pressed="true"]').length>=1);});
console.log(`${checks.length} DOM integration groups passed. This is not a browser/layout/device test.`);
