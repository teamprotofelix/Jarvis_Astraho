import {facilities} from '../economy/recipes.js';
import {object,array,unique,oneOf,number,reject} from '../state/validation.js';
export const createResearch=()=>({unlocked:[],active:null});
export function validateResearch(s,construction){object(s,['unlocked','active']);array(s.unlocked,4);unique(s.unlocked);for(const id of s.unlocked){oneOf(id,Object.keys(facilities));if(!facilities[id].requires.every(p=>construction.levels[p]===1))reject('연구 선행 시설 누락');}if(s.active!==null){object(s.active,['id','remaining','total']);oneOf(s.active.id,Object.keys(facilities));if(s.unlocked.includes(s.active.id)||!facilities[s.active.id].requires.every(p=>construction.levels[p]===1))reject('연구 단계 오류');number(s.active.total,1,facilities[s.active.id].duration);number(s.active.remaining,0,s.active.total);}}
