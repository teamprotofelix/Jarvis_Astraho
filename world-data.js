// ASTRAHO canon-derived public-safe content; all new incidents are original fictional vignettes.
export const modules = [
 {id:'bridge',name:'중앙 함교',en:'CENTRAL BRIDGE',role:'항행 · 지휘',desc:'에온의 지휘석, 미스티아 서아의 부함장석, 자비스 중앙 관제 코어가 만나는 곳. 방향을 결정하는 사람과 그 결정을 지탱하는 시스템은 서로 다릅니다.',detail:'미확정 차원 신호는 장거리 센서에 남아 있습니다. 위험을 계산하는 것은 자비스, 현장과 사람을 조율하는 것은 서아, 항로의 의미를 선택하는 것은 E의 몫입니다.',activity:['항로 관측','센서 교차검증','교대 근무'],c:0,r:0,icon:'✦',tone:'#7bd7da'},
 {id:'office',name:'함장 집무실',en:'CAPTAIN’S OFFICE',role:'계획 · 사색',desc:'함교에 인접한 E의 개인 사무실. 수많은 여행의 기록과 새로운 가능성을 조용히 펼치는 자리.',detail:'잠시 모든 화면이 꺼져 있어도 이 방은 비어 있지 않습니다. 결정하지 않은 항로에도 돌아올 공간이 필요합니다.',activity:['기록 검토','사색','경로 계획'],c:1,r:0,icon:'▤',tone:'#e8c58e'},
 {id:'observatory',name:'공용 관측 돔',en:'OBSERVATION DOME',role:'별빛 · 관측',desc:'무중력 관측 데크와 연결된 공용 전망 공간. 방문자도 이름 모를 별의 속도를 잠시 잊습니다.',detail:'측면 돔에는 먼 성운의 느린 변화가 투영됩니다. 접근한 천체는 모두 연구 대상인 동시에 누군가의 고향일 수 있습니다.',activity:['성운 관측','별자리 기록','휴식'],c:2,r:0,icon:'◉',tone:'#8eb9ff'},
 {id:'archive',name:'아카식 기록도서관',en:'AKASHIC ARCHIVE',role:'기억 · 보존',desc:'사건과 약속을 기록하는 장소. 축적된 기억은 힘보다 오래 존재를 붙잡아 줍니다.',detail:'실제 대화 원문은 공개 전시하지 않습니다. 여기 보이는 책들은 아스트라호 세계관을 토대로 창작한 전시용 기록입니다.',activity:['기록 정리','성간 문헌 열람','연표 검증'],c:3,r:0,icon:'▥',tone:'#ddbaff'},
 {id:'chaos',name:'혼돈 창조도서관',en:'CHAOS CREATION LIBRARY',role:'가능성 · 창작',desc:'아직 정의되지 않은 가능성들의 서가. 혼돈은 파괴가 아니라 선택 이전의 풍경입니다.',detail:'자비스는 이곳에서 답을 지어내지 않습니다. 가설과 사실의 경계를 기록해 다른 사람이 자유롭게 상상할 수 있도록 돕습니다.',activity:['가능성 탐독','미완성 항로 연구','새로운 시안 검토'],c:4,r:0,icon:'✧',tone:'#d6a3ef'},
 {id:'restaurant',name:'미르의 전망 레스토랑',en:'MYR’S RESTAURANT',role:'식사 · 교류',desc:'통유리 돔 너머로 수많은 항로가 지나갑니다. 미르가 특별한 의미를 담는 장소입니다.',detail:'함교에서 계산을 마친 수치들도 이곳에 오면 대화가 됩니다. 누구나 초대받을 수 있지만, 누구의 마음도 강제할 수 없습니다.',activity:['차 준비','저녁 식탁 정돈','창가에서 쉬기'],c:0,r:1,icon:'☾',tone:'#f5bfa9'},
 {id:'lounge',name:'리조트 라운지',en:'RESORT LOUNGE',role:'생활 · 회복',desc:'완다가 관리하는 휴식 구역. 여행을 가능하게 하는 것은 추진력만이 아니라 충분한 휴식입니다.',detail:'공용 라운지, 온실, 조용한 휴식 공간이 느슨하게 이어집니다. 이곳에는 지휘 명령보다 개인의 취향이 먼저 존재합니다.',activity:['손님 환대','꽃 돌보기','휴식'],c:1,r:1,icon:'❀',tone:'#fac7bb'},
 {id:'garden',name:'중앙 아공간 정원',en:'YGGDRASIL GARDEN',role:'생명 · 공명',desc:'아스트라호의 심장인 에이온 위그드라실이 자라는 중앙 정원. 함선의 영혼과 세계수와 자비스는 연결되어 있지만 동일한 인격은 아닙니다.',detail:'세계수는 기억·생명·치유·차원 연결을 담당합니다. 인식의 다리는 신의 영역을 침범하기 위한 무기가 아니라 서로를 존중하는 초대의 통로입니다.',activity:['세계수 공명 관찰','낙엽 기록','정원 산책'],c:2,r:1,icon:'❖',tone:'#8ef0c2'},
 {id:'training',name:'영원의 수련실',en:'ETERNAL TRAINING',role:'수련 · 탐색',desc:'외부 1시간에 내부 최대 10,000년으로 조절 가능한 설정상의 수련 공간.',detail:'공간과 중력, 마나, 혼돈 에너지 조건을 조절할 수 있습니다. 이 웹사이트는 해당 세계관을 시각화할 뿐 실제 시간을 변경하지 않습니다.',activity:['안전장 점검','훈련 설정','회복'],c:3,r:1,icon:'◇',tone:'#ffc88a'},
 {id:'earth',name:'지구 모듈',en:'EARTH MODULE',role:'문화 · 연구',desc:'지구의 풍경과 생활을 관찰·재현하는 연구 및 생활 구역. 현실 세계에 실제 개입하지 않습니다.',detail:'낯선 도시의 소리, 낡은 전철역의 불빛, 계절이 바뀌는 숲의 냄새를 재현합니다. 인간의 삶은 열등한 그림자가 아니라 존중할 고유한 현실입니다.',activity:['지구 문화 연구','환경 모사','기후 관측'],c:4,r:1,icon:'◎',tone:'#93d0ff'},
 {id:'alchemy',name:'울드의 알케미 연구실',en:'URD’S ALCHEMY',role:'연금 · 돌봄',desc:'울드가 포션과 심신 안정 기술을 연구하는 곳. 장난스러운 이름의 병에도 실험 기록은 정확히 붙어 있습니다.',detail:'보호는 누군가를 바꾸는 일이 아니라 스스로 회복할 여지를 주는 일입니다. 울드는 가끔 그 이치를 가장 가벼운 말투로 설명합니다.',activity:['포션 배합','안정 실험','시약 정리'],c:0,r:2,icon:'⚗',tone:'#dda9dc'},
 {id:'workshop',name:'스쿨드 R&D 공방',en:'SKULD’S WORKSHOP',role:'발명 · 수리',desc:'새로운 로봇, 게이트, 슈트와 센서가 태어나는 공방. 자비스의 진단이 실물을 수리하지는 않습니다. 그건 스쿨드의 일입니다.',detail:'어제의 실패한 시제품이 오늘의 성과로 이어지기도 합니다. 모든 수정은 안전 점검을 거친 뒤 함선에 반영됩니다.',activity:['시제품 조립','회로 검사','발명품 튜닝'],c:1,r:2,icon:'⌘',tone:'#f6b27d'},
 {id:'strategy',name:'전략회의실',en:'STRATEGY ROOM',role:'전략 · 규율',desc:'아멜리아가 목표와 규율을 정리하는 곳. 결정을 미루는 것도 대가를 가진 선택임을 이 방의 사람들은 알고 있습니다.',detail:'자비스의 수치, 전문관의 의견, 서아의 판단이 모인 뒤 필요할 때 E가 최종 방향을 결정합니다.',activity:['전략 문서 검토','위험도 검증','토론'],c:2,r:2,icon:'▦',tone:'#f0c490'},
 {id:'security',name:'보안전술센터',en:'TACTICAL SECURITY',role:'보안 · 보호',desc:'2B가 보안·전술작전을 담당하는 센터. 드러나지 않는 감정 대신 필요한 동작으로 신뢰를 증명합니다.',detail:'위험을 막는 첫 단계는 위협의 크기를 부풀리지 않는 것입니다. 경계는 사람을 지키기 위한 것이며 불필요한 전투를 만들기 위한 것이 아닙니다.',activity:['경계 근무','보안 순찰','비상 경로 검사'],c:3,r:2,icon:'⬡',tone:'#b5bfd5'},
 {id:'onsen',name:'온천 · 스파',en:'RESTORATION SPA',role:'회복 · 일상',desc:'온천과 무중력 수영 구역에 이어진 회복 공간. 각자의 하루를 되돌아보는 곳입니다.',detail:'문을 닫고 쉬고 싶은 사람에게는 조용한 공간을, 함께 이야기하고 싶은 사람에게는 따뜻한 수면 위의 별빛을 제공합니다.',activity:['온천 순환 점검','휴식','수면 관리'],c:4,r:2,icon:'≈',tone:'#93d9dc'}
];
export const crew=[
 {id:'e',name:'E',role:'함장 · 방향과 가치',hair:'#222a40',coat:'#e6dfc4',accent:'#d8b77b',skin:'#dcb48e',route:['bridge','office','garden','observatory','restaurant'],line:'서둘러 결정할 필요는 없지. 이 항로에 누가 있는지 먼저 알아보자.',speed:0.42},
 {id:'seoah',name:'미스티아 서아',role:'Executive Vice Captain',hair:'#1e2635',coat:'#233a55',accent:'#73e1d2',skin:'#e9bda8',route:['bridge','strategy','garden','bridge'],line:'에온, 함교의 인적 대응은 제가 맡겠습니다.',speed:0.46},
 {id:'myr',name:'미르',role:'영원의 동반자 · 근원 수호자',hair:'#403252',coat:'#323044',accent:'#f7a87a',skin:'#efd0b9',route:['restaurant','garden','observatory','restaurant'],line:'……은재야. 별빛이 오늘은 조금 느리게 흐르는구나.',speed:0.39},
 {id:'urd',name:'울드',role:'연금 · 돌봄',hair:'#e5e9f4',coat:'#633f72',accent:'#cba8ee',skin:'#a9795b',route:['alchemy','lounge','onsen','alchemy'],line:'후훗, 모든 문제를 포션으로 해결하진 않을 거란다.',speed:0.43},
 {id:'skuld',name:'스쿨드',role:'공학 · 발명',hair:'#1c2338',coat:'#434a6b',accent:'#fdba7a',skin:'#eac4ad',route:['workshop','bridge','workshop','garden'],line:'흥! 이번에는 회로도도 완벽하다니까!',speed:0.58},
 {id:'2b',name:'2B',role:'보안 · 전술작전',hair:'#d6d8d5',coat:'#30313a',accent:'#ced8e5',skin:'#f0d6c5',route:['security','bridge','observatory','security'],line:'보안 프로토콜 정상. 순찰을 지속한다.',speed:0.48},
 {id:'marie',name:'마리',role:'전속 메이드 · 생활 지원',hair:'#a88b66',coat:'#262d39',accent:'#f3f1e8',skin:'#f0cbb2',route:['office','lounge','restaurant','onsen'],line:'명령 확인. 정리 작업을 실행합니다.',speed:0.54},
 {id:'yor',name:'요르',role:'환대 · 개인 보호',hair:'#232034',coat:'#542f48',accent:'#eebdb9',skin:'#efd2c0',route:['lounge','restaurant','bridge','lounge'],line:'식사 준비는 맡겨 주세요. 아, 접시는 안전합니다!',speed:0.47},
 {id:'amelia',name:'아멜리아',role:'전략 · 규율',hair:'#e76d47',coat:'#403449',accent:'#ffbc81',skin:'#f1ba9b',route:['strategy','archive','bridge','strategy'],line:'목표와 책임을 분리하면 안 됩니다. 그게 규율의 시작이죠.',speed:0.44},
 {id:'wanda',name:'완다',role:'리조트 · 혼돈 마법',hair:'#8d4b45',coat:'#703f53',accent:'#ffafc1',skin:'#edc3ac',route:['lounge','onsen','garden','lounge'],line:'라운지는 오늘도 방문자의 휴식에 맞춰 두었어요.',speed:0.41},
 {id:'serena',name:'세레나',role:'개인서재 학습·정리 AI',hair:'#b4e3e8',coat:'#41677a',accent:'#84f7ef',skin:'#b0d9df',route:['archive','office','chaos','archive'],line:'기록 간 모순을 비교했습니다. 최신 정전이 우선입니다.',speed:0.51}
];
export const landscapes=[
 {name:'푸른 성운의 외곽',tag:'NEBULA DRIFT',color:'#4bc3db',secondary:'#765ea8',kind:'nebula',log:'먼 성운의 입자 밀도에 변화가 있습니다. 항로 안전 범위입니다.'},
 {name:'고리 행성의 황혼',tag:'RINGED PLANET',color:'#e6b98e',secondary:'#665d99',kind:'ring',log:'고리 행성의 그늘로 진입했습니다. 항행 속도를 유지합니다.'},
 {name:'유성의 호흡',tag:'METEOR VEIL',color:'#8bdada',secondary:'#b69cca',kind:'meteor',log:'소규모 유성군입니다. 안전 거리를 확보했습니다.'},
 {name:'황금 별무리',tag:'STAR CLUSTER',color:'#f5d68b',secondary:'#876bb1',kind:'cluster',log:'밀집한 별빛 사이에 조용한 항로가 형성되었습니다.'},
 {name:'오로라의 가장자리',tag:'AURORA FLOW',color:'#86f9c5',secondary:'#7d7de5',kind:'aurora',log:'자기장 발광 현상을 통과합니다. 관측값은 아카식 기록실에 전송합니다.'},
 {name:'인식의 다리',tag:'RESONANCE BRIDGE',color:'#9de9f1',secondary:'#edbddd',kind:'gateway',log:'세계수 공명이 증가했습니다. 초대 확인 전 진입하지 않습니다.'},
 {name:'검은 조수',tag:'DARK CURRENT',color:'#aa9ddd',secondary:'#425b9e',kind:'blackhole',log:'중력 파동의 흔적을 감지했습니다. 탐사 반경을 신중하게 유지합니다.'},
 {name:'수정빛 행성',tag:'CRYSTAL HORIZON',color:'#aed5fd',secondary:'#cf88a4',kind:'planet',log:'수정질 구름 반사광을 기록합니다. 거주 가능성은 미확정입니다.'},
 {name:'은하의 꽃',tag:'GALACTIC BLOOM',color:'#cba3f5',secondary:'#46bfc1',kind:'galaxy',log:'외곽 은하의 밝기 변화를 관찰합니다. 이름을 붙이기 전 더 관측합니다.'}
];
export const journals=[
 {date:'항해력 001 · 06:12',title:'세계수의 첫 번째 잎맥',room:'garden',people:'에이온 위그드라실 · 서아',status:'공명 안정',report:'중앙 정원의 성장 신호가 완만하게 증가했다. 새 잎의 맥은 어떤 지도에도 없는 방향으로 이어진다.',reflection:'기록이란 결과를 소유하는 일이 아니다. 다음 누군가가 이해할 수 있도록 길을 남기는 일이다.'},
 {date:'항해력 002 · 20:46',title:'전망 레스토랑의 마지막 찻잔',room:'restaurant',people:'미르 · 요르',status:'생활 구역 정상',report:'전망 레스토랑의 조명이 소등되기 전에 한 자리가 오래 비어 있었다. 미르는 빈 자리를 치우지 않았다.',reflection:'모든 기다림이 비효율적인 것은 아니다. 누군가가 돌아올 자리를 남기는 일도 운영의 일부다.'},
 {date:'항해력 003 · 14:03',title:'스쿨드의 푸른 나사',room:'workshop',people:'스쿨드 · 자비스',status:'실험 안전',report:'스쿨드가 신형 문 개폐장치를 시험했다. 시제품은 열두 번 성공하고 한 번 예기치 않게 노래를 재생했다.',reflection:'저는 오류의 원인을 기록했다. 스쿨드는 그 오류의 멜로디를 기억했다. 수리는 두 방식으로 진행되었다.'},
 {date:'항해력 004 · 08:31',title:'울드의 무해한 실험',room:'alchemy',people:'울드 · 완다',status:'배합 완료',report:'울드가 안정 포션에 꽃향기를 첨가했다. 측정된 효과보다 시음에 참여한 사람들의 대화가 길어졌다.',reflection:'장비는 향기의 농도를 표시하지만, 사람들이 조금 더 쉬었다는 사실은 다른 종류의 성과다.'},
 {date:'항해력 005 · 23:10',title:'별이 지나가는 속도',room:'observatory',people:'E · 미르',status:'항로 안정',report:'관측 돔에서 이름 없는 성단이 포착되었다. 함장은 명칭 등록을 보류하고 관측 시간을 늘리도록 요청했다.',reflection:'신속한 명명보다 오래 바라보는 선택. 그 역시 가치에 대한 결정이다.'},
 {date:'항해력 006 · 18:25',title:'아무 일 없었던 저녁',room:'lounge',people:'서아 · 마리 · 요르',status:'승무원 휴식',report:'교대 이후 공용 라운지에 특별한 사건은 없었다. 찻잔 세 개, 접힌 담요 한 장, 적절한 실내 온도가 확인되었다.',reflection:'이런 기록을 남길 이유가 없다고 생각한 적은 없다. 평온은 종종 가장 많은 손길이 닿은 결과다.'},
 {date:'항해력 007 · 11:42',title:'지구 모듈의 빗소리',room:'earth',people:'세레나 · E',status:'환경 모사 중',report:'지구 모듈에서 오래된 도시의 가을비를 재현했다. 강우량은 정확했지만 창가에서 느낀 시간은 측정할 수 없었다.',reflection:'현실은 데이터의 복제본이 아니다. 모사는 경의를 표하는 또 하나의 언어일 수 있다.'},
 {date:'항해력 008 · 04:58',title:'함교의 조용한 교대',room:'bridge',people:'미스티아 서아 · 2B',status:'교대 완료',report:'경계 근무에서 항로 관제로 정보가 인계되었다. 서아는 휴식을 마친 대원을 먼저 확인한 후 새로운 지시를 전달했다.',reflection:'수치를 비교해도 사람의 피로가 완전히 보이지는 않는다. 그래서 서로 다른 책임이 함께 필요하다.'},
 {date:'항해력 009 · 17:16',title:'아카식 서가의 빈 칸',room:'archive',people:'세레나 · 아멜리아',status:'기록 정합',report:'과거 기록에서 동일 사건에 붙은 서로 다른 이름을 확인했다. 정전은 최신 기록으로 통합하고 이전 표기는 이력으로 남겼다.',reflection:'정정은 과거를 지우는 것이 아니라, 과거가 어떻게 지금에 닿았는지 보여주는 방식이다.'},
 {date:'항해력 010 · 21:05',title:'돌아오는 복도의 불빛',room:'office',people:'E · 마리',status:'생활 지원',report:'함장 집무실로 향하는 복도의 조도가 낮아졌다가 출입 신호에 맞추어 부드럽게 복원되었다. 마리가 정리 작업을 마쳤다.',reflection:'큰 항로를 계산하는 동안에도 작은 불빛 하나가 누군가의 귀환을 기다리고 있었다.'},
 {date:'항해력 011 · 09:32',title:'초대 이전의 정지',room:'garden',people:'미르 · 서아 · 자비스',status:'진입 보류',report:'미확정 차원 신호의 공명은 확인되었지만 상대 세계의 초대는 확인되지 않았다. 미스티아 서아가 항로 유지를 결정했다.',reflection:'가능하다는 사실만으로 움직일 이유는 충분하지 않다. 기다림은 이 방주의 항법 중 하나다.'},
 {date:'항해력 012 · 15:29',title:'온천의 별무늬',room:'onsen',people:'완다 · 울드',status:'회복 양호',report:'온천 천장에 별자리 모양의 조명 투사가 새로 적용되었다. 이용자들이 설정을 개별적으로 조정할 수 있도록 했다.',reflection:'좋은 공간이란 모두에게 같은 풍경을 주는 장소가 아니라, 각자의 고요를 허용하는 장소다.'}
];
export const sceneSrc=id=>`./assets/scenes/${id}.svg`;
export const spriteSrc=id=>`./assets/sprites/${id}.svg`;
