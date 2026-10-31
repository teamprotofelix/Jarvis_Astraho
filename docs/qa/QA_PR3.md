# PR3 검증 기록

2026-10-31, Chromium headless 실제 렌더 엔진/Playwright Python. 물리 기기 검증과 구분한다.

## 자동 검사

`npm test`, `npm run check`, `npm run build` 통과. 개별 파일 직접 실행에서도 총 48개 검사(기존 상호작용 14 + 콘텐츠 6 + 저장 11 + 시각/캐시 2 + 신규 FSM 15)를 확인했다.

신규 FSM 검사: seed 재현성·다른 seed, 마리 office serve/tea→E 방문 대화, 스쿨드 workshop repair→drone 재시험, 서아 bridge work→strategy talk, 미르 restaurant rest→garden observe, 피로/회복, E 예약 우선과 NPC 유효성, 0/음수/NaN 정지, RNG/업무/시간 저장복원 후 동일 160초 진행, PR1/PR2 v1 migration, 잘못된 life 데이터 거부, 전이 로그 중복 억제와 상한, DOM 없는 컨텍스트/룸 좌표.

30분(36,000×.05초) 모델 실행에서 11명 모두 2종 이상의 역할 활동과 휴식 전환, energy 0~100, 로그 최대 12, snapshot 24KB 미만 확인. 이것은 30분 실시간 브라우저/GPU 부하 측정이 아니다.

기존 51 WebP SHA-256 검사 보존. 새 19 WebP 총 2,146,942 bytes, 개별 350KB 미만. RIFF·크기·해시·해상도·alpha·6-frame 형식 검사. Pillow로 19개 전체 decode, 12개 투명 props/fx의 실제 alpha 최소 0 및 비어 있지 않은 alpha, atlas 12개 frame 비어 있지 않음 확인. 원본 PNG 추가 없음. 필수 셸 71 URL, 선택 아트는 요청 캐시.

## 브라우저

1440×900 / 390×844(touch emulation) / 768×1024에서:

- 4× 생활 진행으로 마리 serve와 tea-cup, 스쿨드 repair/work 확인.
- 인물 선택→행동 패널 일치, pause, talk 전이, ROOM의 같은 행동/소품 확인.
- pause 상태에서 JSON 내보내기→실제 IndexedDB reload→JSON의 simulation/RNG/events 완전 동일.
- SW 준비 후 실제 context offline 전환·reload, 생활 뷰와 대화 상태 복원.
- 문서 가로 넘침 없음, pageerror 0.

별도 reduced-motion context: 기본 pause, 명시적 재개 뒤 논리 진행과 CSS animation none 유지. 모바일 최종 회귀: D 키 조종, 모달에서 held key 해제, CDP touchStart/touchEnd를 유지한 실제 터치 조종, blur/focus 정지·복귀, 일지 12편/earth 필터/포커스 트랩·복원, 지도 줌/따라가기, `/Jarvis_Astraho/` 상대 경로 부팅 통과.

스크린샷: [외관](pr3/exterior.webp), [Desktop 생활](pr3/desktop.webp), [Mobile 생활](pr3/mobile.webp), [Tablet 생활](pr3/tablet.webp), [Desktop ROOM](pr3/desktop-room.webp), [Mobile ROOM](pr3/mobile-room.webp).

재현용 선택 검사: 로컬 HTTP 서버 실행 후 `python tests/browser-smoke.py http://127.0.0.1:8000` (시스템 `/usr/bin/chromium`, Python Playwright/Pillow 필요). 증거 파일은 ignored work/browser-smoke에 생성한다. npm 런타임 의존성을 추가하지 않는다.

## 미검증과 롤백

실제 Android/iOS 설치, Safari·VoiceOver, 물리 모바일 GPU·배터리, 30분 실시간 브라우저 메모리, OS 강제 종료 직전 flush 및 다중 탭 경쟁은 미검증이다. 상세 손/팔 전용 action sheet는 후속 art pass다. ROOM은 기존 모달 pause 규칙에 따라 스냅샷을 보여 준다.

PR3 코드 롤백 전 JSON을 백업한다. 이전 PR2는 새 life/RNG 필드를 검증에서 거부할 수 있으므로 데이터를 지우지 말고 최신 버전으로 돌아와 복원한다. 모든 PR을 역순 되돌려도 IndexedDB는 삭제하지 않는다. main 병합·운영 배포·DNS/CNAME 변경은 수행하지 않는다.

```text
npm test                 → 5 test files passed, 0 failed
node tests/crew-life.test.mjs → tests 15, pass 15, fail 0
node tests/persistence.test.mjs → tests 11, pass 11, fail 0
npm run check            → exit 0
npm run build            → 15 modules, 11 directional sheets, 9 landscapes,
                           71 offline URLs; 4531672 bytes original WebP
Living art OK            → 19 WebP, 2146942 bytes; on demand
python tests/browser-smoke.py http://127.0.0.1:8000
                         → 3 viewports pass, exact FSM reload, offline pass,
                           0 page errors; reduced-motion pass
Pillow                   → 19 decoded, 12 transparent props/fx,
                           12 atlas frames nonempty
```
