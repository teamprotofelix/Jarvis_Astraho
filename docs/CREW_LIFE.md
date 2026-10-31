# 승무원 생활 상태기계

`crew/behaviors.js`: 원본 11명 ID를 유지한 공개 창작 업무. 각 인물의 고유 역할 작업과 휴식만 정의한다. 자비스는 목록에 추가하지 않는다. `utility.js`: xorshift seed, 120초 일정 단계·현재 방·피로·최근 행동으로 후보 점수를 매긴다. 진행 중 작업은 끝날 때까지 유지하며 플레이어 이동 요청이 우선한다. 휴식은 energy를 회복하고 업무/이동은 서서히 소모한다. 이 수치는 세계관의 실제 능력이나 생존 상태가 아닌 플레이용 지표다.

`simulation.js`: idle/walk/work/talk/rest/observe/repair/serve/study, 문/복도/수직 shaft 경로, 도착 후 queued 처리, 활동 시작/종료를 소유한다. seed/남은 시간/예약/대기 task를 snapshot에 담는다. `getContext`가 room/state/target/start/remaining/energy/queued/lastAction/preferredJobs/animation/messageKey를 제공하여 향후 임무·시설 작업이 재사용할 수 있다. UI/DOM을 참조하지 않는다. timestep 상한 .08초; hidden/pause/blur/모달은 main에서 update를 호출하지 않는다. 벽시계 경과를 보충하지 않는다.

로그는 실제 이동/작업 시작 전이에서 발생하고 최근 12개만 유지한다. 1초 이내 동일 인물·동일 메시지 중복은 억제한다. frame마다 로그를 생성하지 않는다. 상태 전이/비행 수집·보호막·구간 변경도 debounce 자동저장을 예약한다.

`animation.js`: 기존 4방향×3프레임 sheet를 유지한다. work/repair의 미세 움직임, talk의 기울기, rest의 앉은 자세 폴백, observe의 빛, 투명 소품 10종을 별도 레이어로 합성한다. sensor/worldtree 효과는 1152×192 atlas를 192×192 셀 6개로 읽는다. 저화질은 효과를 생략한다. reduced-motion에서는 정지 프레임과 정지 CSS를 사용하고 명시적인 재개 후에도 논리만 진행한다. 자체 timer/rAF는 없다. 상세 ROOM은 기존 모달 정지 규칙에 따라 현재 활동의 스냅샷을 보여 준다.

미르·세계수·자비스는 독립된 존재다. 서아의 인적 지휘, 스쿨드의 수리·재시험, 2B 보안·마리 생활 지원·울드 연금·요르 환대·아멜리아 규율·완다 리조트·세레나 기록을 구별한다. 마리의 방문 인사는 같은 방의 E에만 반응하며, 새 내면 독백을 공개 로그나 제3자의 지식으로 생성하지 않는다.

## 후속 art pass

새 정밀 액션 시트는 이 ZIP에 없다. 팔/손/가구 상호작용은 소품과 CSS 합성이다. 고품질 전용 행동 셀/가구 충돌·가림/발판 세분화는 별도 PR3 art pass에서 제작·검수한다. 이번 구현을 전용 액션 시트가 완성된 것으로 해석하지 않는다. PR4/PR6의 실제 임무·신규 건설은 이번 범위 밖이다.
