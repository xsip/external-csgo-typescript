"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const user32_1 = require("./user32");
let ignoreMouse = false;
function createWindow() {
    const user32 = new user32_1.User32();
    const rect = user32.getWindowRect('Counter-Strike: Global Offensive');
    const data = {
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
    };
    console.log(data);
    // win.setPosition(rect.left, rect.top, true);
    // win.setSize(rect.right - rect.left, rect.bottom -rect.top, true);
    // Erstelle das Browser-Fenster.
    const opts = {
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
    let win = new electron_1.BrowserWindow(opts);
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
    win.loadFile('src/view/index.html');
    electron_1.globalShortcut.register('insert', () => {
        ignoreMouse = !ignoreMouse;
        win.setIgnoreMouseEvents(ignoreMouse);
        win.webContents.send('ignoremouse', ignoreMouse);
    });
    console.log({
        left: data.left,
        top: data.top,
    });
    setTimeout(() => {
        win.setPosition(parseInt('' + data.left, 0), parseInt('' + data.top, 0), true);
    }, 1000);
}
electron_1.app.on('ready', createWindow);
//# sourceMappingURL=main.js.map