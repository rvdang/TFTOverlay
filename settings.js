let fs = require('fs')
const prompt = require('electron-prompt')

let filter = new Array(36)
let highlightFlag = false

document.getElementById("filter-btn").addEventListener("click", toggleHighlight)
document.getElementById("load-btn").addEventListener("click", loadfilter)
document.getElementById("save-btn").addEventListener("click", savefilter)
document.getElementById("reset-btn").addEventListener("click", reset)

function toggleHighlight(userInitiated) {
	highlightFlag = !highlightFlag
	let i = 0
	if (highlightFlag) {
		document.getElementById("filter-btn").style.border = "1px solid green"
		for (itemrow of itemimages) {
			for (item of itemrow) {
				item.setAttribute("onclick", "highlight(this)")
			}
		}
		if (userInitiated) {
			loadfilter()
		}
	} 
	else {
		document.getElementById("filter-btn").style.border = ""
		savefilter()
		for (itemrow of itemimages) {
			for (item of itemrow) {
				item.style.border = ""
				item.setAttribute("onclick", "craftItem(this)")
			}
		}
	}
}

function highlight(item) {
	if (item.style.border != "1px solid green") {
		item.style.border = "1px solid green"
	} 
	else {
		item.style.border = ""
	}
}

async function loadfilter(filterbtn=false) {
	let window = remote.getCurrentWindow()
	let filtername
	if (filterbtn) {
		await prompt({
		title: 'Load filter',
		label: 'Name of filter to load:',
		value: 'filter name here',
		inputAttrs: {
			type: 'text'
		}}, window)
		.then((r) => {
			if(r === null) {
				console.log('user cancelled')
			} else {
				filtername = r 
			}
		})
		.catch(console.error)
	}

	console.log("Loaded: ", filtername)
	let filter = fs.readFileSync("./filters/" + filtername + ".txt").toString().split(",")
	console.log("Loaded filter: ", filter)

	highlightFlag = false
	toggleHighlight(false)

	let i = 0
	for (itemrow of itemimages) {
		for (item of itemrow) {
			filter[i] = parseInt(filter[i])
			if (filter[i] === 1) {
				item.style.border = "1px solid green"
			} 
			else {
				item.style.border = ""
			}
			i++
		}
	}
}

async function savefilter(filterbtn=false) {
	let window = remote.getCurrentWindow()
	let filtername
	if (filterbtn) {
		await prompt({
		title: 'Save filter',
		label: 'Save this filter as: ',
		value: 'filter name here',
		inputAttrs: {
			type: 'text'
		}}, window)
		.then((r) => {
			if(r === null) {
				console.log('user cancelled')
			} else {
				filtername = r
			}
		})
		.catch(console.error)
	}

	let i = 0
	for (itemrow of itemimages) {
		for (item of itemrow) {
			if (item.style.border != "1px solid green") {
				filter[i] = 0
			} 
			else {
				filter[i] = 1
			}
			i++
		}
	}

	console.log("Saved: ", filtername)
	fs.writeFileSync("./filters/" + filtername + ".txt", filter)
	console.log("Saved filter: ", filter)
}

function reset() {
	for (const item in inventory) {
		inventory[item] = 0
	}
	for (const itemrow in itemtable) {
		for (const item in itemtable[itemrow]) {
			itemtable[itemrow][item] = 0
		}
	}
	for (const itemrow of baseitemimages) {
		for (const item of itemrow) {
			setUncraftable(item)
		}
	}
	for (const itemrow of itemimages) {
		for (const item of itemrow) {
			setUncraftable(item)
		}
	}
	for (let i = 0; i < 8; i++) {
		document.getElementById(String(i)).childNodes[2].nodeValue = " 0 "
	}
	for (let i = 0; i < 2; i++) {
		for (let k = 0; k < 8; k++) {
			craftedItems[i][k].style.backgroundImage = ""
			craftedItems[i][k].value = ""
		}
	}
	highlightFlag = false
	document.getElementById("filter-btn").style.border = ""
	for (itemrow of itemimages) {
		for (item of itemrow) {
			item.style.border = ""
			item.setAttribute("onclick", "craftItem(this)")
		}
	}
	fs.writeFileSync("./filters/undefined.txt", [])
}
