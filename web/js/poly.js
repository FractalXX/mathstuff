window.addEventListener("load", onLoad, false);

var polynomial;
var variable;

var canvas;
var ctx;

var scale;

var mousedown;

function onLoad() {
    document.getElementById("expr-box").addEventListener("keyup", updateExpression, true);
    document.getElementById("var-box").addEventListener("keyup", updateExpression, true);

    canvas = document.getElementById("graph-canvas");
    
    canvas.addEventListener("mousedown", function(e) {
        mousedown = true;
        getValueFromPlot(e); 
    }, true);
    canvas.addEventListener("mousemove", function(e) {
        if(mousedown) {
            getValueFromPlot(e); 
        }
    }, true);
    canvas.addEventListener("mouseup", function(e) {
        mousedown = false;
        getValueFromPlot(e); 
    }, true);

    canvas.width = 640;
    canvas.height = 480;
    ctx = canvas.getContext('2d');

    scale = 20;

    mousedown = false;

    redrawCanvas();
}

function drawCoordSystem() {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();

    drawCoordGrid();
}

function drawCoordGrid() {
    ctx.beginPath();
    ctx.lineWidth = 1;

    for(var x = 0; x < canvas.width; x += scale) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);       
    }

    for(var y = 0; y < canvas.height; y += scale) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);       
    }

    ctx.strokeStyle = "#AAAAAA";
    ctx.stroke();
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
   
    drawCoordSystem();
    if(polynomial !== undefined) {
        plotFunction(-50, 50, 0.1);
        ctx.fillStyle = "#00FFFF";
        ctx.fillRect(variable * scale + canvas.width / 2 - 2.5, -polynomial.eval(variable) * scale + canvas.height / 2 - 2.5, 5, 5);
        ctx.fillStyle = "#FFFF00";
        ctx.fillRect(variable * scale + canvas.width / 2, canvas.height / 2 - 10, 1, 20);
    }
}

function updateExpression() {
    polynomial = new Polynomial(document.getElementById("expr-box").value);
    variable = parseFloat(document.getElementById("var-box").value);
    var value = polynomial.eval(variable);
    if(value !== undefined && !isNaN(variable)) {
        document.getElementById("result").innerText = "Value of polynomial at " + variable + ": " + value;
        document.getElementById("horner-scheme").innerText = "Horner Scheme format: " + polynomial.toHorner();
    }
    redrawCanvas();
}

function getValueFromPlot(e) {
    variable = (e.offsetX - canvas.width / 2) / scale;
    document.getElementById("var-box").value = variable;
    updateExpression();
}

function plotFunction(min, max, increment) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    for(var x = min; x < max; x += increment) {
        ctx.moveTo(x*scale+canvas.width/2, -polynomial.eval(x)*scale+canvas.height/2);
        ctx.lineTo((x+increment)*scale+canvas.width/2, -polynomial.eval(x+increment)*scale+canvas.height/2);    
    }
    ctx.strokeStyle = "#00FF00";
    ctx.stroke();
}

/*function evaluate(coefficients, variable) {
    var s = 0;
    coefficients.forEach((key, number) => {
        s = s * variable + number;
    });
    return s;
}*/