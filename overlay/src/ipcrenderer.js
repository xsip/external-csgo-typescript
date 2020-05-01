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
ipcRenderer.on('resolution', function (e, d) {
    var esp = document.getElementById('espCanvas');
    esp.width = d.w;
    esp.height = d.h;
    console.log(d);
});
//# sourceMappingURL=ipcrenderer.js.map