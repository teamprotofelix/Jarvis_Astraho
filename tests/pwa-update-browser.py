# Optional historical update test: Python Playwright/system Chromium, local git PR7 commit.
# Starts an ephemeral localhost server; writes only ignored work/pwa-update/.
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,hashlib,subprocess,tarfile,io,threading
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
root=Path(__file__).resolve().parents[1];out=root/'work/pwa-update';out.mkdir(parents=True,exist_ok=True);baseline_root=out/'old';baseline_root.mkdir(exist_ok=True)
flag=out/'next';flag.unlink(missing_ok=True)
archive=subprocess.run(['git','archive','26bb869f61dfd5bb0b7cfb1a9dc5018ec1b05372'],cwd=root,check=True,capture_output=True)
with tarfile.open(fileobj=io.BytesIO(archive.stdout)) as tar:tar.extractall(baseline_root,filter='data')
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(root if flag.exists() else baseline_root),**kwargs)
 def log_message(self,*args):pass
 def end_headers(self):self.send_header('Cache-Control','no-cache');super().end_headers()
 def translate_path(self,path):return super().translate_path(path[4:] if path.startswith('/ark/') else path)
server=ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/ark/'
code="""import {earnedCampaign,constructAll} from './tests/fixtures/campaign.mjs';import {createGameState,serializeSave} from './js/state/game-state.js';import {chapter} from './js/story/catalog.js';import {writeFileSync} from 'node:fs';const f=constructAll(earnedCampaign()),c=f.campaign;c.reviewStory('the-unanswered-invitation');while(c.story.pending.length){const p=c.story.pending[0];c.chooseStory({eventId:p.eventId,choiceId:chapter(p.eventId).choices[0].id,eventSequence:p.sequence});}const s=createGameState({...c.snapshot(),ui:{selectedView:'living'}});s.flight.distance=f.distance;writeFileSync('work/pwa-update/fixture.json',serializeSave(s));"""
subprocess.run(['node','--input-type=module','-e',code],cwd=root,check=True)
def export(pg):
 with pg.expect_download() as d:pg.locator('#export-save').click()
 return json.loads(Path(d.value.path()).read_text())
def identity(pg):
 manifest=pg.evaluate("async()=>await(await fetch('./manifest.webmanifest')).json()")
 pixels=pg.evaluate("async()=>await Promise.all(['icon-192.png','icon-512.png','icon-maskable.png','apple-touch-icon.png','favicon-64.png'].map(async name=>{const bitmap=await createImageBitmap(await(await fetch('./assets/'+name)).blob());const value={name,width:bitmap.width,height:bitmap.height};bitmap.close();return value;}))")
 return {'icons':manifest['icons'],'theme':manifest['theme_color'],'background':manifest['background_color'],'decodedPixels':pixels}
def icon_hash(pg):return pg.evaluate("async()=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await(await fetch('./assets/icon-512.png')).arrayBuffer()))).map(b=>b.toString(16).padStart(2,'0')).join('')")
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);c=b.new_context(viewport={'width':390,'height':844},has_touch=True,accept_downloads=True);pg=c.new_page();errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
 pg.goto(base);pg.wait_for_function("document.querySelector('#offline-status').textContent.includes('완료')");pg.locator('#import-save').set_input_files(str(out/'fixture.json'));pg.locator('#confirm-import').click();pg.locator('#living-pause').click();pg.wait_for_timeout(1200)
 before=export(pg);oldIdentity=pg.evaluate("fetch('./manifest.webmanifest').then(r=>r.json())");old=icon_hash(pg);assert before['story']['resolved'];assert before['ui']['paused']
 pg.locator('#story-notification').click();pg.locator('.story-record').first.click();pg.keyboard.press('Escape');pg.screenshot(path=str(out/'before-update.png'))
 flag.write_text('new');pg.evaluate('navigator.serviceWorker.getRegistration().then(r=>r.update())');pg.wait_for_selector('#update-toast:not([hidden])',timeout=30000)
 waiting=pg.evaluate("navigator.serviceWorker.getRegistration().then(r=>({waiting:!!r.waiting,active:!!r.active}))");assert waiting['waiting'];assert icon_hash(pg)==old
 with pg.expect_navigation(wait_until='load'):pg.locator('#apply-update').click()
 pg.wait_for_function("document.querySelector('#save-status').textContent.includes('복원')");after=export(pg)
 for key in ['story','inventory','construction','research','missions','expedition','rewardLedger','flight','simulation']:assert after[key]==before[key],key
 newIdentity=identity(pg);appManifest=c.new_cdp_session(pg).send('Page.getAppManifest');assert not appManifest.get('errors');new=icon_hash(pg);assert new==hashlib.sha256((root/'assets/icon-512.png').read_bytes()).hexdigest() and new!=old
 assert pg.locator('link[rel="apple-touch-icon"]').get_attribute('href')=='./assets/apple-touch-icon.png'
 pg.screenshot(path=str(out/'after-update.png'));c.set_offline(True);pg.reload();pg.wait_for_function("document.querySelector('#save-status').textContent.includes('복원')");assert export(pg)['story']==before['story'];assert icon_hash(pg)==new
 cache=pg.evaluate('caches.keys()');assert any(x.endswith('v1.9.0') for x in cache) and not any(x.endswith('v1.8.0') for x in cache)
 for name in ['apple-touch-icon.png','favicon-64.png']:
  assert pg.evaluate('(name)=>fetch("./assets/"+name).then(r=>r.ok)',name)
 assert not errors,errors
 (out/'update.json').write_text(json.dumps({'baseVersion':'1.8.0','newVersion':'1.9.0','scope':'/ark/','explicitConsent':True,'storyResolved':len(before['story']['resolved']),'preserved':['story','inventory','construction','research','missions','expedition','rewardLedger','flight','simulation'],'oldIconSHA256':old,'newIconSHA256':new,'oldIdentity':oldIdentity,'newIdentity':newIdentity,'manifestParserErrors':appManifest.get('errors'),'networkResources':pg.evaluate("performance.getEntriesByType('resource').map(r=>({path:new URL(r.name).pathname,transferSize:r.transferSize,decodedBodySize:r.decodedBodySize}))"),'offlineAfterUpdate':True,'caches':cache,'errors':errors},indent=2));b.close()
flag.unlink(missing_ok=True);server.shutdown();server.server_close()
print('PASS actual v1.8.0 -> v1.9.0 consent, waiting old icon, flush/reload, full v5 preservation, new icon + apple/favicon offline, scoped old cache cleanup')
