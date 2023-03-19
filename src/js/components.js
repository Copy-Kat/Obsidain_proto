export { Div, Button };

class Div {
	constructor(textContent) {
		this.body = document.createElement("div");

		this.innerText = textContent;
	}
}

class Button {

	constructor(path){
		this.body = document.createElement("div")
		this.body.innerHTML = path
	}
}

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
