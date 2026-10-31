# 시각 레이어

`views/living-view.js`: 뷰 진입 시 한 번 mount, 자체 timer/rAF 없음, 활성 뷰에서만 main의 render 호출을 받는다. 바깥 데크·복도는 기존 ship-map.svg를 사용하고 15개 방을 원래 1200×620 좌표에 배치한다. 시뮬레이션 room/pos/target은 수정하지 않는다. 4개 새 배경과 기존 11개 scene을 버튼 배경 레이어로 보여 주고, floor strip/승무원/z-index/세계수 조명을 별도 합성한다. 줌 좌표는 동일 비율로 투영한다.

Hero는 배경을 포함한 외관 그림이다. VOYAGE의 투명 `assets/ship.webp`는 유지한다. 이미지는 WebP 상대경로, 크기 지정, lazy/async decoding, 로딩 중 색/기존 장면 폴백이다. low quality는 room thumb를 사용하고 hero를 생략한다. 화질은 저장한다. 시안 두 장은 details를 열 때만 로드한다.

`sw.js`: 기존 필수 셸과 별도 `art-v1` 요청 캐시. 아트 실패가 필수 셸 install을 실패시키지 않으며 기존 art-v1은 새 셸 활성화 때 보존한다. 저장 데이터는 별도 IndexedDB다. PR3의 props/fx도 같은 선택 캐시 계약을 사용한다.

생활 조명/미세 패럴랙스는 simulation elapsed를 사용하고 pause/hidden/reduced-motion에서 정지한다. 뷰 종료 시 갱신을 중지하며 렌더러 자체에는 정리해야 할 rAF/interval이 없다. 향후 PR3은 동일 인물 엘리먼트에 prop/animation 상태를 얹는다.
