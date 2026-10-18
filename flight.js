import {landscapes} from './world-data.js';
const rand=(n)=>{let x=Math.sin(n*127.1+18.12)*43758.5453;return x-Math.floor(x)};
export function createFlight(canvas,ship,onUpdate){
 const ctx=canvas.getContext('2d',{alpha:true});let w=900,h=440,scale=1,t=0,sector=0,paused=false,manual=false,x=0,y=0,lit=0,encounter=0;
 const keys=new Set();const stars=Array.from({length:200},(_,i)=>({x:rand(i*2+4),y:rand(i*2+5),r:.4+rand(i*7)*2.1,s:.1+rand(i*8)*.8}));
 let particles=[];
 function resize(){const r=canvas.getBoundingClientRect();w=r.width||900;h=r.height||440;scale=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*scale);canvas.height=Math.round(h*scale);ctx.setTransform(scale,0,0,scale,0,0);}
 function draw(){ctx.clearRect(0,0,w,h);const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,'#071326');g.addColorStop(.53,landscapes[sector].secondary);g.addColorStop(1,'#0c1a31');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 const c=landscapes[sector];const halo=ctx.createRadialGradient(w*.75,h*.35,6,w*.75,h*.35,w*.56);halo.addColorStop(0,c.color+'82');halo.addColorStop(1,c.color+'00');ctx.fillStyle=halo;ctx.fillRect(0,0,w,h);
 stars.forEach((s,i)=>{const sx=((s.x*w-(t*(9+s.s*35)))%w+w)%w,sy=s.y*h;ctx.globalAlpha=.25+s.s*.6;ctx.fillStyle=i%7===0?'#c4ffef':'#f9f7f4';ctx.beginPath();ctx.arc(sx,sy,s.r,0,7);ctx.fill();});ctx.globalAlpha=1;
 if(['ring','planet','blackhole','cluster'].includes(c.kind)){
  const px=w*.76-(t*5)%Math.max(w*.25,120),py=h*.35;const radius=Math.min(w,h)*.22;
  if(c.kind==='blackhole'){ctx.strokeStyle='#dfbfe38f';ctx.lineWidth=22;ctx.beginPath();ctx.ellipse(px,py,radius*1.2,radius*.42,-.3,0,7);ctx.stroke();ctx.fillStyle='#040a16';ctx.beginPath();ctx.arc(px,py,radius*.64,0,7);ctx.fill();}
  else {const p=ctx.createRadialGradient(px-radius*.4,py-radius*.4,3,px,py,radius);p.addColorStop(0,'#f8e5ca');p.addColorStop(.4,c.color);p.addColorStop(1,c.secondary);ctx.fillStyle=p;ctx.beginPath();ctx.arc(px,py,radius,0,7);ctx.fill();if(c.kind==='ring'){ctx.strokeStyle='#e7d7b6c7';ctx.lineWidth=radius*.17;ctx.beginPath();ctx.ellipse(px,py,radius*1.7,radius*.38,-.32,0,7);ctx.stroke();}}}
 if(c.kind==='gateway'){ctx.lineWidth=4;for(let i=0;i<5;i++){ctx.strokeStyle=i%2?'#bff5f988':'#ead6fb88';ctx.beginPath();ctx.ellipse(w*.74,h*.46,80+i*24,145+i*17,0,0,7);ctx.stroke();}}
 if(c.kind==='aurora'||c.kind==='galaxy'){for(let i=0;i<6;i++){ctx.strokeStyle=c.color+(20+i*8).toString(16).padStart(2,'0');ctx.lineWidth=22;ctx.beginPath();ctx.moveTo(0,h*(.12+.11*i));ctx.bezierCurveTo(w*.25,h*(.7-.06*i),w*.65,h*(-.1+.08*i),w,h*(.3+.05*i));ctx.stroke();}}
 if(c.kind==='meteor'){for(let i=0;i<12;i++){let sx=((rand(i+4)*w-t*(20+i*2))%w+w)%w,sy=rand(i+40)*h;ctx.strokeStyle='#c5f7f6b0';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx+34,sy-12);ctx.stroke();}}
 particles.forEach(p=>{ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.hit?'#f1a7ae':'#b7fbe5';ctx.beginPath();ctx.arc(p.x*w,p.y*h,p.hit?8:5,0,7);ctx.fill();});ctx.globalAlpha=1;
 ship.style.transform=`translate(${x*105}px,${y*80+Math.sin(t*.9)*8}px) rotate(${manual?y*8:Math.sin(t*.4)*1.3}deg)`;
 }
 function setManual(v){manual=v;if(!v){x=0;y=0;} onUpdate?.({sector,manual,lit,encounter});}
 function input(key,isDown){if(isDown)keys.add(key.toLowerCase());else keys.delete(key.toLowerCase());}
 function advance(dt){if(paused)return;dt=Math.min(Math.max(0,dt),.08);t+=dt;
  if(t>48){t=0;sector=(sector+1)%landscapes.length;particles=[];onUpdate?.({sector,manual,lit,encounter});}
  if(manual){let dx=(keys.has('arrowright')||keys.has('d')?1:0)-(keys.has('arrowleft')||keys.has('a')?1:0);let dy=(keys.has('arrowdown')||keys.has('s')?1:0)-(keys.has('arrowup')||keys.has('w')?1:0);x=Math.max(-1.6,Math.min(1.6,x+dx*dt*1.5));y=Math.max(-1.3,Math.min(1.3,y+dy*dt*1.5));
  if(rand(Math.floor(t*9)+sector*70)>.984&&particles.length<6)particles.push({x:1.05,y:.22+rand(Math.floor(t*31))*0.65,life:1,hit:false});}
  for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.x-=dt*.18;if(manual&&Math.abs((.43+x*.16)-p.x)<.042&&Math.abs((.50+y*.17)-p.y)<.07){lit++;p.life=0;onUpdate?.({sector,manual,lit,encounter});}if(p.x<-.04||p.life<=0)particles.splice(i,1);}
  draw();
 }
 return {resize,advance,setManual,input,pause:v=>paused=v,next:()=>{sector=(sector+1)%landscapes.length;t=0;particles=[];onUpdate?.({sector,manual,lit,encounter});draw();},get sector(){return sector;},get manual(){return manual;}};
}
