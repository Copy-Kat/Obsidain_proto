import { updateFomat, tab, format} from "./extensions/format-extension.js";
import { dataProperties, keyBinds} from "./consts.js";
import { parseFile, save } from "./extensions/files-extension.js";

var mainDoc = document.getElementById("main");
var currentExtension = "";

export var state = {

	openFiles: [],
	paths: [],
	saveStates: [],
	currentFileIndex : -1

}

console.log(state.saveStates)

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
			document.getElementById(`${currentExtension}-div`).dataset.visible = false;
			currentExtension = ""
			mainDoc.dataset.full = true;
			extensionDiv.dataset.visible = false;
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
	update()
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
				if (state.saveStates[state.currentFileIndex].length < 2) break;
				mainDoc.innerHTML = state.saveStates[state.currentFileIndex].at(-2)
				state.saveStates[state.currentFileIndex].pop()

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
	let previousState = state.saveStates[state.currentFileIndex].at(-1);
	//console.log(newState, previousState)

	if (newState != previousState) {
		state.saveStates[state.currentFileIndex].push(newState)
		// console.log(states)

	}
}




document.getElementById("main").addEventListener("click", () => updateFomat());
