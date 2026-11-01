import {behaviors} from './behaviors.js';
export function createRandom(seed=20261031){let state=(seed>>>0)||1;return {next(){state^=state<<13;state^=state>>>17;state^=state<<5;return (state>>>0)/4294967296;},get state(){return state>>>0;},set state(value){state=(value>>>0)||1;}};}
export function selectNextActivity(member,{elapsed=0,members=[],facilityJobs=[]}={},random=()=>.5){
 const base=behaviors[member.data.id],jobs=[...base,...facilityJobs],life=member.life,phase=Math.floor(elapsed/120)%jobs.length;
 const candidates=jobs.map((job,index)=>({job,score:(index>=base.length?(job.id.includes('-project-')?150:82):40)+(index===phase?18:0)+(job.room===member.room?6:0)+(job.state==='rest'?(life.energy<32?160:life.energy<65?45:-65):0)-(job.id===life.lastAction?85:0)+random()*2}));
 // Marie greets the captain only from a shared public room; no inner monologue is published.
 if(member.data.id==='marie'&&members.some(m=>m.data.id==='e'&&m.phase!=='이동'&&m.room===member.room)&&life.lastAction!=='marie-talk')candidates.push({job:{id:'marie-talk',room:member.room,state:'talk',prop:'conversation-bubble',label:'함장 방문 인사'},score:life.energy<32?10:68});
 candidates.sort((a,b)=>b.score-a.score);const {id,room,state,prop,label}=candidates[0].job;return {id,room,state,prop,label,duration:12+Math.floor(random()*15)};
}
export function createLife(index=0,elapsed=0){return {state:'idle',actionId:'idle',start:elapsed,remaining:3+index*1.5,energy:90-index*2,lastAction:null,animation:'idle',messageKey:'idle',prop:null,label:'다음 일과 준비',task:null};}
