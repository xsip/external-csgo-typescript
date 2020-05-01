const {ipcRenderer} = require('electron');
// ipcRenderer.sendSync('test', 'HALLO');

window.onfocus = function() {
    console.log("focus")
};
window.onblur = function() {
    console.log("blur")
};
window.onkeydown = (e) => {
    console.log(e.keyCode);
    ipcRenderer.send('keydown', e.keyCode);
};

ipcRenderer.on('ignoremouse', (e, a) => {
    (document.getElementById('menu') as HTMLElement).style.display = a ? 'none': 'block';
});

ipcRenderer.on('resolution', (e, d: {w: number, h: number}) => {
    const esp = (document.getElementById('espCanvas') as HTMLCanvasElement);
    esp.width =d.w;
    esp.height =d.h;
    console.log(d);
});