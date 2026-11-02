# Optional actual 20-minute Chromium probe; no Playwright virtual clock.
# Start localhost:8000 first. Writes only ignored work/perf-pr8/.
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,time,subprocess,datetime
root=Path(__file__).resolve().parents[1];out=root/'work/perf-pr8';out.mkdir(parents=True,exist_ok=True)
code="""import {earnedCampaign,constructAll} from './tests/fixtures/campaign.mjs';import {createGameState,serializeSave} from './js/state/game-state.js';import {chapter} from './js/story/catalog.js';import {writeFileSync} from 'node:fs';const f=constructAll(earnedCampaign()),c=f.campaign;c.reviewStory('the-unanswered-invitation');while(c.story.pending.length){const p=c.story.pending[0];c.chooseStory({eventId:p.eventId,choiceId:chapter(p.eventId).choices[0].id,eventSequence:p.sequence});}const s=createGameState({...c.snapshot(),ui:{selectedView:'living'}});s.flight.distance=f.distance;writeFileSync('work/perf-pr8/fixture.json',serializeSave(s));"""
subprocess.run(['node','--input-type=module','-e',code],cwd=root,check=True)
instrument="""(()=>{const raf=requestAnimationFrame.bind(window);window.__qa={appSchedules:0,frames:0,gaps:[],longTasks:0,longTaskMs:0};window.requestAnimationFrame=cb=>{if(cb.name==='animate')__qa.appSchedules++;return raf(cb);};let previous;function measure(t){if(previous){__qa.gaps.push(t-previous);if(__qa.gaps.length>1200)__qa.gaps.shift();}previous=t;__qa.frames++;raf(measure);}raf(measure);new PerformanceObserver(list=>{for(const e of list.getEntries()){__qa.longTasks++;__qa.longTaskMs+=e.duration;}}).observe({type:'longtask',buffered:true});})();"""
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);c=b.new_context(viewport={'width':1440,'height':900},accept_downloads=True);pg=c.new_page();errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.add_init_script(instrument)
 pg.goto('http://127.0.0.1:8000');pg.wait_for_function("document.querySelector('#save-status').dataset.ok==='true'");pg.locator('#import-save').set_input_files(str(out/'fixture.json'));pg.locator('#confirm-import').click();pg.locator('#living-root').scroll_into_view_if_needed();pg.wait_for_timeout(3000)
 cd=c.new_cdp_session(pg);cd.send('Performance.enable');cd.send('HeapProfiler.collectGarbage');initial_heap=cd.send('Runtime.getHeapUsage');start=time.perf_counter();started=datetime.datetime.now(datetime.timezone.utc).isoformat();samples=[];phase_previous=None
 for index in range(41):
  target=start+index*30
  while time.perf_counter()<target:pg.wait_for_timeout(min(2000,max(1,(target-time.perf_counter())*1000)))
  phase=['living','voyage','story','expedition','research','map'][(index//2)%6]
  if phase!=phase_previous:
   pg.bring_to_front()
   if phase=='story':
    pg.locator('#story-notification').click()
    record=pg.locator('.story-record').nth((index//2)%max(1,pg.locator('.story-record').count()));record.click();pg.wait_for_timeout(500);pg.keyboard.press('Escape')
   else:pg.locator(f'.top-nav [data-view={phase}]').click()
   if phase=='voyage':pg.locator('#flight-wrap').scroll_into_view_if_needed()
   elif phase=='living':pg.locator('#living-root').scroll_into_view_if_needed()
   elif phase=='expedition':pg.locator('#exp-wrap').scroll_into_view_if_needed()
   else:pg.locator(f'#{phase}-view').scroll_into_view_if_needed()
   phase_previous=phase
  metrics={v['name']:v['value'] for v in cd.send('Performance.getMetrics')['metrics']};qa=pg.evaluate('({...__qa,gaps:[...__qa.gaps].sort((a,b)=>a-b),elements:document.querySelectorAll("*").length,hidden:document.hidden})');gaps=qa.pop('gaps');qa['rafGapP95Ms']=gaps[int(len(gaps)*.95)] if gaps else None
  sample={'realSeconds':round(time.perf_counter()-start,3),'phase':phase,'heapBytes':metrics.get('JSHeapUsedSize'),'nodes':metrics.get('Nodes'),'documents':metrics.get('Documents'),'listeners':metrics.get('JSEventListeners'),'taskSeconds':metrics.get('TaskDuration'),'scriptSeconds':metrics.get('ScriptDuration'),'layoutSeconds':metrics.get('LayoutDuration'),**qa};samples.append(sample)
  (out/'samples.json').write_text(json.dumps({'startedUTC':started,'samples':samples,'pageErrors':errors},indent=2))
  if index%2==0:print(f"REAL {sample['realSeconds']:.1f}s {phase}: heap={sample['heapBytes']} liveElements={sample['elements']} appFrames={sample['appSchedules']} errors={len(errors)}",flush=True)
  assert not errors,errors
 cd.send('HeapProfiler.collectGarbage');final_heap=cd.send('Runtime.getHeapUsage');duration=time.perf_counter()-start
 pg.screenshot(path=str(out/'final.png'),full_page=False)
 result={'startedUTC':started,'endedUTC':datetime.datetime.now(datetime.timezone.utc).isoformat(),'realSeconds':duration,'virtualClockUsed':False,'viewport':[1440,900],'browser':b.version,'instrumentation':'one bounded RAF sampler plus PerformanceObserver; CDP metrics, GC only at endpoints','initialPostGC':initial_heap,'finalPostGC':final_heap,'samples':samples,'pageErrors':errors,'storyFullScenesRequested':pg.evaluate("performance.getEntriesByType('resource').filter(r=>r.name.includes('/story/scenes/')).map(r=>r.name.split('/').pop())")}
 (out/'result.json').write_text(json.dumps(result,indent=2));assert duration>=1200
 with pg.expect_download() as d:pg.locator('#export-save').click()
 saved=json.loads(Path(d.value.path()).read_text());assert saved['schemaVersion']==5;assert len(saved['story']['journal'])<=18;assert len(saved['missions']['events'])<=24;assert len(saved['construction']['events'])<=24
 b.close()
print('PASS >=20 minutes REAL Chromium session; bounded archive/logs; no page errors. No simulated clock.',flush=True)
