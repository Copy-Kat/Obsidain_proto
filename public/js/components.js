export { Div, Button };

class Div {
	constructor(textContent) {
		this.body = document.createElement("div");

		this.innerText = textContent;
	}
}

class Button {

	constructor(char, elementType){
		
		this.body = document.createElement("div")
		
		this.body.innerHTML = elementType + char[0] + elementType

		this.body.classList.add(elementType)
	}
}

const boldButton = new Button("B", "<strong>")

class nameValuePair extends Div {}

// function updateExtension(id) {
// 	let mode = document.getElementById("extension").dataset.mode;

// 	switch () {
// 		case file:
			
// 			break;
	
// 		default:
// 			break;
// 	}
// }
