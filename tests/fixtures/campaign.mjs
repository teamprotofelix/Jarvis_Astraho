// Fixture earned through the same public pure campaign operations as gameplay.
import {createCampaign} from '../../js/campaign/session.js';
import {createLevel,findPath,tile,point} from '../../js/expedition/level.js';
import {facilities} from '../../js/economy/recipes.js';
export function earnedCampaign(regions=['crystal_shore','ember_canyons','aurora_glacier']){const c=createCampaign();let distance=0;const tick=seconds=>{for(let i=0;i<seconds*20;i++)c.tick(.05,distance);};const walk=target=>{const s=c.expedition,l=createLevel(s.levelSeed,s.destinationId);for(const index of findPath(l,tile(s.player.x,s.player.y),target)){tick(.2);const p=point(index),at=c.expedition.player;c.expeditionCommand({type:'move',dx:p.x-at.x,dy:p.y-at.y});}};
 for(const id of regions){c.command({type:'scan',id});tick(7);c.command({type:'depart',id,distance});distance+=c.missions.active.requiredDistance+1;tick(.2);c.launch();const l=createLevel(c.expedition.levelSeed,id);for(const n of l.nodes){walk(tile(n.x,n.y));c.expeditionCommand({type:'scan'});tick(6.1);c.expeditionCommand({type:'collect',id:n.id});tick(40.1);}walk(l.exit);c.expeditionCommand({type:'extract'});tick(9);}
 return {campaign:c,distance,tick};}
export function constructAll(fixture){const {campaign:c,tick}=fixture;for(const id of Object.keys(facilities)){c.transaction({type:'research',id,transactionId:`tx-${c.construction.sequence+1}`});tick(25);c.transaction({type:'build',id,transactionId:`tx-${c.construction.sequence+1}`});tick(11);}return fixture;}
