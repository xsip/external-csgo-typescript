import {initHack, radar} from './global';
import * as fs from "fs";
let res = {};

initHack('csgo.exe', (e,l, i) => {
    res[i] = radar.calculateRadarPosition(i);
}, () => {
    fs.writeFileSync('../frontend/pos.json', JSON.stringify(res), 'utf-8');
    res = {};
});