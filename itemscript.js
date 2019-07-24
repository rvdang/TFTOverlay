const remote = require("electron").remote;

const page = document.getElementById("page");

// 1x8 array of half-item counts
const inventory = [0, 0, 0, 0, 0, 0, 0, 0];
// 8x8 array of craftable items
const itemtable = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

const itemimages = [];

itemimages.push([document.getElementById("ie")]);
itemimages.push([
  document.getElementById("gunblade"),
  document.getElementById("deathcap")
]);
itemimages.push([
  document.getElementById("swordofthedivine"),
  document.getElementById("rageblade"),
  document.getElementById("rfc")
]);
itemimages.push([
  document.getElementById("spear"),
  document.getElementById("ludens"),
  document.getElementById("shiv"),
  document.getElementById("seraph")
]);
itemimages.push([
  document.getElementById("ga"),
  document.getElementById("locket"),
  document.getElementById("pd"),
  document.getElementById("fh"),
  document.getElementById("thornmail")
]);
itemimages.push([
  document.getElementById("bt"),
  document.getElementById("ionicspark"),
  document.getElementById("cursedblade"),
  document.getElementById("hush"),
  document.getElementById("swordbreaker"),
  document.getElementById("dragonclaw")
]);
itemimages.push([
  document.getElementById("zekes"),
  document.getElementById("morello"),
  document.getElementById("titanic"),
  document.getElementById("redemption"),
  document.getElementById("redbuff"),
  document.getElementById("zephyr"),
  document.getElementById("warmog")
]);
itemimages.push([
  document.getElementById("ghostblade"),
  document.getElementById("yuumi"),
  document.getElementById("bork"),
  document.getElementById("darkin"),
  document.getElementById("knightsvow"),
  document.getElementById("hurricane"),
  document.getElementById("mallet"),
  document.getElementById("fon")
]);


document.oncontextmenu = new Function("return false;");

document.getElementById("close-btn").addEventListener("click", function(e) {
  let window = remote.getCurrentWindow();
  window.close();
});

document.getElementById("minimize-btn").addEventListener("click", function(e) {
  let window = remote.getCurrentWindow();
  const itembreak = document.getElementById("itembreak");
  const pagebreak = document.getElementById("pagebreak");
  const btn = document.getElementById("minimize-btn");
  if (!itembreak) {
    page.style.backgroundImage = 'url("./assets/item-background.png")';
    window.setContentSize(450, 709);
    btn.style.content = 'url("./assets/minus.png")';

    const newitembreak = document.createElement("hr");
    newitembreak.id = "itembreak";
    newitembreak.size = 3;
    pagebreak.appendChild(newitembreak);
    return;
  }
  window.setContentSize(450, 120);
  btn.style.content = 'url("./assets/plus.png")';
  page.style.backgroundImage = 'url("./assets/minimized-items.png")';
  pagebreak.removeChild(itembreak);
});

function decrement(button) {
  const currentval = Number(button.parentElement.childNodes[2].nodeValue);
  if (currentval === 0) {
    return;
  }
  const index = Number(button.parentElement.id);
  decrementtable(index, inventory, itemtable, itemimages);
  // alert(inventory);
  // alert(itemtable);
  button.parentElement.childNodes[2].nodeValue = String(currentval - 1);
}

function increment(button) {
  const currentval = Number(button.parentElement.childNodes[2].nodeValue);

  if (currentval === 9) {
    return;
  }
  const index = Number(button.parentElement.id);
  incrementtable(index, inventory, itemtable, itemimages);
  // alert(inventory);
  // alert(itemtable);
  button.parentElement.childNodes[2].nodeValue = String(currentval + 1);
}

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
function incrementtable(item, currInv, compItems, itemimages) {
  for (let i = 0; i < item; i++) {
    itemimages[item][i].style.opacity = "1.0"
    if (currInv[i] == 0) {
      compItems[item][i] = -1;
    } else if (currInv[i] == 1) {
      compItems[item][i] = 1;
      itemimages[item][i].parentElement.style.opacity = "1.0"
    } else if (currInv[i] > compItems[item][i]) {
      compItems[item][i] += 1;
      itemimages[item][i].parentElement.style.opacity = "1.0"
    }
  }
  for (let j = item; j < 8; j++) {
    itemimages[j][item].style.opacity = "1.0"
    if (j == item) {
      if (currInv[j] == 0) {
        compItems[j][item] = -1;
      } else if (currInv[j] == 1) {
        compItems[j][item] = 1;
        itemimages[j][item].parentElement.style.opacity = "1.0"
      } else if (currInv[j] % 2 == 1) {
        compItems[j][item] += 1;
        itemimages[j][item].parentElement.style.opacity = "1.0"
      }
    } else {
      if (currInv[j] == 0) {
        compItems[j][item] = -1;
      } else if (currInv[j] == 1) {
        compItems[j][item] = 1;
        itemimages[j][item].parentElement.style.opacity = "1.0"
      } else if (currInv[j] > compItems[j][item]) {
        compItems[j][item] += 1;
        itemimages[j][item].parentElement.style.opacity = "1.0"
      }
    }
  }
  currInv[item] += 1;
}

// takes in an item index to decrement, your current
// inventory (1x8 array of half-items) and the 8x8 table of
// craftable items and updates your inventory and table accordingly
function decrementtable(item, currInv, compItems, itemimages) {
  const currentItemCount = currInv[item];
  for (let i = 0; i < item; i++) {
    const pairCount = compItems[item][i];
    const pair = itemimages[item][i]
    if (currentItemCount == 1 && pairCount == 1) {
      compItems[item][i] = -1;
      pair.parentElement.style.opacity = "0.4"
    } else if (currentItemCount == 1 && pairCount == -1) {
      compItems[item][i] = 0;
      pair.style.opacity = "0.4"
      pair.parentElement.style.opacity = "0.4"
    } else if (currentItemCount == pairCount) {
      compItems[item][i] -= 1;
    }
  }
  for (let j = item; j < 8; j++) {
    const pairCount = compItems[j][item];
    const pair = itemimages[j][item]
    if (j == item) {
      if (currentItemCount == 1) {
        compItems[j][item] = 0;
        pair.style.opacity = "0.4"
        pair.parentElement.style.opacity = "0.4"
      } else if (currInv[j] == 2) {
        compItems[j][item] = -1;
        pair.parentElement.style.opacity = "0.4"
      } else if (currInv[j] % 2 == 0) {
        compItems[j][item] -= 1;
      }
    } else {
      if (pairCount == -1 && currentItemCount == 1) {
        compItems[j][item] = 0;
        pair.style.opacity = "0.4"
        pair.parentElement.style.opacity = "0.4"
      } else if (currentItemCount == 1 && pairCount == -1) {
        compItems[j][item] = -1;
        pair.parentElement.style.opacity = "0.4"
      } else if (currentItemCount == pairCount) {
        compItems[j][item] -= 1;
      }
    }
  }
  currInv[item] -= 1;
}