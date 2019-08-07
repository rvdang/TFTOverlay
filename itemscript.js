var $ = require("jquery");
const remote = require("electron").remote;

const page = document.getElementById("page");

document.oncontextmenu = new Function("return false;");

document.getElementById("close-btn").addEventListener("click", function(e) {
  let window = remote.getCurrentWindow();
  window.close();
});

document.getElementById("reset-btn").addEventListener("click", reset);

document.getElementById("maximize-btn").addEventListener("click", function(e) {
  let window = remote.getCurrentWindow();
  // const itembreak = document.getElementById("itembreak");
  // const pagebreak = document.getElementById("pagebreak");
  const btn = document.getElementById("maximize-btn");

  if (page.style.backgroundImage !== 'url("./assets/item-background.png")') {
		page.style.backgroundImage = 'url("./assets/item-background.png")';
		window.setContentSize(375, 579);
		btn.style.content = 'url("./assets/minus.png")';

		// const newitembreak = document.createElement("hr");
	  // newitembreak.id = "itembreak";
	  // newitembreak.size = 3;
	  // pagebreak.appendChild(newitembreak);
  } else {
		page.style.backgroundImage = 'url("./assets/minimized-items.png")';
		window.setContentSize(375, 92);
		btn.style.content = 'url("./assets/plus.png")';

	  // pagebreak.removeChild(itembreak);
}});

const {
  itemPairs: itemimages, 
  baseItems: baseitemimages, 
  craftedItems, 
  inventory, 
  itemtable
} = initializeItems()

function decrement(button) {
  const currentval = Number(button.parentElement.childNodes[2].nodeValue);
  if (currentval === 0) {
    return;
  }
  const index = Number(button.parentElement.id);
  decrementtable(index, inventory, itemtable, itemimages, baseitemimages);
  button.parentElement.childNodes[2].nodeValue = ' ' + String(currentval - 1) + ' ';
}

function increment(button) {
  const currentval = Number(button.parentElement.childNodes[2].nodeValue);

  if (currentval === 9) {
    return;
  }
  const index = Number(button.parentElement.id);
  incrementtable(index, inventory, itemtable, itemimages, baseitemimages);
  button.parentElement.childNodes[2].nodeValue = ' ' + String(currentval + 1) + ' ';
}

function reset() {
  for (const item in inventory) {
    inventory[item] = 0;
  }
  for (const itemrow in itemtable) {
    for (const item in itemtable[itemrow]) {
      itemtable[itemrow][item] = 0;
    }
  }
  for (const itemrow of baseitemimages) {
    for (const item of itemrow) {
      setUncraftable(item);
    }
  }

  for (const itemrow of itemimages) {
    for (const item of itemrow) {
      setUncraftable(item);
    }
  }

  for (let i = 0; i < 8; i++) {
    document.getElementById(String(i)).childNodes[2].nodeValue = "0";
  }

  for (let i = 0; i < 2; i++) {
    for (let k = 0; k < 8; k++) {
      craftedItems[i][k].style.backgroundImage = "";
      craftedItems[i][k].value = "";
    }
  }

  // for (let i = 0; i < 16; i++) {
  //   craftedItems[i].style.backgroundImage = "";
  //   craftedItems[i].value = "";
  // } 

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
}

function setCarousel(pair) {
  pair.style.backgroundImage =
    'url("./assets/frostedicons/' + pair.id + '.png")';
}

function setUncraftable(pair) {
  pair.style.backgroundImage = 'url("./assets/dimicons/' + pair.id + '.png")';
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
  if (
    pair.style.backgroundImage !=
    'url("./assets/fullicons/' + pair.id + '.png")'
  ) {
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
  if (!addItemToList(pair, 7 - row, col)) {
    return;
  }
  decrementtable(7 - row, inventory, itemtable, itemimages, baseitemimages);
  decrementtable(col, inventory, itemtable, itemimages, baseitemimages);
  incDecCounter(7 - row, false);
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

// function addItemToList(pair, row, col) {
// 	for (let i = 0; i < 16; i++) {
// 	  if (craftedItems.style.backgroundImage) {
// 	    continue;
// 	  }
// 	  craftedItems.style.backgroundImage =
// 	    'url("./assets/fullicons/' + pair.id + '.png")';
// 	  craftedItems.value = String(row) + String(col);
// 	  return true;
// 	  }	
// 	return false;
// }

function removeFromList(td) {
  if (!td.value) {
    return;
  }
  row = Number(td.value[0]);
  col = Number(td.value[1]);
  if (row === col && inventory[row] >= 8) {
    return;
  }
  if (inventory[row] >= 9 || inventory[col] >= 9) {
    return;
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

// function shiftCraftedList() {
//   let currentItem;
//   let nextItem;
//   for (let k = 0; k < 16; k++) {
//     currentItem = craftedItems[k];
//     if (currentItem.style.backgroundImage) {
//       continue;
//     }
//     nextItem = craftedItems[k + 1];
//     currentItem.style.backgroundImage = nextItem.style.backgroundImage;
//     nextItem.style.backgroundImage = null;
//     currentItem.value = nextItem.value;
//     nextItem.value = null;
//   }
// }

let timer;
let delay = 10;

$(".itemtabledata").hover(
  function() {
    const id = $(this).attr("id");
    if (!id) {
      return;
    }
    $("#legend").attr("src", "./assets/descriptions/" + id + ".png");
  },
  function() {
    $("#legend").attr("src", "./assets/legend.png");
  }
);

function initializeItems(){
  const CRAFTEDITEMS = [
    "ie","gunblade","deathcap","divine","rageblade",
    "rfc","spear","luden","shiv","seraph",
    "ga","locket","pd","fh","thornmail",
    "bt","ionic spark","cursed blade","hush","sword breaker",
    "dragon claw","zekes","morello","titanic","redemption",
    "red","zephyr","warmog","ghostblade","yuumi",
    "bork","darkin","kv","hurricane","mallet","fon"
  ]
  const BASEITEMS = ["bf","rod","recurve","tear","vest","cloak","giants belt","spatula"]
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
  const itemPairs = []
  let k = 0
  for (let i=1; i<=8;i++){
    const itemrow = []
    for (let j=0; j<i; j++){
      const item = document.getElementById(CRAFTEDITEMS[k])
      setUncraftable(item)
      item.setAttribute("onclick", "craftItem(this)")
      itemrow.push(item)
      k++
    }
    itemPairs.push(itemrow)
  }

  const baseItems = []
  k = 0
  for (let i=0; i<8; i++){
    const itemrow = []
    for (let j=1; j<=2; j++){
      const item = document.getElementById(BASEITEMS[k]+String(j))
      item.id = BASEITEMS[k]
      setUncraftable(item)
      itemrow.push(item)
    }
    k++
    baseItems.push(itemrow)
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

  // const craftedItems = [];
  // for (let i = 0; i < 16; i++) {
  //   const id = "crafted" + String(i%2) + String(Math.floor(i/2));
  //   const td = document.getElementById(id);
  //   td.setAttribute("onclick", "removeFromList(this)");
  //   craftedItems.push(td);
  // }

  return {itemPairs, baseItems, craftedItems, inventory, itemtable}
}