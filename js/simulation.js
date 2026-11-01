import {jobsFor} from './research/facility-jobs.js';
import {behaviors,stateLabels} from './crew/behaviors.js';
import {createRandom,selectNextActivity,createLife} from './crew/utility.js';
import {modules, crew} from './world-data.js';
const rooms=new Map(modules.map(m=>[m.id,m]));
export const MAP={width:1200,height:620,roomWidth:190,roomHeight:132};
export function coords(id){const m=rooms.get(id);if(!m)throw new Error(`Unknown room: ${id}`);return {x:187+m.c*206,y:151+m.r*158};}
const distance=(a,b)=>Math.hypot(b.x-a.x,b.y-a.y);
export function routeBetween(from,to){
 const a=coords(from),b=coords(to),ra=rooms.get(from),rb=rooms.get(to);
 if(from===to)return [];
 const ay=224+ra.r*158,by=224+rb.r*158;
 // Enter only through lower doors. Cross-deck routes use exterior shafts.
 const shaft=a.x+b.x<1200?76:1124;
 const points=ra.r===rb.r?[a,{x:a.x,y:ay},{x:b.x,y:ay},b]:[a,{x:a.x,y:ay},{x:shaft,y:ay},{x:shaft,y:by},{x:b.x,y:by},b];
 return points.filter((p,i)=>!i||distance(p,points[i-1])>.01).slice(1);
}
export function createCrewSimulation({seed=20261031}={}){
 const random=createRandom(seed);let facilities={},project=null;
 const members=crew.map((data,i)=>({data,room:data.route[0],target:data.route[0],queued:null,routeIndex:0,phase:'활동',pos:coords(data.route[0]),path:[],pause:3+i*1.5,activityIndex:i%3,direction:0,life:createLife(i)}));
 const events=[];let elapsed=0,serial=0;
 const record=(m,text)=>{if(events.some(e=>e.person===m.data.id&&e.text===text&&elapsed-e.time<1))return;events.unshift({id:++serial,time:elapsed,person:m.data.id,text});if(events.length>12)events.pop();};
 const localJob=m=>({...behaviors[m.data.id].find(a=>a.room===m.room)||{id:m.data.id+'-local',room:m.room,state:'observe',prop:'holo-console',label:'공간 살펴보기'},duration:16});
 function startAction(m,job){m.phase='활동';m.direction=0;m.target=m.room;Object.assign(m.life,{state:job.state,actionId:job.id,start:elapsed,remaining:job.duration,animation:job.state,messageKey:job.id,prop:job.prop,label:job.label,task:null});m.pause=job.duration;record(m,`${m.data.name} · ${job.label}`);}
 function travel(m,target,task=null){if(target===m.room){startAction(m,task||localJob(m));return;}m.target=target;m.path=routeBetween(m.room,target);m.phase='이동';Object.assign(m.life,{state:'walk',start:elapsed,animation:'walk',prop:null,label:'복도 이동 중',task});record(m,`${m.data.name} · ${rooms.get(target).name}(으)로 이동`);}
 function requestTravel(id,target){const m=members.find(p=>p.data.id===id);if(!m||!rooms.has(target))return false;if(m.phase==='이동')m.queued=target;else travel(m,target);return true;}
 function interact(id){const m=members.find(m=>m.data.id===id);if(!m||m.phase==='이동'||m.life.state==='talk')return false;startAction(m,{id:m.data.id+'-talk',state:'talk',prop:'conversation-bubble',label:'짧은 안부 나누기',duration:6});return true;}
 function update(seconds){const dt=Number.isFinite(seconds)?Math.min(Math.max(seconds,0),.08):0;if(!dt)return;elapsed+=dt;
  for(const m of members){const life=m.life;life.energy=Math.max(0,Math.min(100,life.energy+(life.state==='rest'?1.6+(facilities.bio_dome ? .4 : 0):life.state==='walk'?-.08:-.32)*dt));
   if(m.phase!=='이동'){
    life.remaining=Math.max(0,life.remaining-dt);m.pause=life.remaining;
    if(life.remaining===0){if(life.state!=='idle')life.lastAction=life.actionId;const job=selectNextActivity(m,{elapsed,members,facilityJobs:jobsFor(m.data.id,facilities,project)},()=>random.next());m.routeIndex=(m.routeIndex+1)%m.data.route.length;m.activityIndex=(m.activityIndex+1)%3;if(job.room===m.room)startAction(m,job);else travel(m,job.room,job);}continue;
   }
   let budget=m.data.speed*160*dt;
   while(budget>0&&m.path.length){const p=m.path[0],dx=p.x-m.pos.x,dy=p.y-m.pos.y,d=distance(m.pos,p);m.direction=Math.abs(dx)>Math.abs(dy)?(dx<0?1:2):(dy<0?3:0);
    if(d<=budget){m.pos={...p};m.path.shift();budget-=d;}else{m.pos={x:m.pos.x+dx*budget/d,y:m.pos.y+dy*budget/d};budget=0;}}
   if(!m.path.length){m.room=m.target;const task=life.task;if(m.queued){const next=m.queued;m.queued=null;travel(m,next);}else startAction(m,task||localJob(m));}
  }
 }
 function snapshot(){return {elapsed,serial,rngState:random.state,members:members.map(({data,...m})=>({id:data.id,...structuredClone(m)})),events:structuredClone(events)};}
 function restore(state){elapsed=state.elapsed;serial=state.serial;random.state=state.rngState??seed;events.splice(0,events.length,...structuredClone(state.events));for(const saved of state.members){const m=members.find(m=>m.data.id===saved.id);if(!m)continue;const {id,...fields}=saved;Object.assign(m,structuredClone(fields));
   if(!saved.life){m.life=createLife(0,elapsed);m.life.remaining=Math.max(0,m.pause);if(m.phase==='이동'){m.life.state='walk';m.life.animation='walk';m.life.label='복도 이동 중';}}
   const full=routeBetween(m.room,m.target),suffix=full.slice(full.length-m.path.length);let safe=m.phase==='이동'&&m.path.length>0&&JSON.stringify(suffix)===JSON.stringify(m.path);
   if(safe){const previous=full.length===m.path.length?coords(m.room):full[full.length-m.path.length-1],next=m.path[0];safe=Math.abs((next.x-previous.x)*(m.pos.y-previous.y)-(next.y-previous.y)*(m.pos.x-previous.x))<.01&&m.pos.x>=Math.min(previous.x,next.x)&&m.pos.x<=Math.max(previous.x,next.x)&&m.pos.y>=Math.min(previous.y,next.y)&&m.pos.y<=Math.max(previous.y,next.y);}
   if(m.phase==='이동'&&!safe){m.pos=coords(m.room);m.target=m.room;m.path=[];m.phase='활동';m.pause=1;m.life=createLife(0,elapsed);m.life.remaining=1;record(m,`${m.data.name} · 저장 경로를 마지막 안전 공간으로 복구`);}
   if(m.phase==='활동'){m.pos=coords(m.room);m.path=[];m.target=m.room;}
  }}
 const getContext=m=>({room:m.room,state:m.life.state,target:m.target,start:m.life.start,remaining:m.life.remaining,energy:m.life.energy,queued:m.queued,lastAction:m.life.lastAction,preferredJobs:[...behaviors[m.data.id],...jobsFor(m.data.id,facilities,project)].map(a=>a.id),animation:m.life.animation,messageKey:m.life.messageKey});
 return {setFacilities(levels,active=null){facilities={...levels};project=active;},members,events,update,requestTravel,interact,snapshot,restore,getContext,get elapsed(){return elapsed;},get revision(){return serial;},getOccupants:id=>members.filter(m=>m.phase!=='이동'&&m.room===id),getDisplayRoom:m=>m.phase==='이동'?`${rooms.get(m.room).name} → ${rooms.get(m.target).name}`:rooms.get(m.room).name,getActivity:m=>`${stateLabels[m.life.state]} · ${m.life.label}`};
}
export const canonNote='위치·시간·상태와 새로운 일화는 아스트라호의 공개용 창작 시뮬레이션입니다.';
