document.getElementById("bold").addEventListener("click", () => {

    document.getElementById("main").focus();

    // get the main editor
    var textArea = document.getElementById("main");

    // get the text string of the editor
    var text //= textArea.innerHTML.toString();
    var text1

    // get selection
    const selection = window.getSelection().getRangeAt(0);

    // get containers
    const startContainer = selection.startContainer;
    const endContainer = selection.endContainer;

    // get childnodes
    var childnodes =  textArea.childNodes;
    
    // get the indecies 
    var indexStart = Array.from(childnodes).indexOf(startContainer.parentElement);
    var indexEnd = Array.from(childnodes).indexOf(endContainer.parentElement);

    // get offset
    var startOffset = selection.startOffset;
    var endOffset = selection.endOffset;

    // get the cases

    // case 1: same div no bolding yet
    if (indexStart === indexEnd) {
        // get text
        text = startContainer.innerHTML;
        text1 = startContainer.innerText;
        var newText = text.slice(0, startOffset) 
                        + "<strong>" + text1.slice(startOffset, endOffset) 
                        + "</strong>" + text.slice(endOffset)
        startContainer.parentElement.innerHTML = newText;
    }

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
