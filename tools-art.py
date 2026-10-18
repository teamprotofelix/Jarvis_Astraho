"""Production resizing/conversion only; image content is generated with imagegen.
Usage: python tools-art.py /absolute/path/to/art-paths.json
Raw PNGs remain outside this public repository.
"""
from PIL import Image
from pathlib import Path
import json,sys,hashlib
root=Path(__file__).parent
paths=json.loads(Path(sys.argv[1]).read_text())
manifest=[]
kinds={'space-nebula':'nebula','space-ring':'ring','space-meteor':'meteor','space-cluster':'cluster','space-aurora':'aurora','space-gateway':'gateway','space-blackhole':'blackhole','space-planet':'planet','space-galaxy':'galaxy'}
def save(im,target,size,quality=80,lossless=False,source=None):
    im=im.resize(size,Image.Resampling.LANCZOS)
    target=root/target;target.parent.mkdir(parents=True,exist_ok=True)
    im.save(target,'WEBP',quality=quality,method=6,lossless=lossless)
    manifest.append({'path':target.relative_to(root).as_posix(),'width':im.width,'height':im.height,'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'sourceBytes':source})
for name,path in paths.items():
    source=Path(path); im=Image.open(source);size=source.stat().st_size
    if name.startswith('sprite-'):
        assert im.mode=='RGBA' and im.getextrema()[3][0]==0, f'Missing transparent alpha: {name}'
        save(im,f'assets/sprites/{name[7:]}.webp',(384,512),quality=90,source=size)
    elif name=='ship':
        assert im.mode=='RGBA' and im.getextrema()[3][0]==0,'Missing ship transparency'
        save(im,'assets/ship.webp',(960,540),quality=88,source=size)
    elif name in kinds:
        save(im.convert('RGB'),f'assets/backgrounds/{kinds[name]}.webp',(1280,720),quality=80,source=size)
    else:
        save(im.convert('RGB'),f'assets/scenes/{name}.webp',(960,540),quality=82,source=size)
        save(im.convert('RGB'),f'assets/thumbs/{name}.webp',(320,180),quality=74)
(root/'assets/art-manifest.json').write_text(json.dumps({'generator':'imagegen','version':'1.1.0','sprites':{'columns':3,'rows':4,'cellWidth':128,'cellHeight':128,'directions':['south','west','east','north']},'assets':manifest},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'files':len(manifest),'webpBytes':sum(x['bytes'] for x in manifest),'originalPngBytes':sum(x['sourceBytes'] or 0 for x in manifest)}))
