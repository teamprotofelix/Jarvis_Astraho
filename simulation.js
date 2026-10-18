import {modules, crew} from './world-data.js';
const roomMap=new Map(modules.map(m=>[m.id,m]));
export function coords(id){const m=roomMap.get(id);return {x:88+m.c*206+99,y:78+m.r*158+73};}
const dist=(a,b)=>Math.hypot(b.x-a.x,b.y-a.y);
function waypoints(from,to){
 // Three protected access lanes: vertical from local rooms, transverse central corridor, then vertical again.
 const a=coords(from),b=coords(to);return [a,{x:a.x,y:310},{x:b.x,y:310},b].filter((p,i,all)=>!i||dist(p,all[i-1])>.01);
}
export function createCrewSimulation(){
 const members=crew.map((c,i)=>({data:c,room:c.route[0],target:c.route[0],routeIndex:0,phase:'활동',pos:coords(c.route[0]),path:[],segment:0,pause:30+i*8,activityIndex:i%3}));
 let elapsed=0;
 function update(dt){dt=Math.min(Math.max(dt,0),.08);elapsed+=dt;
  for(const m of members){let remaining=dt;
   if(m.phase!=='이동'){m.pause-=remaining;if(m.pause<=0){m.routeIndex=(m.routeIndex+1)%m.data.route.length;m.target=m.data.route[m.routeIndex];m.path=waypoints(m.room,m.target).slice(1);m.segment=0;m.phase='이동';}continue;}
   let budget=m.data.speed*108*remaining;
   while(budget>0 && m.path.length){const p=m.path[0],d=dist(m.pos,p);if(d<=budget){m.pos={...p};m.path.shift();budget-=d;}else{m.pos={x:m.pos.x+(p.x-m.pos.x)*budget/d,y:m.pos.y+(p.y-m.pos.y)*budget/d};budget=0;}}
   if(!m.path.length){m.room=m.target;m.phase='활동';m.pause=25+((m.routeIndex*13+m.data.id.length*11)%30);m.activityIndex=(m.activityIndex+1)%3;}
  }
 }
 return {members,update,get elapsed(){return elapsed;},getOccupants:id=>members.filter(m=>m.phase!=='이동'&&m.room===id),getDisplayRoom:m=>m.phase==='이동'?`${roomMap.get(m.room).name} → ${roomMap.get(m.target).name}`:roomMap.get(m.room).name,getActivity:m=>m.phase==='이동'?'복도 이동 중':roomMap.get(m.room).activity[m.activityIndex]};
}
export const canonNote='사이트 속 위치·상태·시간과 새로운 사건은 공개용 허구 시뮬레이션이며, 실제 함선 관제 또는 사용자의 현실 활동 정보가 아닙니다.';
