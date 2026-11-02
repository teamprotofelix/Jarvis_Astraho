# Optional: Python Playwright/Pillow, system Chromium; serve localhost:8000.
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import json,subprocess
root=Path(__file__).resolve().parents[1];out=root/'work/qa-pr8';out.mkdir(parents=True,exist_ok=True);results={}
code="""import {earnedCampaign,constructAll} from './tests/fixtures/campaign.mjs';import {createGameState,serializeSave} from './js/state/game-state.js';import {chapter} from './js/story/catalog.js';import {writeFileSync} from 'node:fs';const f=constructAll(earnedCampaign()),c=f.campaign;c.reviewStory('the-unanswered-invitation');while(c.story.pending.length){const p=c.story.pending[0];c.chooseStory({eventId:p.eventId,choiceId:chapter(p.eventId).choices[0].id,eventSequence:p.sequence});}const s=createGameState({...c.snapshot(),ui:{selectedView:'living'}});s.flight.distance=f.distance;writeFileSync('work/qa-pr8/fixture.json',serializeSave(s));"""
subprocess.run(['node','--input-type=module','-e',code],cwd=root,check=True)
def exported(pg):
 with pg.expect_download() as d:pg.locator('#export-save').click()
 return json.loads(Path(d.value.path()).read_text())
def load(c):
 pg=c.new_page();pg.goto('http://127.0.0.1:8000');pg.wait_for_function("document.querySelector('#save-status').dataset.ok==='true'");return pg

def imported(pg):
 pg.locator('#import-save').set_input_files(str(root/'work/qa-pr8/fixture.json'));pg.locator('#confirm-import').click();pg.locator('#global-pause').click();return pg
instrument="""(()=>{const original=requestAnimationFrame.bind(window);window.__appFrames=0;window.requestAnimationFrame=cb=>original(t=>{if(cb.name==='animate')__appFrames++;cb(t);});})();"""
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 c=b.new_context(viewport={'width':1440,'height':900},device_scale_factor=3,has_touch=True,service_workers='block',accept_downloads=True);c.add_init_script(instrument);pg=imported(load(c));errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
 # Pausing removes the app RAF; resuming cannot multiply loops.
 n=pg.evaluate('__appFrames');pg.wait_for_timeout(600);assert pg.evaluate('__appFrames')==n
 for i in range(4):pg.locator('#global-pause').click();pg.wait_for_timeout(100);pg.locator('#global-pause').click()
 n=pg.evaluate('__appFrames');pg.wait_for_timeout(400);assert pg.evaluate('__appFrames')==n
 pg.locator('#story-notification').click();pg.locator('#story-filter').select_option('skulds-prototype');assert pg.locator('.story-record').count()==1;pg.locator('#story-filter').select_option('all')
 initial_full=pg.evaluate("performance.getEntriesByType('resource').filter(r=>r.name.includes('/story/scenes/')).length");assert initial_full==0
 pg.locator('.story-record').first.click();pg.wait_for_function("document.querySelector('.story-scene>img').complete");assert '/story/scenes/' in pg.locator('.story-scene>img').get_attribute('src');pg.keyboard.press('Escape')
 pg.locator('[data-view=living]').first.click();pg.locator('#art-quality').select_option('low');pg.locator('#story-notification').click();pg.locator('.story-record').first.click();assert '/story/thumbs/' in pg.locator('.story-scene>img').get_attribute('src');pg.keyboard.press('Escape')
 # Fail decode even with HTTP 200, then fail thumb fetch; bridge fallback survives.
 pg.route('**/assets/story/scenes/*.webp',lambda r:r.fulfill(status=200,content_type='image/webp',body=b'not a webp'))
 pg.route('**/assets/story/thumbs/*.webp',lambda r:r.fulfill(status=404,body='missing'))
 pg.locator('[data-view=living]').first.click();pg.locator('#art-quality').select_option('high');pg.locator('#story-notification').click();pg.locator('.story-record').first.click();pg.wait_for_function("document.querySelector('.story-scene>img').getAttribute('src').includes('/scenes/bridge')");assert pg.locator('#detail-title').inner_text();pg.keyboard.press('Escape');pg.unroute_all()
 results['images']={'initialFullScenes':initial_full,'desktopHighFull':True,'lowThumb':True,'http200DecodeFailureAnd404ThumbFallback':True}
 # Four widths, every primary view, fixed toolbar controls and AX tree.
 layouts=[]
 for name,w,h in [('desktop',1440,900),('mobile',390,844),('tablet',768,1024),('narrow',320,700)]:
  pg.set_viewport_size({'width':w,'height':h})
  for view in ['map','living','voyage','missions','expedition','research','journal']:
   pg.locator(f'.top-nav [data-view={view}]').click();pg.wait_for_timeout(50);assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth'),(name,view)
  pg.locator('#story-notification').click();assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth')
  buttons=pg.locator('.save-toolbar button:visible').evaluate_all('(els)=>els.map(e=>({id:e.id,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}))');assert all(x['w']>=44 and x['h']>=44 for x in buttons),buttons
  pg.locator('.story-record').first.click();assert '/story/thumbs/' in pg.locator('.story-scene>img').get_attribute('src') if w<1000 else True
  pg.locator('#detail-dialog').screenshot(path=str(out/f'{name}-story.png'),animations='disabled');pg.keyboard.press('Tab');assert pg.evaluate('document.activeElement.closest("#detail-dialog")!==null');pg.keyboard.press('Escape');assert pg.evaluate('document.activeElement.classList.contains("story-record")')
  layouts.append({'width':w,'height':h,'views':8,'noOverflow':True,'toolbar44px':True})
 cd=c.new_cdp_session(pg);ax=cd.send('Accessibility.getFullAXTree')['nodes'];results['accessibility']={'axNamedStoryFilter':any(x.get('name',{}).get('value')=='기록 필터' for x in ax),'dialogTabAndEscapeFocus':True,'physicalScreenReaderTested':False};assert results['accessibility']['axNamedStoryFilter']
 pg.set_viewport_size({'width':1440,'height':900});pg.locator('[data-view=voyage]').first.click();pg.locator('#flight-wrap').scroll_into_view_if_needed();pg.wait_for_timeout(200);dims=pg.locator('#flight-canvas').evaluate('(e)=>({width:e.width,height:e.height,cssW:e.getBoundingClientRect().width,cssH:e.getBoundingClientRect().height})');assert dims['width']<=dims['cssW']*2+2 and dims['height']<=dims['cssH']*2+2,dims
 results['layout']=layouts;results['canvasDPR3CappedAt2']=dims;results['pauseFramesStopped']=True
 # Future JSON import must leave in-memory story untouched.
 before=exported(pg);future={**before,'schemaVersion':6};f=out/'future.json';f.write_text(json.dumps(future));pg.locator('#import-save').set_input_files(str(f));pg.wait_for_function("document.querySelector('#save-status').textContent.includes('거부')");assert exported(pg)['story']==before['story'];results['futureImportPreserved']=True
 # Current corrupt/future record remains stored without automatic overwrite.
 pg.evaluate("value=>new Promise((resolve,reject)=>{const r=indexedDB.open('astraho-save:/',1);r.onsuccess=()=>{const tx=r.result.transaction('state','readwrite');tx.objectStore('state').put(value,'current');tx.oncomplete=resolve;tx.onerror=reject;};})",future)
 pg.reload();pg.wait_for_function("document.querySelector('#save-status').textContent.includes('기존 데이터 보존')");pg.wait_for_timeout(900)
 raw=pg.evaluate("()=>new Promise(resolve=>{const r=indexedDB.open('astraho-save:/',1);r.onsuccess=()=>{const s=r.result.transaction('state').objectStore('state').get('current');s.onsuccess=()=>resolve(s.result);};})");assert raw==future;results['futureStoredRawPreserved']=True
 c.close()
 for kind,script in [('unavailable',"IDBFactory.prototype.open=function(){throw new DOMException('blocked','SecurityError');}"),('quota',"IDBObjectStore.prototype.put=function(){throw new DOMException('full','QuotaExceededError');}")]:
  c=b.new_context(service_workers='block',accept_downloads=True);c.add_init_script(script);pg=c.new_page();pg.goto('http://127.0.0.1:8000');pg.wait_for_function("document.querySelector('#save-status').textContent.includes('저장 불가')" if kind=='unavailable' else "document.querySelector('#save-status').dataset.ok==='true'")
  if kind=='quota':pg.locator('#global-pause').click();pg.wait_for_timeout(1200);pg.wait_for_function("document.querySelector('#save-status').textContent.includes('저장 불가')")
  assert exported(pg)['schemaVersion']==5;results[kind]={'warning':pg.locator('#save-status').inner_text(),'jsonBackupWorks':True};c.close()
 results['pageErrors']=errors;assert not errors; b.close()
(out/'matrix.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
for f in out.glob('*story.png'):Image.open(f).save(f.with_suffix('.webp'),'WEBP',quality=76)
print('PASS PR8 matrix: pause loop, filter, decode/404 fallback, high/low, 4 widths x8 views, AX/focus, DPR cap, future import/stored preservation, IDB unavailable/quota export')
