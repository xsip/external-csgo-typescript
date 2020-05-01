// import "./debug-info/debug.info.element";
var ExternalFrontend = /** @class */ (function () {
    function ExternalFrontend() {
        var _this = this;
        this.radarSize = 0;
        this.radarPos = { x: -1, y: -1 };
        this.handleSocketMessage = function (data) {
            var info = document.getElementById('info');
            if (info) {
                info.innerText = (data.currentMap);
            }
            if (data.radarSize !== _this.radarSize) {
                _this.updateRadarSize(data.radarSize);
            }
            if (data.radarPos.x !== _this.radarPos.x || data.radarPos.y !== _this.radarPos.y) {
                _this.updateRadarPosition(data.radarPos);
            }
            _this.updateRadar(data.radar);
            _this.updateEsp(data.esp);
        };
    }
    ExternalFrontend.prototype.bootstrap = function () {
        this.setupRadarCanvas();
        this.setupEspCanvas();
        this.createSocketConnection();
        var info = document.getElementById('info');
        info.style.position = 'fixed';
        info.style.left = '20px';
        info.style.top = '30px';
    };
    ExternalFrontend.prototype.setupRadarCanvas = function () {
        this.radarCanvas = document.getElementById("radarCanvas");
        this.radarCtx = this.radarCanvas.getContext("2d");
        this.radarCtx.fillStyle = "#FF0000";
        this.radarCanvas.style.border = '4px solid rgba(35,35,35,1)';
    };
    ExternalFrontend.prototype.setupEspCanvas = function () {
        this.espCanvas = document.getElementById("espCanvas");
        this.espCtx = this.espCanvas.getContext("2d");
        this.espCanvas.style.width = '100%';
        this.espCanvas.style.height = '100%';
        this.espCanvas.style.border = '4px solid rgba(35,35,35,1)';
        this.espCtx.fillStyle = "#FF0000";
    };
    ExternalFrontend.prototype.createSocketConnection = function () {
        var _this = this;
        var url = 'ws://192.168.8.125:8080';
        var connection = new WebSocket(url);
        console.log('connecting..');
        connection.onopen = function () {
            console.log('connected!');
        };
        connection.onerror = function (error) {
            var l = document.createElement('h1');
            l.innerText = 'ERROR CONNECTING!';
            document.body.appendChild(l);
            console.log("WebSocket error: " + error);
        };
        connection.onopen = function () {
            connection.send('frontend connected');
            var button = document.getElementById('changeRadarSize');
            button.addEventListener('click', function () {
                connection.send(JSON.stringify({
                    radarSize: '' + document.getElementById('radarSize').value,
                    radarPos: {
                        x: document.getElementById('x').value,
                        y: document.getElementById('y').value
                    }
                }));
            });
        };
        connection.onmessage = function (e) {
            var d = JSON.parse(e.data);
            _this.handleSocketMessage(d);
        };
    };
    ExternalFrontend.prototype.drawRadarPoint = function (x, y, r, g, b, a) {
        this.radarCtx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
        this.radarCtx.fillRect(x - 2.5, y - 2.5, 5, 5);
    };
    ExternalFrontend.prototype.drawExpBox = function (x, y, r, g, b, a) {
        this.espCtx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
        this.espCtx.fillRect(x, y, 5, 5);
    };
    ExternalFrontend.prototype.updateRadar = function (radarData) {
        this.radarCtx.clearRect(0, 0, this.radarCanvas.width, this.radarCanvas.height);
        for (var key in radarData) {
            if (radarData[key].isLocal) {
                this.drawRadarPoint(radarData[key].pos.x, radarData[key].pos.y, 0, 255, 0, 255);
            }
            else {
                if (radarData[key].team === 2) {
                    this.drawRadarPoint(radarData[key].pos.x, radarData[key].pos.y, 255, 0, 0, 255);
                }
                else if (radarData[key].team === 3) {
                    this.drawRadarPoint(radarData[key].pos.x, radarData[key].pos.y, 0, 0, 255, 255);
                }
            }
        }
    };
    ExternalFrontend.prototype.posIsOnScreen = function (pos, width, height) {
        if (width === void 0) { width = 1280; }
        if (height === void 0) { height = 720; }
        return pos.x !== 0 && pos.y !== 0 && pos.x > 0 && pos.y > 0 && pos.x <= width && pos.y <= height;
    };
    ExternalFrontend.prototype.updateEsp = function (espData) {
        this.espCtx.clearRect(0, 0, this.espCanvas.width, this.espCanvas.height);
        for (var key in espData) {
            if (this.posIsOnScreen(espData[key].pos)) {
                // console.log(`${espData[key].pos.x} & ${espData[key].pos.y}`);
                if (espData[key].isLocal) {
                    // this.drawRadarPoint(espData[key].pos.x, espData[key].pos.y, 0, 255, 0, 255);
                }
                else {
                    if (espData[key].team === 2) {
                        this.drawExpBox(espData[key].pos.x, espData[key].pos.y, 255, 0, 0, 255);
                    }
                    else if (espData[key].team === 3) {
                        this.drawExpBox(espData[key].pos.x, espData[key].pos.y, 0, 0, 255, 255);
                    }
                }
            }
        }
    };
    ExternalFrontend.prototype.updateRadarSize = function (size) {
        this.radarSize = size;
        this.radarCanvas.width = this.radarSize;
        this.radarCanvas.height = this.radarSize;
        document.getElementById('radarSize').value = '' + this.radarSize;
    };
    ExternalFrontend.prototype.updateRadarPosition = function (pos) {
        this.radarPos = pos;
        this.radarCanvas.style.position = 'fixed';
        this.radarCanvas.style.left = pos.x + 'px';
        this.radarCanvas.style.top = pos.y + 'px';
        document.getElementById('x').value = '' + this.radarPos.x;
        document.getElementById('y').value = '' + this.radarPos.y;
    };
    return ExternalFrontend;
}());
var ext = new ExternalFrontend();
console.log('Running..');
window.onload = ext.bootstrap.bind(ext);
//# sourceMappingURL=index.js.map