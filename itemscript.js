var $ = require("jquery");
const remote = require("electron").remote;

const page = document.getElementById("page");

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
  decrementtable(index, inventory, itemtable, itemimages, baseitemimages);
  button.parentElement.childNodes[2].nodeValue = String(currentval - 1);
}

function increment(button) {
  const currentval = Number(button.parentElement.childNodes[2].nodeValue);

  if (currentval === 9) {
    return;
  }
  const index = Number(button.parentElement.id);
  incrementtable(index, inventory, itemtable, itemimages, baseitemimages);
  button.parentElement.childNodes[2].nodeValue = String(currentval + 1);
}

function reset(currInv, allitems) {
  currInv = new Array(8).fill(0);
  allitems = Array.from(Array(8), _ => Array(8).fill(0));
  return [currInv, allitems];
}

function incrementtable(item, currInv, compItems, itemimages, baseitemimages) {
  setAllCraftable(baseitemimages[item]);
  for (let i = 0; i < item; i++) {
    pair = itemimages[item][i];
    if (currInv[i] == 0) {
      compItems[item][i] = -1;
      setCarousel(pair);
    } else if (currInv[i] >= 1 && currInv[item] == 0) {
      compItems[item][i] = 1;
      setCraftable(pair, 1);
    } else if (currInv[i] > compItems[item][i]) {
      compItems[item][i] += 1;
      setCraftable(pair, compItems[item][i]);
    }
  }
  for (let j = item; j < 8; j++) {
    pair = itemimages[j][item];
    if (j == item) {
      if (currInv[j] == 0) {
        compItems[j][item] = -1;
        setCarousel(pair);
      } else if (currInv[j] == 1) {
        compItems[j][item] = 1;
        setCraftable(pair, 1);
      } else if (currInv[j] % 2 == 1) {
        compItems[j][item] += 1;
        setCraftable(pair, compItems[j][item]);
      }
    } else {
      if (currInv[j] == 0) {
        compItems[j][item] = -1;
        setCarousel(pair);
      } else if (currInv[j] >= 1 && currInv[item] == 0) {
        compItems[j][item] = 1;
        setCraftable(pair, 1);
      } else if (currInv[j] > compItems[j][item]) {
        compItems[j][item] += 1;
        setCraftable(pair, compItems[j][item]);
      }
    }
  }
  currInv[item] += 1;
}

// takes in an item index to decrement, your current
// inventory (1x8 array of half-items) and the 8x8 table of
// craftable items and updates your inventory and table accordingly
function decrementtable(item, currInv, compItems, itemimages, baseitemimages) {
  const currentItemCount = currInv[item];
  if (currentItemCount === 1) {
    setAllUncraftable(baseitemimages[item]);
  }
  for (let i = 0; i < item; i++) {
    const pairCount = compItems[item][i];
    const pair = itemimages[item][i];
    if (currentItemCount == 1 && pairCount >= 1) {
      compItems[item][i] = -1;
      setCarousel(pair);
    } else if (currentItemCount == 1 && pairCount == -1) {
      compItems[item][i] = 0;
      setUncraftable(pair);
    } else if (currentItemCount == pairCount) {
      compItems[item][i] -= 1;
      setCraftable(pair, compItems[item][i]);
    }
  }
  for (let j = item; j < 8; j++) {
    const pairCount = compItems[j][item];
    const pair = itemimages[j][item];
    if (j == item) {
      if (currentItemCount == 1) {
        compItems[j][item] = 0;
        setUncraftable(pair);
      } else if (currInv[j] == 2) {
        compItems[j][item] = -1;
        setCarousel(pair);
      } else if (currInv[j] % 2 == 0) {
        compItems[j][item] -= 1;
        setCraftable(pair, compItems[j][item]);
      }
    } else {
      if (currentItemCount == 1 && pairCount >= 1) {
        compItems[j][item] = -1;
        setCarousel(pair);
      } else if (currentItemCount == 1 && pairCount == -1) {
        compItems[j][item] = 0;
        setUncraftable(pair);
      } else if (currentItemCount == pairCount) {
        compItems[j][item] -= 1;
        setCraftable(pair, compItems[j][item]);
      }
    }
  }
  currInv[item] -= 1;
}

function setCraftable(pair, number) {
  pair.style.backgroundImage = 'url("./assets/fullicons/' + pair.id + '.png")';
  if(number){
    pair.innerHTML = String(number)
  }
}

function setCarousel(pair) {
  pair.style.backgroundImage = 'url("./assets/frostedicons/' + pair.id + '.png")';
  pair.innerHTML = ""
}

function setUncraftable(pair) {
  pair.style.backgroundImage = 'url("./assets/dimicons/' + pair.id + '.png")';
  pair.innerHTML = ""
}

function setAllCraftable(pairlist) {
  for (const pair of pairlist) {
    setCraftable(pair);
  }
}

function setAllUncraftable(pairlist) {
  for (const pair of pairlist) {
    setUncraftable(pair);
  }
}

function incDecCounter(index, inc) {
  counter = document.getElementById(String(index)).childNodes[2];
  currentval = Number(counter.nodeValue);
  incdec = inc ? 1 : -1;
  counter.nodeValue = String(currentval + incdec);
}

function craftItem(pair) {
  if (pair.style.backgroundImage != 'url("./assets/fullicons/' + pair.id + '.png")') {
    return;
  }
  row =
    $(pair)
      .closest("tr")
      .index() - 1;
  col =
    $(pair)
      .closest("td")
      .index() - 1;
  if (!addItemToList(pair, row, col)) {
    return;
  }
  decrementtable(row, inventory, itemtable, itemimages, baseitemimages);
  decrementtable(col, inventory, itemtable, itemimages, baseitemimages);
  incDecCounter(row, false);
  incDecCounter(col, false);
}

function addItemToList(pair, row, col) {
  for (let i = 0; i < 2; i++) {
    for (let k = 0; k < 8; k++) {
      if (craftedItems[i][k].style.backgroundImage) {
        continue;
      }
      craftedItems[i][k].style.backgroundImage =
        'url("./assets/fullicons/' + pair.id + '.png")';
      craftedItems[i][k].value = String(row) + String(col);
      return true;
    }
  }
  return false;
}

function removeFromList(td) {
  if (!td.value) {
    return;
  }
  row = Number(td.value[0]);
  col = Number(td.value[1]);
  if (row === col && inventory[row] >=8){
    return
  }
  if (inventory[row] >= 9 || inventory[col >= 9]){
    return
  }
  incrementtable(row, inventory, itemtable, itemimages, baseitemimages);
  incrementtable(col, inventory, itemtable, itemimages, baseitemimages);
  td.value = null;
  td.style.backgroundImage = null;
  incDecCounter(row, true);
  incDecCounter(col, true);
  shiftCraftedList();
}

function shiftCraftedList() {
  let currentItem;
  let nextItem;
  for (let k = 0; k < 7; k++) {
    currentItem = craftedItems[0][k];
    if (currentItem.style.backgroundImage) {
      continue;
    }
    nextItem = craftedItems[0][k + 1];
    currentItem.style.backgroundImage = nextItem.style.backgroundImage;
    nextItem.style.backgroundImage = null;
    currentItem.value = nextItem.value;
    nextItem.value = null;
  }
  currentItem = craftedItems[0][7];
  if (!currentItem.style.backgroundImage) {
    nextItem = craftedItems[1][0];
    currentItem.style.backgroundImage = nextItem.style.backgroundImage;
    nextItem.style.backgroundImage = null;
    currentItem.value = nextItem.value;
    nextItem.value = null;
  }
  for (let k = 0; k < 7; k++) {
    currentItem = craftedItems[1][k];
    if (currentItem.style.backgroundImage) {
      continue;
    }
    nextItem = craftedItems[1][k + 1];
    currentItem.style.backgroundImage = nextItem.style.backgroundImage;
    nextItem.style.backgroundImage = null;
    currentItem.value = nextItem.value;
    nextItem.value = null;
  }
}

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
  document.getElementById("divine"),
  document.getElementById("rageblade"),
  document.getElementById("rfc")
]);
itemimages.push([
  document.getElementById("spear"),
  document.getElementById("luden"),
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
  document.getElementById("ionic spark"),
  document.getElementById("cursed blade"),
  document.getElementById("hush"),
  document.getElementById("sword breaker"),
  document.getElementById("dragon claw")
]);
itemimages.push([
  document.getElementById("zekes"),
  document.getElementById("morello"),
  document.getElementById("titanic"),
  document.getElementById("redemption"),
  document.getElementById("red"),
  document.getElementById("zephyr"),
  document.getElementById("warmog")
]);
itemimages.push([
  document.getElementById("ghostblade"),
  document.getElementById("yuumi"),
  document.getElementById("bork"),
  document.getElementById("darkin"),
  document.getElementById("kv"),
  document.getElementById("hurricane"),
  document.getElementById("mallet"),
  document.getElementById("fon")
]);

baseitemimages = [];
baseitemimages.push([
  document.getElementById("bf1"),
  document.getElementById("bf2")
]);
baseitemimages.push([
  document.getElementById("rod1"),
  document.getElementById("rod2")
]);
baseitemimages.push([
  document.getElementById("recurve1"),
  document.getElementById("recurve2")
]);
baseitemimages.push([
  document.getElementById("tear1"),
  document.getElementById("tear2")
]);
baseitemimages.push([
  document.getElementById("vest1"),
  document.getElementById("vest2")
]);
baseitemimages.push([
  document.getElementById("cloak1"),
  document.getElementById("cloak2")
]);
baseitemimages.push([
  document.getElementById("giants belt1"),
  document.getElementById("giants belt2")
]);
baseitemimages.push([
  document.getElementById("spatula1"),
  document.getElementById("spatula2")
]);

for (const itemrow of baseitemimages) {
  for (const item of itemrow) {
    item.id = item.id.substring(0, item.id.length - 1);
    setUncraftable(item);
  }
}

for (const itemrow of itemimages) {
  for (const item of itemrow) {
    setUncraftable(item);
    item.setAttribute("onclick", "craftItem(this)");
  }
}

const craftedItems = [[], []];
for (let i = 0; i < 2; i++) {
  for (let k = 0; k < 8; k++) {
    const id = "crafted" + String(i) + String(k);
    const td = document.getElementById(id);
    td.setAttribute("onclick", "removeFromList(this)");
    craftedItems[i].push(td);
  }
}
