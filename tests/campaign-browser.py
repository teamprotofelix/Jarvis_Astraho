# Optional integration: pip install playwright Pillow; serve repository over localhost.
# Outputs and model-earned fixtures are written only to ignored work/campaign-browser.
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import json,sys,subprocess
root=Path(__file__).resolve().parents[1];out=root/'work/campaign-browser';out.mkdir(parents=True,exist_ok=True)
base_url=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8000'
subprocess.run(['node','--input-type=module','-e',"import {earnedCampaign} from './tests/fixtures/campaign.mjs';import {createGameState,serializeSave} from './js/state/game-state.js';import {writeFileSync} from 'node:fs';const f=earnedCampaign();const s=createGameState({...f.campaign.snapshot(),ui:{selectedView:'research'}});s.flight.distance=f.distance;writeFileSync('work/campaign-browser/earned-campaign.json',serializeSave(s));"],cwd=root,check=True)
def exported(page):
 with page.expect_download() as d:page.locator('#export-save').click()
 return json.loads(Path(d.value.path()).read_text())
def savepoint(page):
 page.clock.run_for(1500);page.wait_for_timeout(100)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 c=b.new_context(viewport={'width':1440,'height':900},has_touch=True,accept_downloads=True);page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(base_url);page.wait_for_function("document.querySelector('#save-status').dataset.ok==='true'");page.clock.install()
 page.locator('[data-view=missions]').first.click();page.locator('[data-mission-action=scan][data-signal=crystal_shore]').click();page.clock.run_for(7200)
 page.locator('[data-mission-action=depart][data-signal=crystal_shore]').click();page.locator('#flight-wrap').scroll_into_view_if_needed();page.wait_for_timeout(100);page.clock.run_for(68000)
 page.locator('[data-view=missions]').first.click();page.locator('[data-mission-action=launch][data-signal=crystal_shore]').click();page.locator('#exp-wrap').scroll_into_view_if_needed();page.wait_for_timeout(300)
 assert '수정 해안' in page.locator('#exp-region').inner_text()
 page.locator('#exp-wrap').focus();page.keyboard.down('d');page.clock.run_for(300);page.keyboard.up('d');assert 'X2 Y7' not in page.locator('#exp-state-text').inner_text()
 # Play each objective through the actual path-following controls, then scan and gather.
 for index in range(3):
  page.locator('.exp-slot button').nth(index).click();page.clock.run_for(8000)
  page.locator('[data-exp-action=scan]').click();page.clock.run_for(6200)
  page.locator('[data-exp-action=interact]').click();page.clock.run_for(40200)
  assert page.locator('.exp-slot strong').nth(index).inner_text().endswith('✓'),page.locator('#expedition-notice').inner_text()
  print('Collected objective',index+1,flush=True)
 # Pause midway and persist compact expedition deltas.
 page.locator('#expedition-pause').click();savepoint(page);saved=exported(page);assert saved['schemaVersion']==4;assert len(saved['expedition']['collectedIds'])==3
 page.reload();page.wait_for_function("document.querySelector('#save-status').textContent.includes('복원')");restored=exported(page);assert restored['expedition']==saved['expedition'];assert restored['missions']==saved['missions']
 page.locator('#expedition-pause').click();page.locator('[data-exp-action=home]').click();page.clock.run_for(10000)
 page.locator('[data-exp-action=extract]').click();page.clock.run_for(9200);page.locator('#expedition-pause').click();savepoint(page)
 result=exported(page);assert result['rewardLedger']['lastSequence']==1;assert sum(result['rewardLedger']['totals'].values())==9
 assert result['missions']['active']['status']=='completed'
 page.reload();page.wait_for_function("document.querySelector('#save-status').textContent.includes('복원')");assert exported(page)['inventory']==result['inventory']
 # Complete the first real expedition -> engineering loop with its earned resources.
 page.locator('[data-view=research]').first.click();page.locator('#research-pause').click()
 assert page.locator('[data-inventory=resonance_crystal]').inner_text()=='4'
 research=page.locator('[data-project-action=research][data-facility=survey_hangar]');research.click()
 assert page.locator('[data-inventory=resonance_crystal]').inner_text()=='3'
 assert page.locator('[data-inventory=starmetal]').inner_text()=='2'
 assert page.locator('[data-facility-card=survey_hangar] button').is_disabled()
 page.clock.run_for(13200);page.locator('[data-project-action=build][data-facility=survey_hangar]').click();page.clock.run_for(11200)
 assert '가동 중' in page.locator('[data-facility-card=survey_hangar]').inner_text()
 assert page.locator('[data-inventory=resonance_crystal]').inner_text()=='1'
 assert page.locator('[data-inventory=starmetal]').inner_text()=='1'
 assert '신호 스캔 1.5' in page.locator('.effect-readout').inner_text()
 page.locator('#research-pause').click();savepoint(page);first=exported(page)
 assert first['construction']['levels']['survey_hangar']==1
 page.reload();page.wait_for_function("document.querySelector('#save-status').textContent.includes('복원')")
 reloaded=exported(page)
 for key in ['inventory','research','construction','missions','rewardLedger']:assert reloaded[key]==first[key],key
 # Import a separately model-earned three-region fixture; build all four through mobile taps.
 page.set_viewport_size({'width':390,'height':844})
 page.locator('#import-save').set_input_files(str(out/'earned-campaign.json'));page.locator('#confirm-import').click()
 for facility in ['survey_hangar','anomaly_lab','bio_dome','worldtree_resonator']:
  page.locator(f'[data-project-action=research][data-facility={facility}]').tap();page.clock.run_for(26200)
  page.locator(f'[data-project-action=build][data-facility={facility}]').tap();page.clock.run_for(11200)
  assert '가동 중' in page.locator(f'[data-facility-card={facility}]').inner_text()
  print('Built facility',facility,flush=True)
 page.locator('[data-project-action=analyze]').tap();assert page.locator('[data-inventory=memory_echo]').inner_text()=='5'
 page.locator('[data-view=living]').first.click();page.locator('#living-root').scroll_into_view_if_needed();page.clock.run_for(32000)
 assert page.locator('.living-room .facility-overlay').count()==4
 assert page.locator('.living-person[data-action*=\"-facility-\"]').count()>0
 page.locator('#living-pause').click();savepoint(page)
 page.locator('#living-root').screenshot(path=str(out/'living-mobile.png'))
 page.locator('.living-room[data-room=garden]').click(position={'x':10,'y':10});assert page.locator('.room-scene .facility-overlay').count()==2
 page.locator('.room-scene').screenshot(path=str(out/'garden-room.png'));page.keyboard.press('Escape')
 page.locator('.ark-hero').screenshot(path=str(out/'exterior.png'))
 result=exported(page);page.locator('[data-view=research]').first.click();savepoint(page)
 for name,w,h in [('desktop',1440,900),('mobile',390,844),('tablet',768,1024),('narrow',320,700)]:
  page.set_viewport_size({'width':w,'height':h});page.locator('#research-view').scroll_into_view_if_needed();page.wait_for_timeout(150)
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),name
  page.locator('#research-view').screenshot(path=str(out/f'{name}.png'))
 page.wait_for_function("document.querySelector('#offline-status').textContent.includes('완료')");c.set_offline(True);page.reload();page.wait_for_selector('[data-facility-card]');assert exported(page)['inventory']==result['inventory']
 assert not errors,errors;b.close()
for f in out.glob('*.png'):Image.open(f).save(f.with_suffix('.webp'),'WEBP',quality=72);f.unlink()
print('PASS PR6 first real expedition -> exact research/build costs -> installed hangar -> reload; separate model-earned fixture -> mobile tap all four -> actual crew/room/hero -> crafting -> offline; four widths, 0 page errors')
