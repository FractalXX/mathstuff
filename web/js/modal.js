function Modal(modalContent) {
    this.element = document.createElement("div");
    let modalStyle = document.createElement("style");
    let modalCSS = '.js-modal{ position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(0, 0, 0, .1); max-width: 650px; border-radius: 5px; } .js-modal img, .js-modal iframe, .js-modal video{ max-width: 100%; } .js-modal-inner{ position: relative; padding: 10px; } .js-modal-close{ position: absolute; top: -10px; right: -10px; background-color: black; color: #eee; border-width: 0; font-size: 10px; height: 24px; width: 24px; border-radius: 100%; text-align: center; }';
    let modalClose = '<button class="js-modal-close" id="js_modal_close">X</button>';

    this.element.setAttribute("class", "js-modal");
    this.element.innerHTML = '<div class="js-modal-inner">' + modalContent + modalClose + '</div>';
}

Modal.prototype.show = function () {
    let body = document.getElementsByTagName('body')[0];
    body.appendChild(this.element);
    let modalClose = document.querySelector("#js_modal_close");

    let element = this.element;
    if (modalClose) {
        modalClose.addEventListener('click', function () {
            element.remove();
            enableInput();
        });
    }
    disableInput();
};

let disableInput = function () {
    document.querySelectorAll('input').forEach(function (element) {
        if (!element.classList.contains('js-modal-close')) {
            element.disabled = true;
        }
    });
};

let enableInput = function () {
    document.querySelectorAll('input').forEach(function (element) {
        element.disabled = false;
    });
};