# Optional: serve localhost:8000; Python Playwright and system Chromium.
from pathlib import Path
from playwright.sync_api import sync_playwright
import subprocess,json
root=Path(__file__).resolve().parents[1];out=root/'work/qa-pr8';out.mkdir(parents=True,exist_ok=True)
code="""import {earnedCampaign,constructAll} from './tests/fixtures/campaign.mjs';import {createGameState,serializeSave} from './js/state/game-state.js';import {chapter} from './js/story/catalog.js';import {writeFileSync} from 'node:fs';for(const index of [0,1]){const f=constructAll(earnedCampaign()),c=f.campaign;c.reviewStory('the-unanswered-invitation');while(c.story.pending.length){const p=c.story.pending[0];c.chooseStory({eventId:p.eventId,choiceId:chapter(p.eventId).choices[index].id,eventSequence:p.sequence});}const s=createGameState({...c.snapshot(),ui:{selectedView:'story',paused:true}});s.flight.distance=f.distance;writeFileSync('work/qa-pr8/branch-'+index+'.json',serializeSave(s));}""";subprocess.run(['node','--input-type=module','-e',code],cwd=root,check=True)
def export(pg):
 with pg.expect_download() as d:pg.locator('#export-save').click()
 return json.loads(Path(d.value.path()).read_text())
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);c=b.new_context(accept_downloads=True);pg=c.new_page();pg.goto('http://127.0.0.1:8000');pg.wait_for_function("document.querySelector('#save-status').dataset.ok==='true'")
 texts=[];states=[]
 for i in [0,1]:
  pg.locator('#import-save').set_input_files(str(out/f'branch-{i}.json'));pg.locator('#confirm-import').click();pg.wait_for_timeout(500);states.append(export(pg));texts.append(pg.locator('.story-record').first.inner_text())
 assert states[0]['story']['revision']==states[1]['story']['revision'];assert texts[0]!=texts[1];assert states[0]['story']!=states[1]['story']
 pg.locator('#undo-import').click();pg.wait_for_timeout(600);assert export(pg)['story']==states[0]['story'];assert pg.locator('.story-record').first.inner_text()==texts[0]
 pg.reload();pg.wait_for_function("document.querySelector('#save-status').textContent.includes('복원')");assert export(pg)['story']==states[0]['story']
 (out/'import.json').write_text(json.dumps({'sameRevision':states[0]['story']['revision'],'differentBranchesRenderedWhilePaused':True,'undoRestoredStoryAndUI':True,'reloadPreservedUndo':True},indent=2));b.close()
print('PASS real JSON import two different choices with same story revision, paused UI updates, undo restores exact story and survives reload')
