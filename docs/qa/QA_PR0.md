# PR0 브라우저 기준선

Chromium headless (실제 렌더 엔진), Playwright Python, 2026-10-31.

1440×900 / 390×844(touch emulation) / 768×1024 각각: 15 room·11 crew·12 journal DOM, 문서 가로 넘침 없음, 방 열기/Escape/포커스 복원, VOYAGE 수동 D 키 이동 통과. 모바일은 터치 패드 tap도 실행했다. pageerror 0. 스크린샷: [desktop](pr0/desktop.webp), [mobile](pr0/mobile.webp), [tablet](pr0/tablet.webp).

실행: `python work/qa/baseline.py` (저장소 밖 임시 검증 스크립트). `npm test`, `npm run check`, `npm run build` 통과. 원본 WebP 51개 / 4,531,672 bytes / 필수 캐시 64 URL.

물리 기기, 실제 PWA 설치, Safari 및 스크린리더는 미검증. 터치 에뮬레이션을 실기기 테스트로 해석하지 않는다.
