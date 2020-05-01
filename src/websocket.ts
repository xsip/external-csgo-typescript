import * as _WebSocket from 'ws';
import {radar, removeFromWsConnections, wsConnections} from "./global";

const wss = new _WebSocket.Server({port: 8080});


const handleRequest = (request: any) => {
    if (request.radarSize) {
        radar.setRadarSize(request.radarSize);
    }
    if (request.radarPos) {
        radar.setRadarPos(request.radarPos);
    }
};

export const onWebsocketConnection = (afterConnection: () => void) => {

    wss.on('connection', ws => {

        ws.on('message', message => {
            console.log(`Received message => ${message}`);
            try {
                handleRequest(JSON.parse(message + ''));
            } catch {

            }
        });
        wsConnections.push(ws);

        ws.onclose = () => {
            console.log('removing connection..');
            removeFromWsConnections(ws);
        };
    });
    afterConnection();
};