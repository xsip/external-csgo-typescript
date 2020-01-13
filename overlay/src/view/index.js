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
        };
    }
    ExternalFrontend.prototype.bootstrap = function () {
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.fillStyle = "#FF0000";
        this.canvas.style.border = '4px solid rgba(35,35,35,1)';
        this.createSocketConnection();
        var info = document.getElementById('info');
        info.style.position = 'fixed';
        info.style.left = '20px';
        info.style.top = '30px';
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
    ExternalFrontend.prototype.drawPixel = function (x, y, r, g, b, a) {
        this.ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
        this.ctx.fillRect(x - 2.5, y - 2.5, 5, 5);
    };
    ExternalFrontend.prototype.updateRadar = function (radarData) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.drawPixel(100 - 5, 100 - 5, 0, 255, 0, 255);
        for (var key in radarData) {
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
    };
    ExternalFrontend.prototype.updateRadarSize = function (size) {
        this.radarSize = size;
        this.canvas.width = this.radarSize;
        this.canvas.height = this.radarSize;
        document.getElementById('radarSize').value = '' + this.radarSize;
    };
    ExternalFrontend.prototype.updateRadarPosition = function (pos) {
        this.radarPos = pos;
        this.canvas.style.position = 'fixed';
        this.canvas.style.left = pos.x + 'px';
        this.canvas.style.top = pos.y + 'px';
        document.getElementById('x').value = '' + this.radarPos.x;
        document.getElementById('y').value = '' + this.radarPos.y;
    };
    return ExternalFrontend;
}());
var ext = new ExternalFrontend();
console.log('Running..');
window.onload = ext.bootstrap.bind(ext);
//# sourceMappingURL=index.js.map