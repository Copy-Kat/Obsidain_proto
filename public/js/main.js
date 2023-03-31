import { updateFomat, tab, format } from "./utils.js";
import { dataProperties, keyBinds } from "./consts.js";

var states = [];
var currentState = 0;
var mainDoc = document.getElementById("main");
var currentExtension = "";

function setup() {
	var previousState = mainDoc.innerHTML;

	states.push(previousState);
}

var docs = {}





const extensionDivs = {

	
}

var openFiles = []
var paths = []
var saveStates = []
var currentFileIndex = ""

var extensionDiv = document.createElement("div");

extensionDiv.id = "extension";

var titleDiv = document.createElement("div");

titleDiv.innerText = ""

titleDiv.id = "extension-name"

extensionDiv.appendChild(titleDiv)

var formatDiv = document.createElement("div");

formatDiv.id = "format-div";

formatDiv.dataset.visible = false

for (const [key, value] of Object.entries(dataProperties)) {
	let data = document.createElement("div");
	data.id = key;
	data.dataset.elementType = value[1]
	data.classList.add("format-button")
	data.innerText = value[1][0];
	formatDiv.appendChild(data);
}

extensionDiv.appendChild(formatDiv)

extensionDiv.dataset.visible = false;

var fileDiv = document.createElement("div")

fileDiv.id = "file-div"

document.getElementById("file").addEventListener("click", async () => {
	fetch("http://localhost:8008/files")
	.then((res) => res.json())
	.then((body) => {
		document.getElementById("file-div").textContent = ""
		body.children.forEach((child) => {parseFile(child, document.getElementById("file-div"), 0);})
	});
});

function parseFile(file, nodeRef, depth) {
	
	if (file.children) {
		//console.log(file)
		var newNode = document.createElement("div")
		newNode.dataset.name = file.name;
		newNode.dataset.type = "dir"
		newNode.dataset.expanded = false;
		newNode.dataset.path = file.path;
		newNode.style.paddingLeft = `${depth * 10}px`;
		newNode.style.zIndex = `${depth}`;
		newNode.addEventListener("click", (e) => {
			e.stopPropagation()
			//console.log(typeof newNode.dataset.expanded)
			newNode.dataset.expanded = newNode.dataset.expanded === "false"
		})
		//console.log(`path: ${file.path}, name: ${file.name}`)
		if (file.children.length == 0) {
			nodeRef.appendChild(newNode);
			return
		}
		file.children.forEach((element) => {
			parseFile(element, newNode, depth + 1)
		nodeRef.appendChild(newNode)
		console.log(nodeRef.childNodes)
		})
		
	} else {
		var newNode1 = document.createElement("div");
		newNode1.dataset.type = "file";
		newNode1.dataset.name = file.name;
		newNode1.dataset.path = file.path;
		newNode1.style.paddingLeft = `${depth * 10}px`;
		newNode1.style.zIndex = `${depth}`;
		
		newNode1.addEventListener("click", (e) => {
			e.stopPropagation();

			var openFile = document.createElement("div");

			openFile.classList.add("open-file")
			openFile.dataset.name = file.name

			document.getElementById("open-editors").appendChild(openFile)
			
			openFiles.push(file.name);
			paths.push(file.path);

			let url = "http://localhost:8008/read/" + newNode1.dataset.path.replaceAll("/", "%2F")
			fetch(url).then((res) => res.text()).then((body) => {mainDoc.innerHTML = body; saveStates.push([body])})


		})

		nodeRef.appendChild(newNode1)
		//console.log(`path: ${file.path}, name: ${file.name}`);
	}
}

fileDiv.dataset.visible = false

extensionDiv.appendChild(fileDiv)


document
	.getElementById("body")
	.insertBefore(extensionDiv, document.getElementById("open-editors"));

const formatWraper = document.getElementById("format-div").childNodes;
formatWraper.forEach((button) => {
	button.addEventListener("mousedown", (e) => {
		e.preventDefault();
		let selection = window.getSelection().getRangeAt(0)
		//console.log(selection.startContainer.parentElement.tagName !== "DIV")
		if (selection.startContainer.parentElement.tagName !== "DIV") {
			//console.log("lmo")
			format(button.id, selection, button.dataset.elementType)
		}
	})
})

const extensions = document.getElementById("top").childNodes;
extensions.forEach((extension) => {
	extension.addEventListener("click", () => {
		if (extension.dataset.selected === "true") {
			extension.dataset.selected = false;
			//console.log(document.getElementById(`${currentExtension}-div`))
			document.getElementById(`${currentExtension}-div`).dataset.visible = false;
			currentExtension = ""
			mainDoc.dataset.full = true;
			extensionDiv.dataset.visible = false;
			titleDiv.innerText = ""
			//extensionDiv.innerText="he"
			//extensionDiv.dataset.mode = extension.id
			document.getElementById("open-editors").dataset.full = true;
			return;
		}
		extension.dataset.selected = true;
		if (currentExtension != "") {
			document.getElementById(`${currentExtension}-div`).dataset.visible = false;
		}
		
		currentExtension = extension.id
		//console.log(document.getElementById(`${currentExtension}-div`));
		document.getElementById(`${currentExtension}-div`).dataset.visible = true;
		//console.log(currentExtension)
		extensionDiv.dataset.visible = true;
		titleDiv.innerText = currentExtension
		mainDoc.dataset.full = false;
		document.getElementById("open-editors").dataset.full = false;
		let id = extension.id;
		let childNodes = document.getElementById("top").childNodes;
		childNodes.forEach((node) => {
			if (node.id != id && node instanceof SVGElement) {
				//console.log(node)
				node.dataset.selected = false;
			}
		});
	});
});

// document.getElementById("bold").addEventListener("click", () => {
//     format("STRONG", "<strong>", "</strong>");
// });

// document.getElementById("italic").addEventListener("click", () => {
//     format("EM", "<em>", "</em>");
// });

// document.getElementById("underline").addEventListener("click", () => {
//     format("U", "<u>", "</u>");
// });

// INPUT HANDLING
document.addEventListener("keydown", (event) => {
	switch (event.key) {
		case "Tab":
			event.preventDefault();
			tab();
			break;

		default:
			break;
	}

	if (event.ctrlKey) {
		//event.preventDefault();
		const select = window.getSelection()
		const selection = select.getRangeAt(0);

		switch (event.key) {
			case keyBinds.bold:
				event.preventDefault();
				format("bold", selection, "bold");
				break;

			case keyBinds.italics:
				event.preventDefault();
				format("em", selection, "italic");
				break;

			case keyBinds.underline:
				event.preventDefault();
				format("u", selection, "underline");
				break;

			case keyBinds.save:
				event.preventDefault();
				save()
				break;

			case keyBinds.undo:
				event.preventDefault();
				currentState--;
				if (currentState < 0) {
					currentState = 0;
					break;
				}
				let body = mainDoc;
				body.innerHTML = states[currentState];
				states.pop();
				break;

			case keyBinds.test:
				event.preventDefault();
				break;

			default:
				//console.log("Not Implemented");
				break;
		}

	}
});

function save(){
	let body = document.getElementById("main").innerHTML.trim();
	let path = "Files/test/test3.html";
	fetch("http://localhost:8008/write", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
		},
		body: `body=${body}&path=${path}`
	});
}

document.addEventListener("keyup", () => {
	updateFomat();

	let newState = mainDoc.innerHTML;

	//console.log(newState)
	let previousState = states[currentState];
	//console.log(newState, previousState)

	if (newState != previousState) {
		states.push(newState);
		currentState++;
		// console.log(states)
	}
});

document.getElementById("main").addEventListener("click", () => updateFomat());





// TEXT FORMATING


setup();