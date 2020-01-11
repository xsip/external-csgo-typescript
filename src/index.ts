import {clientState, initHack, mT, radar} from './global';
import * as fs from "fs";
import {startWsServer} from "./websocket";
let res = [];
startWsServer((ws: WebSocket) => {
    console.log('WS Server started!');
    initHack('csgo.exe', (e,l, i) => {
        res.push(radar.calculateRadarPosition(i));
    }, () => {
        ws.send(JSON.stringify({
            radar: res,
            currentMap: clientState.resolver().dwClientState_Map(mT.string)
        }));
        // fs.writeFileSync('../frontend/pos.json', JSON.stringify(res), 'utf-8');
        res = [];
    });
});
