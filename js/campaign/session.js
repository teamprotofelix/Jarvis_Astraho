import {createMissions,expeditionDTO} from '../missions/model.js';
import {reduceMission} from '../missions/reducer.js';
import {createExpedition,reduceExpedition,expeditionResult,TERMINAL} from '../expedition/model.js';
import {createRewardLedger,creditReward} from '../economy/reward-ledger.js';
export function createCampaign(){let missions=createMissions(),expedition=null,rewardLedger=createRewardLedger(),revision=0;
 function settle(){if(!expedition||!TERMINAL.includes(expedition.state))return;const result=creditReward(rewardLedger,expeditionResult(expedition));if(!result.credited)return;const nextMission=reduceMission(missions,{type:'return',id:expedition.destinationId});rewardLedger=result.ledger;missions=nextMission;revision++;}
 return {
 get missions(){return missions;},get expedition(){return expedition;},get rewardLedger(){return rewardLedger;},get revision(){return revision+missions.revision;},get dto(){return expeditionDTO(missions);},
 command(event){if(expedition?.state==='active'&&['return','abandon','retry','depart'].includes(event.type))throw Error('원정 화면에서 회수 또는 철수하세요');missions=reduceMission(missions,event);if(['retry','depart'].includes(event.type))expedition=null;},
 launch(){const dto=expeditionDTO(missions);if(!dto||expedition)throw Error('원정 준비를 마친 새 임무만 출발할 수 있습니다');expedition=createExpedition(dto);revision++;},
 expeditionCommand(event){if(!expedition)throw Error('진행 중인 원정이 없습니다');expedition=reduceExpedition(expedition,event);revision++;settle();},
 tick(dt,distance,input={},{expeditionActive=true}={}){missions=reduceMission(missions,{type:'tick',dt,distance});if(expedition?.state==='active'&&expeditionActive){expedition=reduceExpedition(expedition,{type:'tick',dt});if((input.dx||input.dy)&&expedition.state==='active')expedition=reduceExpedition(expedition,{type:'move',dx:input.dx,dy:input.dy});settle();}},
 snapshot(){return {missions:structuredClone(missions),expedition:structuredClone(expedition),rewardLedger:structuredClone(rewardLedger)};},
 restore(state){missions=structuredClone(state.missions);expedition=structuredClone(state.expedition);rewardLedger=structuredClone(state.rewardLedger);revision++;}
 };}
