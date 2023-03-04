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
    undo : "z"
    
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
        switch (event.key) {
            case keyBinds.bold:
                event.preventDefault();
                format("bold");
                break;
            case keyBinds.italics:
                event.preventDefault();
                format("em");
                break;
            case keyBinds.underline:
                event.preventDefault();
                format("u");
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
function format(elementType) {
    // get the text string of the editor
    var text, text1, textArea; 
    var multi_line = false;
    var undo = false;

    // get selection
    const selection = window.getSelection().getRangeAt(0);

    // get containers
    const startContainer = selection.startContainer;
    const endContainer = selection.endContainer;

    //console.log(startContainer.parentElement.classList , endContainer.parentElement.classNames)

    // classes 
    const startContainerClasses = startContainer.parentElement.classList
    const endContainerClasses = endContainer.parentElement.classList

    if (startContainerClasses.contains(elementType) && endContainerClasses.contains(elementType)) {
        undo = true;
        console.log(undo);
    }

    // console.log(startContainerClasses, endContainerClasses)

    if (startContainer === endContainer) {
        textArea = startContainer.parentElement.parentElement
    }
    else {
        textArea = selection.commonAncestorContainer
    }
    
    // get the main editor
    //var textArea = startContainer.parentElement;
    //document.getElementById(id).focus(); // keep focus

    //console.log(startContainer, endContainer);

    // get childnodes
    var childnodes =  textArea.childNodes;

    // console.log(childnodes)
    
    // get the indecies 
    var indexStart, indexEnd

    // assumption: if not span then depth 1
    var indexStart = Array.from(childnodes).indexOf(startContainer.parentElement);

    var indexEnd = Array.from(childnodes).indexOf(endContainer.parentElement);

    // console.log(indexStart, indexEnd)

    // get offset
    var startOffset = selection.startOffset;
    var endOffset = selection.endOffset;

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

        console.log(startContainerClasses, endContainerClasses)

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
            childnodes[index].classList.add(elementType)
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

        console.log(startContainerClasses, endContainerClasses)

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