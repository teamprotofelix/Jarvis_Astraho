import {behaviors,stateLabels} from '../crew/behaviors.js';
import {createLife} from '../crew/utility.js';
import {crew,modules} from '../world-data.js';
import {createCrewSimulation} from '../simulation.js';
import {FlightModel} from '../flight-model.js';
export const SCHEMA_VERSION=1,MAX_SAVE_BYTES=256*1024;
const roomIds=modules.map(m=>m.id),crewIds=crew.map(c=>c.id);
const fail=message=>{throw new Error(message);};
export function keys(value,allowed){if(!value||typeof value!=='object'||Array.isArray(value)||![Object.prototype,null].includes(Object.getPrototypeOf(value)))fail('객체 형식 오류');for(const key of Object.keys(value))if(!allowed.includes(key))fail(`허용되지 않는 키: ${key}`);}
const num=(n,min,max)=>{if(!Number.isFinite(n)||n<min||n>max)fail('수치 범위 오류');};
const choice=(n,values)=>{if(!values.includes(n))fail('식별자 오류');};
const text=(v,max=240)=>{if(typeof v!=='string'||v.length>max)fail('문자열 오류');};
const required=(v,template,optional=[])=>{keys(v,[...Object.keys(template),...optional]);for(const k of Object.keys(template))if(!(k in v))fail(`누락된 키: ${k}`);};
const point=p=>{required(p,{x:0,y:0});num(p.x,0,1200);num(p.y,0,620);};
export function createGameState({simulation=createCrewSimulation().snapshot(),flight=new FlightModel().snapshot(),ui={}}={}){
 return {schemaVersion:1,runId:globalThis.crypto?.randomUUID?.()||`local-${Date.now()}`,savedAt:new Date().toISOString(),simulation,flight,ui:{selectedCrew:'e',selectedView:'map',paused:false,zoom:1,speed:1,following:false,quality:'high',...ui}};
}
export function validateState(value){
 required(value,{schemaVersion:1,runId:'',savedAt:'',simulation:{},flight:{},ui:{}});
 if(value.schemaVersion!==1)fail('지원하지 않는 저장 버전');text(value.runId,80);text(value.savedAt,40);if(!Number.isFinite(Date.parse(value.savedAt)))fail('날짜 오류');
 const ui=value.ui;required(ui,{selectedCrew:'',selectedView:'',paused:false,zoom:1,speed:1,following:false,quality:''});choice(ui.selectedCrew,crewIds);choice(ui.selectedView,['map','voyage','journal','living','missions','expedition']);choice(ui.quality,['high','low']);choice(ui.speed,[1,2,4]);num(ui.zoom,.65,1.4);if(typeof ui.paused!=='boolean'||typeof ui.following!=='boolean')fail('설정 오류');
 const s=value.simulation;required(s,{elapsed:0,serial:0,members:[],events:[]},['rngState']);if(s.rngState!==undefined){num(s.rngState,1,4294967295);if(!Number.isInteger(s.rngState))fail('난수 상태 오류');}num(s.elapsed,0,1e10);num(s.serial,0,1e12);if(!Number.isInteger(s.serial))fail('이벤트 번호 오류');
 if(!Array.isArray(s.members)||s.members.length!==crew.length)fail('승무원 수 오류');
 const seen=new Set();for(const m of s.members){
  required(m,{id:'',room:'',target:'',queued:null,routeIndex:0,phase:'',pos:{},path:[],pause:0,activityIndex:0,direction:0},['life']);choice(m.id,crewIds);if(seen.has(m.id))fail('중복 승무원');seen.add(m.id);choice(m.room,roomIds);choice(m.target,roomIds);if(m.queued!==null)choice(m.queued,roomIds);choice(m.phase,['활동','이동']);point(m.pos);
  if(!Array.isArray(m.path)||m.path.length>6)fail('이동 경로 오류');m.path.forEach(point);choice(m.routeIndex,crew.find(c=>c.id===m.id).route.map((_,i)=>i));num(m.pause,-1,10000);choice(m.activityIndex,[0,1,2]);choice(m.direction,[0,1,2,3]);if(m.life!==undefined)validateLife(m,s.elapsed);
 }
 if(!Array.isArray(s.events)||s.events.length>12)fail('이벤트 상한 오류');for(const e of s.events){required(e,{id:0,time:0,person:'',text:''});num(e.id,1,s.serial);num(e.time,0,s.elapsed);choice(e.person,crewIds);text(e.text);}
 const f=value.flight,ft=new FlightModel(()=>.5).snapshot();required(f,ft);
 for(const k of ['x','y'])num(f[k],0,1);num(f.tilt,-2,2);for(const k of ['time','distance','collisions','lit'])num(f[k],0,1e12);num(f.sectorTime,0,42);num(f.spawnTime,0,2.3);num(f.invincible,0,3);num(f.shield,0,100);choice(f.sector,[0,1,2,3,4,5,6,7,8]);if(typeof f.manual!=='boolean')fail('조종 설정 오류');text(f.message);
 if(!Array.isArray(f.objects)||f.objects.length>12)fail('비행 객체 상한 오류');for(const o of f.objects){required(o,{kind:'',x:0,y:0,spin:0,age:0});choice(o.kind,['light','rock']);num(o.x,-.2,1.2);num(o.y,0,1);num(o.spin,0,6);num(o.age,0,100);}
 const copy=structuredClone(value);copy.simulation.rngState??=20261031;for(const [index,m] of copy.simulation.members.entries())if(!m.life){m.life=createLife(index,copy.simulation.elapsed);m.life.remaining=Math.max(0,m.pause);if(m.phase==='이동')Object.assign(m.life,{state:'walk',animation:'walk',label:'복도 이동 중'});}return copy;
}
// v1.1 had no persisted progress. An absent save starts from that same seed.
export function migrateState(value){return value==null?createGameState():validateState(value);}
export function parseSave(source){if(typeof source!=='string'||new TextEncoder().encode(source).length>MAX_SAVE_BYTES)fail('저장 파일은 256KB 이하여야 합니다');return validateState(JSON.parse(source,(k,v)=>{if(['__proto__','constructor','prototype'].includes(k))fail('오염 키 오류');return v;}));}
export function serializeSave(value){return JSON.stringify(validateState(value),null,2);}

const props=['tea-cup','holo-console','plant-care','wrench-repair','archive-book','security-shield','repair-drone','worldtree-spark','conversation-bubble','rest-chair'];
function validateLife(m,elapsed){const l=m.life,ids=['idle',m.id+'-talk',m.id+'-local',...behaviors[m.id].map(a=>a.id)];required(l,{state:'',actionId:'',start:0,remaining:0,energy:0,lastAction:null,animation:'',messageKey:'',prop:null,label:'',task:null});choice(l.state,Object.keys(stateLabels));choice(l.animation,Object.keys(stateLabels));choice(l.actionId,ids);if(l.lastAction!==null)choice(l.lastAction,ids);text(l.messageKey,80);text(l.label,120);num(l.start,0,elapsed);num(l.remaining,0,10000);num(l.energy,0,100);if(l.prop!==null)choice(l.prop,props);if((m.phase==='이동')!==(l.state==='walk'))fail('이동/행동 불일치');if(l.task!==null){const t=l.task;required(t,{id:'',room:'',state:'',prop:'',label:'',duration:0});choice(t.id,behaviors[m.id].map(a=>a.id));choice(t.room,roomIds);choice(t.state,Object.keys(stateLabels));choice(t.prop,props);text(t.label,120);num(t.duration,1,60);const original=behaviors[m.id].find(a=>a.id===t.id);if(t.room!==original.room||t.state!==original.state||t.prop!==original.prop)fail('업무 메타데이터 불일치');}}
