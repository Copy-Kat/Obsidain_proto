var states = [];
var currentState = 0

function setup() {
    
    var previousState = document.getElementById("main").innerHTML;

    states.push(previousState);

}

const keyBinds = {

    bold : "b",
    italics : "i",
    underline : "u",
    undo : "z",
    test : "t"
    
}

const extensions = document.getElementById("top").childNodes;
extensions.forEach(extension => {
    extension.addEventListener("click", () => {
        if (extension.dataset.selected == "true") {
            extension.dataset.selected = "false";
            document.getElementById("main").dataset.full = "true";
            document.getElementById("open-editors").dataset.full = "true";
            return
        }
        extension.dataset.selected = "true";
        document.getElementById("main").dataset.full = "false";
        document.getElementById("open-editors").dataset.full = "false"; 
        let id = extension.id;
        let childNodes = document.getElementById("top").childNodes;
        childNodes.forEach(node => {
            if (node.id != id && node instanceof SVGElement) {
                //console.log(node)
                node.dataset.selected = "false"
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
        const selection = window.getSelection().getRangeAt(0)       

        switch (event.key) {
            case keyBinds.bold:
                event.preventDefault();
                format("bold", selection);
                break;
            case keyBinds.italics:
                event.preventDefault();
                format("em", selection);
                break;
            case keyBinds.underline:
                event.preventDefault();
                format("u", selection);
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
        states.push(newState)
        currentState++;
        // console.log(states)
    }
})


// TEXT FORMATING
function format(elementType, selection) {
    // get the text string of the editor
    var text, text1; 
    var multi_para = false;
    var undo = false;

    // get selection
    // const selection = window.getSelection().getRangeAt(0);

    // // get containers
    const startContainer = selection.startContainer;
    const endContainer = selection.endContainer;
    
    const startContainerClasses = startContainer.parentElement.classList
    const endContainerClasses = endContainer.parentElement.classList
    
    var startOffset = selection.startOffset;
    var endOffset = selection.endOffset;

    if (startContainerClasses.contains(elementType) && endContainerClasses.contains(elementType)) {
        undo = true;
        console.log(undo);
    }
    //console.log(startContainer.parentElement.classList , endContainer.parentElement.classNames)

    if (startContainer === endContainer) {
        var textArea = startContainer.parentElement.parentElement
    }
    else if (selection.commonAncestorContainer.tagName == "P") {
        var textArea = selection.commonAncestorContainer
    }
    else {
        multi_para = true
    }

    if (!multi_para) {

        // classes 
        

        
        //console.log(textArea)

        

        // console.log(startContainerClasses, endContainerClasses)
        
        // get the main editor
        //var textArea = startContainer.parentElement;
        //document.getElementById(id).focus(); // keep focus

        //console.log(startContainer, endContainer);

        // get childnodes
        var childnodes =  textArea.childNodes;

        // console.log(childnodes)

        // assumption: if not span then depth 1
        var indexStart = Array.from(childnodes).indexOf(startContainer.parentElement);

        var indexEnd = Array.from(childnodes).indexOf(endContainer.parentElement);

        // console.log(indexStart, indexEnd)

        // get offset
        

        // console.log(startOffset, endOffset)

        // get the cases

        // case 1: single line no boling
        if (indexStart === indexEnd) {
            // console.log("1")
            // get text
            text = startContainer.parentElement.innerText;

            const newSpan = document.createElement("span");
            const formatedSpan = document.createElement("span");

            newSpan.innerHTML = text.slice(0, startOffset).replaceAll(" ", "&nbsp;");
            formatedSpan.innerHTML = text.slice(startOffset, endOffset).replaceAll(" ", "&nbsp;");

            textArea.insertBefore(newSpan, startContainer.parentElement);
            textArea.insertBefore(formatedSpan, startContainer.parentElement);

            if (startContainerClasses.length != 0) {
                formatedSpan.classList = startContainerClasses  
                newSpan.classList = startContainerClasses  
            }

            if (undo) {
                formatedSpan.classList.remove(elementType);
            } else {
                formatedSpan.classList.add(elementType);
            }

            startContainer.parentElement.innerHTML = text.slice(endOffset).replaceAll(" ", "&nbsp;");
        }

        else if (indexStart + 1 === indexEnd) {

            text = startContainer.parentElement.innerText;
            text1 = endContainer.parentElement.innerText;

            const formatedspan1 = document.createElement("span");
            const formatedspan2 = document.createElement("span");

            formatedspan1.innerHTML = text.slice(startOffset).replaceAll(" ", "&nbsp;") 
            formatedspan2.innerHTML =  text1.slice(0, endOffset).replaceAll(" ", "&nbsp;");

            if (startContainerClasses.length != 0) {
                formatedspan1.classList = startContainerClasses    
            }
            if (endContainerClasses.length != 0) {
                formatedspan2.classList = endContainerClasses    
            }

            //console.log(startContainerClasses, endContainerClasses)

            if (undo) {
                formatedspan1.classList.remove(elementType);
                formatedspan2.classList.remove(elementType)
            } else {
                formatedspan1.classList.add(elementType);
                formatedspan2.classList.add(elementType);
            }

            textArea.insertBefore(formatedspan1, endContainer.parentElement);
            textArea.insertBefore(formatedspan2, endContainer.parentElement);
            
            startContainer.parentElement.innerHTML = text.slice(0, startOffset).replaceAll(" ", "&nbsp;");
            endContainer.parentElement.innerHTML = text1.slice(endOffset).replaceAll(" ", "&nbsp;");

        }

        else {

            text = startContainer.parentElement.innerText;
            text1 = endContainer.parentElement.innerText;
            
            for (let index = indexStart + 1; index < indexEnd; index++) {
                if (undo && childnodes[index].classList.contains(elementType)) {
                    childnodes[index].classList.remove(elementType);
                } else { childnodes[index].classList.add(elementType); }  
            }

            const formatedspan1 = document.createElement("span");
            const formatedspan2 = document.createElement("span");

            formatedspan1.innerHTML = text.slice(startOffset).replaceAll(" ", "&nbsp;") 
            formatedspan2.innerHTML =  text1.slice(0, endOffset).replaceAll(" ", "&nbsp;");

            if (startContainerClasses.length != 0) {
                formatedspan1.classList = startContainerClasses    
            }
            if (endContainerClasses.length != 0) {
                formatedspan2.classList = endContainerClasses    
            }

            if (undo) {
                formatedspan1.classList.remove(elementType);
                formatedspan2.classList.remove(elementType)
            } else {
                formatedspan1.classList.add(elementType);
                formatedspan2.classList.add(elementType);
            }

            textArea.insertBefore(formatedspan1, childnodes[indexStart+1]);
            textArea.insertBefore(formatedspan2, endContainer.parentElement);
            
            startContainer.parentElement.innerHTML = text.slice(0, startOffset).replaceAll(" ", "&nbsp;");
            endContainer.parentElement.innerHTML = text1.slice(endOffset).replaceAll(" ", "&nbsp;");

        }
    } else {
        const editorChilds = document.querySelectorAll("div.main>p")

        console.log(startOffset, endOffset)

        var parent1 = startContainer.parentElement.parentElement
        var parent2 = endContainer.parentElement.parentElement

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

        if (startContainerClasses.length != 0) {
            formatedspan1.classList = startContainerClasses    
        }
        if (endContainerClasses.length != 0) {
            formatedspan2.classList = endContainerClasses    
        }

        if (undo) {
            formatedspan1.classList.remove(elementType);
            formatedspan2.classList.remove(elementType)
        } else {
            formatedspan1.classList.add(elementType);
            formatedspan2.classList.add(elementType);
        }

        formatedspan1.innerHTML = text.slice(startOffset).replaceAll(" ", "&nbsp;") 
        formatedspan2.innerHTML =  text1.slice(0, endOffset).replaceAll(" ", "&nbsp;");

        for (let index = indexStart + 1; index < childnodesStart.length; index++) {
            if (undo) { childnodesStart[index].classList.remove(elementType) } else { childnodesStart[index].classList.add(elementType) }
        }

        for (let index = 0; index < indexEnd; index++) {
            if (undo) { childnodesEnd[index].classList.remove(elementType) } else { childnodesEnd[index].classList.add(elementType) }
        }

        parent1.insertBefore(formatedspan1, childnodesStart[indexStart+1]);
        parent2.insertBefore(formatedspan2, endContainer.parentElement);

        startContainer.parentElement.innerHTML = text.slice(0, startOffset).replaceAll(" ", "&nbsp;");
        endContainer.parentElement.innerHTML = text1.slice(endOffset).replaceAll(" ", "&nbsp;");

        for (let index = indexParentStart + 1; index <= indexParentEnd - 1; index++) {
            editorChilds[index].childNodes.forEach(element => {
                if (undo) {element.classList.remove(elementType)} else {element.classList.add(elementType)};
            });
        }

        console.log(indexStart, indexEnd, childnodesStart, childnodesEnd)
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

// TODO: FIX THIS
function enter() {
    const selection = window.getSelection().getRangeAt(0);
    
    text = selection.startContainer.parentElement.innerText;

    console.log(selection.startContainer.parentElement.innerHTML)

    selection.startContainer.parentElement.innerHTML = text.slice(0, selection.startOffset) + "</br>" + text.slice(selection.startOffset);
}