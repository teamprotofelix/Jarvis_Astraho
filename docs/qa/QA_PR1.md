# PR1 검증

2026-10-31. `npm test`, `npm run check`, `npm run build` 통과. 별도 직접 실행으로 14개 상호작용 회귀 + 6개 기존 콘텐츠 검사 + 11개 신규 저장 검사 통과. 필수 캐시 67 URL, 기존 51 WebP 해시 보존.

Chromium 390×844 touch emulation에서 실제 IndexedDB로 다음을 확인했다.

- E bridge→garden 이동 중 onsen 예약, pause 및 2× 설정 저장 후 reload: 위치/남은 경로/예약/시간이 export JSON과 동일.
- JSON 다운로드, 오염 키 거부, 정상 파일 미리보기 시 변경 없음, 확인 후 4× 복원, 이전 저장으로 되돌려 2× 복구.
- 필수 SW 설치 뒤 네트워크 offline 전환·reload, 15 room 및 진행 복원.
- pageerror 0. [모바일 스크린샷](pr1/mobile.webp).

단위 검사: 주입 storage 순차 쓰기, quota/권한 실패 경고, 손상 저장 자동 덮어쓰기 방지, 미지원 IndexedDB, 잘못된 JSON/버전/키/ID/크기 거부, 고아 경로 복구, flight 객체/수치 복원.

미검증: 실기기 PWA 설치, Safari/iOS quota 정책, OS 강제 종료 시 마지막 flush, 다중 탭 동시 플레이 충돌. pagehide flush는 best effort다. 롤백: PR1 커밋 되돌리기, IDB를 삭제하지 않으며 필요하면 사전에 JSON 내보내기.
