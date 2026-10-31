# PR0 기준선 감사

2026-10-31, 원격 main 및 로컬 HEAD `734177332e116ac26008375d33437f0b0ad9b636` 일치 확인(GitHub connector). 셸 git fetch는 실행 환경 proxy 연결 실패. 원격 커밋을 별도 조회하여 기준선을 확인했다.

## 현재 동작과 책임

| 파일 | 책임 / 보존 계약 |
| --- | --- |
| world-data.js | 15개 room ID, 11명 crew ID, 9개 풍경, 12편 공개 창작 일지·대화·활동 |
| simulation.js | 1200×620 고정 좌표, 하단 문→복도→수직 shaft 경로, 현재 경로 도착 후 예약 처리 |
| flight-model.js | 9 sector, AUTO/MANUAL, 정규화된 조종·수집·충돌·보호막, 제한된 객체 수 |
| flight.js | Canvas 배경·별·객체와 투명 선체, 입력 해제 및 뷰 정지 |
| main.js | 지도·인물·따라가기·줌·모달·일지·포커스·pause·PWA 연결 |
| styles.css / index.html | 3×5 지도, 반응형 패널, 키보드·터치 조종 UI, reduced-motion |
| sw.js | scope별 원자 precache 64 URL, 사용자 선택 갱신, 이전 캐시 정리 |
| tests | 225 경로, 이동예약, 비행, VM 서비스워커, 원본 51 WebP 해시 검사 |

## 제약과 후속 단계

진행은 메모리에만 있다. 생명주기 전체를 담당하는 main.js는 짧지만 압축되어 수정 위험이 있다. 기존 SW는 4,531,672 byte WebP 전체를 설치하므로 새 고해상도 자산까지 필수 설치하면 초기 전송·실패 위험이 커진다. 고정 지도 좌표는 새 뷰에서도 유지한다. 원본 아트 manifest는 변경하지 않는다.

pause·blur·hidden·모달은 시뮬레이션 시간을 멈춘다. 모달은 배경 inert와 포커스 복원/트랩을 제공한다. 시각 동작과 저장은 독립적으로 다뤄야 한다. 입력 해제와 페이지 상대 경로는 회귀 검사 대상이다.

## 검증

`npm test`, `npm run check`, `npm run build` 통과. 수량 검사를 15/11/9/12 정확한 값으로 강화했다. Chromium desktop 1440×900, mobile 390×844, tablet 768×1024 캡처는 docs/qa/pr0에 기록한다. 브라우저 자동화 결과는 QA_PR0.md에 별도로 적는다. 실제 Android/iOS 설치·Safari·스크린리더·물리 터치 장치는 미검증이다.

PR0은 시각/UI/모델 동작을 바꾸지 않는다. 롤백: PR0 커밋 되돌리기(문서와 수량 검사만).
