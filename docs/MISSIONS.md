# PR4 항로와 저장 schema 2

catalog는 6종 신호, 3개 현재 원정 목적지(수정 해안·붉은 협곡·극광 빙원)를 정의한다. 나머지 지역은 관측과 후속 준비만 제공한다. 초대가 확인되지 않은 부유섬은 blocked이며 UI와 reducer 양쪽에서 진입 불가다. 초대의 수락을 임의 생성하는 기능은 없다.

model/reducer는 DOM 없는 복사 기반 상태 전이를 제공한다. undetected→detected→scanning→ready→traveling→arrived→expedition-ready→returning→completed; 보류/재관측은 별도 분기다. 스캔은 6초, 항행은 seed에 따라 480~720 가상 ly, 귀환은 8초다. 실제 FlightModel.distance가 증가해야 도착하며 next-sector는 거리 증가가 없다. 자동·수동 비행 모두 동일 조건이다. 기존 비행 조작/수집/보호막을 바꾸지 않는다.

임무 ID는 단조 증가 sequence로 생성한다. 상태/ID/메타데이터/스캔 진행/배열 상한/초대/항행 거리를 검사한다. 이벤트는 승무원 로그와 분리해 최근 24개만 유지한다. `expeditionDTO`는 원정 준비 상태에서만 `{missionId,destinationId,seed,status}`를 반환한다. PR5가 이 DTO에서 실행 가능한 원정을 연다. PR4에서는 궤도 관측을 마치고 무보상 귀환할 수 있다.

schema 1은 legacy validator로 검증한 뒤 복사본에 missions를 추가한다. schema 2는 missions 필드가 반드시 있어야 하며 미래 버전·알 수 없는 키·손상 필드를 거부한다. 기존 crew/RNG/flight/ui/IDB와 JSON 256KiB 상한을 보존한다. 저장 캐시와 이미지 캐시는 별도다.

IndexedDB 저장은 같은 readwrite transaction 안에서 revision과 이전 current의 서명을 비교한다. stale tab(구버전 탭의 revision 없는 쓰기 포함)이 감지되면 쓰기를 abort하고 자동저장을 중지, 새로고침 안내를 보여 준다. 임시 메모리 진행은 JSON으로 내보낼 수 있다. current와 before-import의 원자 보존을 유지한다. 수동 JSON 편집을 막는 서버 기반 anti-cheat는 아니다.

pause/blur/hidden/모달에서 시뮬레이션 시계를 정지한다. 백그라운드 시간을 보충하지 않는다. 신규 카드 아트는 미션 화면에서만 lazy load하며 원본은 첨부의 절차적 일러스트다. 기존 51+19 아트 manifest를 변경하지 않는다.
