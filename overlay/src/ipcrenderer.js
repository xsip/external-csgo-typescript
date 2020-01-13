var ipcRenderer = require('electron').ipcRenderer;
// ipcRenderer.sendSync('test', 'HALLO');
window.onfocus = function () {
    console.log("focus");
};
window.onblur = function () {
    console.log("blur");
};
window.onkeydown = function (e) {
    console.log(e.keyCode);
    ipcRenderer.send('keydown', e.keyCode);
};
ipcRenderer.on('ignoremouse', function (e, a) {
    document.getElementById('menu').style.display = a ? 'none' : 'block';
});
//# sourceMappingURL=ipcrenderer.js.map