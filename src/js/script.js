var states = [];
var currentState = 0
const color = "#ec1370"

function setup() {
    
    var previousState = document.getElementById("main").innerHTML;

    states.push(previousState);

}

const keyBinds = {

    bold : "b",
    italics : "i",
    underline : "u",
    undo : "z",
    highlight : "h",
    test : "f",
    
}

const extensions = document.getElementById("top").childNodes;
extensions.forEach(extension => {
    extension.addEventListener("click", () => {
        if (extension.dataset.selected == "true") {
            extension.dataset.selected = "false";
            document.getElementById("test").dataset.full = "true";
            //document.getElementById("open-editors").dataset.full = "true";
            return
        }
        extension.dataset.selected = "true";
        document.getElementById("test").dataset.full = "false";
        //document.getElementById("open-editors").dataset.full = "false"; 
        let id = extension.id;
        let childNodes = document.getElementById("top").childNodes;
        childNodes.forEach(node => {
            if (node.id != id && node instanceof SVGElement) {
                //console.log(node)
                node.dataset.selected = "false";
            }
        });
    })
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


        const selection = window.getSelection().getRangeAt(0); 

        switch (event.key.toLowerCase()) {

            case keyBinds.bold:
                event.preventDefault();
                format("bold", selection, "bold");
                break;

            case keyBinds.italics:
                event.preventDefault();
                format("italic", selection, "italic");
                break;
                
            case keyBinds.underline:
                event.preventDefault();
                format("underline", selection, "underline");
                break;

            case keyBinds.highlight:
                event.preventDefault();
                format("highlight", selection, color, true);
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

            case keyBinds.test:
                event.preventDefault();
                const editor = document.getElementById("main");
                console.log(getCaretIndex(editor));
                break;

            default:
                //console.log("Not Implemented");
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
        states.push(newState);
        currentState++;
        // console.log(states)
    }
})

function tab() {
    
    const [pos, node] = getCaretPos();

    const text = node.innerText;

    node.innerHTML = text.slice(0, pos).replaceAll(" ", "&nbsp;") + "&nbsp;&nbsp;&nbsp;&nbsp;" + text.slice(pos).replaceAll(" ", "&nbsp;");
    
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
function format(elementType, selection, data, isData = false) {
    // get the text string of the editor
    var text, text1; 
    var multi_para = false;
    var undo = false;

    // get selection
    // const selection = window.getSelection().getRangeAt(0);

    // // get containers
    const startContainer = selection.startContainer;
    const endContainer = selection.endContainer;
    
    const startContainerClasses = window.getComputedStyle(startContainer.parentElement);
    const endContainerClasses = window.getComputedStyle(endContainer.parentElement)
    
    var startOffset = selection.startOffset;
    var endOffset = selection.endOffset;

    var val1 = startContainerClasses.getPropertyValue("--" + elementType)
    var val2 = endContainerClasses.getPropertyValue("--" + elementType)

    console.log(startContainerClasses, endContainerClasses)

    if (val1 == val2 && val1 != "inherit" && val1 != "") {
        undo = true;
        console.log(undo);
    }
    //console.log(startContainer.parentElement.classList , endContainer.parentElement.classNames)

    if (startContainer === endContainer) {
        var textArea = startContainer.parentElement.parentElement;
    }
    else if (selection.commonAncestorContainer.tagName == "P") {
        var textArea = selection.commonAncestorContainer;
    }
    else {
        multi_para = true;
    }

    if (!multi_para) {

        // get childnodes
        var childnodes =  textArea.childNodes;

        // assumption: if not span then depth 1
        var indexStart = Array.from(childnodes).indexOf(startContainer.parentElement);

        var indexEnd = Array.from(childnodes).indexOf(endContainer.parentElement);

        // case 1: single line no boling
        if (indexStart === indexEnd) {
             console.log("1")
            // get text
            text = startContainer.parentElement.innerText;

            const newSpan = document.createElement("span");
            const formatedSpan = document.createElement("span");

            newSpan.innerHTML = text.slice(0, startOffset).replaceAll(" ", "&nbsp;");
            formatedSpan.innerHTML = text.slice(startOffset, endOffset).replaceAll(" ", "&nbsp;");

            textArea.insertBefore(newSpan, startContainer.parentElement);
            textArea.insertBefore(formatedSpan, startContainer.parentElement);

            formatedSpan.style.cssText += startContainerClasses.cssText;
            newSpan.style.cssText += startContainerClasses.cssText;
        
            if (undo) {
                formatedSpan.style.setProperty("--" + elementType, "inherit");
            } else {
                formatedSpan.style.setProperty("--" + elementType, data);
            }

            startContainer.parentElement.innerHTML = text.slice(endOffset).replaceAll(" ", "&nbsp;");
        }

        else if (indexStart + 1 === indexEnd) {

            console.log("2")

            text = startContainer.parentElement.innerText;
            text1 = endContainer.parentElement.innerText;

            const formatedspan1 = document.createElement("span");
            const formatedspan2 = document.createElement("span");

            formatedspan1.innerHTML = text.slice(startOffset).replaceAll(" ", "&nbsp;") 
            formatedspan2.innerHTML =  text1.slice(0, endOffset).replaceAll(" ", "&nbsp;");

            formatedspan1.style.cssText += startContainerClasses.cssText;
            formatedspan2.style.cssText += endContainerClasses.cssText; 
            

            //console.log(startContainerClasses, endContainerClasses)

            if (undo) {
                formatedspan1.style.setProperty("--" + elementType, "inherit");
                formatedspan2.style.setProperty("--" + elementType, "inherit");
            } else {
                formatedspan1.style.setProperty("--" + elementType, data);
                formatedspan2.style.setProperty("--" + elementType, data);
            }

            textArea.insertBefore(formatedspan1, endContainer.parentElement);
            textArea.insertBefore(formatedspan2, endContainer.parentElement);
            
            startContainer.parentElement.innerHTML = text.slice(0, startOffset).replaceAll(" ", "&nbsp;");
            endContainer.parentElement.innerHTML = text1.slice(endOffset).replaceAll(" ", "&nbsp;");

        }

        else {

            console.log("3")

            text = startContainer.parentElement.innerText;
            text1 = endContainer.parentElement.innerText;
            
            for (let index = indexStart + 1; index < indexEnd; index++) {
                if (undo) {
                    childnodes[index].style.setProperty("--" + elementType, "inherit");
                } else { childnodes[index].style.setProperty("--" + elementType, data); }  
            }

            const formatedspan1 = document.createElement("span");
            const formatedspan2 = document.createElement("span");

            formatedspan1.innerHTML = text.slice(startOffset).replaceAll(" ", "&nbsp;") 
            formatedspan2.innerHTML =  text1.slice(0, endOffset).replaceAll(" ", "&nbsp;");

            
            formatedspan1.style.cssText += startContainerClasses.cssText;
            formatedspan2.style.cssText += endContainerClasses.cssText; 
            

            if (undo) {
                formatedspan1.style.setProperty("--" + elementType, "inherit");
                formatedspan2.style.setProperty("--" + elementType, "inherit");
            } else {
                formatedspan1.style.setProperty("--" + elementType, data);
                formatedspan2.style.setProperty("--" + elementType, data);
            }

            textArea.insertBefore(formatedspan1, childnodes[indexStart+1]);
            textArea.insertBefore(formatedspan2, endContainer.parentElement);
            
            startContainer.parentElement.innerHTML = text.slice(0, startOffset).replaceAll(" ", "&nbsp;");
            endContainer.parentElement.innerHTML = text1.slice(endOffset).replaceAll(" ", "&nbsp;");

        }
    } else {

        const editorChilds = document.querySelectorAll("div.main>p");

        //console.log(startOffset, endOffset)

        var parent1 = startContainer.parentElement.parentElement;
        var parent2 = endContainer.parentElement.parentElement;

        var indexParentStart = Array.from(editorChilds).indexOf(parent1);

        var indexParentEnd = Array.from(editorChilds).indexOf(parent2);

        var childnodesStart =  parent1.childNodes;
        var childnodesEnd =  parent2.childNodes;

        var indexStart = Array.from(childnodesStart).indexOf(startContainer.parentElement);

        var indexEnd = Array.from(childnodesEnd).indexOf(endContainer.parentElement);

        text = startContainer.parentElement.innerText;
        text1 = endContainer.parentElement.innerText;

        const formatedspan1 = document.createElement("span");
        const formatedspan2 = document.createElement("span");

        formatedspan1.style.cssText += startContainerClasses.cssText;
        formatedspan2.style.cssText += endContainerClasses.cssText; 

        if (undo) {
            formatedspan1.style.setProperty("--" + elementType, "inherit");
            formatedspan2.style.setProperty("--" + elementType, "inherit");
        } else {
            formatedspan1.style.setProperty("--" + elementType, data);
            formatedspan2.style.setProperty("--" + elementType, data);
        }

        formatedspan1.innerHTML = text.slice(startOffset).replaceAll(" ", "&nbsp;");
        formatedspan2.innerHTML =  text1.slice(0, endOffset).replaceAll(" ", "&nbsp;");

        for (let index = indexStart + 1; index < childnodesStart.length; index++) {
            if (undo) { childnodesStart[index].style.setProperty("--" + elementType, "inherit"); } else { childnodesStart[index].style.setProperty("--" + elementType, data); }
        }

        for (let index = 0; index < indexEnd; index++) {
            if (undo) { childnodesEnd[index].style.setProperty("--" + elementType, "inherit"); } else { childnodesEnd[index].style.setProperty("--" + elementType, data); }
        }

        parent1.insertBefore(formatedspan1, childnodesStart[indexStart+1]);
        parent2.insertBefore(formatedspan2, endContainer.parentElement);

        startContainer.parentElement.innerHTML = text.slice(0, startOffset).replaceAll(" ", "&nbsp;");
        endContainer.parentElement.innerHTML = text1.slice(endOffset).replaceAll(" ", "&nbsp;");

        for (let index = indexParentStart + 1; index <= indexParentEnd - 1; index++) {
            editorChilds[index].childNodes.forEach(element => {
                if (undo) {element.style.setProperty("--" + elementType, "inherit");} else {element.style.setProperty("--" + elementType, data);};
            });
        }

        //console.log(indexStart, indexEnd, childnodesStart, childnodesEnd);
    }

    // Clean up
    document.getElementById("main").childNodes.forEach(child => {
        let newChildNodes = child.childNodes;
        newChildNodes.forEach(element => {
            if (element.innerText === "") {
                element.remove();
            }
        });
    });

    //console.log(document.getElementById("main").childNodes)
}