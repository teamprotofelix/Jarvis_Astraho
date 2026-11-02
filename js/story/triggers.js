import {chapter} from './catalog.js';
import {offerStory,followStory} from './model.js';
const offer=(s,eventId,sourceId,simTime)=>offerStory(s,{eventId,triggerId:chapter(eventId).triggerId,sourceId,simTime});
export function storyFromChanges(story,before,after){let s=story;const time=after.missions.clock,facts=[];
 for(const signal of after.missions.signals){const previous=before.missions.signals.find(v=>v.signalId===signal.signalId);if(previous.scanProgress<1&&signal.scanProgress===1){facts.push(signal.signalId);if(signal.signalId==='crystal_shore')s=offer(s,'unidentified-signal',signal.signalId,time);}}
 if(before.missions.active?.status!==after.missions.active?.status&&after.missions.active){const a=after.missions.active;facts.push(a.missionId);if(a.destinationId==='ember_canyons'&&['arrived','expedition-ready'].includes(a.status))s=offer(s,'rescue-or-boundary',a.missionId,time);if(a.status==='completed'&&after.expedition?.state==='extracted'&&after.expedition.collectedIds.length>0&&after.rewardLedger.lastSequence===after.missions.sequence)s=offer(s,'return-to-the-ark',a.missionId,time);}
 const builds={survey_hangar:'skulds-prototype',anomaly_lab:'memory-echo',bio_dome:'seed-of-the-ark'};
 for(const [id,event] of Object.entries(builds))if(!before.construction.levels[id]&&after.construction.levels[id]){const source=`tx-${after.construction.sequence}`;s=offer(s,event,source,time);facts.push(source);}
 if(after.construction.sequence!==before.construction.sequence)facts.push(`tx-${after.construction.sequence}`);
 if(after.rewardLedger.lastSequence!==before.rewardLedger.lastSequence)facts.push(`mission-${after.rewardLedger.lastSequence}`);
 if(facts.length)s=followStory(s,facts[0],time);return s;
}
export function storyFromCrew(story,members,revision,simTime){const e=members.find(m=>m.data.id==='e'),marie=members.find(m=>m.data.id==='marie');if(!e||!marie||revision<1||e.phase==='이동'||marie.phase==='이동'||e.room!==marie.room||!['serve','rest'].includes(marie.life.state))return story;return offer(story,'quiet-kindness',`crew-${revision}`,simTime);}
// Explicit reviews let pre-v5 saves revisit their real achievements without auto-inventing history.
export function reviewStory(story,state,eventId){const source={
 'unidentified-signal':state.missions.signals.find(v=>v.signalId==='crystal_shore').scanProgress===1?'crystal_shore':null,
 'rescue-or-boundary':state.missions.active?.destinationId==='ember_canyons'&&['arrived','expedition-ready','returning','completed'].includes(state.missions.active.status)?state.missions.active.missionId:null,
 'skulds-prototype':state.construction.levels.survey_hangar?'survey_hangar':null,
 'memory-echo':state.construction.levels.anomaly_lab?'anomaly_lab':null,
 'seed-of-the-ark':state.construction.levels.bio_dome?'bio_dome':null,
 'the-unanswered-invitation':state.missions.signals.find(v=>v.signalId==='gravity_orchard').status==='blocked'?'gravity_orchard':null,
 'return-to-the-ark':state.expedition?.state==='extracted'&&state.expedition.collectedIds.length>0&&state.missions.active?.status==='completed'?state.expedition.missionId:null
 }[eventId];if(!source)throw Error('이 기록을 검토할 실제 진행 조건이 없습니다');return offer(story,eventId,source,state.missions.clock);}
