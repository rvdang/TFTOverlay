const remote = require('electron').remote;

// var window = remote.getCurrentWindow();

document.oncontextmenu = new Function("return false;");

document.getElementById("close-btn").addEventListener("click", function (e) {
  let window = remote.getCurrentWindow();  
  window.close();
}); 

function minimize(){
    if (!document.getElementById("itembreak")){
        return
    }
    const page = document.getElementById("page")
    page.style.height = "120px"
    let window = remote.getCurrentWindow();
    window.setSize(450, 120, true);

    
    page.style.backgroundImage = 'url("./assets/minimized-items.png")'
    document.getElementById("pagebreak").removeChild(document.getElementById("itembreak"))
}

function maximize(){
    if (document.getElementById("itembreak")){
      return
    }
    document.getElementById("page").style.height = "709px";
    let window = remote.getCurrentWindow();
    window.setSize(450, 709, true);

    document.getElementById("page").style.backgroundImage = 'url("./assets/item-background.png")'

    const pagebreak = document.createElement('hr');
    pagebreak.id = "itembreak"
    pagebreak.size = 3
    document.getElementById("pagebreak").appendChild(pagebreak)
}

function decrement(button){
  const currentval = Number(button.parentElement.childNodes[2].nodeValue)
  if (currentval === 0){
    return;
  }
  button.parentElement.childNodes[2].nodeValue = String(currentval - 1)
}

function increment(button){
  const currentval = Number(button.parentElement.childNodes[2].nodeValue)
  
  if (currentval === 9){
    return;
  }
  button.parentElement.childNodes[2].nodeValue = String(currentval + 1)
}

// 1x8 array of half-item counts
var inventory;
// 8x8 array of craftable items
var allitems;

// takes in your current inventory (1x8 array of half-items) 
// and the 8x8 table of craftable items and sets their contents
// to 0, returning a list containing both objects
function reset(currInv, allitems) {
  currInv = new Array(8).fill(0);
  allitems = Array.from(Array(8), _ => Array(8).fill(0));
  return [currInv, allitems];
}

// takes in an item index to increment, your current 
// inventory (1x8 array of half-items) and the 8x8 table of 
// craftable items and updates your inventory and table accordingly
function incrementtable(item, currInv, compItems) {
  for (i = 0; i < item; i++) {
    if (currInv[i] == 0) {
      compItems[item][i] = -1;
    } else if (currInv[i] > compItems[i][item]) {
      compItems[item][i] += 1;
    }
  }
  for (j = item; j < 8; j++) {
    if (j == item) {
      if (currInv[j] == 0) {
        compItems[j][item] = -1;
      } else if (currInv[j] == 1) {
        compItems[j][item] = 1;
      } else if (currInv[j]%2 == 1) {
        compItems[j][item] += 1
      }
    } else if (currInv[j] == 0) {
      compItems[j][item] = -1;
    } else if (currInv[j] > compItems[j][item]) {
      compItems[j][item] += 1;
    }
  }
  currInv[item] += 1
  return [currInv, allitems];
}

// takes in an item index to decrement, your current 
// inventory (1x8 array of half-items) and the 8x8 table of 
// craftable items and updates your inventory and table accordingly
function decrementtable(item, currInv, compItems) {
  for (i = 0; i < item; i++) {
    if (currInv[item] == 1 && compItems[item][i] == 1) {
      compItems[item][i] = -1;
    } else if (currInv[item] == 1 && compItems[item][i] == -1) {
      compItems[item][i] = 0;
    } else if (currInv[item] == compItems[item][i]) {
      compItems[item][i] -= 1;
    }
  }
  for (j = item; j < 8; j++) {
    if (j == item) {
      if (compItems[j][item] == -1 && currInv[item] == 1) {
        compItems[j][item] = 0;
      } else if (currInv[j] <= 2) {
        compItems[j][item] = -1;
      } else if (currInv[j]%2 == 0) {
        compItems[j][item] -= 1
      }
    } else if (compItems[j][item] == -1 && currInv[item] == 1) {
      compItems[j][item] = 0;
    } else if (currInv[item] == 1) {
      compItems[j][item] = -1;
    } else if (currInv[item] == compItems[j][item]) {
      compItems[j][item] -= 1;
    }
  }
  currInv[item] -= 1
  return [currInv, compItems]
}


// document.getElementById("minimize-btn").addEventListener("click", function (e) {
//     var window = remote.getCurrentWindow();
//     // window.setSize(369, 78, true);
//     // alert(document.getElementById("page").style.backgroundImage);
//     const page = document.getElementById("page")
//     page.style.backgroundImage = 'url("./assets/minimized-items.png")'
//     page.removeChild(document.getElementById("itembreak"))
// }); 