document.getElementById("bold").addEventListener("click", () => {

    // get the text string of the editor
    var text, text1, id

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
        // get text
        text = startContainer.parentElement.innerText;

        const newDiv = document.createElement("div");
        const boldDiv = document.createElement("div");

        newDiv.contentEditable = "true";
        boldDiv.contentEditable = "true";

        newDiv.innerHTML = text.slice(0, startOffset).replaceAll(" ", "&nbsp;");
        boldDiv.innerHTML = "<strong>" + text.slice(startOffset, endOffset).replaceAll(" ", "&nbsp;") + "</strong>";

        textArea.insertBefore(newDiv, startContainer.parentElement);
        textArea.insertBefore(boldDiv, startContainer.parentElement);

        startContainer.parentElement.innerHTML = text.slice(endOffset).replaceAll(" ", "&nbsp;");

        console.log(text.slice(0, startOffset))
    }

    else if (indexStart + 1 === indexEnd) {

        text = startContainer.parentElement.innerHTML;
        text1 = endContainer.parentElement.innerHTML;

        if (endContainer.parentElement.tagName === "STRONG"){
        
            startContainer.parentElement.innerHTML = text.slice(0, startOffset);
            endContainer.parentElement.innerHTML = text.slice(startOffset) + text1
            //console.log(text, text1)
        }
        else {
            startContainer.parentElement.innerHTML = text + text1.slice(0, endOffset + 5);
            endContainer.parentElement.innerHTML = text1.slice(endOffset + 5);
        }
    }


    // else {
    //     // case 2: 2 consecutive div no bold
    //     if (indexStart + 2 === indexEnd) {
            
    //         text = startContainer.parentElement.innerText;
    //         text1 = endContainer.parentElement.innerText;
            
    //         const boldDiv1 = document.createElement("div");
    //         const boldDiv2 = document.createElement("div");

    //         boldDiv1.innerHTML = "<strong>" + text.slice(startOffset) + "</strong>";
    //         boldDiv2.innerHTML = "<strong>" + text1.slice(0, endOffset) + "</strong>";

    //         textArea.insertBefore(boldDiv1, startContainer.parentElement)
    //         textArea.insertBefore(boldDiv2, endContainer.parentElement);

    //         startContainer.parentElement.innerText = text.slice(0, startOffset);
    //         endContainer.parentElement.innerText = text1.slice(endOffset)
    //     }
    // }

    // console.log(selection.commonAncestorContainer == textArea)
    // console.log(selection)
    console.log(startOffset, endOffset)
    // console.log(selection.startContainer.parentElement, selection.endContainer.parentElement)
    
    
    console.log(indexStart, indexEnd)


    
    // var textArea = document.getElementById("main");
    // var text = textArea.innerHTML.toString();
    // var selection = window.getSelection();
    // if (selection.anchorOffset != selection.focusOffset) {
    //     console.log(selection.anchorOffset, selection.focusOffset)
    //     console.log(text.slice(selection.anchorOffset, selection.focusOffset))
    //     var newString = text.slice(0, selection.anchorOffset) 
    //                     + "<b>" + text.slice(selection.anchorOffset, selection.focusOffset) 
    //                     + "</b>" + text.slice(selection.focusOffset)
    //     console.log(textArea.innerHTML);
    //     textArea.innerHTML = newString;

    // }
    
    //let boldText = "<b>" + selection + "</b>"
    //document.getElementById("text").innerHTML = text.replace(selection, boldText) //use innerhtml instead of innertext
});


// document.addEventListener()

function italic() {
var editor = document.getElementById("main-area");
var start = editor.selectionStart;
var end = editor.selectionEnd;
var selectedText = editor.value.substring(start, end);
var newText = "<i>" + selectedText + "</i>";
editor.value =
    editor.value.substring(0, start) +
    newText +
    editor.value.substring(end);
}

function underline() {
    var editor = document.getElementById("main-area");
    var start = editor.selectionStart;
    var end = editor.selectionEnd;
    var selectedText = editor.value.substring(start, end);
    var newText = "<u>" + selectedText + "</u>";
    editor.value =
        editor.value.substring(0, start) +
        newText +
        editor.value.substring(end);
    }
