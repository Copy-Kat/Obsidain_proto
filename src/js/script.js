var states = [];
var currentState = 0

function setup() {
    
    var previousState = document.getElementById("main").innerHTML;

    states.push(previousState);

    //console.log(states.length)
}

const keyBinds = {

    bold : "b",
    italics : "i",
    underline : "u",
    undo : "z"
    
}

document.getElementById("bold").addEventListener("click", () => {
    format("STRONG", "<strong>", "</strong>");
});

document.getElementById("italic").addEventListener("click", () => {
    format("EM", "<em>", "</em>");
});

document.getElementById("underline").addEventListener("click", () => {
    format("U", "<u>", "</u>");
});


// INPUT HANDLING
document.addEventListener("keydown", (event) => {

    switch (event.key) {
        case "Enter":
            //event.preventDefault();
            console.log(event.key)
            //enter();
            break;
    
        default:
            break;
    }


    if (event.ctrlKey) {
        //event.preventDefault();
        switch (event.key) {
            case keyBinds.bold:
                event.preventDefault();
                format("STRONG", "<strong>", "</strong>");
                break;
            case keyBinds.italics:
                event.preventDefault();
                format("EM", "<em>", "</em>");
                break;
            case keyBinds.underline:
                event.preventDefault();
                format("U", "<u>", "</u>");
                break;
            case keyBinds.undo:
                event.preventDefault();
                currentState--;
                if (currentState < 0) {
                    currentState = 0;
                    break;
                }
                let body = document.getElementById("main");
                body.innerHTML = states[currentState];
                states.pop()
                break;
            default:
                console.log("Not Implemented");
                break;
        }
    }
});

document.addEventListener("keyup", () => {

    let newState = document.getElementById("main").innerHTML;

    //console.log(newState)
    let previousState = states[currentState];
    //console.log(newState, previousState)

    if (newState != previousState) {
        states.push(newState)
        currentState++;
        console.log(states)
    }
})


// TEXT FORMATING
function format(elementType, elementOpen, elementClose) {
    // get the text string of the editor
    var text, text1, textArea; 
    var multi_line = false;
    var text2 = ""

    // get selection
    const selection = window.getSelection().getRangeAt(0);

    // get containers
    const startContainer = selection.startContainer;
    const endContainer = selection.endContainer;

    if (startContainer === endContainer) {
        textArea = startContainer.parentElement.parentElement
    }
    else {
        textArea = selection.commonAncestorContainer
    }
    
    // get the main editor
    //var textArea = startContainer.parentElement;
    //document.getElementById(id).focus(); // keep focus

    console.log(startContainer, endContainer);

    // get childnodes
    var childnodes =  textArea.childNodes;

    console.log(childnodes)
    
    // get the indecies 
    var indexStart, indexEnd

    // assumption: if not span then depth 1
    if(startContainer.parentElement.tagName === 'SPAN') {
        var indexStart = Array.from(childnodes).indexOf(startContainer.parentElement);
    }
    else {
        indexStart = Array.from(childnodes).indexOf(startContainer.parentElement.parentElement);
    }

    if(endContainer.parentElement.tagName === 'SPAN') {
        var indexEnd = Array.from(childnodes).indexOf(endContainer.parentElement);
    }
    else {
        indexEnd = Array.from(childnodes).indexOf(endContainer.parentElement.parentElement);
    }

    console.log(indexStart, indexEnd)

    // get offset
    var startOffset = selection.startOffset;
    var endOffset = selection.endOffset;

    console.log(startOffset, endOffset)

    // get the cases

    // case 1: single line no boling
    if (indexStart === indexEnd) {
        // console.log("1")
        // get text
        text = startContainer.parentElement.innerText;

        const newSpan = document.createElement("span");
        const boldSpan = document.createElement("span");

        newSpan.contentEditable = "true";
        boldSpan.contentEditable = "true";

        newSpan.innerHTML = text.slice(0, startOffset).replaceAll(" ", "&nbsp;");
        boldSpan.innerHTML = elementOpen + text.slice(startOffset, endOffset).replaceAll(" ", "&nbsp;") + elementClose;

        textArea.insertBefore(newSpan, startContainer.parentElement);
        textArea.insertBefore(boldSpan, startContainer.parentElement);

        startContainer.parentElement.innerHTML = text.slice(endOffset).replaceAll(" ", "&nbsp;");
    }

    else if (indexStart + 1 === indexEnd) {

        text = startContainer.parentElement.innerText;
        text1 = endContainer.parentElement.innerText;

        if (endContainer.parentElement.tagName === elementType){
        
            startContainer.parentElement.innerHTML = text.slice(0, startOffset).replaceAll(" ", "&nbsp;");
            endContainer.parentElement.innerHTML = text.slice(startOffset).replaceAll(" ", "&nbsp;") + text1.replaceAll(" ", "&nbsp;")
        }
        
        else {
            startContainer.parentElement.innerHTML = text.replaceAll(" ", "&nbsp;") + text1.slice(0, endOffset).replaceAll(" ", "&nbsp;");
            endContainer.parentElement.innerHTML = text1.slice(endOffset).replaceAll(" ", "&nbsp;");
        }
    }

    else {

        text = startContainer.parentElement.innerText;
        text1 = endContainer.parentElement.innerText;
        
        for (let index = indexStart + 1; index < indexEnd; index++) {
            text2 += childnodes[index].innerText;
        }

        for (let index = indexStart + 1; index < indexEnd; index++) {
            textArea.removeChild(childnodes[indexStart + 1]);
        }
        
        if (startContainer.parentElement.tagName === "SPAN" && endContainer.parentElement.tagName === elementType){
        
            startContainer.parentElement.innerHTML = text.slice(0, startOffset).replaceAll(" ", "&nbsp;");
            endContainer.parentElement.innerHTML = text.slice(startOffset).replaceAll(" ", "&nbsp;") + text2.replaceAll(" ", "&nbsp;") + text1.replaceAll(" ", "&nbsp;")
        }

        else if (startContainer.parentElement.tagName === elementType && endContainer.parentElement.tagName === "SPAN"){
        
            startContainer.parentElement.innerHTML = text.replaceAll(" ", "&nbsp;") + text2.replaceAll(" ", "&nbsp;") + text1.slice(0, endOffset).replaceAll(" ", "&nbsp;");
            endContainer.parentElement.innerHTML = text1.slice(endOffset).replaceAll(" ", "&nbsp;");
        }

        else if (startContainer.parentElement.tagName === "SPAN" && endContainer.parentElement.tagName === "SPAN"){
        
            const boldDiv = document.createElement("span");

            boldDiv.contentEditable = "true";

            boldDiv.innerHTML = elementOpen + text.slice(startOffset).replaceAll(" ", "&nbsp;") + text2.replaceAll(" ", "&nbsp;") + text1.slice(0, endOffset).replaceAll(" ", "&nbsp;") + elementClose;

            textArea.insertBefore(boldDiv, endContainer.parentElement);
            
            startContainer.parentElement.innerHTML = text.slice(0, startOffset).replaceAll(" ", "&nbsp;");
            endContainer.parentElement.innerHTML = text1.slice(endOffset).replaceAll(" ", "&nbsp;");
        }

        else if (startContainer.parentElement.tagName === elementType && endContainer.parentElement.tagName === elementType){
            
            startContainer.parentElement.innerText = text.replaceAll(" ", "&nbsp;") + text2.replaceAll(" ", "&nbsp;") + text1.replaceAll(" ", "&nbsp;");

            endContainer.parentElement.remove();

        }

    }

    // Clean up
    var newChildNodes = textArea.childNodes;
    newChildNodes.forEach(element => {
        if (element.innerText === "") {
            element.remove();
        }
    });
}

// TODO: FIX THIS
function enter() {
    const selection = window.getSelection().getRangeAt(0);
    
    text = selection.startContainer.parentElement.innerText;

    console.log(selection.startContainer.parentElement.innerHTML)

    selection.startContainer.parentElement.innerHTML = text.slice(0, selection.startOffset) + "</br>" + text.slice(selection.startOffset);
}