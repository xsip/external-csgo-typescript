"use strict";
;
var ExternalFrontend = /** @class */ (function () {
    function ExternalFrontend() {
        var _this = this;
        this.handleSocketMessage = function (data) {
            var info = document.getElementById('info');
            if (info) {
                info.innerText = (data.currentMap);
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
    };
    ExternalFrontend.prototype.createSocketConnection = function () {
        var _this = this;
        var url = 'ws://localhost:8080';
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
        };
        connection.onmessage = function (e) {
            var d = JSON.parse(e.data);
            _this.handleSocketMessage(d);
        };
    };
    ExternalFrontend.prototype.drawPixel = function (x, y, r, g, b, a) {
        this.ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
        this.ctx.fillRect(x - 5, y - 5, 10, 10);
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
    return ExternalFrontend;
}());
var ext = new ExternalFrontend();
console.log('Running..');
window.onload = ext.bootstrap.bind(ext);
