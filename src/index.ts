import {clientState, entityList, initHack, mT, radar} from './global';
import * as fs from "fs";
import {startWsServer} from "./websocket";

interface Vec2 {
    x: number;
    y: number
}
interface Data {
    radar: {
        pos: Vec2;
        isLocal: boolean;
        team: number;
    };
    currentMap: string;
}

let res = [];
startWsServer((ws: WebSocket) => {
    console.log('WS Server started!');
    initHack('csgo.exe', (e, l, i) => {
        res.push({
            pos: radar.calculateRadarPosition(i),
            team: entityList.getPlayer(i).m_iTeamNum(mT.int),
            isLocal: entityList.getPlayer(i).base === entityList.getLocalPlayer().base,
        });
    }, () => {
        ws.send(JSON.stringify({
            radar: res,
            currentMap: clientState.resolver().dwClientState_Map(mT.string)
        }));
        res = [];
    });
});
