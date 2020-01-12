import {app, BrowserWindow, ipcMain, globalShortcut} from 'electron';

let ignoreMouse: boolean = false;

function createWindow() {
    // Erstelle das Browser-Fenster.
    const opts = {
        transparent: true,
        frame: false,
        width: 400,
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

    globalShortcut.register('insert', () => {
        ignoreMouse = !ignoreMouse;
        win.setIgnoreMouseEvents(ignoreMouse);
        win.webContents.send('ignoremouse', ignoreMouse)
    })
}

app.on('ready', createWindow);