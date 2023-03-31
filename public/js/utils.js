import { dataProperties } from "./consts.js";

var mainDoc = document.getElementById("main");

export function updateFomat() {
	//console.log("hi")

	const [pos, node] = getCaretPos();

	var compStyle = window.getComputedStyle(node);

	for (const [key, value] of Object.entries(dataProperties)) {
		let data = document.getElementById(key);
		data.dataset.data = compStyle.getPropertyValue(value[0]);
	}
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

export function tab() {
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

export function format(elementType, selection, data) {
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
