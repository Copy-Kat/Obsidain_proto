document.getElementById("bold").addEventListener("click", () => {
    format("STRONG", "<strong>", "</strong>");
});

document.getElementById("italic").addEventListener("click", () => {
    format("EM", "<em>", "</em>");
});

document.getElementById("underline").addEventListener("click", () => {
    format("U", "<u>", "</u>");
});

function format(elementType, elementOpen, elementClose) {
    // get the text string of the editor
    var text, text1, id
    var text2 = ""

    // get selection
    const selection = window.getSelection().getRangeAt(0);

    // get containers
    const startContainer = selection.startContainer;
    const endContainer = selection.endContainer;

    if (startContainer === endContainer) {
        id = startContainer.parentElement.parentElement.id
    }
    else {
        id = selection.commonAncestorContainer.id
    }
    
    // get the main editor
    var textArea = document.getElementById(id);
    document.getElementById(id).focus(); // keep focus

    console.log(startContainer, endContainer);

    // get childnodes
    var childnodes =  textArea.childNodes;

    console.log(childnodes)
    
    // get the indecies 
    var indexStart, indexEnd

    if(startContainer.parentElement.tagName === 'DIV') {
        var indexStart = Array.from(childnodes).indexOf(startContainer.parentElement);
    }
    else {
        indexStart = Array.from(childnodes).indexOf(startContainer.parentElement.parentElement);
    }

    if(endContainer.parentElement.tagName === 'DIV') {
        var indexEnd = Array.from(childnodes).indexOf(endContainer.parentElement);
    }
    else {
        indexEnd = Array.from(childnodes).indexOf(endContainer.parentElement.parentElement);
    }

    // get offset
    var startOffset = selection.startOffset;
    var endOffset = selection.endOffset;

    // get the cases

    // case 1: single line no boling
    if (indexStart === indexEnd) {
        // console.log("1")
        // get text
        text = startContainer.parentElement.innerText;

        const newDiv = document.createElement("div");
        const boldDiv = document.createElement("div");

        newDiv.contentEditable = "true";
        boldDiv.contentEditable = "true";

        newDiv.innerHTML = text.slice(0, startOffset).replaceAll(" ", "&nbsp;");
        boldDiv.innerHTML = elementOpen + text.slice(startOffset, endOffset).replaceAll(" ", "&nbsp;") + elementClose;

        textArea.insertBefore(newDiv, startContainer.parentElement);
        textArea.insertBefore(boldDiv, startContainer.parentElement);

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
        
        if (startContainer.parentElement.tagName === "DIV" && endContainer.parentElement.tagName === elementType){
        
            startContainer.parentElement.innerHTML = text.slice(0, startOffset).replaceAll(" ", "&nbsp;");
            endContainer.parentElement.innerHTML = text.slice(startOffset).replaceAll(" ", "&nbsp;") + text2.replaceAll(" ", "&nbsp;") + text1.replaceAll(" ", "&nbsp;")
        }

        else if (startContainer.parentElement.tagName === elementType && endContainer.parentElement.tagName === "DIV"){
        
            startContainer.parentElement.innerHTML = text.replaceAll(" ", "&nbsp;") + text2.replaceAll(" ", "&nbsp;") + text1.slice(0, endOffset).replaceAll(" ", "&nbsp;");
            endContainer.parentElement.innerHTML = text1.slice(endOffset).replaceAll(" ", "&nbsp;");
        }

        else if (startContainer.parentElement.tagName === "DIV" && endContainer.parentElement.tagName === "DIV"){
        
            const boldDiv = document.createElement("div");

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
}
