import { updateFomat, tab, format } from "./utils.js";
import { dataProperties, keyBinds, fileExtensions, startScreen } from "./consts.js";

var states = [];
var currentState = 0;
var mainDoc = document.getElementById("main");
var currentExtension = "";

function setup() {

	saveStates.push([document.getElementById("main").innerHTML])

}

var openFiles = []
var paths = []
var saveStates = []
var currentFileIndex = -1

console.log(saveStates)

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
		})
		
	} else {
		var newNode1 = document.createElement("div");
		newNode1.dataset.type = "file";
		newNode1.dataset.name = file.name;
		newNode1.dataset.path = file.path;
		newNode1.style.paddingLeft = `${depth * 10}px`;
		newNode1.style.zIndex = `${depth}`;
		
		newNode1.addEventListener("click", (e) => {switchFile(e, file.name, file.path)})

		nodeRef.appendChild(newNode1)
		//console.log(`path: ${file.path}, name: ${file.name}`);
	}
}

function switchFile(e, fileName, filePath){

	e.stopPropagation();

	if (openFiles.includes(fileName)) {
		console.log(openFiles)
		document.querySelectorAll(`[data-name="${openFiles[currentFileIndex]}"]`)[1].dataset.open = false
		currentFileIndex = openFiles.indexOf(fileName)
		document.getElementById("main").innerHTML = saveStates[currentFileIndex].at(0)
		document.querySelectorAll(`[data-name="${openFiles[currentFileIndex]}"]`)[1].dataset.open = true
		console.log(openFiles)
		return
	}

	if (currentFileIndex != -1) {
		console.log(document.querySelectorAll(`[data-name="${openFiles[currentFileIndex]}"]`))
		document.querySelectorAll(`[data-name="${openFiles[currentFileIndex]}"]`)[1].dataset.open = false
	}

	var openFile = document.createElement("div");

	let extension = fileExtensions[fileName.split(".").at(-1)];

	console.log(fileName.split(".").at(-1))

	openFile.innerHTML = `<div><i class = "nf ${extension[0]}" style="color: ${extension[1]}; font-size: 1.1rem"></i> <div>${fileName}</div></div>`

	let close = document.createElement("div");

	close.innerHTML = "x"

	close.addEventListener("click", (e) => {closeFile(e, openFile, fileName)})

	openFile.firstChild.appendChild(close)

	openFile.classList.add("open-file")
	openFile.dataset.name = fileName
	openFile.dataset.path = filePath

	openFile.addEventListener("click", (e) => {switchFile(e, fileName, filePath)})

	openFile.dataset.open = true

	document.getElementById("open-editors").appendChild(openFile)
	
	openFiles.push(fileName);
	paths.push(filePath);

	currentFileIndex = openFiles.length - 1;
	console.log(currentFileIndex)

	let url = "http://localhost:8008/read/" + filePath.replaceAll("/", "%2F")
	fetch(url).then((res) => res.text()).then((body) => {mainDoc.innerHTML = body}).then(() => setup())

	console.log(openFiles)
}

function closeFile(e, openFile, name) {

	e.stopPropagation()

	console.log(name)
	
	let removeIndex = openFiles.indexOf(name)

	console.log(removeIndex)

	openFiles.splice(removeIndex, 1);
	paths.splice(removeIndex, 1);
	saveStates.splice(removeIndex, 1);

	console.log(openFiles)

	currentFileIndex = openFiles.length - 1

	openFile.remove();

	if (currentFileIndex > -1) {document.getElementById("main").innerHTML = saveStates[currentFileIndex].at(-1); return;}
	else {document.getElementById("main").innerHTML = startScreen}
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
			document.getElementById(currentExtension).dataset.selected = false;
		}
		
		currentExtension = extension.id
		//console.log(document.getElementById(`${currentExtension}-div`));
		document.getElementById(`${currentExtension}-div`).dataset.visible = true;
		//console.log(currentExtension)
		extensionDiv.dataset.visible = true;
		titleDiv.innerText = currentExtension
		mainDoc.dataset.full = false;
		document.getElementById("open-editors").dataset.full = false;

	});
});

// INPUT HANDLING
document.addEventListener("keydown", (event) => {
	switch (event.key) {
		case "Tab":
			event.preventDefault();
			tab();
			break;

		default:
			update()
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
				if (saveStates[currentFileIndex].length < 2) break;
				mainDoc.innerHTML = saveStates[currentFileIndex].at(-2)
				saveStates[currentFileIndex].pop()

				break;

			case keyBinds.test:
				event.preventDefault();
				break;

			default:
				break;
		}

	}
});

function update(){

	updateFomat();

	let newState = document.getElementById("main").innerHTML;


	//console.log(newState)
	let previousState = saveStates[currentFileIndex].at(-1);
	//console.log(newState, previousState)

	if (newState != previousState) {
		saveStates[currentFileIndex].push(newState)
		// console.log(states)

	}
}

function save(){
	let body = document.getElementById("main").innerHTML;
	let path = paths[currentFileIndex];
	fetch("http://localhost:8008/write", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
		},
		body: `body=${body}&path=${path}`
	});
}


document.getElementById("main").addEventListener("click", () => updateFomat());
