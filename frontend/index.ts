interface Vec2 {
    x: number;
    y: number
}

interface RadarEntry {
    pos: Vec2;
    isLocal: boolean;
    team: number;
}

interface Data {
    radar: RadarEntry[]
    currentMap: string;
    radarSize: number;
    radarPos: Vec2;
}

class ExternalFrontend {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    radarSize: number = 0;
    radarPos: Vec2 = {x: -1, y: -1};

    constructor() {

    }

    bootstrap() {
        this.canvas = document.getElementById("radarCanvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.fillStyle = "#FF0000";
        this.canvas.style.border = '4px solid rgba(35,35,35,1)';

        this.createSocketConnection();


    }

    createSocketConnection() {
        const url: string = 'ws://192.168.8.125:8080';
        const connection: WebSocket = new WebSocket(url);
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
            const button: HTMLInputElement = document.getElementById('changeRadarSize') as HTMLInputElement;
            button.addEventListener('click', () => {
                connection.send(JSON.stringify({
                    radarSize: '' + (document.getElementById('radarSize') as HTMLInputElement).value,
                    radarPos: {
                        x: (document.getElementById('x') as HTMLInputElement).value,
                        y: (document.getElementById('y') as HTMLInputElement).value
                    }

                }));
            });
        };
        connection.onmessage = (e: MessageEvent) => {
            const d = JSON.parse(e.data);
            this.handleSocketMessage(d);
        }
    }

    handleSocketMessage = (data: Data) => {

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

    drawPixel(x: number, y: number, r: number, g: number, b: number, a: number) {
        this.ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        this.ctx.fillRect(x - 2.5, y - 2.5, 5, 5);
    }

    updateRadar(radarData: RadarEntry[]) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.drawRadarPoint(100 - 5, 100 - 5, 0, 255, 0, 255);
        for (let key in radarData) {
            if (radarData[key].isLocal) {
                this.drawPixel(radarData[key].pos.x, radarData[key].pos.y, 0, 255, 0, 255);
            } else {
                if (radarData[key].team === 2) {
                    this.drawPixel(radarData[key].pos.x, radarData[key].pos.y, 255, 0, 0, 255);
                } else if (radarData[key].team === 3) {
                    this.drawPixel(radarData[key].pos.x, radarData[key].pos.y, 0, 0, 255, 255);
                }
            }


        }
    }

    updateRadarSize(size: number) {
        this.radarSize = size;
        this.canvas.width = this.radarSize;
        this.canvas.height = this.radarSize;
        (document.getElementById('radarSize') as HTMLInputElement).value = '' + this.radarSize;
    }

    updateRadarPosition(pos: Vec2) {
        this.radarPos = pos;
        this.canvas.style.position = 'fixed';
        this.canvas.style.left = pos.x + 'px';
        this.canvas.style.top = pos.y + 'px';
        (document.getElementById('x') as HTMLInputElement).value = '' + this.radarPos.x;
        (document.getElementById('y') as HTMLInputElement).value = '' + this.radarPos.y;
    }
}

const ext: ExternalFrontend = new ExternalFrontend();
console.log('Running..');
window.onload = ext.bootstrap.bind(ext);
