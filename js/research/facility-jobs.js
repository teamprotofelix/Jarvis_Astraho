import {facilities} from '../economy/recipes.js';
export const facilityActions=[
 {id:'2b-facility-survey_hangar',crew:'2b',facility:'survey_hangar',room:'workshop',state:'observe',prop:'security-shield',label:'탐사 격납고 출발 점검'},
 {id:'skuld-facility-anomaly_lab',crew:'skuld',facility:'anomaly_lab',room:'workshop',state:'study',prop:'repair-drone',label:'증축 연구실 표본 분석'},
 {id:'wanda-facility-bio_dome',crew:'wanda',facility:'bio_dome',room:'garden',state:'work',prop:'plant-care',label:'증축 온실 표본 재배'},
 {id:'marie-facility-bio_dome',crew:'marie',facility:'bio_dome',room:'garden',state:'work',prop:'plant-care',label:'증축 온실 생활 환경 정돈'},
 {id:'myr-facility-worldtree_resonator',crew:'myr',facility:'worldtree_resonator',room:'garden',state:'observe',prop:'worldtree-spark',label:'공명 장치의 변화 관측'},
 ...Object.entries(facilities).map(([id,f])=>({id:`skuld-project-${id}`,crew:'skuld',facility:id,room:'workshop',state:'work',prop:'wrench-repair',label:`${f.name} 연구·조립`}))
];
export const jobsFor=(id,levels,project)=>facilityActions.filter(a=>a.crew===id&&(a.id.includes('-project-')?project?.id===a.facility:levels[a.facility]===1));
