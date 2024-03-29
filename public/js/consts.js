export var state = {

	openFiles: [],
	paths: [],
	saveStates: [],
	currentFileIndex : -1

}

export const dataProperties = {
	bold: ["font-weight", "bold", "nf nf-fa-bold"],
	em: ["font-style", "italic", "nf nf-fa-italic"],
	u: ["text-decoration-line", "underline", "nf nf-fa-underline"],
};


export const keyBinds = {
	bold: "b",
	italics: "i",
	underline: "u",
	undo: "z",
	highlight: "i",
	save: "s",
	test: "y",
};

export const fileExtensions = {
	html : ["nf nf-cod-code", "#c16930"],
	js : ["nf nf-dev-javascript_badge", "#E9FF00"],
	css : ["nf nf-seti-css", "#0FE3EF"],
	py : ["nf nf-dev-python", "#0FE3EF"],
	json : ["nf nf-cod-json", "#E9FF00"],
	file : ["nf nf-oct-file_directory", "#930FD4"],
	// html : ["nf nf-cod-code", "#c16930"],
	// html : ["nf nf-cod-code", "#c16930"],
	// html : ["nf nf-cod-code", "#c16930"],
	// html : ["nf nf-cod-code", "#c16930"],
	// html : ["nf nf-cod-code", "#c16930"],
	// html : ["nf nf-cod-code", "#c16930"],
	// html : ["nf nf-cod-code", "#c16930"],
	// html : ["nf nf-cod-code", "#c16930"],
	// html : ["nf nf-cod-code", "#c16930"]
}

export const startScreen =
`<div style="height: 100%; display: grid; grid-template-columns: 1fr 3fr 1fr;">
	<div style="height: 100%; grid-column: 2; font-size: 200%;">
		<h2> <i class="nf nf-md-fountain_pen_tip" style="font-size: 200%;"></i> Typewriter</h2>
		<h4>Node taking improved</h4>
		<h5>Start</h5>
		<h6>New file</h6>
		<h6>New folder</h6>
		<span class="material-symbols-outlined file"> folder</span>
		<i class="nf nf-dev-javascript_badge" style="color: #ec1370;"></i>
		<i class="nf nf-dev-javascript_shield"></i>
	</div>
</div>`