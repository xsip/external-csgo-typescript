interface Vec2 {
    x: number;
    y: number
}

interface Data {
    radar: Vec2[];
    currentMap: string;
}

class ExternalFrontend {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;

    constructor() {

    }

    bootstrap() {
        this.canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.fillStyle = "#FF0000";
        this.canvas.style.border = '4px solid rgba(35,35,35,1)';

        this.createSocketConnection();
    }

    createSocketConnection() {
        const url: string = 'ws://localhost:8080';
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
        this.updateRadar(data.radar);

    }

    drawPixel(x: number, y: number, r: number, g: number, b: number, a: number) {
        this.ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        this.ctx.fillRect(x - 5, y - 5, 10, 10);
    }

    updateRadar(radarData: Vec2[]) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawPixel(100 - 5, 100 - 5, 0, 255, 0, 255);
        for (let key in radarData) {
            this.drawPixel(radarData[key].x, radarData[key].y, 255, 0, 0, 255);
        }
    }
}

const ext: ExternalFrontend = new ExternalFrontend();
console.log('Running..');
window.onload = ext.bootstrap.bind(ext);