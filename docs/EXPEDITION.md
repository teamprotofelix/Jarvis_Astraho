# PR5 행성 원정 계약

PR4의 expedition-ready DTO만 createExpedition에 전달한다. 수정 해안/붉은 협곡/극광 빙원의 24×14 level은 seed로 재생성한다. 암반 충돌, 지역별 위험 지형, 귀환점과 표본 세 개를 제공한다. 출발점에서 모든 표본으로 보장 경로를 뚫고 BFS 도달성을 검사한다. 지도 전체/이미지는 저장하지 않는다.

방향키/WASD 또는 44px 이상 터치 패드로 한 칸씩 이동한다. 지도 탭·목표 버튼은 BFS 경로를 실제 이동하며 텔레포트하지 않는다. Q 스캔은 6초 후 5칸 범위 표본을 확인한다. E/Space는 한 칸 이내의 스캔된 표본을 40초 동안 채집한다. 이동하면 작업을 취소한다. 세 채집과 이동/스캔을 합쳐 첫 원정은 대략 3분 규모다. HOME 귀환점에서만 가방을 인도할 수 있으며 부분 회수도 가능하다.

원정 보급 240은 초당 1 감소하고 위험 지형 진입은 8을 소모한다. 0이면 자동 구조되어 채집 수량의 절반(내림)을 인도한다. 사용자 철수는 확인 후 표본을 반납하고 보상 0으로 귀환한다. 기본 장비/원정 재시도 비용은 없다. 이것은 함선 자체의 산소·기아·생명 피해가 아니다.

Campaign은 terminal expedition→reward ledger 갱신→mission returning 전이를 함께 처리한다. missionId+completionId와 lastSequence high-water mark로 한 번만 보상한다. 최근 ID 64개를 제거한 뒤에도 옛 mission 번호는 다시 정산할 수 없다. 결과 누적 counts는 0~999 상한이며 초과분은 누적 표시 상한으로 처리한다. PR6은 이 지급 지점을 inventory에 연결한다. 원정 재진입과 활성 원정의 별도 mission 취소는 거부한다.

schema3 = schema2 + expedition|null + rewardLedger. v1/v2를 복사·검증해 단계적으로 확장한다. player 좌표/방향, supply, elapsed, cooldown, damage, visited≤336, scanned/collected≤3, 현재 작업만 보존한다. 원정과 임무 ID/seed/단계 및 이미 정산된 임무의 재진입을 교차 검증한다. 입력의 held key와 tap 경로는 임시 값으로 복원 때 해제한다.

렌더러는 기존 E 4방향 sheet를 사용하고 1920×1080 배경/960×540 preview, 세 투명 레이어, 두 6-frame 효과를 필요할 때 로드한다. 오류는 preview/색 배경으로 폴백한다. 모바일은 카메라 crop과 전체 미니맵을 함께 보여 준다. 다른 뷰에서는 원정 시계와 렌더를 멈추며 canvas가 viewport 밖이면 그리기를 생략한다. 자체 rAF/timer를 추가하지 않는다. pause/blur/모달에서 입력을 해제하고 hidden 시간을 보충하지 않는다.
