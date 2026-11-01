import {destination} from './catalog.js';
import {reject,number} from '../state/validation.js';
const append=(s,kind,id)=>{s.events.unshift({id:++s.revision,time:s.clock,missionId:s.active?.missionId??null,destinationId:id,kind});s.events.length=Math.min(24,s.events.length);};
export function reduceMission(state,event,{scanRate=1,stability=1}={}){
 const s=structuredClone(state),a=s.active;
 if(event.type==='tick'){
  number(event.dt,0,.1);number(event.distance,0,1e12);s.clock+=event.dt;
  for(const v of s.signals)if(v.status==='scanning'){v.scanProgress=Math.min(1,v.scanProgress+event.dt*scanRate/6);if(v.scanProgress===1){v.status='ready';append(s,'ready',v.signalId);}}
  if(a?.status==='traveling'&&event.distance-a.startDistance>=a.requiredDistance){a.status='arrived';s.signals.find(v=>v.signalId===a.destinationId).status='arrived';append(s,'arrived',a.destinationId);}
  else if(a?.status==='arrived'){a.status='expedition-ready';s.signals.find(v=>v.signalId===a.destinationId).status=a.status;append(s,'landing-ready',a.destinationId);}
  else if(a?.status==='returning'){a.returnProgress=Math.min(8,a.returnProgress+event.dt*stability);if(a.returnProgress===8){a.status='completed';s.signals.find(v=>v.signalId===a.destinationId).status='completed';append(s,'completed',a.destinationId);}}
  return s;
 }
 const v=s.signals.find(v=>v.signalId===event.id);if(!v)reject('알 수 없는 신호');const d=destination(event.id);
 if(event.type==='select'){s.selectedId=event.id;return s;}
 if(event.type==='discover'){if(v.status!=='undetected')reject('이미 발견된 신호입니다');v.status='detected';v.discoveredAt=s.clock;append(s,'discovered',event.id);}
 else if(event.type==='scan'){if(v.status!=='detected')reject('발견된 신호만 스캔할 수 있습니다');v.status='scanning';append(s,'scan',event.id);}
 else if(event.type==='depart'){if(v.status!=='ready'||!d.playable||d.requiresInvitation||a&&!['completed','abandoned'].includes(a.status))reject('항행 조건을 충족하지 못했습니다');number(event.distance,0,1e12);number(s.sequence+1,1,999999999,true);s.active={missionId:`mission-${++s.sequence}`,destinationId:d.id,seed:v.seed,status:'traveling',startDistance:event.distance,requiredDistance:480+v.seed%3*120,returnProgress:0};v.status='traveling';append(s,'depart',event.id);}
 else if(event.type==='return'){if(a?.destinationId!==event.id||a.status!=='expedition-ready')reject('귀환 가능한 임무가 없습니다');a.status='returning';v.status='returning';append(s,'return',event.id);}
 else if(event.type==='abandon'){if(!['scanning','ready','traveling','arrived','expedition-ready'].includes(v.status))reject('보류할 진행이 없습니다');v.status='abandoned';if(a?.destinationId===event.id)a.status='abandoned';append(s,'abandoned',event.id);}
 else if(event.type==='retry'){if(!['abandoned','completed'].includes(v.status))reject('새 관측을 시작할 수 없습니다');if(a?.destinationId===event.id)s.active=null;v.status='detected';v.scanProgress=0;append(s,'retry',event.id);}
 else reject('불법 임무 전이');return s;
}
