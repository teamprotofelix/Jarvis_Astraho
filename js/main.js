import {modules,crew,journals,landscapes,sceneSrc,spriteSrc,thumbSrc,conversations,roomActions} from './world-data.js';
import {createCrewSimulation,coords,canonNote} from './simulation.js';
import {createFlight} from './flight.js';
const $=s=>document.querySelector(s);
const roomMap=new Map(modules.map(m=>[m.id,m]));
const sim=createCrewSimulation();
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let paused=reduced,blurred=false,last=0,lastUI=0,activeView='map',returnFocus=null,selected='e',following=false,zoom=1,speed=1,currentRoom=null,talkIndex=0,flightVisible=false;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const time=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`;
const member=()=>sim.members.find(m=>m.data.id===selected);
const sprite=(id,extra='')=>`<span aria-hidden="true" class="sprite-sheet ${extra}" style="background-image:url('${spriteSrc(id)}')"></span>`;
function buildMap(){
 $('#map-hotspots').innerHTML=modules.map(m=>`<button type="button" class="map-room" data-room="${m.id}" style="left:${(88+m.c*206)/12}%;top:${(78+m.r*158)/6.2}%;--tone:${m.tone}" aria-label="${m.name} 방문"><img src="${thumbSrc(m.id)}" alt="" width="320" height="180"><span class="room-name">${m.icon} ${m.name}</span><span class="room-count" data-count="${m.id}"></span></button>`).join('');
 $('#crew-sprites').innerHTML=crew.map(p=>`<button type="button" class="crew-sprite" data-person="${p.id}" aria-label="${p.name} 따라보기">${sprite(p.id)}<span class="sprite-name">${p.name}</span></button>`).join('');
 $('#modules-grid').innerHTML=modules.map(m=>`<button type="button" class="module-card" data-room="${m.id}"><img src="${thumbSrc(m.id)}" alt="${m.name}" width="320" height="180" loading="lazy"><div class="module-card-content"><span class="module-icon" style="color:${m.tone}">${m.icon}</span><div><small>${m.en}</small><strong>${m.name}</strong></div><span class="module-arrow">↗</span></div></button>`).join('');
 $('#crew-pills').innerHTML=crew.map(p=>`<button type="button" class="crew-pill" data-person="${p.id}">${p.name}</button>`).join('');
 $('#crew-count').textContent=crew.length;
 $('#statuses').innerHTML=[['세계수 공명','안정'],['항로 분석','관측 중'],['생활 환경','정상']].map(([label,value])=>`<div class="status-row"><div><span>${label}</span><b>${value}</b></div><div class="status-track"><i style="width:96%;background:var(--mint)"></i></div></div>`).join('');
}
function updateMap(){
 for(const m of sim.members){const el=$(`.crew-sprite[data-person="${m.data.id}"]`);const index=crew.indexOf(m.data),idle=m.phase!=='이동';
  // Spread co-located residents without changing navigation coordinates.
  const offset=idle?(index%3-1)*21:0;
  el.style.left=(m.pos.x+offset)/12+'%';el.style.top=m.pos.y/6.2+'%';el.style.zIndex=String(Math.round(m.pos.y));
  el.classList.toggle('selected',m.data.id===selected);el.classList.toggle('walking',!idle&&!paused&&!blurred);
  const frame=idle||paused||blurred?0:1+(Math.floor(sim.elapsed*7)%2);
  el.firstElementChild.style.backgroundPosition=`${frame*50}% ${m.direction*100/3}%`;
 }
 for(const m of modules){const n=sim.getOccupants(m.id).length;$(`[data-count="${m.id}"]`).textContent=n?`${n}명 활동`:'휴식 공간';}
 $('#ship-clock').textContent=`SIM +${time(sim.elapsed)}`;
 const m=member();$('#person-location').textContent=`${sim.getDisplayRoom(m)} · ${sim.getActivity(m)}${m.queued?' · 다음: '+roomMap.get(m.queued).name:''}`;
 $('#life-feed').innerHTML=sim.events.slice(0,5).map(e=>`<li><time>${time(e.time)}</time> ${esc(e.text)}</li>`).join('')||'<li>각자의 하루가 시작됩니다.</li>';
 if(following&&activeView==='map')centerPerson();
}
function selectPerson(id){if(!crew.some(p=>p.id===id))return;selected=id;talkIndex=0;const p=member().data;
 $('#observer-title').textContent=p.name;$('#observer-copy').textContent=p.line;$('#person-role').textContent=p.role;$('#portrait').innerHTML=sprite(id);$('#talk-response').textContent='';
 document.querySelectorAll('.crew-pill').forEach(el=>{const on=el.dataset.person===id;el.classList.toggle('selected',on);el.setAttribute('aria-pressed',String(on));});updateMap();
}
function centerPerson(){const m=member(),scroll=$('#map-scroll'),stage=$('#map-stage');scroll.scrollLeft=(m.pos.x/1200)*stage.clientWidth-scroll.clientWidth/2;}
function setFollowing(value){following=value;$('#follow-person').classList.toggle('active',value);$('#follow-person').setAttribute('aria-pressed',String(value));$('#follow-person').textContent=value?'따라가기 중':'따라가기';if(value)centerPerson();}
function setZoom(value){zoom=Math.max(.65,Math.min(1.4,value));$('#map-stage').style.width=1200*zoom+'px';$('#zoom-value').textContent=Math.round(zoom*100)+'%';if(following)centerPerson();}
function activate(view){activeView=view;flight.clear();document.querySelectorAll('.view').forEach(el=>el.classList.toggle('active',el.id===`${view}-view`));document.querySelectorAll('[data-view]').forEach(el=>{const on=el.dataset.view===view;el.classList.toggle('active',on);if(on)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});if(view==='voyage')flight.resize();syncPause();}
function showDialog(content){if($('#dialog-backdrop').hidden)returnFocus=document.activeElement;$('#dialog-body').innerHTML=content;$('#dialog-backdrop').hidden=false;document.body.classList.add('dialog-open');$('.app-shell').inert=true;$('#dialog-close').focus();syncPause();}
function closeDialog(){if($('#dialog-backdrop').hidden)return;$('#dialog-backdrop').hidden=true;currentRoom=null;document.body.classList.remove('dialog-open');$('.app-shell').inert=false;syncPause();if(returnFocus?.isConnected)returnFocus.focus();}
function roomDialog(id){const m=roomMap.get(id);if(!m)return;currentRoom=id;const list=sim.getOccupants(id);
 showDialog(`<div class="dialog-image room-scene"><img src="${sceneSrc(id)}" alt="${m.name} 내부"><div class="room-residents">${list.map((p,i)=>`<button type="button" data-room-person="${p.data.id}" style="left:${18+i*13}%" aria-label="${p.data.name}와 대화">${sprite(p.data.id)}<span>${p.data.name}</span></button>`).join('')}</div><div class="dialog-image-title"><span>${m.en}</span><h2 id="detail-title">${m.name}</h2></div></div><div class="dialog-content"><div class="dialog-meta"><span>${m.role}</span><span>ROOM / ${String(modules.indexOf(m)+1).padStart(2,'0')}</span></div><p class="dialog-lead">${esc(m.desc)}</p><p>${esc(m.detail)}</p><div class="dialog-chipset"><strong>지금 이곳</strong><span>${list.length?list.map(p=>esc(p.data.name)).join(' · '):'조용한 빈 공간'}</span></div><div class="room-actionbar"><button type="button" class="gold-btn" data-room-action="${id}">${roomActions[id][0]}</button><button type="button" class="outline-btn" data-visit="${id}">함장 이동 예약</button>${id==='bridge'?'<button type="button" class="outline-btn" data-launch>항해 조종하기 ↗</button>':''}</div><p id="room-response" class="scene-response" aria-live="polite">공간의 활동을 선택하거나, 체류 중인 승무원에게 말을 걸어보세요.</p><div class="dialog-controls"><button class="outline-btn" data-nav-room="${modules[(modules.indexOf(m)+14)%15].id}">← 이전 공간</button><button class="outline-btn" data-nav-room="${modules[(modules.indexOf(m)+1)%15].id}">다음 공간 →</button></div></div>`);
}
function journalDialog(index){const j=journals[index],m=roomMap.get(j.room);currentRoom=null;showDialog(`<div class="dialog-image"><img src="${sceneSrc(j.room)}" alt="${m.name}"><div class="dialog-image-title"><span>JARVIS / ENTRY ${String(index+1).padStart(3,'0')}</span><h2 id="detail-title">${esc(j.title)}</h2></div></div><div class="dialog-content"><div class="dialog-meta"><span>${esc(j.date)}</span><span>${m.name}</span></div><p>${esc(j.people)} · ${esc(j.status)}</p><h3>관측 보고</h3><p class="dialog-lead">${esc(j.report)}</p><h3>자비스의 기록</h3><p class="reflection">${esc(j.reflection)}</p><p class="fiction-label">공개용으로 새롭게 창작한 가상의 항해일지입니다.</p></div>`);}
function renderJournals(){const value=$('#journal-filter').value;$('#journal-grid').innerHTML=journals.map((j,index)=>({...j,index})).filter(j=>value==='all'||j.room===value).map(j=>`<button type="button" class="journal-card" data-journal="${j.index}"><div class="journal-art"><img src="${thumbSrc(j.room)}" alt="${roomMap.get(j.room).name}" width="320" height="180" loading="lazy"><span>ENTRY ${String(j.index+1).padStart(3,'0')}</span></div><div class="journal-body"><div class="journal-date">${esc(j.date)}</div><h3>${esc(j.title)}</h3><p>${esc(j.report)}</p><div class="journal-last"><span>${esc(j.status)}</span><span>기록 열람 ↗</span></div></div></button>`).join('')||'<p>이 구역의 기록은 준비 중입니다.</p>';}
for(const m of modules){const option=document.createElement('option');option.value=m.id;option.textContent=m.name;$('#journal-filter').append(option);}
buildMap();renderJournals();selectPerson('e');
const flight=createFlight($('#flight-canvas'),$('#flight-ship'),state=>{const s=landscapes[state.sector];$('#sector-name').textContent=s.name;$('#sector-tag').textContent=s.tag;$('#sector-heading').textContent=s.name;$('#flight-log').textContent=s.log;$('#flight-event').textContent=state.message;$('#mode-label').textContent=state.manual?'MANUAL':'AUTOPILOT';$('#light-count').textContent=String(state.lit).padStart(2,'0');$('#shield-value').textContent=state.shield+'%';$('#distance-value').textContent=Math.floor(state.distance)+' ly';});
function syncPause(){const stopped=paused||blurred||document.hidden||!$('#dialog-backdrop').hidden;flight.pause(stopped||activeView!=='voyage'||!flightVisible);$('#motion-toggle').textContent=paused?'움직임 재개':'움직임 일시정지';$('#motion-toggle').setAttribute('aria-pressed',String(paused));last=0;updateMap();}
function setManual(value){flight.setManual(value);for(const [id,on] of [['auto-btn',!value],['manual-btn',value]]){$('#'+id).classList.toggle('active',on);$('#'+id).setAttribute('aria-pressed',String(on));}$('#manual-pad').hidden=!value;$('#flight-wrap').focus();}
function animate(now){if(!last)last=now;const dt=Math.min((now-last)/1000,.05);if(now-last<32){requestAnimationFrame(animate);return;}last=now;
 const running=!paused&&!blurred&&!document.hidden&&$('#dialog-backdrop').hidden;
 if(running){for(let i=0;i<speed;i++)sim.update(dt);if(activeView==='voyage')flight.advance(dt);}
 if(now-lastUI>160){updateMap();lastUI=now;}requestAnimationFrame(animate);
}
$('#motion-toggle').addEventListener('click',()=>{paused=!paused;syncPause();});
$('#sim-speed').addEventListener('click',()=>{speed=speed===1?2:speed===2?4:1;$('#sim-speed').textContent=speed+'× 생활';});
$('#zoom-in').addEventListener('click',()=>setZoom(zoom+.15));$('#zoom-out').addEventListener('click',()=>setZoom(zoom-.15));$('#map-fit').addEventListener('click',()=>{setFollowing(false);setZoom(Math.max(.65,Math.min(1,$('#map-scroll').clientWidth/1200)));});
$('#follow-person').addEventListener('click',()=>setFollowing(!following));$('#visit-person').addEventListener('click',()=>{const m=member();roomDialog(m.phase==='이동'?m.target:m.room);});
$('#talk-person').addEventListener('click',()=>{const lines=conversations[selected];$('#talk-response').textContent=lines[talkIndex++%lines.length];});
for(const event of ['wheel','touchstart'])$('#map-scroll').addEventListener(event,()=>{if(following)setFollowing(false);},{passive:true});
$('#map-scroll').addEventListener('keydown',e=>{if(e.key.startsWith('Arrow')&&following)setFollowing(false);});
$('#auto-btn').addEventListener('click',()=>setManual(false));$('#manual-btn').addEventListener('click',()=>setManual(true));$('#next-sector').addEventListener('click',()=>flight.next());$('#journal-filter').addEventListener('change',renderJournals);
document.addEventListener('click',event=>{const el=event.target.closest('button');if(!el)return;
 if(el.dataset.view){activate(el.dataset.view);return;}
 if(el.dataset.person){selectPerson(el.dataset.person);return;}
 if(el.dataset.room){roomDialog(el.dataset.room);return;}
 if(el.dataset.navRoom){roomDialog(el.dataset.navRoom);return;}
 if(el.dataset.journal!==undefined){journalDialog(+el.dataset.journal);return;}
 if(el.dataset.roomAction){$('#room-response').textContent=roomActions[el.dataset.roomAction][1];return;}
 if(el.dataset.roomPerson){$('#room-response').textContent=conversations[el.dataset.roomPerson][0];return;}
 if(el.dataset.visit){const target=el.dataset.visit;sim.requestTravel('e',target);closeDialog();selectPerson('e');setFollowing(true);$('#talk-response').textContent=roomMap.get(target).name+'(으)로 이동을 예약했습니다.';return;}
 if(el.hasAttribute('data-launch')){closeDialog();activate('voyage');}
});
$('#dialog-close').addEventListener('click',closeDialog);$('#dialog-backdrop').addEventListener('click',e=>{if(e.target===$('#dialog-backdrop'))closeDialog();});
$('#help-button').addEventListener('click',()=>showDialog(`<div class="dialog-content"><p class="eyebrow">WELCOME ABOARD</p><h2 id="detail-title">아스트라호에서 보내는 하루</h2><p>SHIP MAP: 방 또는 승무원을 선택하세요. 따라가기, 대화, 공간 방문과 함장 이동 예약을 사용할 수 있습니다. 지도는 확대·축소하거나 가로로 밀어 살펴보세요.</p><p>VOYAGE: 자동 조종으로 풍경을 감상하거나 MANUAL을 누르고 방향키·WASD 또는 터치 패드로 비행하세요. 밝은 별빛을 모으고 회색 운석을 피하세요. 보호막은 소진되면 안전 위치에서 재생됩니다.</p><p>움직임 일시정지는 생활과 비행에 함께 적용됩니다. 화면을 벗어나거나 창이 비활성화되면 자동으로 멈춥니다. 다시 돌아오면 기존의 일시정지 설정을 유지합니다.</p><p>대화와 일지는 미리 작성한 창작 장면입니다. 새로고침하면 진행은 초기화됩니다. 첫 방문의 오프라인 준비가 끝난 뒤 이미지와 모든 기능을 인터넷 없이 이용할 수 있습니다.</p><p>자비스는 함선 AI, 서아는 부함장, 세계수는 독립된 존재입니다. 에아와 실라는 각자의 여행과 공동체를 존중하여 상주자로 배치하지 않았습니다.</p><p>${canonNote}</p></div>`));
const movement=new Set(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d']);
window.addEventListener('keydown',e=>{
 if(!$('#dialog-backdrop').hidden){if(e.key==='Escape'){e.preventDefault();closeDialog();}if(e.key==='Tab'){const els=[...$('#detail-dialog').querySelectorAll('button,a,select,[tabindex]')].filter(el=>!el.disabled);const first=els[0],last=els.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}return;}
 if(activeView==='voyage'&&flight.manual&&$('#flight-wrap').contains(document.activeElement)&&movement.has(e.key.toLowerCase())){e.preventDefault();if(!paused&&!blurred)flight.input(e.key,true);}
});
window.addEventListener('keyup',e=>flight.input(e.key,false));
for(const button of document.querySelectorAll('#manual-pad button')){button.addEventListener('pointerdown',e=>{e.preventDefault();if(paused||blurred)return;button.setPointerCapture(e.pointerId);flight.input(button.dataset.key,true);});for(const type of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(type,()=>flight.input(button.dataset.key,false));}
window.addEventListener('blur',()=>{blurred=true;syncPause();});window.addEventListener('focus',()=>{blurred=false;syncPause();});document.addEventListener('visibilitychange',syncPause);window.addEventListener('resize',()=>{if(activeView==='voyage')flight.resize();});
new IntersectionObserver(entries=>{if(activeView==='voyage'){flightVisible=entries[0].isIntersecting;syncPause();}},{threshold:.05}).observe($('#flight-wrap'));
setZoom(innerWidth<650?.72:1);syncPause();requestAnimationFrame(animate);
// Complete offline readiness is announced only after an atomic precache succeeds.
if('serviceWorker' in navigator)window.addEventListener('load',async()=>{try{
 const reg=await navigator.serviceWorker.register('./sw.js',{scope:'./'}),show=()=>{$('#update-toast').hidden=false;};
 if(reg.waiting&&navigator.serviceWorker.controller)show();reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)show();});});
 navigator.serviceWorker.ready.then(()=>{$('#offline-status').textContent='오프라인 준비 완료';});
 let accepting=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(accepting)location.reload();});$('#apply-update').addEventListener('click',()=>{if(reg.waiting){accepting=true;reg.waiting.postMessage({type:'SKIP_WAITING'});}});$('#dismiss-update').addEventListener('click',()=>{$('#update-toast').hidden=true;});
}catch{$('#offline-status').textContent='온라인에서 이용 중';}});
