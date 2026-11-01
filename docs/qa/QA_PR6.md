# PR6 최종 검증

2026-11-01. Stacked base PR5(#6) `02c7a5e2344bb732450e40284f848ebeff6e0188`. main에 직접 변경·병합·배포·CNAME/DNS 변경 없음.

## 명령과 모델 검사

`npm test`, `npm run check`, `npm run build` 통과. 총 84개 검사(초기 48 + 임무 10 + 원정 10 + 저장 충돌 1 + 경제 15). 15개 기존 방/11명/FSM/225 경로/기존 항해/캐시 검사 유지.

경제 검사: 자원 부족 원자적 실패, 첫 무료 원정으로 연구/건설, 정상 모델 원정 세 곳에서 얻은 재고로 네 시설 완성, 중복/과거/미래 nonce와 외부 recipe 거부, 분석 제작의 정확한 비용/수량, 상한 실패 롤백, 실제 스캔·보급·귀환·휴식 회복 효과, 시설 승무원의 실제 작업/경로, v1/v2/v3 원본 보존 migration와 v3 재고 한 번 이전, schema4 손상/미래 버전 거부, active 연구 JSON 정확 복원, 64개 거래 기록 삭제 후에도 재실행 거부.

20분 모델 실행에서 임무 로그≤24, 시설 로그≤24, transactionIds≤64, JSON<48KB. **20분 실시간 브라우저 GPU/메모리 검사는 아니다.**

원본 51+19 WebP 해시 유지. 신규 사용 25개 869,694 bytes, 모두 350KB 미만. RIFF/해상도/해시/alpha 검사 및 Pillow 실제 디코딩. 투명 레이어/아이콘/시설의 실제 alpha 범위, 3개 atlas의 18 frame 비어 있지 않음을 확인. 필수 셸 91 URL; 신규 아트 전체를 precache하지 않는다. 원본 PNG 추가 없음.

## 실제 첫 게임 루프

빈 Chromium context, UI만으로 다음을 실행했다. 대기·항해·작업 시간은 Playwright clock으로 진행했다.

1. 수정 해안 스캔→실제 AUTO 항행→원정 출발→키보드 이동→세 목표의 경로 이동/스캔/채집.
2. 중간 pause·IDB 재로드의 원정 상태 일치→HOME 이동→회수→총 9 표본이 정확히 한 번 지급.
3. 연구 패널의 재고 수정 4/별금속 3 확인→격납고 연구 비용 차감 후 3/2→연구 완료→건설 비용 차감 후 1/1→가동 확인.
4. 실제 스캔 효과 1.5× 표시, installed level 1, 자원/연구/건설/임무/원장 모두 재로드 후 동일.

## 확장 시설과 입력 검증 (fixture 구분)

세 지역을 순수 캠페인 모델로 정상 플레이해 만든 별도의 earned JSON을 사용자 파일 가져오기/미리보기/확인으로 불러왔다. 무상 자원을 UI에 삽입한 검사가 아니며 위의 빈 저장 첫 플레이와 구분한다.

390px 실제 touch 이벤트의 버튼 tap으로 네 시설의 연구/조립을 순서대로 진행했다. 분석 제작 후 기억 잔향 +2, Living View의 구조물 4개, 신규 시설 작업 중인 승무원, 정원 ROOM 구조물 2개, 외관 hero 증축을 확인했다. 이후 오프라인 재방문에서 재고가 그대로였다. 화면 1440×900/390×844/768×1024/320×700 가로 넘침 없음, pageerror 0.

별도 PR5 준비 fixture의 v3→v4 가져오기로 held touch 이동, 모달 held-key 해제, blur 정지, 중간 스캔의 pause/오프라인 정확 복원을 최종 코드에서 확인했다.

## 실제 PWA 업데이트

로컬 별도 서버의 `/Jarvis_Astraho/`에서 SW v1.7.0→검사용 next-version을 제공했다. **저장소 sw.js와 운영 배포는 바꾸지 않았다.** 업데이트 알림을 받은 뒤 사용자 수락 버튼으로 flush→새 SW 활성화→자동 reload를 실행했다. 자원/시설/연구/임무/원정/원장 모두 동일하고, 업데이트 뒤 offline reload도 통과했다. reduced-motion context에서 정지 연출과 모바일 390px 화면을 확인, pageerror 0. 설치 실패 시 이전 캐시 보존은 기존 VM 단위 검사로 확인한다.

화면: [Desktop](pr6/desktop.webp), [Mobile](pr6/mobile.webp), [Tablet](pr6/tablet.webp), [320px](pr6/narrow.webp), [생활 뷰](pr6/living-mobile.webp), [정원 ROOM](pr6/garden-room.webp), [증축 외관](pr6/exterior.webp).

재현: 로컬 서버 실행 후 `python tests/campaign-browser.py http://127.0.0.1:8000`. Python Playwright/Pillow와 시스템 `/usr/bin/chromium` 필요. 실제 첫 루프와 별도 모델 획득 fixture/스크린샷을 ignored `work/campaign-browser`에 생성한다.

## 한계와 롤백

실제 Android/iOS 홈 화면 설치, Safari/VoiceOver, 물리 기기 GPU/발열/배터리, 20분 **실시간** 브라우저 메모리 부하는 미검증이다. 업데이트 검사는 로컬 Chromium이며 운영 배포 검증이 아니다. local JSON의 수동 값 변경을 막는 서버 anti-cheat는 없다. PR7 스토리와 PR8 최종 성능 패스/보호막 보너스는 후속이다.

코드 롤백 전 schema4 JSON을 내보내고 current/before-import를 삭제하지 않는다. 이전 코드는 schema4를 거부할 수 있으므로 최신 버전에서 백업을 다시 가져온다. PR들은 역순으로 되돌릴 수 있으며 CNAME/DNS는 원래 값 그대로다.


```text
npm test                 → 8 test files, 0 failed (84 individual cases)
node tests/construction.test.mjs → tests 15 / pass 15 / fail 0
npm run check            → exit 0
npm run build            → 15 modules / 11 crew / 9 landscapes / 91 offline URLs
Original art             → 51 WebP 4,531,672 bytes + 19 WebP 2,146,942 bytes
Selected new art         → 25 WebP 869,694 bytes, procedural illustration
Pillow                   → 25 decoded, actual alpha valid, 18 atlas frames nonempty
python tests/campaign-browser.py http://127.0.0.1:8000
                         → first expedition/research/build, all four mobile facilities,
                           exact reload/offline, 4 widths, pageerror 0
Local PWA next version   → consent/flush/reload, schema4 state unchanged,
                           offline after update, reduced-motion, pageerror 0
```

최종 기존 기능 브라우저 회귀: 모바일 키보드 수동 조종, 모달 held key 해제, held touch 조종, blur/focus, 12편 일지·earth 필터·포커스, 지도 줌·따라가기 확인. 하위 경로 부팅은 실제 PWA 업데이트 검사에 포함했다.
