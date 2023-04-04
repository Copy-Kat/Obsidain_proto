import { fileExtensions, startScreen  } from "../consts.js";
import { state } from "../main.js";

var mainDoc = document.getElementById("main");

export function parseFile(file, nodeRef, depth) {
	
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

	if (state.openFiles.includes(fileName)) {
		console.log(state.openFiles)
		document.querySelectorAll(`[data-name="${state.openFiles[state.currentFileIndex]}"]`)[1].dataset.open = false
		state.currentFileIndex = state.openFiles.indexOf(fileName)
		document.getElementById("main").innerHTML = state.saveStates[state.currentFileIndex].at(0)
		document.querySelectorAll(`[data-name="${state.openFiles[state.currentFileIndex]}"]`)[1].dataset.open = true
		console.log(state.openFiles)
		return
	}

	if (state.currentFileIndex != -1) {
		console.log(document.querySelectorAll(`[data-name="${state.openFiles[state.currentFileIndex]}"]`))
		document.querySelectorAll(`[data-name="${state.openFiles[state.currentFileIndex]}"]`)[1].dataset.open = false
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
	
	state.openFiles.push(fileName);
	state.paths.push(filePath);

	state.currentFileIndex = state.openFiles.length - 1;
	console.log(state.currentFileIndex)

	let url = "http://localhost:8008/read/" + filePath.replaceAll("/", "%2F")
	fetch(url).then((res) => res.text()).then((body) => {mainDoc.innerHTML = body}).then(() => setup())

	console.log(state.openFiles)
}

function closeFile(e, openFile, name) {

	e.stopPropagation()

	console.log(name)
	
	let removeIndex = state.openFiles.indexOf(name)

	console.log(removeIndex)

	state.openFiles.splice(removeIndex, 1);
	state.paths.splice(removeIndex, 1);
	state.saveStates.splice(removeIndex, 1);

	console.log(state.openFiles)

	state.currentFileIndex = state.openFiles.length - 1

	openFile.remove();

	if (state.currentFileIndex > -1) {document.getElementById("main").innerHTML = state.saveStates[state.currentFileIndex].at(-1); return;}
	else {document.getElementById("main").innerHTML = startScreen}
}

export function save(){
	let body = document.getElementById("main").innerHTML;
	let path = state.paths[state.currentFileIndex];
	fetch("http://localhost:8008/write", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
		},
		body: `body=${body}&path=${path}`
	});
}

function setup() {

	state.saveStates.push([document.getElementById("main").innerHTML])

}
