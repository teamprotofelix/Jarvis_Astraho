# PR7 검증

2026-11-02. 기준 main/base `76104c0eaf2599b332978733007cca469e6b0c2d`. PR4~PR6 병합과 일치를 확인했다. main 병합·배포·CNAME 변경 없음.

`npm test`, `npm run check`, `npm run build` 통과. 기존 84개+신규 이야기 14개, 총 98개. 9장/27선택·9심볼, 실제 scan 트리거·중복 방지, 즉시/지연 분기와 발화자 구별, FIFO/sequence/double click/reorder 거부, 3결정 후 함장 관점, 9결정/18기록/27revision 상한, 정상 모델에서 획득한 6개 주요 장면, 초대 제한, 실제 동시 방 serve/rest, v1~v4→v5 원본 보존, v4 명시적 검토, 정확한 v5 복원, unknown/poison/future 거부를 확인한다.

Chromium 새 빈 저장에서 실제 첫 스캔→키보드 선택→pause/JSON·IDB 정확 reload→서아 대사 변화→출항의 지연 후속 기록을 확인했다. 시간 진행에는 Playwright clock을 사용했다. 별도 기존 v4 정상 획득/건설 저장을 사용자 JSON 미리보기/확인으로 불러온 뒤, 실제 완료 조건의 기록 검토로 6개 장면+함장 관점(총 7개)을 UI에서 결정했다. 초대 미확인/진입 금지와 재고는 유지된다. 이 기존 저장 검사를 빈 저장 첫 플레이와 구분한다.

1440×900/390×844/768×1024/320×700 가로 넘침 없음, 모달 Escape/포커스 복원, 원래 고정 일지 12편, 실제 offline reload의 story 동일성, pageerror 0. [Desktop](pr7/desktop.webp), [Mobile](pr7/mobile.webp), [Tablet](pr7/tablet.webp), [320px](pr7/narrow.webp), [기록 모달](pr7/record-mobile.webp).

첨부 33개 전체의 SHA/bytes/pixel/Pillow decode를 검증했다. PR7은 그중 이야기 WebP 27개/4,298,882 bytes만 사용하며 아이콘 교체는 PR8에서 한다. 원본 51+19+25 manifest 보존, 필수 셸 95 URL, 새 고화질은 요청 캐시다. 처음 화면의 story full-scene 요청 0 확인.

미검증: 물리 Android/iOS·Safari·VoiceOver 설치와 실제 20분 성능. PR8에서 별도 접근성/성능/업데이트 검증을 수행한다. 롤백 전 schema5 JSON 백업, current/before-import 삭제 금지. 이전 코드는 v5를 거부할 수 있으므로 최신 버전에서 복원한다.
