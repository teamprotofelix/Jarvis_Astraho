import {landscapes,landscapeSrc} from './world-data.js';
import {FlightModel} from './flight-model.js';
const rand=n=>{const v=Math.sin(n*127.1+18.12)*43758.5453;return v-Math.floor(v);};
export function createFlight(canvas,ship,onUpdate){
 const ctx=canvas.getContext('2d',{alpha:true}),model=new FlightModel(),keys=new Set(),images=new Map();let paused=false,w=900,h=440;
 const reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false;
 const stars=Array.from({length:130},(_,i)=>({x:rand(i*2+4),y:rand(i*2+5),r:.5+rand(i*7)*1.6,s:.1+rand(i*8)*.8}));
 function loadScene(index){if(images.has(index))return;const image=new Image();images.set(index,image);image.onload=draw;image.src=landscapeSrc(index);}
 function cover(image){const ratio=Math.max(w/image.naturalWidth,h/image.naturalHeight),dw=image.naturalWidth*ratio,dh=image.naturalHeight*ratio;ctx.drawImage(image,(w-dw)/2,(h-dh)/2,dw,dh);}
 function resize(){const rect=canvas.getBoundingClientRect();w=rect.width||900;h=rect.height||440;const dpr=Math.min(globalThis.devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);model.setBounds(w,h);draw();}
 function draw(){if(!ctx)return;ctx.clearRect(0,0,w,h);ctx.fillStyle='#09182d';ctx.fillRect(0,0,w,h);const image=images.get(model.sector);if(image?.complete&&image.naturalWidth)cover(image);ctx.fillStyle='#03112533';ctx.fillRect(0,0,w,h);
  for(const s of stars){const x=((s.x*w-(reduced?0:model.time)*(8+s.s*28))%w+w)%w;ctx.globalAlpha=.3+s.s*.55;ctx.fillStyle='#e7fffc';ctx.beginPath();ctx.arc(x,s.y*h,s.r,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
  for(const o of model.objects){const x=o.x*w,y=o.y*h;ctx.save();ctx.translate(x,y);ctx.rotate(o.spin+o.age*.4);ctx.beginPath();if(o.kind==='light'){ctx.fillStyle='#bdffe7';ctx.shadowColor='#88f9da';ctx.shadowBlur=18;ctx.moveTo(0,-11);ctx.lineTo(7,0);ctx.lineTo(0,11);ctx.lineTo(-7,0);}else{ctx.fillStyle='#8d8c97';ctx.strokeStyle='#d9c7aa';ctx.lineWidth=2;for(let i=0;i<7;i++){const angle=i/7*Math.PI*2,r=i%2?16:21;ctx.lineTo(Math.cos(angle)*r,Math.sin(angle)*r);}}ctx.closePath();ctx.fill();if(o.kind==='rock')ctx.stroke();ctx.restore();}
  if(model.manual){ctx.strokeStyle=model.invincible>0?'#ffbd9a':'#9cead747';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(model.x*w,model.y*h,model.shipWidth*.53,model.shipWidth*.22,0,0,Math.PI*2);ctx.stroke();}
  ship.style.width=model.shipWidth+'px';ship.style.left=model.x*100+'%';ship.style.top=model.y*100+'%';ship.style.transform=`translate(-50%,-50%) rotate(${reduced?0:model.tilt*57.3}deg)`;
 }
 function report(){onUpdate?.({sector:model.sector,manual:model.manual,lit:model.lit,shield:model.shield,distance:model.distance,message:model.message});}
 function clear(){keys.clear();}
 function setManual(value){clear();model.setManual(value);report();draw();}
 function input(key,down){if(down)keys.add(key.toLowerCase());else keys.delete(key.toLowerCase());}
 function advance(dt){if(paused)return;const before=model.sector;model.step(dt,{left:keys.has('arrowleft')||keys.has('a'),right:keys.has('arrowright')||keys.has('d'),up:keys.has('arrowup')||keys.has('w'),down:keys.has('arrowdown')||keys.has('s')});if(before!==model.sector){loadScene(model.sector);loadScene((model.sector+1)%landscapes.length);}draw();report();}
 loadScene(0);resize();report();
 return {resize,advance,input,clear,setManual,snapshot:()=>model.snapshot(),restore(state){clear();model.restore(state);loadScene(model.sector);report();draw();},pause(value){paused=value;if(value)clear();},next(){model.next();loadScene(model.sector);report();draw();},get manual(){return model.manual;},get sector(){return model.sector;}};
}
