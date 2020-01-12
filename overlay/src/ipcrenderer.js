const { ipcRenderer } = require('electron');
// ipcRenderer.sendSync('test', 'HALLO');
window.onfocus = function () {
    console.log("focus");
};
window.onblur = function () {
    console.log("blur");
};
window.onkeydown = (e) => {
    console.log(e.keyCode);
    ipcRenderer.send('keydown', e.keyCode);
};
ipcRenderer.on('ignoremouse', (e, a) => {
    document.getElementById('menu').style.display = a ? 'none' : 'block';
});
//# sourceMappingURL=ipcrenderer.js.map