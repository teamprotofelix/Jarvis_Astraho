import {readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
function visit(directory){for(const item of readdirSync(directory,{withFileTypes:true})){const path=`${directory}/${item.name}`;if(item.isDirectory())visit(path);else if(path.endsWith('.js'))execFileSync(process.execPath,['--check',path],{stdio:'inherit'});}}
visit('js');execFileSync(process.execPath,['--check','sw.js'],{stdio:'inherit'});
