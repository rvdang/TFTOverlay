const remote = require('electron').remote;

document.oncontextmenu = new Function("return false;");

document.getElementById("close-btn").addEventListener("click", function (e) {
    var window = remote.getCurrentWindow();
    window.close();
}); 