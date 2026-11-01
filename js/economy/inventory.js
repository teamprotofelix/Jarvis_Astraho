import {emptyCounts,resources} from './resources.js';
import {validateCounts} from './reward-ledger.js';
export const createInventory=(counts=emptyCounts())=>({counts:structuredClone(counts)});
export function spend(counts,cost){const result=structuredClone(counts);for(const [id,n] of Object.entries(cost)){if(!Object.hasOwn(resources,id)||!Number.isInteger(n)||n<1||result[id]<n)throw Error('보유 자원이 부족합니다');result[id]-=n;}validateCounts(result);return result;}
export function addResources(inventory,items){const result=structuredClone(inventory);validateCounts(items);for(const id of Object.keys(resources))result.counts[id]=Math.min(999,result.counts[id]+items[id]);return result;}
