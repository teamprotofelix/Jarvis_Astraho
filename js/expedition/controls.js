import {findPath,tile,point} from './level.js';
export function createExpeditionControls(wrap,{onAction,onTarget}){
 const held=new Set();let path=[],enabled=false;
 const direction={arrowup:[0,-1],w:[0,-1],arrowdown:[0,1],s:[0,1],arrowleft:[-1,0],a:[-1,0],arrowright:[1,0],d:[1,0]};
 const clear=()=>{held.clear();path=[];};
 wrap.addEventListener('keydown',event=>{const key=event.key.toLowerCase();if(!enabled||!wrap.contains(document.activeElement))return;if(direction[key]){event.preventDefault();held.add(key);path=[];}else if(['e',' ','q'].includes(key)&&!event.repeat){event.preventDefault();onAction(key==='q'?'scan':'interact');}});
 wrap.addEventListener('focusout',event=>{if(!wrap.contains(event.relatedTarget))clear();});
 window.addEventListener('keyup',event=>held.delete(event.key.toLowerCase()));
 for(const button of wrap.querySelectorAll('[data-exp-key]')){button.addEventListener('pointerdown',event=>{event.preventDefault();if(!enabled)return;button.setPointerCapture(event.pointerId);held.add(button.dataset.expKey);path=[];});for(const type of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(type,()=>held.delete(button.dataset.expKey));}
 wrap.querySelector('canvas').addEventListener('pointerup',event=>{if(enabled){wrap.focus({preventScroll:true});onTarget(event);}});
 return {clear,setEnabled(value){enabled=value;if(!value)clear();},target(level,player,index){path=findPath(level,tile(player.x,player.y),index);},read(player){if(!enabled)return {};for(const key of held)if(direction[key])return {dx:direction[key][0],dy:direction[key][1]};while(path.length&&path[0]===tile(player.x,player.y))path.shift();if(!path.length)return {};const next=point(path[0]);if(Math.abs(next.x-player.x)+Math.abs(next.y-player.y)!==1){path=[];return {};}return {dx:next.x-player.x,dy:next.y-player.y};}};
}
