document.addEventListener("load", onLoad, false);

var constraints = {};

function onLoad() {
    document.getElementById("add-button", addConstraint, false);
}

function addConstraint() {
    let expression = jsep(document.getElementById("constraint-box").value);
    
}