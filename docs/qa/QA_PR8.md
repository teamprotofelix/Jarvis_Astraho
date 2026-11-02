# PR8 검증 — PWA Identity & Quality

2026-11-02. Base `26bb869f61dfd5bb0b7cfb1a9dc5018ec1b05372` (PR7 #8), branch `feat/astraho-pr8-pwa-quality`. PR7이 열린 상태라 PR8은 PR7 브랜치를 base로 쌓는다. PR7 병합 후 main으로 target을 바꾸어 검토한다. main 병합·Pages 배포·CNAME 변경 없음.

## 구현과 정적 검사

v1.9.0 / 저장 schema 5 유지. 첨부 원본 PNG 5개를 정확히 적용하고 SHA/byte/pixel 및 실제 브라우저 디코드를 확인했다. 1024 master는 미배포. `any` 192/512, `maskable` 512, Apple 180, favicon 64, relative scope/path와 `#0b172a` 일치. [자산 명세](../../assets/pwa-art-manifest.json), [아이콘·원형/사각형 크롭](pr8/icon-previews.webp). 이 시트는 에뮬레이션 미리보기이며 물리 홈 화면 설치 증거가 아니다.

`npm test`, `npm run check`, `npm run build` 통과. 기존 PR7 98개 + 중복 저장/명시적 백업 + quota 실패 후 동일 snapshot 재시도 = **100개** 검사 (Node 출력은 9개 test 파일 단위). 15 room/11 crew/9 landscape/고정 일지 12편 보존. 필수 셸 97 URL, PNG 567,206 bytes. 기존 51+19+25 WebP와 신규 story 27개 보존, story full scenes 9개 전체 precache 없음. 전체 이미지 해시와 크기를 build에서 재검사한다.

## 실제 브라우저 기능

Chromium desktop/mobile emulation. `tests/quality-browser.py`, `tests/story-tabs-browser.py`를 포함한다. [수치/실패 매트릭스](pr8/matrix.json), [탭 충돌](pr8/tabs.json), [JSON import/undo](pr8/import.json).

- 1440×900 / 390×844 / 768×1024 / 320×700, 8개 주 화면에서 가로 넘침 없음. [Desktop](pr8/desktop-story.webp) · [Mobile](pr8/mobile-story.webp) · [Tablet](pr8/tablet-story.webp) · [320px](pr8/narrow-story.webp).
- 실제 pending 이야기 3선택의 이름/AX tree, 44px 이상 선택지/저장 툴바, Tab/Shift-Tab·Escape·포커스 복원을 확인. [모바일 선택](pr8/mobile-choice.webp). 스크린리더 엔진의 실제 낭독 검증과 구분한다.
- 첫 화면 full story 요청 0. desktop/high는 full, low 또는 폭 1000px 미만은 thumb. HTTP 200의 깨진 WebP 디코드 + thumbnail 404를 연속 주입해 기존 bridge 폴백과 텍스트 모달 유지 확인. 의도한 404의 브라우저 리소스 오류는 장애 주입 결과이며 앱 pageerror는 0.
- DPR 3 환경 canvas 비트맵 상한 2 확인. 전역 pause 시 앱 RAF 호출 증가 0, 반복 재개/정지 후 중복 loop 없음. 일시정지 중 archive filter와 화질/resize도 즉시 갱신.
- IndexedDB SecurityError/QuotaExceededError 주입 → 안내와 유효 JSON export. 미래 v6 JSON import 거부와 미래 저장 원문 보존 확인. 동일 story revision의 서로 다른 분기를 import할 때 UI 갱신, undo 후 정확한 story/재접속 복원 확인.
- 두 실제 탭이 같은 사건의 다른 선택을 저장 → stale 탭 저장 중지, 먼저 저장된 story를 reload해 동일성 확인. 자원 중복 지급 없음.
- 기존 `tests/campaign-browser.py` 전체: 첫 스캔→비행→실제 원정 수집 3개→중간 정확 reload→정상 회수/9자원→정확 비용의 격납고 연구/건설→reload. 별도 정상 모델 획득 fixture로 모바일 시설 4개·제작·승무원 시설 행동·room/hero·offline 검증. 이 흐름은 Playwright 가상 clock으로 진행한 기능 테스트다.
- 실제 held touch와 키보드 비행/원정, 모달 held-key 해제, blur/focus 동결, mid-scan offline 정확 복원을 별도 회귀 검사. 기존 고정 12편 필터와 지도 zoom/follow 유지.

## PWA 이전/이후

실제 이전 PR7 commit을 별도 로컬 서버 `/ark/`에서 구동하고, v1.8.0→현재 v1.9.0 파일로 전환했다. 새 worker waiting 동안 이전 icon SHA 유지 → 사용자 업데이트 수락 → flush/activate/reload → 새 SHA 일치. schema5 story(8개 결정)/inventory/construction/research/missions/expedition/rewardLedger/flight/simulation 정확 보존. 새 버전 offline reload, 새 icon/Apple/favicon cache hit, 같은 scope의 이전 shell만 정리됨을 확인했다.

[이전 앱](pr8/before-update.webp) · [이후 앱](pr8/after-update.webp) · [manifest 전후/실제 decode pixels/네트워크 크기 기록](pr8/update.json). Chrome manifest parser errors 0. OS launcher 설치/기존 바로가기 갱신은 미검증이다. 화면상 링크/manifest와 웹 캐시 검증만으로 물리 홈 화면 교체를 주장하지 않는다.

## 실제 20분 측정

`2026-11-02T11:47:53.702308+00:00` → `2026-11-02T12:07:55.667087+00:00`, **1201.55초 실제 연속 실행**. Playwright 가상 clock 미사용. Chromium `154.0.8037.57`, headless Linux, 1440×900. 매 60초 living→voyage→story→expedition→research→map을 순환하고 30초마다 41개 표본 수집. story 모달은 잠시 열어 읽고 닫으며 이때만 정상 pause. 모델로 획득한 시설/완료 원정/8개 story 상태에서 시작했다. 원정 화면 순환은 완료한 원정의 rendering이며 20분 내내 active field exploration을 했다는 뜻이 아니다.

앱 RAF 이름별 호출, 별도 bounded 1,200-gap frame sampler, PerformanceObserver long task, CDP heap/task/layout를 수집했다. GC는 시작/끝에서만 강제했다. 기능 테스트와 전후 5분 비교 일부가 같은 host에서 병행돼 CPU 수치는 공유 환경의 관찰이다.

- pageerror **0**, 유효 schema5 export와 story≤18 / mission≤24 / construction≤24 기록 상한 확인.
- 강제 GC 후 JS used heap: 2,926,576 → 3,671,348 bytes (차이 +744,772). 방문 화면·리스너·이미지 캐시의 초기 증가가 포함된다. 이 값 하나로 누수 부재를 단정하지 않는다.
- DOM live elements: 960 → 1232. CDP 전체 node 수는 분리된 DOM과 GC 주기에 따라 변하며, 표의 live elements와 구분한다.
- CDP renderer TaskDuration 증가 198.33s / 실제 1201.40s. ScriptDuration 증가 28.81s, LayoutDuration 증가 10.46s. OS 전체 CPU/물리 GPU 이용률이 아니다.
- long tasks: 293개 / 28838.0ms 증가 (초기 부팅 제외, 모달·화면 교체 포함). 아래 RAF p95는 화면 합성 FPS가 아닌 callback 간격의 최근 window 통계다.
- full story 요청: 4개 장면만, 실제 연 순서에 따른 요청. 9개 전체 선로드 아님.

| 실제 초 | 화면 | JS heap MiB | Live elements | RAF gap p95 ms | Long tasks 누계 |
|---:|---|---:|---:|---:|---:|
| 0.1 | living | 3.01 | 960 | 133.3 | 4 |
| 60.5 | voyage | 3.27 | 960 | 50.0 | 19 |
| 121.1 | story | 3.88 | 1098 | 16.8 | 32 |
| 180.5 | expedition | 4.81 | 1137 | 16.8 | 36 |
| 240.5 | research | 3.90 | 1217 | 16.8 | 81 |
| 300.8 | map | 4.06 | 1226 | 16.8 | 85 |
| 360.6 | living | 4.20 | 1226 | 66.6 | 123 |
| 420.5 | voyage | 4.25 | 1226 | 33.4 | 125 |
| 482.3 | story | 4.05 | 1226 | 33.4 | 145 |
| 540.5 | expedition | 4.39 | 1226 | 16.8 | 146 |
| 600.5 | research | 4.39 | 1226 | 16.8 | 165 |
| 660.6 | map | 4.51 | 1226 | 16.8 | 179 |
| 720.6 | living | 4.05 | 1226 | 16.7 | 184 |
| 780.5 | voyage | 3.84 | 1226 | 66.8 | 210 |
| 842.8 | story | 4.00 | 1232 | 66.6 | 255 |
| 900.5 | expedition | 4.22 | 1232 | 16.8 | 260 |
| 960.5 | research | 4.16 | 1232 | 16.8 | 272 |
| 1020.5 | map | 4.65 | 1232 | 16.7 | 274 |
| 1080.5 | living | 4.35 | 1232 | 16.7 | 275 |
| 1140.2 | voyage | 4.12 | 1232 | 33.4 | 278 |
| 1201.5 | story | 3.83 | 1232 | 16.8 | 297 |

[측정 그래프](pr8/performance.svg) · [41개 원본 표본/GC/task/네트워크](pr8/performance.json) · [마지막 화면](pr8/performance-final.webp). `python tests/perf-browser.py`로 같은 20분 probe를 재현할 수 있다.

이전 PR7 동일 화면 순서의 별도 **300.8초** 실제 표본도 [보존](pr8/performance-before-5m.json)했다. 첫 약 300초 renderer task 증가: 이전 61.30s, 현재 46.56s. 순차/공유 부하·화면 준비 차이가 있으므로 엄격한 A/B 성능 보장이나 모바일 개선율로 해석하지 않는다. 확실한 변경은 pause RAF 0과 unchanged snapshot 저장 생략으로 별도 검증했다.

## 한계·복구

물리 Android/iOS 설치, Safari, NVDA/VoiceOver 실제 낭독, OS 홈 아이콘 cache 갱신, 실제 GPU 메모리·전력·발열은 **미검증**. Chromium viewport/touch/AX emulation과 headless 20분 결과를 해당 실기기 검사로 대체하지 않는다.

롤백 전 schema5 JSON을 백업하고 IndexedDB current/before-import를 삭제하지 않는다. PR8만 되돌리면 schema5는 유지되나, PR7 이전 코드는 v5를 거부할 수 있으므로 호환 앱에서 복원한다. 첨부 1024 master와 비공개 대화/키/개인 경로는 런타임에 추가하지 않았다. 변경 파일 전체는 PR Files changed에 기록한다.
