# PR4 검증

기준 main `1beb767c602e1abdd339717dc5d312b7230812b3`, 2026-11-01. PR0~PR3 병합을 확인하고 main에서 별도 브랜치를 생성했다.

`npm test`, `npm run check`, `npm run build` 통과. 신규 mission 검사 10개: deterministic 배치·스캔, 초대/ID/불법 전이/연속 클릭, 실제 거리 도착, 재관측의 새로운 ID, v1→v2 원본 보존, 정확한 JSON 복원, 손상/미래 버전 거부, 1시간 모델의 24-event 상한. 기존 48개 회귀 검사도 유지한다. 기본 셸 78 URL. 새로 사용하는 7 WebP(6 preview+signal effect) 219,386 bytes 해시/치수/알파 확인. 기존 51+19 manifest는 보존한다.

Chromium 실화면에 Playwright clock을 적용해 스캔→항로 선택→기존 AUTO 실제 비행→도착→귀환을 플레이했다. next-sector 연속 클릭으로는 도착하지 않음, 초대 미확인 목적지에 출발 버튼 없음, schema2 IDB/JSON의 missions 동일성, stale tab 쓰기 충돌, 오프라인 신호 표시를 검사한다. 화면은 1440×900 / 390×844 / 768×1024 / 320×700을 확인한다. 320px에서 발견한 기존 hero 최소 너비 넘침을 수정했다.

화면: [Desktop](pr4/desktop.webp), [Mobile](pr4/mobile.webp), [Tablet](pr4/tablet.webp), [320px](pr4/narrow.webp). 검증 스크립트는 별도 작업 폴더에서 실행했다. 후속 PR에 재현용 통합 browser smoke를 포함한다.

1시간 모델 검사는 실시간 1시간 브라우저 부하 시험이 아니다. 실제 Android/iOS 설치·Safari·스크린리더·20분 실제 GPU/메모리는 미검증. PR4에는 원정 플레이나 보상이 없으며 PR5에 DTO로 연결한다. 롤백 전 JSON 백업, PR4 되돌리기 후 IDB를 삭제하지 말고 schema2를 읽는 버전에서 복원한다. main 병합/배포/CNAME/DNS 변경 없음.
