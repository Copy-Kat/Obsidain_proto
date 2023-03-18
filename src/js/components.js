export { Div };

class Div {
	constructor(textContent) {
		this.body = document.createElement("div");

		this.innerText = textContent;
	}
}

class nameValuePair extends Div {}
