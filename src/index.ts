import {aimbot,  hackBase, radar, wsConnections} from './global';
import {onWebsocketConnection} from './websocket';

import {Vec3} from './extended.math';
import * as fs from 'fs';
import {readBspFile} from './bspparser/bsp-parser';
import {Entity} from './entity';
import {ClientState} from "./clientState";


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

let radarEntries = [];
let espEntries = [];
let currentMap: string;
const bspFile = readBspFile(fs.readFileSync("C:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive\\csgo\\maps\\de_dust2.bsp"));

onWebsocketConnection(() => {
    console.log('WS Server started!');
    hackBase((entity: Entity, localEntity: Entity, localViewAngles:Vec3, entityLoopIndex: number, clientState: ClientState) => {
        radarEntries.push({
            pos: radar.calculateRadarPositionForEntity(entity, localEntity, localViewAngles),
            team: entity.team,
            isLocal: entityLoopIndex === clientState.localEntityIndex
        });

        espEntries.push({
            pos: radar.w2s2(entity.headBoneOrigin),
            team: entity.team,
            isLocal: entityLoopIndex === clientState.localEntityIndex
        });

        if (entity.team !== localEntity.team) {
            aimbot.playerIsInFov(entity, localEntity,localViewAngles, (aimAngle: Vec3) => {
                if (entity.health > 0 && entity.health <= 100) {
                    let mouseClicked = true;
                    if (mouseClicked) {
                        localViewAngles = aimAngle;
                    }
                }
            })
        }
    }, (clientState: ClientState) => {
        wsConnections.map(ws => {
            ws.send(JSON.stringify({
                radar: radarEntries,
                esp: espEntries,
                currentMap: clientState.currentMap,
                radarSize: radar.radarSize,
                radarPos: radar.frontendRadarPosition
            }));
        });
        radarEntries = [];
        espEntries = [];
    });
});
