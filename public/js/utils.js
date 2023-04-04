export function createWraperDiv(id, display=true) {

	var Div = document.createElement("div");
	Div.id = id;
	Div.dataset.visible = display;

	return Div;
}