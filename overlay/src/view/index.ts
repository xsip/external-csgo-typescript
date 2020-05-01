// import "./debug-info/debug.info.element";

interface Vec2 {
    x: number;
    y: number
}

interface RenderData {
    pos: Vec2;
    isLocal: boolean;
    team: number;
}

interface Data {
    radar: RenderData[]
    esp: RenderData[];
    currentMap: string;
    radarSize: number;
    radarPos: Vec2;
}

class ExternalFrontend {
    radarCanvas: HTMLCanvasElement;
    radarCtx: CanvasRenderingContext2D | null;

    espCanvas: HTMLCanvasElement;
    espCtx: CanvasRenderingContext2D | null;
    radarSize: number = 0;
    radarPos: Vec2 = {x: -1, y: -1};

    constructor() {

    }

    bootstrap() {

        this.setupRadarCanvas();
        this.setupEspCanvas();

        this.createSocketConnection();

        const info = document.getElementById('info');
        info.style.position = 'fixed';
        info.style.left = '20px';
        info.style.top = '30px';

    }

    setupRadarCanvas() {
        this.radarCanvas = document.getElementById("radarCanvas") as HTMLCanvasElement;
        this.radarCtx = this.radarCanvas.getContext("2d");
        this.radarCtx.fillStyle = "#FF0000";
        this.radarCanvas.style.border = '4px solid rgba(35,35,35,1)';
    }

    setupEspCanvas() {
        this.espCanvas = document.getElementById("espCanvas") as HTMLCanvasElement;
        this.espCtx = this.espCanvas.getContext("2d");
        this.espCanvas.style.width = '100%';
        this.espCanvas.style.height = '100%';
        this.espCanvas.style.border = '4px solid rgba(35,35,35,1)';
        this.espCtx.fillStyle = "#FF0000";


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

        this.updateEsp(data.esp);

    };

    drawRadarPoint(x: number, y: number, r: number, g: number, b: number, a: number) {
        this.radarCtx.fillStyle = `rgba(${r},${g},${b},${a})`;
        this.radarCtx.fillRect(x - 2.5, y - 2.5, 5, 5);
    }

    drawExpBox(x: number, y: number, r: number, g: number, b: number, a: number) {
        this.espCtx.fillStyle = `rgba(${r},${g},${b},${a})`;
        this.espCtx.fillRect(x, y, 5, 5);
    }

    updateRadar(radarData: RenderData[]) {
        this.radarCtx.clearRect(0, 0, this.radarCanvas.width, this.radarCanvas.height);
        for (let key in radarData) {
            if (radarData[key].isLocal) {
                this.drawRadarPoint(radarData[key].pos.x, radarData[key].pos.y, 0, 255, 0, 255);
            } else {
                if (radarData[key].team === 2) {
                    this.drawRadarPoint(radarData[key].pos.x, radarData[key].pos.y, 255, 0, 0, 255);
                } else if (radarData[key].team === 3) {
                    this.drawRadarPoint(radarData[key].pos.x, radarData[key].pos.y, 0, 0, 255, 255);
                }
            }


        }
    }

    posIsOnScreen(pos: Vec2, width = 1280, height = 720) {
        return pos.x !== 0 && pos.y !== 0 && pos.x > 0 && pos.y > 0 && pos.x <= width && pos.y <= height;
    }
    updateEsp(espData: RenderData[]) {
        this.espCtx.clearRect(0, 0,this.espCanvas.width,this.espCanvas.height);
        for (let key in espData) {
            if (this.posIsOnScreen(espData[key].pos)) {
                // console.log(`${espData[key].pos.x} & ${espData[key].pos.y}`);


            if (espData[key].isLocal) {
                // this.drawRadarPoint(espData[key].pos.x, espData[key].pos.y, 0, 255, 0, 255);
            } else {
                if (espData[key].team === 2) {
                    this.drawExpBox(espData[key].pos.x, espData[key].pos.y, 255, 0, 0, 255);
                } else if (espData[key].team === 3) {
                    this.drawExpBox(espData[key].pos.x, espData[key].pos.y, 0, 0, 255, 255);
                }
            }

            }
        }
    }

    updateRadarSize(size: number) {
        this.radarSize = size;
        this.radarCanvas.width = this.radarSize;
        this.radarCanvas.height = this.radarSize;
        (document.getElementById('radarSize') as HTMLInputElement).value = '' + this.radarSize;
    }

    updateRadarPosition(pos: Vec2) {
        this.radarPos = pos;
        this.radarCanvas.style.position = 'fixed';
        this.radarCanvas.style.left = pos.x + 'px';
        this.radarCanvas.style.top = pos.y + 'px';
        (document.getElementById('x') as HTMLInputElement).value = '' + this.radarPos.x;
        (document.getElementById('y') as HTMLInputElement).value = '' + this.radarPos.y;
    }
}

const ext: ExternalFrontend = new ExternalFrontend();
console.log('Running..');
window.onload = ext.bootstrap.bind(ext);
