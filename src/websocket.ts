import * as _WebSocket from 'ws';
const wss = new _WebSocket.Server({ port: 8080 });



export const startWsServer = (afterConnection: (ws: WebSocket ) => void) => {

    wss.on('connection', ws => {

        ws.on('message', message => {
            console.log(`Received message => ${message}`)
        });
        afterConnection(ws);
    });
}