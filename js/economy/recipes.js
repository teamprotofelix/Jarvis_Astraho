export const facilities={
 survey_hangar:{name:'탐사 격납고',room:'workshop',anchor:[25,75],hero:[72,62],requires:[],researchCost:{resonance_crystal:1,starmetal:1},buildCost:{resonance_crystal:2,starmetal:1},duration:12,effect:'신호 스캔 1.5× · 탐사 스캔 1.25×'},
 anomaly_lab:{name:'이변 분석 연구실',room:'workshop',anchor:[76,74],hero:[52,54],requires:['survey_hangar'],researchCost:{ancient_fragment:1,memory_echo:1},buildCost:{ancient_fragment:2,starmetal:1},duration:18,effect:'표본 분석 제작 · 후속 연구 시간 25% 단축'},
 bio_dome:{name:'생태 온실',room:'garden',anchor:[26,76],hero:[36,38],requires:['anomaly_lab'],researchCost:{biosample:1,worldtree_seed:1},buildCost:{biosample:2,worldtree_seed:1},duration:20,effect:'보급 소모 25% 감소 · 승무원 휴식 회복 강화'},
 worldtree_resonator:{name:'세계수 공명 장치',room:'garden',anchor:[76,76],hero:[60,36],requires:['bio_dome'],researchCost:{resonance_crystal:1,memory_echo:1},buildCost:{resonance_crystal:2,worldtree_seed:1},duration:24,effect:'귀환 안정 1.5× · 탐사 스캔 추가 1.25×'}
};
export const analysisRecipe={id:'sample_analysis',cost:{biosample:1,ancient_fragment:1},outputs:{memory_echo:2}};
export function facilityEffects(levels){return {scanRate:levels.survey_hangar?1.5:1,expeditionScanRate:(levels.survey_hangar?1.25:1)*(levels.worldtree_resonator?1.25:1),supplyRate:levels.bio_dome ? .75 : 1,stability:levels.worldtree_resonator?1.5:1,researchScale:levels.anomaly_lab ? .75 : 1,restBonus:levels.bio_dome ? .4 : 0};}
