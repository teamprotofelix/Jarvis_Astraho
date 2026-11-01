import {migrateState,parseSave,serializeSave} from './game-state.js';
// Serialized writes prevent an older save finishing after a newer one.
export function createPersistence({storage,capture,apply,status,delay=650,timers=globalThis}){
 let ready=false,blocked=false,conflicted=false,timer=null,queue=Promise.resolve(),raw=null;
 const report=(message,ok=false)=>status?.(message,ok);
 async function load(){try{raw=await storage.get();if(raw!==null)apply(migrateState(raw));report(raw?'진행 복원 완료':'새 항해 · 자동저장 준비',true);}catch{blocked=true;report('저장 불가 · 임시 모드 (기존 데이터 보존)');}finally{ready=true;}}
 function flush({backup=false,explicit=false}={}){if(!ready||blocked&&!explicit)return queue;timers.clearTimeout(timer);timer=null;const snapshot=capture();queue=queue.catch(()=>{}).then(async()=>{try{await storage.put(snapshot,{backup});raw=snapshot;blocked=false;report('자동저장 완료',true);}catch(error){if(error.name==='SaveConflictError'){blocked=true;conflicted=true;report('다른 탭의 변경 감지 · 저장 중지 / 새로고침 필요');}else report('저장 불가 · 임시 모드 / JSON 백업 권장');}});return queue;}
 function schedule(){if(!ready||blocked)return;timers.clearTimeout(timer);timer=timers.setTimeout(()=>flush(),delay);}
 async function importState(source){const state=parseSave(source);await flush();apply(state);await flush({backup:true,explicit:true});}
 async function undoImport(){const state=await storage.get('before-import');if(!state)throw Error('가져오기 이전 저장이 없습니다');apply(migrateState(state));await flush({explicit:true});}
 return {load,flush,schedule,importState,undoImport,exportState:()=>serializeSave(capture()),exportOriginal:()=>JSON.stringify(raw,null,2),get ready(){return ready;},get conflicted(){return conflicted;}};
}
