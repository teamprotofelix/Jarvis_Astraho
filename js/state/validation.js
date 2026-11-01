export const reject=message=>{throw Error(message);};
export function object(value,fields,optional=[]){if(!value||typeof value!=='object'||Array.isArray(value)||![Object.prototype,null].includes(Object.getPrototypeOf(value)))reject('객체 형식 오류');for(const k of Object.keys(value))if(!fields.includes(k)&&!optional.includes(k))reject(`허용되지 않는 키: ${k}`);for(const k of fields)if(!Object.hasOwn(value,k))reject(`누락된 키: ${k}`);}
export function number(value,min,max,integer=false){if(!Number.isFinite(value)||value<min||value>max||integer&&!Number.isInteger(value))reject('수치 범위 오류');}
export function oneOf(value,values){if(!values.includes(value))reject('알 수 없는 식별자');}
export function array(value,max){if(!Array.isArray(value)||value.length>max)reject('목록 상한 오류');}
export function unique(value){if(new Set(value).size!==value.length)reject('중복 식별자');}
