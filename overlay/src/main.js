"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var user32_1 = require("./user32");
require('electron-reload')(__dirname);
var ignoreMouse = false;
var createWindow = function () { return __awaiter(void 0, void 0, void 0, function () {
    var user32, rect, data, opts, win;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user32 = new user32_1.User32();
                rect = user32.getWindowRect('Counter-Strike: Global Offensive');
                data = {
                    left: rect.left,
                    right: rect.right,
                    top: rect.top,
                    bottom: rect.bottom,
                };
                console.log(data);
                opts = {
                    transparent: true,
                    frame: false,
                    width: data.right - data.left,
                    height: data.bottom - data.top,
                    // x: rect.left,
                    // y: rect.top,
                    backgroundColor: "#00ffffff",
                    hasShadow: false,
                    alwaysOnTop: true,
                    resizable: false,
                    titleBarStyle: "hidden",
                    webPreferences: {
                        nodeIntegration: true, nodeIntegrationInWorker: true,
                        preload: __dirname + '/ipcrenderer.js',
                    },
                };
                win = new electron_1.BrowserWindow(opts);
                win.setIgnoreMouseEvents(ignoreMouse);
                win.webContents.send('ignoremouse', ignoreMouse);
                // und lade die index.html der App.
                // win.loadURL('http://192.168.8.125:8081/');
                /*ipcMain.on('keydown', function (event, arg) {
                    // console.log('GOT TEST MESSAGE!');
            
                    if (arg === 45) {
                        ignoreMouse = !ignoreMouse;
                        win.setIgnoreMouseEvents(ignoreMouse);
                    }
                    win.webContents.send('ignoremouse', ignoreMouse)
                });*/
                return [4 /*yield*/, win.loadFile('src/view/index.html')];
            case 1:
                // und lade die index.html der App.
                // win.loadURL('http://192.168.8.125:8081/');
                /*ipcMain.on('keydown', function (event, arg) {
                    // console.log('GOT TEST MESSAGE!');
            
                    if (arg === 45) {
                        ignoreMouse = !ignoreMouse;
                        win.setIgnoreMouseEvents(ignoreMouse);
                    }
                    win.webContents.send('ignoremouse', ignoreMouse)
                });*/
                _a.sent();
                electron_1.globalShortcut.register('insert', function () {
                    ignoreMouse = !ignoreMouse;
                    win.setIgnoreMouseEvents(ignoreMouse);
                    win.webContents.send('ignoremouse', ignoreMouse);
                });
                console.log({
                    left: data.left,
                    top: data.top,
                });
                setTimeout(function () {
                    win.setPosition(parseInt('' + data.left, 0), parseInt('' + data.top, 0), true);
                    win.webContents.send('resolution', { w: data.right - data.left, h: data.bottom - data.top, });
                }, 2000);
                return [2 /*return*/];
        }
    });
}); };
// setTimeout(() => {
electron_1.app.on('ready', createWindow);
// },2000);
//# sourceMappingURL=main.js.map