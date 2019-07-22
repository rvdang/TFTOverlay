const remote = require('electron').remote;

document.oncontextmenu = new Function("return false;");

document.getElementById("close-btn").addEventListener("click", function (e) {
    var window = remote.getCurrentWindow();
    window.close();
}); 

function minimize(){
    if (!document.getElementById("itembreak")){
        return
    }
    var window = remote.getCurrentWindow();
    window.setSize(369, 93, false);
    const page = document.getElementById("page")
    page.style.backgroundImage = 'url("./assets/minimized-items.png")'
    page.removeChild(document.getElementById("itembreak"))
}

function maximize(){
    if (document.getElementById("itembreak")){
        return
    }
    var window = remote.getCurrentWindow();
    window.setSize(369, 704, false);
    const page = document.getElementById("page")
    page.style.backgroundImage = 'url("./assets/item-background.png")'
    const pagebreak = document.createElement('hr');
    pagebreak.id = "itembreak"
    pagebreak.size = 3
    pagebreak.noShade = true
    pagebreak.color = "#E1C368"
    pagebreak.width = "352px"
    page.appendChild(pagebreak)
}

// document.getElementById("minimize-btn").addEventListener("click", function (e) {
//     var window = remote.getCurrentWindow();
//     // window.setSize(369, 78, true);
//     // alert(document.getElementById("page").style.backgroundImage);
//     const page = document.getElementById("page")
//     page.style.backgroundImage = 'url("./assets/minimized-items.png")'
//     page.removeChild(document.getElementById("itembreak"))
// }); 