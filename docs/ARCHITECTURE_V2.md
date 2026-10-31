# Living Ark 2.0 상태와 레이어 계약

PR0 → PR1(persistence) → PR2(visual core) → PR3(crew life) 순서의 stacked PR. 선행 PR 병합 뒤 다음 PR의 base를 main으로 변경하며 이미 포함된 선행 커밋을 중복 병합하지 않는다.

## 상태 계약

순수 `state/game-state.js`가 schemaVersion=1 envelope, 엄격한 외부 JSON 검증·크기/키 검사·migration을 소유한다. `state/storage.js`는 scope별 IndexedDB I/O, 직렬 저장·실패 HUD를 담당한다. simulation/flight는 DOM 없는 snapshot/restore를 제공한다. UI는 선택·줌·뷰·pause·속도·품질을 저장한다. hidden/blur는 일시적인 정지 원인이며 돌아온 뒤 경과시간을 보충하지 않는다. 캐시 삭제는 IndexedDB를 삭제하지 않는다.

## 렌더 계약

기존 SHIP MAP 좌표/문/shaft와 VOYAGE 선체를 보존한다. Living View는 같은 15개 방과 crew 위치를 사용하는 추가 레이어다. 네 개 생활 배경, 나머지 기존 scene, 선택적인 시안 preview는 별도 역할이다. hero는 우주를 포함하는 외관 그림이며 비행 선체로 쓰지 않는다. 선택적 이미지는 뷰 접근 시 로드하고 요청 성공 후 별도 캐시한다. 저품질 모드는 기존 thumb로 전환한다.

## 행동 계약

crew behaviors/utility는 역할·일정·피로·최근 작업과 주입 가능한 seed로 다음 작업을 결정한다. simulation은 walk/action 전이와 경로, 남은 시간, energy, queued, lastAction을 소유한다. 이동예약은 진행 중인 경로를 완료한 후 실행한다. 이벤트는 실제 전이에서만 발생하고 길이를 제한한다. renderer는 행동 데이터에 따라 기존 4×3 걷기 시트와 개별 소품/6프레임 효과를 합성한다. 렌더러는 시간·행동 결정을 변경하지 않는다.

자비스는 패널 시스템이며 11명 crew에 추가하지 않는다. 서아의 인적 지휘, 미르·세계수의 독립성과 공개 창작 경계를 유지한다. 향후 PR4/PR6은 작업 메타데이터와 versioned snapshot을 확장한다. 신규 시설·생존 시스템은 이번 범위에 포함하지 않는다.
