var states = [];
var currentState = 0;
var mainDoc = document.getElementById("main");
var currentExtension = "";

function setup() {
	var previousState = mainDoc.innerHTML;

	states.push(previousState);
}

var docs = {}

const keyBinds = {
	bold: "b",
	italics: "i",
	underline: "u",
	undo: "z",
	highlight: "i",
	save: "s",
	test: "f",
};

const dataProperties = {
	bold : ["font-weight", "bold"],
	em: ["font-style", "italic"],
	u: ["text-decoration", "underline"],
};

const extensionDivs = {

	
}

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
			console.log(typeof newNode.dataset.expanded)
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
			let url = "http://localhost:8008/read/" + newNode1.dataset.path.replaceAll("/", "%2F")
			fetch(url).then((res) => res.text()).then((body) => mainDoc.innerHTML = body)
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

function updateFomat() {
	//console.log("hi")

	const [pos, node] = getCaretPos();

	var compStyle = window.getComputedStyle(node);

	for (const [key, value] of Object.entries(dataProperties)) {
		let data = document.getElementById(key);
		data.dataset.data = compStyle.getPropertyValue(value[0]);
	}
}

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
				updateFomat();
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
				const editor = mainDoc;
				console.log(getCaretIndex(editor));
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

function tab() {
	const [pos, node] = getCaretPos();

	const text = node.innerText;

	node.innerHTML =
		text.slice(0, pos).replaceAll(" ", "&nbsp;") +
		"&nbsp;&nbsp;&nbsp;&nbsp;" +
		text.slice(pos).replaceAll(" ", "&nbsp;");

	var selection = window.getSelection();

	var range = document.createRange();

	range.selectNode(node);

	range.setStart(node.firstChild, pos + 4);

	selection.removeAllRanges();

	selection.addRange(range);

	range.collapse(true);
}

function getCaretPos() {
	let position = 0;
	//const selection = window.getSelection();

	var range = window.getSelection().getRangeAt(0);

	const preCaretRange = range.cloneRange();

	preCaretRange.selectNodeContents(range.startContainer.parentElement);
	preCaretRange.setEnd(range.endContainer, range.endOffset);

	position = preCaretRange.toString().length;

	return [position, range.startContainer.parentElement];
}

// TEXT FORMATING
function format(elementType, selection, data) {
	// get the text string of the editor
	var text, text1;
	var multi_para = false;
	var undo = false;

	// get selection
	// const selection = window.getSelection().getRangeAt(0);

	var newRange = selection.cloneRange();

	// // get containers
	const startContainer = selection.startContainer;
	const endContainer = selection.endContainer;

	const startContainerClasses = startContainer.parentElement.classList;
	const endContainerClasses = endContainer.parentElement.classList;

	var startOffset = selection.startOffset;
	var endOffset = selection.endOffset;

	//console.log(startContainer.parentElement.classList , endContainer.parentElement.classNames)

	if (startContainer === endContainer) {
		var textArea = startContainer.parentElement.parentElement;
	} else if (selection.commonAncestorContainer.tagName == "P") {
		var textArea = selection.commonAncestorContainer;
	} else {
		multi_para = true;
	}

	if (!multi_para) {
		// get childnodes
		var childnodes = textArea.childNodes;

		// assumption: if not span then depth 1
		var indexStart = Array.from(childnodes).indexOf(startContainer.parentElement);

		var indexEnd = Array.from(childnodes).indexOf(endContainer.parentElement);

		// case 1: single line no boling
		if (indexStart === indexEnd) {
			// console.log("1")
			// get text
			text = startContainer.parentElement.innerText;

			const newSpan = document.createElement("span");
			const formatedSpan = document.createElement("span");

			newSpan.innerHTML = text.slice(0, startOffset).replaceAll(" ", "&nbsp;");
			formatedSpan.innerHTML = text
				.slice(startOffset, endOffset)
				.replaceAll(" ", "&nbsp;");

			textArea.insertBefore(newSpan, startContainer.parentElement);
			textArea.insertBefore(formatedSpan, startContainer.parentElement);

			if (startContainerClasses.length != 0) {
				formatedSpan.classList = startContainerClasses;
				formatedSpan.style.cssText = startContainer.parentElement.style.cssText;
				newSpan.classList = startContainerClasses;
				newSpan.style.cssText = startContainer.parentElement.style.cssText;
			}

			if (
				startContainerClasses.contains(elementType + "-" + data) &&
				endContainerClasses.contains(elementType + "-" + data)
			) {
				undo = true;
				console.log(undo);
			}

			if (undo) {
				formatedSpan.classList.remove(elementType + "-" + data);
				formatedSpan.style.setProperty("--" + elementType, "inherit");
			} else {
				formatedSpan.classList.add(elementType + "-" + data);
				formatedSpan.style.setProperty("--" + elementType, data);
			}

			startContainer.parentElement.innerHTML = text
				.slice(endOffset)
				.replaceAll(" ", "&nbsp;");
		} else if (indexStart + 1 === indexEnd) {
			text = startContainer.parentElement.innerText;
			text1 = endContainer.parentElement.innerText;

			const formatedspan1 = document.createElement("span");
			const formatedspan2 = document.createElement("span");

			formatedspan1.innerHTML = text.slice(startOffset).replaceAll(" ", "&nbsp;");
			formatedspan2.innerHTML = text1
				.slice(0, endOffset)
				.replaceAll(" ", "&nbsp;");

			if (startContainerClasses.length != 0) {
				formatedspan1.classList = startContainerClasses;
				formatedspan1.style.cssText = startContainer.parentElement.style.cssText;
			}
			if (endContainerClasses.length != 0) {
				formatedspan2.classList = endContainerClasses;
				formatedspan2.style.cssText = endContainer.parentElement.style.cssText;
			}

			if (
				startContainerClasses.contains(elementType + "-" + data) &&
				endContainerClasses.contains(elementType + "-" + data)
			) {
				undo = true;
				console.log(undo);
			}

			//console.log(startContainerClasses, endContainerClasses)

			if (undo) {
				formatedspan1.classList.remove(elementType + "-" + data);
				formatedspan2.classList.remove(elementType + "-" + data);
				formatedspan1.style.setProperty("--" + elementType, "inherit");
				formatedspan2.style.setProperty("--" + elementType, "inherit");
			} else {
				formatedspan1.classList.add(elementType + "-" + data);
				formatedspan2.classList.add(elementType + "-" + data);
				formatedspan1.style.setProperty("--" + elementType, data);
				formatedspan2.style.setProperty("--" + elementType, data);
			}

			textArea.insertBefore(formatedspan1, endContainer.parentElement);
			textArea.insertBefore(formatedspan2, endContainer.parentElement);

			startContainer.parentElement.innerHTML = text
				.slice(0, startOffset)
				.replaceAll(" ", "&nbsp;");
			endContainer.parentElement.innerHTML = text1
				.slice(endOffset)
				.replaceAll(" ", "&nbsp;");
		} else {
			text = startContainer.parentElement.innerText;
			text1 = endContainer.parentElement.innerText;

			if (
				startContainerClasses.contains(elementType + "-" + data) &&
				endContainerClasses.contains(elementType + "-" + data)
			) {
				undo = true;
				console.log(undo);
			}

			for (let index = indexStart + 1; index < indexEnd; index++) {
				if (!childnodes[index].classList.contains(elementType + "-" + data)) {
					undo = false;
					break;
				}
			}

			for (let index = indexStart + 1; index < indexEnd; index++) {
				if (
					undo &&
					childnodes[index].classList.contains(elementType + "-" + data)
				) {
					childnodes[index].classList.remove(elementType + "-" + data);
					childnodes[index].style.setProperty("--" + elementType, "inherit");
				} else {
					childnodes[index].classList.add(elementType + "-" + data);
					childnodes[index].style.setProperty("--" + elementType, data);
				}
			}

			const formatedspan1 = document.createElement("span");
			const formatedspan2 = document.createElement("span");

			formatedspan1.innerHTML = text.slice(startOffset).replaceAll(" ", "&nbsp;");
			formatedspan2.innerHTML = text1
				.slice(0, endOffset)
				.replaceAll(" ", "&nbsp;");

			if (startContainerClasses.length != 0) {
				formatedspan1.classList = startContainerClasses;
				formatedspan1.style.cssText = startContainer.parentElement.style.cssText;
			}
			if (endContainerClasses.length != 0) {
				formatedspan2.classList = endContainerClasses;
				formatedspan2.style.cssText = endContainer.parentElement.style.cssText;
			}

			if (undo) {
				formatedspan1.classList.remove(elementType + "-" + data);
				formatedspan2.classList.remove(elementType + "-" + data);
				formatedspan1.style.setProperty("--" + elementType, "inherit");
				formatedspan2.style.setProperty("--" + elementType, "inherit");
			} else {
				formatedspan1.classList.add(elementType + "-" + data);
				formatedspan2.classList.add(elementType + "-" + data);
				formatedspan1.style.setProperty("--" + elementType, data);
				formatedspan2.style.setProperty("--" + elementType, data);
			}

			textArea.insertBefore(formatedspan1, childnodes[indexStart + 1]);
			textArea.insertBefore(formatedspan2, endContainer.parentElement);

			startContainer.parentElement.innerHTML = text
				.slice(0, startOffset)
				.replaceAll(" ", "&nbsp;");
			endContainer.parentElement.innerHTML = text1
				.slice(endOffset)
				.replaceAll(" ", "&nbsp;");
		}
	} else {
		const editorChilds = document.querySelectorAll("div.main>p");

		console.log(startOffset, endOffset);

		var parent1 = startContainer.parentElement.parentElement;
		var parent2 = endContainer.parentElement.parentElement;

		var indexParentStart = Array.from(editorChilds).indexOf(parent1);

		var indexParentEnd = Array.from(editorChilds).indexOf(parent2);

		var childnodesStart = parent1.childNodes;
		var childnodesEnd = parent2.childNodes;

		var indexStart = Array.from(childnodesStart).indexOf(
			startContainer.parentElement
		);

		var indexEnd = Array.from(childnodesEnd).indexOf(endContainer.parentElement);

		text = startContainer.parentElement.innerText;
		text1 = endContainer.parentElement.innerText;

		const formatedspan1 = document.createElement("span");
		const formatedspan2 = document.createElement("span");

		if (startContainerClasses.length != 0) {
			formatedspan1.classList = startContainerClasses;
			formatedspan1.style.cssText = startContainer.parentElement.style.cssText;
		}
		if (endContainerClasses.length != 0) {
			formatedspan2.classList = endContainerClasses;
			formatedspan2.style.cssText = endContainer.parentElement.style.cssText;
		}

		formatedspan1.innerHTML = text.slice(startOffset).replaceAll(" ", "&nbsp;");
		formatedspan2.innerHTML = text1.slice(0, endOffset).replaceAll(" ", "&nbsp;");

		if (
			startContainerClasses.contains(elementType + "-" + data) &&
			endContainerClasses.contains(elementType + "-" + data)
		) {
			undo = true;
			console.log(undo);
		}

		for (let index = indexStart + 1; index < childnodesStart.length; index++) {
			if (!childnodesStart[index].classList.contains(elementType + "-" + data)) {
				undo = false;
				break;
			}
		}

		for (let index = 0; index < indexEnd; index++) {
			if (!childnodesEnd[index].classList.contains(elementType + "-" + data)) {
				undo = false;
				break;
			}
		}

		for (let index = indexParentStart + 1; index <= indexParentEnd - 1; index++) {
			editorChilds[index].childNodes.forEach((element) => {
				if (!element.classList.contains(elementType + "-" + data)) {
					undo = false;
				}
			});
		}

		if (undo) {
			formatedspan1.classList.remove(elementType + "-" + data);
			formatedspan2.classList.remove(elementType + "-" + data);
			formatedspan1.style.setProperty("--" + elementType, "inherit");
			formatedspan2.style.setProperty("--" + elementType, "inherit");
		} else {
			formatedspan1.classList.add(elementType + "-" + data);
			formatedspan2.classList.add(elementType + "-" + data);
			formatedspan1.style.setProperty("--" + elementType, data);
			formatedspan2.style.setProperty("--" + elementType, data);
		}

		for (let index = indexStart + 1; index < childnodesStart.length; index++) {
			if (
				undo &&
				childnodesStart[index].classList.contains(elementType + "-" + data)
			) {
				childnodesStart[index].classList.remove(elementType + "-" + data);
				childnodesStart[index].style.setProperty("--" + elementType, "inherit");
			} else {
				childnodesStart[index].classList.add(elementType + "-" + data);
				childnodesStart[index].style.setProperty("--" + elementType, data);
			}
		}

		for (let index = 0; index < indexEnd; index++) {
			if (
				undo &&
				childnodesEnd[index].classList.contains(elementType + "-" + data)
			) {
				childnodesEnd[index].classList.remove(elementType + "-" + data);
				childnodesEnd[index].style.setProperty("--" + elementType, "inherit");
			} else {
				childnodesEnd[index].classList.add(elementType + "-" + data);
				childnodesEnd[index].style.setProperty("--" + elementType, data);
			}
		}

		parent1.insertBefore(formatedspan1, childnodesStart[indexStart + 1]);
		parent2.insertBefore(formatedspan2, endContainer.parentElement);

		console.log(formatedspan1, formatedspan2);

		startContainer.parentElement.innerHTML = text
			.slice(0, startOffset)
			.replaceAll(" ", "&nbsp;");
		endContainer.parentElement.innerHTML = text1
			.slice(endOffset)
			.replaceAll(" ", "&nbsp;");

		for (let index = indexParentStart + 1; index <= indexParentEnd - 1; index++) {
			editorChilds[index].childNodes.forEach((element) => {
				if (undo) {
					element.classList.remove(elementType + "-" + data);
					element.style.setProperty("--" + elementType, "inherit");
				} else {
					element.classList.add(elementType + "-" + data);
					element.style.setProperty("--" + elementType, data);
				}
			});
		}

		//const select = window.getSelection()

		//newRange.setStart(startContainer.parentElement, startOffset)

		//newRange.setEnd(endContainer.parentElement, endOffset)

		//select.removeAllRanges()

		//select.addRange(newRange)

		//selection.collapse(false);

		console.log(indexStart, indexEnd, childnodesStart, childnodesEnd);
	}

	// Clean up
	mainDoc.childNodes.forEach((child) => {
		let newChildNodes = child.childNodes;
		newChildNodes.forEach((element) => {
			if (element.innerText === "") {
				element.remove();
			}
		});
	});

	//console.log(mainDoc.childNodes)
}

setup();