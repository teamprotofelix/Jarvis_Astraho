import {createGameState as createLegacy,validateState as validateLegacy} from './legacy-state.js';
import {createMissions,validateMissions} from '../missions/model.js';
import {object,oneOf,reject} from './validation.js';
export const SCHEMA_VERSION=2,MAX_SAVE_BYTES=256*1024;
const base=['schemaVersion','runId','savedAt','simulation','flight','ui'];
export function createGameState(options={}){return {...createLegacy(options),schemaVersion:SCHEMA_VERSION,missions:options.missions??createMissions()};}
export function migrateState(value){
 if(value==null)return createGameState();oneOf(value.schemaVersion,[1,2]);object(value,value.schemaVersion===1?base:[...base,'missions']);
 const original=Object.fromEntries(base.map(k=>[k,value[k]]));original.schemaVersion=1;const state=validateLegacy(original);
 const missions=value.schemaVersion>=2?validateMissions(value.missions):createMissions();if(missions.active&&missions.active.startDistance>state.flight.distance)reject('항행 거리 불일치');
 return {...state,schemaVersion:SCHEMA_VERSION,missions:structuredClone(missions)};
}
export const validateState=value=>{if(value==null)reject('빈 저장 데이터');return migrateState(value);};
export function parseSave(source){if(typeof source!=='string'||new TextEncoder().encode(source).length>MAX_SAVE_BYTES)reject('저장 파일은 256KB 이하여야 합니다');return validateState(JSON.parse(source,(k,v)=>{if(['__proto__','constructor','prototype'].includes(k))reject('오염 키 오류');return v;}));}
export function serializeSave(state){return JSON.stringify(validateState(state),null,2);}
