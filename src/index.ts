import {aimbot, clientState, entityList, initHack, mT, radar, wsConnections} from './global';
import * as fs from "fs";
import {startWsServer} from "./websocket";
import {EntityResolver} from "./entityList";
import {Vec3} from "./calcs";

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
startWsServer(() => {
    console.log('WS Server started!');
    initHack('csgo.exe', (entity: EntityResolver, localEntity: EntityResolver, index: number) => {
        // const entityTeam: number = entity.m_iTeamNum(mT.int);
        // const localTeam: number = localEntity.m_iTeamNum(mT.int);
        const entityTeam: number = entityList.getPlayer(index).m_iTeamNum(mT.int);
        const localTeam: number = entityList.getLocalPlayer().m_iTeamNum(mT.int);
        res.push({
            pos: radar.calculateRadarPosition(index),
            team: entityTeam,
            isLocal: entityList.getPlayer(index).base === entityList.getLocalPlayer().base,
        });

        if(entityTeam !== localTeam) {
            aimbot.playerIsInFov(index,(aimAngle: Vec3) => {
                let mouseClicked = false;
                if(mouseClicked) {
                    clientState.resolver().set.dwClientState_ViewAngles(aimAngle, mT.vector3);
                }
            })
        }
    }, () => {

        wsConnections.map(ws => {
            ws.send(JSON.stringify({
                radar: res,
                currentMap: clientState.resolver().dwClientState_Map(mT.string),
                radarSize: radar.radarSize,
                radarPos: radar.frontendRadarPosition
            }));
        });

        res = [];
    });
});
