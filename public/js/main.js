import { updateFomat, tab, format, FormatDiv} from "./extensions/format-extension.js";
import { save, FileDiv } from "./extensions/files-extension.js";
import { dataProperties, keyBinds, state} from "./consts.js";
import { createWraperDiv } from "./utils.js";

var mainDoc = document.getElementById("main");
var currentExtension = "";

const extensionDiv = createWraperDiv("extension", false)

const titleDiv = createWraperDiv("extension-name");

extensionDiv.appendChild(titleDiv)

const formatDiv = new FormatDiv("format", dataProperties)

formatDiv.setup(extensionDiv)

const fileDiv = new FileDiv("file")

fileDiv.setup(extensionDiv)

document.getElementById("body").insertBefore(extensionDiv, document.getElementById("open-editors"));

// switch extension
document.getElementById("top").childNodes.forEach((extension) => {
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

	if (state.currentFileIndex === -1) {
		return
	}

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
