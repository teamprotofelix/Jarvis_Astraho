export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export class FlightModel{
 constructor(random=Math.random){this.random=random;this.width=960;this.height=500;this.x=.28;this.y=.52;this.tilt=0;this.time=0;this.sectorTime=0;this.sector=0;this.manual=false;this.lit=0;this.shield=100;this.collisions=0;this.invincible=0;this.distance=0;this.objects=[];this.spawnTime=0;this.message='자동 조종이 안전 항로를 유지합니다.';this.spawn('light',.75,.52);}
 get shipWidth(){return clamp(this.width*.24,90,240);}
 setBounds(width,height){this.width=Math.max(1,width);this.height=Math.max(1,height);this.bound();}
 bound(){const mx=(this.shipWidth*.5+8)/this.width,my=(this.shipWidth*.18+8)/this.height;this.x=clamp(this.x,mx,1-mx);this.y=clamp(this.y,my,1-my);}
 setManual(value){this.manual=!!value;this.tilt=0;this.message=value?'방향키·WASD·터치로 조종하세요.':'자동 조종이 안전 항로를 유지합니다.';}
 spawn(kind,x=1.1,y=.16+this.random()*.68){if(this.objects.length<12)this.objects.push({kind,x,y,spin:this.random()*6,age:0});}
 next(){this.sector=(this.sector+1)%9;this.sectorTime=0;this.objects=[];this.spawnTime=0;}
 step(seconds,input={}){const dt=Number.isFinite(seconds)?clamp(seconds,0,.05):0;if(!dt)return;this.time+=dt;this.sectorTime+=dt;this.distance+=dt*12;this.invincible=Math.max(0,this.invincible-dt);
  if(this.sectorTime>=42)this.next();
  let dy=0;
  if(this.manual){const dx=(input.right?1:0)-(input.left?1:0);dy=(input.down?1:0)-(input.up?1:0);const length=Math.hypot(dx,dy)||1;this.x+=dx/length*220/this.width*dt;this.y+=dy/length*220/this.height*dt;}
  else{const hazard=this.objects.find(o=>o.kind==='rock'&&o.x>this.x&&o.x<this.x+.26&&Math.abs(o.y-this.y)<.2),light=this.objects.find(o=>o.kind==='light'&&o.x>this.x);const target=hazard?(hazard.y>.5?.24:.76):(light?.y??(.5+Math.sin(this.time*.35)*.13));dy=target-this.y;this.x+=(.28-this.x)*(1-Math.exp(-dt*2));this.y+=dy*(1-Math.exp(-dt*3));}
  this.tilt+=(dy*.12-this.tilt)*(1-Math.exp(-dt*8));this.bound();this.spawnTime+=dt;
  if(this.spawnTime>2.2){this.spawnTime=0;this.spawn(this.random()<.65?'light':'rock');}
  const rx=(this.shipWidth*.32+12)/this.width,ry=(this.shipWidth*.12+12)/this.height;
  for(let i=this.objects.length-1;i>=0;i--){const o=this.objects[i];o.x-=dt*.15;o.age+=dt;
   if(Math.abs(o.x-this.x)<rx&&Math.abs(o.y-this.y)<ry){
    if(o.kind==='light'){this.lit++;this.message='별빛 조각을 기록했습니다.';this.objects.splice(i,1);continue;}
    if(this.manual&&this.invincible===0){this.shield=Math.max(0,this.shield-25);this.collisions++;this.invincible=1.5;this.message='운석 접촉. 보호막이 충격을 흡수했습니다.';if(this.shield===0){this.shield=100;this.invincible=3;this.x=.28;this.y=.5;this.message='보호막 재생 완료. 안전 위치에서 탐사를 계속합니다.';}this.objects.splice(i,1);continue;}
    if(!this.manual){this.objects.splice(i,1);continue;}
   }
   if(o.x<-.1)this.objects.splice(i,1);
  }
 }
}
