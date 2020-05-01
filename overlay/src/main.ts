import {app, BrowserWindow, globalShortcut} from 'electron';
import {IRect, User32} from "./user32";
require('electron-reload')(__dirname);
let ignoreMouse: boolean = false;
const  createWindow = async () => {


    const user32: User32 = new User32();
    let data = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    };
    while(data.left === 0 && data.top === 0) {
        const rect = user32.getWindowRect('Counter-Strike: Global Offensive');
        data = {
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom,
        };
    }
    console.log(data);
    const opts = {
        transparent: true,
        frame: false,
        width: data.right - data.left,
        height: data.bottom - data.top,
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
    let win = new BrowserWindow(opts as any);
    win.setIgnoreMouseEvents(ignoreMouse);
    win.webContents.send('ignoremouse', ignoreMouse);
    await win.loadFile('src/view/index.html');

    globalShortcut.register('insert', () => {
        ignoreMouse = !ignoreMouse;
        win.setIgnoreMouseEvents(ignoreMouse);
        win.webContents.send('ignoremouse', ignoreMouse)
    });
    console.log({
        left: data.left,
        top: data.top,
    });
    setTimeout(() => {
        win.setPosition(parseInt('' + data.left, 0), parseInt('' + data.top, 0),true);
        win.webContents.send('resolution', {w: data.right - data.left, h: data.bottom - data.top,});
    }, 2000);

}
    app.on('ready', createWindow);

