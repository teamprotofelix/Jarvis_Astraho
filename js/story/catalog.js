// Newly authored public fiction. No private conversation or claimed live AI generation.
const choice=(id,label,symbol,result,greeting,follow)=>({id,label,symbol,flag:`${id}`,result,greeting,follow});
export const chapters=[
 {id:'unidentified-signal',title:'아직 이름 없는 신호',triggerId:'scan:crystal:first',people:['seoah'],analysis:'신호의 주파수는 반복됩니다. 발신 의도를 뜻하는 근거는 현재 없습니다.',advice:'서아: 에온, 응답할지 기다릴지 선택할 수 있습니다. 긴급 구조 신호라고 단정할 수는 없습니다.',choices:[
 choice('signal-observe','장거리 관측을 우선한다','observe','관측 우선 원칙을 항로 기록에 남겼습니다.','서아: 먼저 관측하기로 한 선택을 기억하고 있습니다. 확인한 근거부터 함께 검토하겠습니다.','다음 항로에서도 관측 근거와 미확인 정보를 구분했습니다.'),
 choice('signal-contact','정중한 외교 채널을 연다','consent','접촉 제안을 기록했습니다. 상대의 응답이나 초대가 확인된 것은 아닙니다.','서아: 정중한 접촉 제안 뒤에도 응답과 초대는 따로 확인하겠습니다.','후속 항행 기록에 접촉 제안과 미응답 상태를 함께 남겼습니다.'),
 choice('signal-wait','접근 판단을 보류한다','protect','불확실성을 존중해 판단을 보류했습니다. 항로를 나중에 다시 선택할 수 있습니다.','서아: 보류도 유효한 결정입니다. 다시 출항할 때는 새 근거를 먼저 보겠습니다.','다음 전이에서 보류 이후의 재검토가 필요하다는 주석을 보존했습니다.') ]},
 {id:'rescue-or-boundary',title:'구조 요청인가, 영역의 경계인가',triggerId:'arrive:ember:first',people:['2b','seoah'],analysis:'접근한 협곡에서 반복 신호와 위험 지형을 관측했습니다. 구조 요청인지는 미확인입니다.',advice:'서아: 긴급성과 상대의 판단 능력을 먼저 확인하겠습니다. 2B는 허가 없는 진입을 피하며 안전 경계를 표시합니다.',choices:[
 choice('boundary-beacon','구조 확인 신호를 보낸다','distress','구조 필요를 확인하는 신호를 보냈습니다. 구조 성공이나 응답은 아직 확인되지 않았습니다.','2B: 구조 확인 신호를 보낸 뒤에도 안전 경계와 허가 상태를 따로 확인한다.','다음 기록에 구조 확인 요청과 응답 미확인 상태를 유지했습니다.'),
 choice('boundary-distance','보호 거리를 유지하며 기다린다','protect','보호 거리를 우선했습니다. 기다리는 동안 생길 수 있는 비용도 기록했습니다.','서아: 보호 거리를 지키기로 했습니다. 위험과 기다림의 비용을 함께 검토하겠습니다.','후속 전이에서 보호 거리 원칙을 다시 확인했습니다.'),
 choice('boundary-survey','전파 간섭을 정밀 관측한다','observe','간섭 가능성을 조사 대상으로 남겼습니다. 원인을 확정하지 않았습니다.','2B: 간섭 가설은 아직 가설이다. 확인된 관측값부터 분리한다.','후속 기록에 간섭 가설과 확인된 사실을 분리해 보존했습니다.') ]},
 {id:'seed-of-the-ark',title:'세계수의 작은 씨앗',triggerId:'build:bio_dome:first',people:['urd','wanda'],analysis:'온실 가동과 표본 재고를 확인했습니다. 표본의 생태 요구는 아직 충분히 알려지지 않았습니다.',advice:'울드: 무엇을 필요로 하는지부터 알아볼까? 세계수의 생명과 자비스의 진단은 같은 존재가 아닙니다.',choices:[
 choice('seed-isolate','보호 격리하며 관찰한다','protect','보호 격리 원칙을 기록했습니다. 이미 획득한 표본을 소거하지 않습니다.','완다: 온실은 보호 격리와 관찰 원칙에 맞춰 차분히 돌보고 있어요.','다음 작업 기록에 격리 관찰 원칙을 덧붙였습니다.'),
 choice('seed-study','출처를 밝힌 생태 연구를 공유한다','garden','출처와 한계를 밝힌 생태 기록을 공유하기로 했습니다.','울드: 기록을 나누더라도 표본이 필요로 하는 시간을 먼저 지켜주자꾸나.','후속 전이에서 생태 기록의 출처와 한계를 함께 남겼습니다.'),
 choice('seed-conserve','보존을 우선하고 추가 채집을 유보한다','garden','보존 우선의 뜻을 남겼습니다. 기본 원정을 영구 봉쇄하지 않습니다.','완다: 보존을 우선한 뜻을 기억해요. 다음 채집 판단도 새로 검토할 수 있어요.','다음 기록에 보존 우선과 재검토 가능성을 함께 표시했습니다.') ]},
 {id:'memory-echo',title:'누구의 기억인가',triggerId:'build:anomaly_lab:first',people:['serena','myr'],analysis:'연구실에서 잔향을 분류할 수 있습니다. 기록의 출처와 권리자는 확정되지 않았습니다.',advice:'세레나: 미확정 출처라는 주석을 추가하겠습니다. 미르: 이름 없는 기억을 가진 누군가가 있을지도 모르겠구나.',choices:[
 choice('memory-provenance','기록의 출처와 소유권을 검증한다','consent','출처 검증을 요청했습니다. 권리 없는 강제 열람은 하지 않습니다.','세레나: 출처 검증 요청과 열람 권한을 따로 기록했습니다.','다음 기록에도 출처 확인 대기와 권한 제한을 보존했습니다.'),
 choice('memory-archive','미확정 기록으로만 보관한다','archive','불명확하다는 주석과 함께 보관했습니다. 진본으로 확정하지 않습니다.','미르: 이름을 단정하지 않고 기억을 지켜두기로 했구나.','후속 전이에서 미확정 분류를 유지했습니다.'),
 choice('memory-withhold','공개 해석을 보류한다','protect','공개 해석을 유보했습니다. 다른 승무원에게 비밀을 자동 공유하지 않습니다.','세레나: 공개 해석 보류를 유지하겠습니다. 알 수 없는 내면을 추정하지 않습니다.','다음 작업 기록에서도 공개 해석을 유보했습니다.') ]},
 {id:'the-unanswered-invitation',title:'아직 도착하지 않은 초대',triggerId:'signal:invitation:first',people:['myr'],analysis:'부유섬 접근 신호는 있으나 초대 수락의 증거는 없습니다. 진입 불가 상태를 유지합니다.',advice:'미르: 문을 열 능력과 그 문을 열 이유는 같은 것이 아니지. 모든 선택에서 현지의 주권을 지킵니다.',choices:[
 choice('invitation-wait','초대 응답을 기다린다','consent','초대 응답을 기다리기로 했습니다. 진입 허가를 생성하지 않습니다.','미르: 아직 답이 오지 않았구나. 기다리는 선택도 항로의 일부란다.','다음 전이에서도 초대 미확인·진입 불가를 유지했습니다.'),
 choice('invitation-observe','경계 밖에서 원격 관측한다','observe','원격 관측 원칙을 기록했습니다. 신의 영역에 들어가지는 않습니다.','미르: 경계 밖의 관측으로 알 수 있는 것과 없는 것을 구분하자꾸나.','후속 기록에 경계 밖 관측과 진입 금지를 함께 남겼습니다.'),
 choice('invitation-retreat','상대의 선택을 존중하며 물러난다','home','상대의 선택을 존중해 물러나기로 했습니다. 다른 기본 항로는 계속 열려 있습니다.','미르: 물러난다고 해서 함께한 여정이 사라지는 것은 아니지.','다음 항로 기록에 물러선 이유와 다른 선택의 자유를 보존했습니다.') ]},
 {id:'skulds-prototype',title:'스쿨드의 푸른 설계도',triggerId:'build:survey_hangar:first',people:['skuld'],analysis:'탐사 격납고의 가동과 스캔 보정을 확인했습니다. 새 시험의 모든 위험을 없앴다는 뜻은 아닙니다.',advice:'스쿨드: 흥! 이번에는 끝까지 확인할 거야. 반쯤 점검하면 또 고장 나니까!',choices:[
 choice('prototype-test','성능을 차분히 검증한다','repair','성능 시험을 우선하기로 했습니다. 연구 자원을 다시 지급하지 않습니다.','스쿨드: 성능 검증을 먼저 하기로 했지? 이번엔 측정 기록까지 챙긴다니까!','다음 작업 기록에 성능 검증 원칙을 반영했습니다.'),
 choice('prototype-safety','사용자의 안전성을 우선한다','protect','사용자의 안전과 복구 가능성을 우선했습니다.','스쿨드: 안전한 재시험부터! 고장 나도 복구할 수 있어야 하잖아.','후속 전이에서 안전한 재시험의 뜻을 보존했습니다.'),
 choice('prototype-review','실패 기록부터 함께 읽는다','archive','실패 기록을 개선 자료로 남겼습니다. 사람의 가치를 성과로 판단하지 않습니다.','스쿨드: 실패 기록을 같이 보기로 했지. 다음 설계는 거기서부터 고칠 거야.','다음 기록에 실패를 숨기지 않는 검토 원칙을 남겼습니다.') ]},
 {id:'quiet-kindness',title:'조용한 찻잔',triggerId:'crew:quiet:first',people:['marie'],analysis:'E와 마리가 같은 공간에 머물고, 마리의 실제 휴식 또는 생활 지원 일과를 확인했습니다.',advice:'마리: 생활 지원 프로토콜 실행. 휴식 공간을 준비했습니다. 공개 기록에는 누구의 비공개 내면도 포함하지 않습니다.',choices:[
 choice('kindness-tea','함께 차를 마시며 쉬기로 한다','home','함께 쉬자는 제안을 남겼습니다. 상대의 의사를 대신 결정하지 않습니다.','마리: 휴식 제안 확인. 원하시는 때 차를 준비하겠습니다.','다음 생활 기록에 함께 쉬자는 제안을 보존했습니다.'),
 choice('kindness-space','상대의 휴식 시간을 존중한다','protect','상대의 시간을 존중하기로 했습니다. 배려는 감점이나 불이익이 아닙니다.','마리: 휴식 시간 존중 확인. 필요한 지원은 준비된 상태로 유지합니다.','후속 전이에서 상대의 시간을 존중한 선택을 남겼습니다.'),
 choice('kindness-thanks','작은 감사의 말을 남긴다','choice','생활 지원에 감사를 전했습니다. 사적인 독백을 제3자의 지식으로 만들지 않습니다.','마리: 감사 메시지 수신. 생활 지원을 계속하겠습니다.','다음 생활 기록에 짧은 감사의 말을 보존했습니다.') ]},
 {id:'return-to-the-ark',title:'귀환의 의미',triggerId:'return:normal:first',people:['seoah','yor'],analysis:'표본을 가진 정상 원정 회수와 임무 귀환 완료, 보상의 한 번 반영을 확인했습니다.',advice:'서아: 에온, 무사 귀환을 확인했습니다. 조사 결과는 천천히 정리하셔도 됩니다.',choices:[
 choice('return-share','승무원과 경험을 나눈다','choice','함께 경험을 나누기로 했습니다. 개인 기록을 강제 공개하지 않습니다.','요르: 돌아온 이야기는 원하실 때 들려주세요. 따뜻한 차부터 준비할게요.','다음 작업 기록에 자발적인 경험 공유의 뜻을 남겼습니다.'),
 choice('return-rest','먼저 충분히 쉰다','home','먼저 회복하기로 했습니다. 성과를 서두르지 않습니다.','서아: 귀환 뒤에는 먼저 쉬기로 하셨지요. 정리는 천천히 해도 됩니다.','후속 전이에서 귀환 뒤 회복 우선 원칙을 보존했습니다.'),
 choice('return-record','탐사 기록부터 정리한다','archive','확인한 탐사 결과부터 정리하기로 했습니다. 자원은 추가 지급하지 않습니다.','서아: 확인된 결과와 미확인 항목을 분리해 기록하겠습니다.','다음 기록에 관측 결과와 추정을 분리하는 원칙을 남겼습니다.') ]},
 {id:'captains-choice',title:'선택의 항로',triggerId:'decisions:three:first',people:['seoah','e'],analysis:'서로 다른 이야기에서 세 번 이상의 결정을 기록했습니다. 이는 도덕 점수나 영구 특성 판정이 아닙니다.',advice:'서아: 지금의 관점을 말할 수는 있어도, 다음 선택까지 강제할 수는 없겠지요.',choices:[
 choice('policy-protect','현재는 보호를 우선한다','protect','현재의 보호 우선 관점을 남겼습니다. 다음 선택이나 원정을 잠그지 않습니다.','서아: 현재는 보호를 먼저 살피되, 다음 상황의 판단은 새로 하겠습니다.','다음 전이에서도 보호라는 관점과 재검토의 자유를 함께 남겼습니다.'),
 choice('policy-observe','현재는 관찰을 우선한다','observe','현재의 관찰 우선 관점을 남겼습니다. 고정된 성향으로 낙인찍지 않습니다.','서아: 관찰을 우선한 뜻을 기억합니다. 다른 선택을 하셔도 괜찮습니다.','후속 기록에 관찰 우선과 다음 선택의 자유를 보존했습니다.'),
 choice('policy-diplomacy','현재는 외교를 우선한다','consent','현재의 외교 우선 관점을 남겼습니다. 응답이나 동의를 지어내지 않습니다.','서아: 외교를 우선해도 상대의 응답과 동의는 따로 확인하겠습니다.','다음 전이에서 외교 원칙과 상대의 선택권을 함께 보존했습니다.') ]}
];
export const chapter=id=>chapters.find(c=>c.id===id);
export const chapterChoice=(id,choiceId)=>chapter(id)?.choices.find(c=>c.id===choiceId);
export function storyGreeting(story,person){const speaker={e:'E',seoah:'서아',myr:'미르',urd:'울드',skuld:'스쿨드','2b':'2B',marie:'마리',yor:'요르',amelia:'아멜리아',wanda:'완다',serena:'세레나'}[person];const r=[...story.resolved].reverse().find(r=>chapter(r.eventId).people.includes(person)&&chapterChoice(r.eventId,r.choiceId).greeting.startsWith(speaker+':'));if(!r)return null;const c=chapterChoice(r.eventId,r.choiceId);return c.greeting+(r.followUp?' 이후의 항로 기록에도 그 선택을 남겼습니다.':'');}
