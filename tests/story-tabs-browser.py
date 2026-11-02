# Optional: serve localhost:8000; Python Playwright and system Chromium.
from pathlib import Path
from playwright.sync_api import sync_playwright
import subprocess,json
root=Path(__file__).resolve().parents[1];out=root/'work/qa-pr8';out.mkdir(exist_ok=True)
code="""import {earnedCampaign} from './tests/fixtures/campaign.mjs';import {createGameState,serializeSave} from './js/state/game-state.js';import {writeFileSync} from 'node:fs';const f=earnedCampaign(),s=createGameState({...f.campaign.snapshot(),ui:{selectedView:'story',paused:true}});s.flight.distance=f.distance;writeFileSync('work/qa-pr8/pending.json',serializeSave(s));""";subprocess.run(['node','--input-type=module','-e',code],cwd=root,check=True)
def export(pg):
 with pg.expect_download() as d:pg.locator('#export-save').click()
 return json.loads(Path(d.value.path()).read_text())
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);c=b.new_context(viewport={'width':390,'height':844},has_touch=True,accept_downloads=True);a=c.new_page();a.goto('http://127.0.0.1:8000');a.wait_for_function("document.querySelector('#save-status').dataset.ok==='true'");a.locator('#import-save').set_input_files(str(out/'pending.json'));a.locator('#confirm-import').click();a.wait_for_timeout(1200)
 a.locator('[data-open-story=""]').click();choices=a.locator('[data-story-choice]');assert choices.count()==3;names=choices.all_inner_texts();assert all(names)
 ax=c.new_cdp_session(a).send('Accessibility.getFullAXTree')['nodes'];assert len([x for x in ax if x.get('role',{}).get('value')=='button' and 'E의' not in x.get('name',{}).get('value','')])>=4
 assert all(x['width']>=44 and x['height']>=44 for x in choices.evaluate_all('(es)=>es.map(e=>e.getBoundingClientRect().toJSON())'));a.locator('#detail-dialog').screenshot(path=str(out/'mobile-choice.png'))
 a.locator('[data-story-choice]').nth(1).focus();a.keyboard.press('Tab');assert a.evaluate('document.activeElement.hasAttribute("data-story-choice")');a.keyboard.press('Escape');assert a.evaluate('document.activeElement.hasAttribute("data-open-story")')
 # Both pages read the same revision; A holds an obsolete decision dialog.
 a.locator('[data-open-story=""]').click();z=c.new_page();z.goto('http://127.0.0.1:8000');z.wait_for_function("document.querySelector('#save-status').textContent.includes('복원')");z.locator('[data-open-story=""]').click();z.locator('[data-story-choice]').first.click();z.wait_for_timeout(1400);winner=export(z)
 a.bring_to_front();a.locator('[data-story-choice]').nth(1).click();a.wait_for_timeout(1400);a.wait_for_function("document.querySelector('#save-status').textContent.includes('다른 탭')");notice=a.locator('#save-status').inner_text()
 z.reload();z.wait_for_function("document.querySelector('#save-status').textContent.includes('복원')");assert export(z)['story']==winner['story']
 (out/'tabs.json').write_text(json.dumps({'choiceNames':names,'choices44px':True,'keyboardTabEscape':True,'AXTree':True,'conflictNotice':notice,'winnerStoryPreserved':True},ensure_ascii=False,indent=2));b.close()
print('PASS pending choices AX/names/44px/keyboard; two real pages choose different alternatives, stale save stopped, first winning story preserved')
