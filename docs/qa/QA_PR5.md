# PR5 검증

2026-11-01, stacked base PR4(#5). `npm test`, `npm run check`, `npm run build` 통과. 신규 expedition 10개 검사와 저장 충돌 검사 1개를 추가했다. 기존 검사 포함 총 69개. 300개 지역/seed의 도달성, 세 지역의 스캔/채집/회수와 다른 보상, 막힌/대각선 이동, 구조/철수, 오래된 보상 replay 거부, schema1/2→3, compact JSON 정확 복원, 불법/음수/외부 ID 거부를 확인한다.

첫 플레이 실제 Chromium, 새 빈 context에서 UI만 조작하고 Playwright clock으로 시간을 진행:

1. 신호 스캔→기존 AUTO 항행→수정 해안 원정 출발.
2. D 키 이동, 목표 버튼의 실제 경로 이동, 표본 3개를 각각 스캔/40초 채집.
3. 원정 pause 후 JSON export/IDB reload: position/supply/action/collected/mission 상태 완전 동일.
4. HOME으로 이동→회수→귀환 완료. 수정 4/별금속 3/기억 2, 총 9 지급.
5. 재방문과 실제 offline context reload에서도 원장 동일, 추가 보상 없음. pageerror 0.

추가 입력 검사는 순수 모델로 만든 원정 준비 fixture를 **사용자 JSON 가져오기·미리보기·확인**으로 로드하여 실제 held touch 이동, 모달 held key 해제, blur 정지, 중간 스캔 pause/오프라인 정확 복원을 확인한다. 이 fixture 검사를 위 첫 플레이 증거와 구분한다.

1440×900 / 390×844 / 768×1024 / 320×700 화면 넘침 없음. [Desktop](pr5/desktop.webp), [Mobile](pr5/mobile.webp), [Tablet](pr5/tablet.webp), [320px](pr5/narrow.webp). 원본 51+19 이미지 유지. 선택 신규 WebP 21개, 861,064 bytes, 필수 셸 85 URL. 전체 35개 후보를 설치하지 않는다.

미검증: 실제 모바일 설치/Safari/스크린리더, 20분 실제 브라우저 GPU·메모리. clock 진행은 실시간 기기 부하 검사가 아니다. reduced-motion은 정지 프레임으로 구현하며 최종 통합 브라우저 검사에서 별도 확인한다. 롤백 전 JSON 백업 후 PR5 커밋을 되돌리며 IDB와 원본 파일은 보존한다. main 병합/배포 없음.
