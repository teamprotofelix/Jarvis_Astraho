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
export function createCrewSimulation(){
 const members=crew.map((data,i)=>({data,room:data.route[0],target:data.route[0],queued:null,routeIndex:0,phase:'활동',pos:coords(data.route[0]),path:[],pause:3+i*1.5,activityIndex:i%3,direction:0}));
 const events=[];let elapsed=0,serial=0;
 const record=(m,text)=>{events.unshift({id:++serial,time:elapsed,person:m.data.id,text});if(events.length>12)events.pop();};
 function travel(m,target){if(target===m.room){m.pause=8;return;}m.target=target;m.path=routeBetween(m.room,target);m.phase='이동';record(m,`${m.data.name} · ${rooms.get(target).name}(으)로 이동`);}
 function requestTravel(id,target){const m=members.find(p=>p.data.id===id);if(!m||!rooms.has(target))return false;if(m.phase==='이동')m.queued=target;else travel(m,target);return true;}
 function update(seconds){const dt=Number.isFinite(seconds)?Math.min(Math.max(seconds,0),.08):0;elapsed+=dt;
  for(const m of members){
   if(m.phase!=='이동'){m.pause-=dt;if(m.pause<=0){m.routeIndex=(m.routeIndex+1)%m.data.route.length;travel(m,m.data.route[m.routeIndex]);}continue;}
   let budget=m.data.speed*160*dt;
   while(budget>0&&m.path.length){const p=m.path[0],dx=p.x-m.pos.x,dy=p.y-m.pos.y,d=distance(m.pos,p);m.direction=Math.abs(dx)>Math.abs(dy)?(dx<0?1:2):(dy<0?3:0);
    if(d<=budget){m.pos={...p};m.path.shift();budget-=d;}else{m.pos={x:m.pos.x+dx*budget/d,y:m.pos.y+dy*budget/d};budget=0;}}
   if(!m.path.length){m.room=m.target;m.phase='활동';m.direction=0;m.pause=8+(m.routeIndex*7+m.data.id.length*3)%15;m.activityIndex=(m.activityIndex+1)%3;record(m,`${m.data.name} · ${rooms.get(m.room).activity[m.activityIndex]}`);if(m.queued){const target=m.queued;m.queued=null;travel(m,target);}}
  }
 }
 return {members,events,update,requestTravel,get elapsed(){return elapsed;},getOccupants:id=>members.filter(m=>m.phase!=='이동'&&m.room===id),getDisplayRoom:m=>m.phase==='이동'?`${rooms.get(m.room).name} → ${rooms.get(m.target).name}`:rooms.get(m.room).name,getActivity:m=>m.phase==='이동'?'복도 이동 중':rooms.get(m.room).activity[m.activityIndex]};
}
export const canonNote='위치·시간·상태와 새로운 일화는 아스트라호의 공개용 창작 시뮬레이션입니다.';
