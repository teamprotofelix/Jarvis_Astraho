export const destinations=[
 {id:'crystal_shore',name:'수정 해안',biome:'crystal',risk:1,requiresInvitation:false,playable:true,analysis:'공명 수정의 반사 스펙트럼과 해안 지형을 관측했습니다.',advice:'기본 장비로 표본 회수와 안전 귀환을 우선합니다.'},
 {id:'ember_canyons',name:'붉은 협곡',biome:'ember',risk:2,requiresInvitation:false,playable:true,analysis:'열류와 좁은 암반 통로가 있습니다. 항로 수치는 추정값입니다.',advice:'2B의 안전 점검 후 협곡 장애물을 피하며 이동합니다.'},
 {id:'aurora_glacier',name:'극광 빙원',biome:'aurora',risk:2,requiresInvitation:false,playable:true,analysis:'빙하 표본의 발광과 신호 차폐를 관측했습니다.',advice:'스캔으로 표본 위치를 확인하고 보급 잔량을 지킵니다.'},
 {id:'violet_mycelium',name:'비올렛 숲',biome:'violet',risk:3,requiresInvitation:false,playable:false,analysis:'균사체 신호는 확인했으나 현지 탐사 장비는 준비 중입니다.',advice:'생태 환경을 보전하며 후속 원정을 준비합니다.'},
 {id:'ancient_ring_ruins',name:'고대 링 유적',biome:'ruins',risk:3,requiresInvitation:false,playable:false,analysis:'인공 구조물의 잔향입니다. 소유와 접근권은 미확정입니다.',advice:'접촉 가능성을 먼저 검토합니다. 현재는 관측만 합니다.'},
 {id:'gravity_orchard',name:'부유섬 정원',biome:'gravity',risk:4,requiresInvitation:true,playable:false,analysis:'신의 영역으로 추정되며 수락된 초대 기록이 없습니다.',advice:'초대가 확인될 때까지 진입을 보류합니다.'}
];
export const destination=id=>destinations.find(d=>d.id===id);
export const missionStates=['undetected','detected','scanning','ready','traveling','arrived','expedition-ready','returning','completed','abandoned','blocked'];
export const missionLabels={'undetected':'미탐지',detected:'신호 발견',scanning:'스캔 중',ready:'항행 준비',traveling:'접근 항행',arrived:'궤도 도착','expedition-ready':'원정 준비',returning:'귀환 중',completed:'귀환 완료',abandoned:'보류',blocked:'진입 불가'};
