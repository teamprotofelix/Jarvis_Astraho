import {createRandom} from '../crew/utility.js';
export const WIDTH=24,HEIGHT=14;
export const tile=(x,y)=>y*WIDTH+x;
export const point=index=>({x:index%WIDTH,y:Math.floor(index/WIDTH)});
export const regions={
 crystal_shore:{name:'수정 해안',tone:'#90e2e5',hazards:5,layer:'crystal_mist',samples:[['resonance_crystal',4],['starmetal',3],['memory_echo',2]]},
 ember_canyons:{name:'붉은 협곡',tone:'#ffc079',hazards:10,layer:'cosmic_dust',samples:[['ancient_fragment',4],['starmetal',4],['resonance_crystal',3]]},
 aurora_glacier:{name:'극광 빙원',tone:'#a1f0c5',hazards:8,layer:'aurora_curtain',samples:[['biosample',4],['worldtree_seed',3],['memory_echo',3]]}
};
export function createLevel(seed,destinationId){if(!Number.isInteger(seed)||seed<1||seed>4294967295)throw Error('레벨 seed 오류');const region=regions[destinationId];if(!region)throw Error('지원하지 않는 탐사 지역');const random=createRandom(seed),start=tile(2,7),blocked=new Set();for(let y=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++)if(!x||!y||x===WIDTH-1||y===HEIGHT-1||random.next()<.14)blocked.add(tile(x,y));
 const nodes=region.samples.map(([resource,count],i)=>({id:`sample-${i}`,x:8+i*6,y:3+Math.floor(random.next()*8),resource,count}));
 const carve=(x,y)=>blocked.delete(tile(x,y));carve(2,7);for(const n of nodes){let x=2,y=7;while(x!==n.x){x+=Math.sign(n.x-x);carve(x,y);}while(y!==n.y){y+=Math.sign(n.y-y);carve(x,y);}}
 const floor=[];for(let y=1;y<HEIGHT-1;y++)for(let x=1;x<WIDTH-1;x++)if(!blocked.has(tile(x,y))&&tile(x,y)!==start&&!nodes.some(n=>n.x===x&&n.y===y))floor.push(tile(x,y));
 const hazards=new Set();while(hazards.size<region.hazards)hazards.add(floor[Math.floor(random.next()*floor.length)]);
 return {seed,destinationId,width:WIDTH,height:HEIGHT,start,exit:start,blocked,hazards,nodes};
}
export function findPath(level,from,to){if(level.blocked.has(from)||level.blocked.has(to)||!Number.isInteger(to)||to<0||to>=WIDTH*HEIGHT)return [];const todo=[from],previous=new Map([[from,null]]);for(let at=0;at<todo.length;at++){const current=todo[at];if(current===to)break;const p=point(current);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=p.x+dx,y=p.y+dy,next=tile(x,y);if(x<0||x>=WIDTH||y<0||y>=HEIGHT||level.blocked.has(next)||previous.has(next))continue;previous.set(next,current);todo.push(next);}}
 if(!previous.has(to))return [];const path=[];for(let n=to;n!==from;n=previous.get(n))path.unshift(n);return path;
}
