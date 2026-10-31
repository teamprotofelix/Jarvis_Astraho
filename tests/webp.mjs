// Read the lossless/lossy/extended WebP headers without a runtime image dependency.
export function webpInfo(b){
 if(b.toString('ascii',0,4)!=='RIFF'||b.toString('ascii',8,12)!=='WEBP'||b.readUInt32LE(4)+8!==b.length)throw Error('Invalid WebP container');
 let width,height,alpha=false;
 for(let offset=12;offset+8<=b.length;){const kind=b.toString('ascii',offset,offset+4),size=b.readUInt32LE(offset+4),p=offset+8;if(p+size>b.length)throw Error('Truncated WebP');
  if(kind==='VP8X'){width=1+b.readUIntLE(p+4,3);height=1+b.readUIntLE(p+7,3);alpha=!!(b[p]&16);}
  if(kind==='ALPH')alpha=true;
  if(kind==='VP8 '&&width===undefined){width=b.readUInt16LE(p+6)&16383;height=b.readUInt16LE(p+8)&16383;}
  if(kind==='VP8L'){const bits=b.readUInt32LE(p+1);if(width===undefined){width=1+(bits&16383);height=1+((bits>>>14)&16383);}alpha=alpha||!!(bits&0x10000000);}
  offset=p+size+(size%2);
 }
 if(!width||!height)throw Error('Missing WebP dimensions');return {width,height,alpha};
}
