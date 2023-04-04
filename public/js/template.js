export class DisplayDiv {

	constructor(id) {

		let div = document.createElement("div");
		div.id = `${id}-div`;
		div.dataset.visible = false;
		this.body = div
	}

	attach(nodeRef) {
		nodeRef.appendChild(this.body)
	}

}



