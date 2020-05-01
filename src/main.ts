import {clientState, hackBase, radar} from './shared/declerations';

import * as fs from 'fs';
import {readBspFile} from './bspparser/bsp-parser';
import {Entity} from './game/entity/entity.interfaces';
import {SocketService} from "./network/socket/socket.service";


let radarEntries = [];
let espEntries = [];

const bspFile = readBspFile(fs.readFileSync("C:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive\\csgo\\maps\\de_dust2.bsp"));
const socket: SocketService = new SocketService();



const run = () => {
    console.log('WS Server started!');
    hackBase((entity: Entity, localEntity: Entity, entityLoopIndex: number) => {
        radarEntries.push({
            pos: radar.calculateRadarPositionForEntity(entity, localEntity, clientState.viewAngles),
            team: entity.team,
            isLocal: entityLoopIndex === clientState.localEntityIndex
        });
        /*
        espEntries.push({
            pos: ExtendedMath.worldToScreen(entity.headBoneOrigin, renderer.viewMatrix),
            team: entity.team,
            isLocal: entityLoopIndex === clientState.localEntityIndex
        });

        if (entity.team !== localEntity.team) {
            aimbot.playerIsInFov(entity, localEntity, clientState.viewAngles, (aimAngle: Vec3) => {
                if (entity.health > 0 && entity.health <= 100) {
                    let mouseClicked = true;
                    if (mouseClicked) {
                        clientState.viewAngles = aimAngle;
                    }
                }
            })
        }*/
    }, () => {
        socket.connections.map(ws => {
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
};

socket.startServer(run);
