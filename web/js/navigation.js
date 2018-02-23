window.addEventListener("load", onLoad, false);

var navButtons;

function onLoad() {
    $("#nav-placeholder").load("nav.html", function() {
        navButtons = document.querySelectorAll(".nav-button");
        navButtons.forEach((element) => {
            element.addEventListener("click", setActive, false);
            if(element.innerHTML.toLowerCase() == document.title.toLowerCase()) {
                element.classList.add("active");
            }
        });
    });
}

function setActive() {
    navButtons.forEach((element) => {
        element.classList.remove("active");
    });
    this.classList.add("active");
}