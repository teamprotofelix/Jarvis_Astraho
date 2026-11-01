import {facilityActions} from '../research/facility-jobs.js';
import {createInventory} from '../economy/inventory.js';
import {createResearch} from '../research/model.js';
import {createConstruction,validateEconomy} from '../economy/construction.js';
import {validateExpedition} from '../expedition/model.js';
import {createRewardLedger,validateRewardLedger} from '../economy/reward-ledger.js';
import {createGameState as createLegacy,validateState as validateLegacy} from './legacy-state.js';
import {createMissions,validateMissions} from '../missions/model.js';
import {object,oneOf,reject} from './validation.js';
export const SCHEMA_VERSION=4,MAX_SAVE_BYTES=256*1024;
const base=['schemaVersion','runId','savedAt','simulation','flight','ui'];
export function createGameState(options={}){return {...createLegacy(options),schemaVersion:SCHEMA_VERSION,missions:options.missions??createMissions(),expedition:options.expedition??null,rewardLedger:options.rewardLedger??createRewardLedger(),inventory:options.inventory??createInventory(options.rewardLedger?.totals),research:options.research??createResearch(),construction:options.construction??createConstruction()};}
export function migrateState(value){
 if(value==null)return createGameState();oneOf(value.schemaVersion,[1,2,3,4]);object(value,[...base,...(value.schemaVersion>=2?['missions']:[]),...(value.schemaVersion>=3?['expedition','rewardLedger']:[]),...(value.schemaVersion>=4?['inventory','research','construction']:[])]);
 const original=Object.fromEntries(base.map(k=>[k,value[k]]));original.schemaVersion=1;const state=validateLegacy(original);
 const missions=value.schemaVersion>=2?validateMissions(value.missions):createMissions();if(missions.active&&missions.active.startDistance>state.flight.distance)reject('항행 거리 불일치');
 const expedition=value.schemaVersion>=3?value.expedition:null,rewardLedger=value.schemaVersion>=3?value.rewardLedger:createRewardLedger();validateExpedition(expedition,missions);validateRewardLedger(rewardLedger,missions,expedition);const inventory=value.schemaVersion>=4?value.inventory:createInventory(rewardLedger.totals),research=value.schemaVersion>=4?value.research:createResearch(),construction=value.schemaVersion>=4?value.construction:createConstruction();validateEconomy(inventory,research,construction);for(const m of state.simulation.members){for(const id of [m.life.actionId,m.life.task?.id]){const job=facilityActions.find(a=>a.id===id);if(job&&!construction.levels[job.facility]&&!research.unlocked.includes(job.facility)&&research.active?.id!==job.facility&&construction.active?.id!==job.facility)reject('해금되지 않은 시설 작업');}}return {...state,inventory:structuredClone(inventory),research:structuredClone(research),construction:structuredClone(construction),schemaVersion:SCHEMA_VERSION,missions:structuredClone(missions),expedition:structuredClone(expedition),rewardLedger:structuredClone(rewardLedger)};
}
export const validateState=value=>{if(value==null)reject('빈 저장 데이터');return migrateState(value);};
export function parseSave(source){if(typeof source!=='string'||new TextEncoder().encode(source).length>MAX_SAVE_BYTES)reject('저장 파일은 256KB 이하여야 합니다');return validateState(JSON.parse(source,(k,v)=>{if(['__proto__','constructor','prototype'].includes(k))reject('오염 키 오류');return v;}));}
export function serializeSave(state){return JSON.stringify(validateState(state),null,2);}
