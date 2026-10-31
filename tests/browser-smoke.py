# Optional: pip install playwright Pillow; serve repo on localhost, then run this file.
# Uses the system Chromium; artifacts go to ignored work/browser-smoke.
from playwright.sync_api import sync_playwright
from pathlib import Path
from PIL import Image
import json,sys
root=Path(__file__).resolve().parents[1];dest=root/'work/browser-smoke';dest.mkdir(parents=True,exist_ok=True)
base_url=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8000'
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 results=[]
 for label,w,h in [('desktop',1440,900),('mobile',390,844),('tablet',768,1024)]:
  context=browser.new_context(viewport={'width':w,'height':h},has_touch=label=='mobile',accept_downloads=True)
  page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(base_url);page.wait_for_function("document.querySelector('#save-status').dataset.ok==='true'")
  page.locator('[data-view="living"]').click();page.locator('#living-root').scroll_into_view_if_needed()
  # 4x logic speed without changing the single rendering loop.
  page.evaluate("document.querySelector('#sim-speed').click();document.querySelector('#sim-speed').click()")
  page.wait_for_function("document.querySelector('.living-person[data-person=marie]').dataset.state==='serve'",timeout=20000)
  marie=page.locator('.living-person[data-person="marie"]');assert marie.locator('.life-prop img').get_attribute('src').endswith('/tea-cup.webp')
  assert page.locator('.living-person[data-person="skuld"]').get_attribute('data-state') in ['repair','work']
  marie.click();assert '생활 지원' in page.locator('#living-life').inner_text()
  # Pause through visible control: UI and prop render freeze together.
  page.locator('#living-pause').click();page.wait_for_timeout(200)
  page.locator('#living-scroll').evaluate('(e)=>e.scrollLeft=0');page.locator('#living-root').screenshot(path=str(dest/f'{label}.png'))
  if label=='desktop':
   page.locator('.ark-hero').screenshot(path=str(dest/'exterior.png'))
  page.locator('#living-talk').click();assert marie.get_attribute('data-state')=='talk'
  assert '대화' in page.locator('#living-life').inner_text()
  page.locator('#living-visit').click();assert page.locator('[data-room-person="marie"]').get_attribute('data-state')=='talk'
  page.locator('.room-scene').screenshot(path=str(dest/f'{label}-room.png'))
  page.keyboard.press('Escape')
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  # Exact paused FSM/rng restoration through the existing user-facing export.
  with page.expect_download() as d:page.locator('#export-save').click()
  saved=json.loads(Path(d.value.path()).read_text())
  page.wait_for_timeout(1000);page.reload();page.wait_for_function("document.querySelector('#save-status').textContent.includes('복원')")
  with page.expect_download() as d:page.locator('#export-save').click()
  restored=json.loads(Path(d.value.path()).read_text());assert restored['simulation']==saved['simulation']
  page.wait_for_function("document.querySelector('#offline-status').textContent.includes('완료')")
  context.set_offline(True);page.reload();page.wait_for_selector('.living-person');page.wait_for_timeout(200)
  assert page.locator('.living-person[data-person="marie"]').get_attribute('data-state')=='talk'
  assert not errors,errors
  results.append({'viewport':label,'MarieTea':'pass','SkuldWork':'pass','talkAndRoom':'pass','FSMReload':'exact','offline':'pass','pageerrors':errors})
  context.close()
 # Reduced motion starts paused; explicit resume advances logic with static walk/fx frames.
 context=browser.new_context(viewport={'width':390,'height':844},reduced_motion='reduce')
 page=context.new_page();page.goto(base_url);page.wait_for_function("document.querySelector('#save-status').dataset.ok==='true'")
 assert page.locator('#motion-toggle').get_attribute('aria-pressed')=='true'
 page.locator('[data-view="living"]').click();page.locator('#living-pause').click();page.wait_for_timeout(800)
 assert page.locator('body').evaluate('(e)=>e.classList.contains("motion-stopped")')
 assert all(v=='none' for v in page.locator('.living-person .sprite-sheet').evaluate_all('(els)=>els.map(e=>getComputedStyle(e).animationName)'))
 browser.close()
for image in dest.glob('*.png'):
 Image.open(image).save(image.with_suffix('.webp'),'WEBP',quality=72);image.unlink()
print(json.dumps(results,ensure_ascii=False,indent=2));print('PASS reduced-motion logic/render separation')
