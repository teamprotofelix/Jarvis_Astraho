# 저장 상태 schemaVersion 1

`state/game-state.js`는 DOM/Map/함수 없는 envelope를 검증한다. JSON은 UTF-8 256KB 이하, 알려진 키만 허용한다. `__proto__`/constructor/prototype 키, 잘못된 ID·범위·버전·중복 승무원·초과 이벤트/객체를 거부한다. 가져오기 파일은 HTML/eval로 실행하지 않는다.

| 필드 | 계약 |
| --- | --- |
| schemaVersion / runId / savedAt | 1 / 로컬 run ID / ISO 시각 |
| ui | selectedCrew, selectedView, paused, zoom(.65~1.4), speed(1/2/4), following, quality |
| simulation | elapsed, serial, 11 members, 최근 events 최대 12 |
| member | id, room, target, queued, routeIndex, phase, pos, path, pause, activityIndex, direction |
| flight | 정규화 위치·기울기, time·sectorTime·sector, manual, lit·shield·collisions·invincible·distance, objects 최대 12, spawnTime·message |

## Migration

| 입력 | 처리 |
| --- | --- |
| 저장 없음(v1.1) | 기존 11명 초기 위치/비행 seed로 시작 |
| v1 | 검증 후 순수 모델 restore |
| 알 수 없는 버전/손상 | 자동저장 중지, 기존 원본 보존, HUD 경고·원본 백업 제공 |

이동 경로는 원래 routeBetween의 suffix와 위치를 확인한다. 고아 경로는 마지막 안전 room으로 복구하고 한 번 기록한다. 진행시간을 벽시계 차이만큼 보충하지 않는다. pause는 저장하며 hidden/blur는 런타임 정지 원인이다.

## 저장 I/O와 사용자 복원

앱 디렉터리별 `astraho-save:<pathname>` IndexedDB / `state` object store / `current` 슬롯. 의미 있는 클릭은 650ms debounce, 15초 주기, hidden/pagehide는 best-effort flush. 쓰기는 순서대로 처리한다. 업데이트를 수락할 때 flush 후 service worker 활성화를 요청한다. 브라우저 강제 종료 직전의 완료는 보장하지 않는다.

IndexedDB 불가·저장 거부·quota 실패 시 게임은 메모리에서 계속 동작하고 HUD에 저장 불가를 표시한다. localStorage fallback은 사용하지 않는다. JSON 내보내기는 항상 가능하다. 가져오기는 사용자가 파일을 선택하고 미리보기의 복원 버튼을 눌러야 적용한다. 적용 직전 상태를 flush하고, 기존 current는 `before-import`에 원자적으로 보존한다. ‘가져오기 되돌리기’로 이 슬롯을 복원할 수 있다. 저장 원본 백업 버튼은 현재 로드된 원본(손상 데이터 포함)을 내보낸다. 여러 번 가져오면 직전 한 회분을 보관하므로 중요한 백업은 파일로 내보낸다.

PWA CacheStorage는 정적 파일만 저장한다. SW 교체/기존 캐시 정리는 IndexedDB를 삭제하지 않는다. 서버 전송·로그인·유료 API가 없다. 이전 v1.1 앱으로 코드 롤백해도 IndexedDB 파일은 남지만 v1.1은 이를 읽지 않는다.

## PR3의 v1 확장

`simulation.rngState`는 32bit nonzero seed 상태다. member의 `life`는 state/actionId/start/remaining/energy/lastAction/animation/messageKey/prop/label/task를 저장한다. task는 이동 완료 후 수행할 역할 작업 메타데이터와 duration이다. PR1/PR2 v1 저장에 이 필드가 없으면 기존 pause/phase를 보존하며 idle/walk 기본값과 seed 20261031을 채운다. 알려진 작업·상태·소품·방/역할 일치, energy와 시간 범위를 검증한다. 새로운 seed 상태를 보존하므로 복원 후에도 같은 선택 순서가 이어진다. PR3의 새 필드를 읽지 못하는 이전 코드로 돌아갈 때는 내보낸 JSON을 보존하고 최신 앱에서 다시 복원한다.

## PR4 schema 2

v1 envelope + `missions:{seed,clock,revision,sequence,selectedId,active,signals,events}`. 신호 6개, 활성 임무 최대 1개, 이벤트 최대 24개. v1→v2는 기존 원본과 simulation/RNG/flight/ui를 보존한 복사본 migration이다. 미래 버전은 기존 저장을 자동 덮어쓰지 않는다. 경계별 검증은 `state/legacy-state.js`, `missions/model.js`, `state/game-state.js`에 분리한다. 여러 탭의 저장은 IDB 내부 revision/current 비교로 충돌을 감지한다.
