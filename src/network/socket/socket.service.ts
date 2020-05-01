import * as _WebSocket from 'ws';
import {radar} from '../../shared/declerations';
import WebSocket = require("ws");


export class SocketService {

    private wss: WebSocket.Server;
    public connections: WebSocket[] = [];
    constructor() {

    }


    public startServer(afterStarting: () => void, port: number = 8080) {
        this.wss = new _WebSocket.Server({port});
        this.addConnectionListener(afterStarting);
    }

    public addConnectionListener = (afterAdding) => {

        this.wss.on('connection', ws => {

            ws.on('message', message => {
                console.log(`Received message => ${message}`);
                try {
                    this.handleRequest(JSON.parse(message + ''));
                } catch {

                }
            });
            this.connections.push(ws);

            ws.onclose = () => {
                this.onOverlayDisconnect(ws);
            };
        });
        afterAdding();
    };

    private handleRequest = (request: any) => {
        console.log(request);
        if (request.radarSize) {
            radar.setRadarSize(request.radarSize);
        }
        if (request.radarPos) {
            radar.setRadarPos(request.radarPos);
        }
    };

    private onOverlayDisconnect(ws: WebSocket) {
        this.connections = this.connections.filter(w => w != ws) as any;
        console.log('Overlay disconnected')
    }
}