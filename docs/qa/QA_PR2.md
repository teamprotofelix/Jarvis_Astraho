# PR2 Living View 검증

2026-10-31. `npm test`, `npm run check`, `npm run build` 통과. 필수 셸 68 URL. 원본 51 WebP 해시 검사를 유지하고 신규 7 WebP의 경로·SHA-256·bytes·RIFF/width/height/alpha를 검사한다. 신규 아트 합계 2,098,288 bytes, 각 350KB 미만.

실제 Chromium 1440×900, 390×844 touch emulation, 768×1024:

- 첫 지도 화면에서 신규 아트 요청은 hero 한 장 301,794 bytes뿐이다. 4개 생활 배경과 시안 두 장은 최초 지도에서 요청되지 않았다. 기존 기본 아트 precache 4,531,672 bytes는 유지되어 첫 방문 WebP는 hero 포함 4,833,466 bytes 수준(텍스트 셸 별도)이다.
- Living View에서 15개 실제 room 버튼과 11명 crew 확인. 각 방 라벨을 실제 클릭하여 15개 모달 방문/Escape 종료. 새 4개 배경/기존 11개 배경 경로 확인.
- 문서 가로 넘침 없음. pause 뒤 clock 정지. low quality 선택 시 thumb 사용, reload 뒤 선택된 living 뷰·화질 복원. pageerror 0.
- [Desktop](pr2/desktop.webp), [Mobile](pr2/mobile.webp), [Tablet](pr2/tablet.webp). 선택 공간/승무원은 기존 지도와 같은 모델을 공유한다. 겹친 승무원은 같은 방 인원수에 따라 시각 오프셋을 두며 경로 좌표는 바꾸지 않는다.

서비스워커 단위 검사: 선택 아트는 install에서 받지 않고 요청 성공분만 캐시, activation에서 아트 캐시·형제 사이트 보존, 아트 캐시 quota 실패 시 온라인 응답 유지. PR1에서 기본 offline reload를 검증했다. 방문하지 않은 새 아트의 오프라인 첫 열기는 기존 장면/색 레이어로 폴백한다.

미검증: 물리 기기 설치, Safari/iOS, 저사양 GPU·배터리 성능. 시안 두 장은 분위기 참고 이미지이며 15개 방 실제 지도로 사용하지 않는다. 신규 건축 슬롯 없음. 롤백: PR2 커밋 되돌리기; IDB 진행은 보존되며 PR1은 living 선택을 map으로 폴백한다.
