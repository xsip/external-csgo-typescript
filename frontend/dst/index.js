class ExternalFrontend {
    constructor() {
        this.radarSize = 0;
        this.radarPos = { x: -1, y: -1 };
        this.handleSocketMessage = (data) => {
            const info = document.getElementById('info');
            if (info) {
                info.innerText = (data.currentMap);
            }
            if (data.radarSize !== this.radarSize) {
                this.updateRadarSize(data.radarSize);
            }
            if (data.radarPos.x !== this.radarPos.x || data.radarPos.y !== this.radarPos.y) {
                this.updateRadarPosition(data.radarPos);
            }
            this.updateRadar(data.radar);
        };
    }
    bootstrap() {
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.fillStyle = "#FF0000";
        this.canvas.style.border = '4px solid rgba(35,35,35,1)';
        this.createSocketConnection();
    }
    createSocketConnection() {
        const url = 'ws://192.168.8.125:8080';
        const connection = new WebSocket(url);
        console.log('connecting..');
        connection.onopen = () => {
            console.log('connected!');
        };
        connection.onerror = error => {
            const l = document.createElement('h1');
            l.innerText = 'ERROR CONNECTING!';
            document.body.appendChild(l);
            console.log(`WebSocket error: ${error}`);
        };
        connection.onopen = () => {
            connection.send('frontend connected');
            const button = document.getElementById('changeRadarSize');
            button.addEventListener('click', () => {
                connection.send(JSON.stringify({
                    radarSize: '' + document.getElementById('radarSize').value,
                    radarPos: {
                        x: document.getElementById('x').value,
                        y: document.getElementById('y').value
                    }
                }));
            });
        };
        connection.onmessage = (e) => {
            const d = JSON.parse(e.data);
            this.handleSocketMessage(d);
        };
    }
    drawPixel(x, y, r, g, b, a) {
        this.ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        this.ctx.fillRect(x - 2.5, y - 2.5, 5, 5);
    }
    updateRadar(radarData) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.drawPixel(100 - 5, 100 - 5, 0, 255, 0, 255);
        for (let key in radarData) {
            if (radarData[key].isLocal) {
                this.drawPixel(radarData[key].pos.x, radarData[key].pos.y, 0, 255, 0, 255);
            }
            else {
                if (radarData[key].team === 2) {
                    this.drawPixel(radarData[key].pos.x, radarData[key].pos.y, 255, 0, 0, 255);
                }
                else if (radarData[key].team === 3) {
                    this.drawPixel(radarData[key].pos.x, radarData[key].pos.y, 0, 0, 255, 255);
                }
            }
        }
    }
    updateRadarSize(size) {
        this.radarSize = size;
        this.canvas.width = this.radarSize;
        this.canvas.height = this.radarSize;
        document.getElementById('radarSize').value = '' + this.radarSize;
    }
    updateRadarPosition(pos) {
        this.radarPos = pos;
        this.canvas.style.position = 'fixed';
        this.canvas.style.left = pos.x + 'px';
        this.canvas.style.top = pos.y + 'px';
        document.getElementById('x').value = '' + this.radarPos.x;
        document.getElementById('y').value = '' + this.radarPos.y;
    }
}
const ext = new ExternalFrontend();
console.log('Running..');
window.onload = ext.bootstrap.bind(ext);
//# sourceMappingURL=index.js.map