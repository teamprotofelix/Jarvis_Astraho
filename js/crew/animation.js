import {stateLabels} from './behaviors.js';
// Composite the existing walking sheet with independent props; never invent action-sheet cells.
export function renderCrewAction(element,member,elapsed,{motion=true,quality='high'}={}){
 const life=member.life;if(!life)return;element.dataset.state=life.state;element.dataset.action=life.actionId;element.title=`${member.data.name} · ${stateLabels[life.state]} · ${life.label}`;
 element.setAttribute('aria-label',element.title);
 let layer=element.querySelector('.life-prop');if(!layer){layer=document.createElement('span');layer.className='life-prop';layer.setAttribute('aria-hidden','true');const image=document.createElement('img');image.alt='';image.width=32;image.height=32;image.decoding='async';image.onload=()=>layer.classList.add('ready');image.onerror=()=>layer.classList.remove('ready');layer.append(image);element.append(layer);const fx=document.createElement('span');fx.className='life-fx';fx.setAttribute('aria-hidden','true');element.append(fx);}
 const prop=life.state==='walk'?null:life.prop;layer.hidden=!prop;
 if(prop&&layer.dataset.prop!==prop){layer.dataset.prop=prop;layer.classList.remove('ready');layer.firstElementChild.src=`./assets/props/${prop}.webp`;}
 const effect=quality==='low'?null:member.room==='garden'&&life.state!=='walk'?'worldtree-pulse':member.room==='bridge'&&['work','observe'].includes(life.state)?'sensor-scan':null,fx=element.querySelector('.life-fx');fx.hidden=!effect;
 if(effect){fx.style.backgroundImage=`url('./assets/fx/${effect}-atlas.webp')`;const frame=motion?Math.floor(elapsed*6)%6:0;fx.style.backgroundPosition=`${frame*20}% 0`;}
}
export function roomStagePosition(index,count){return {x:count<=1?50:16+index*(68/Math.max(1,count-1)),y:73};}
