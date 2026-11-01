import {createMissions,expeditionDTO} from '../missions/model.js';
import {reduceMission} from '../missions/reducer.js';
export function createCampaign(){let missions=createMissions();return {
 get missions(){return missions;},get revision(){return missions.revision;},get dto(){return expeditionDTO(missions);},
 command(event){missions=reduceMission(missions,event);},
 tick(dt,distance){missions=reduceMission(missions,{type:'tick',dt,distance});},
 snapshot(){return {missions:structuredClone(missions)};},restore(state){missions=structuredClone(state.missions);}
};}
