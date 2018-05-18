window.addEventListener('load', onLoad, false);

let canvas;
let ctx;

let points = [];
let pointSize = 10;

let grabbedIndex = -1;

let scale = 20;

let origo;

let variable = 0;
let value = 0;

function onLoad() {
    canvas = document.getElementById('graph-canvas');

    setCanvasSize(600, 600);
    update();

    document.getElementById('graph-canvas').addEventListener('mousedown', canvasMouseDown, true);
    document.getElementById('graph-canvas').addEventListener('mousemove', canvasMouseMove, true);
    document.getElementById('graph-canvas').addEventListener('mouseup', canvasMouseUp, true);

    var plotScale = document.getElementById("plot-scale");
    plotScale.addEventListener("keyup", update, true);

    document.getElementById("inc-scale").addEventListener("click", function () {
        plotScale.value = parseFloat(plotScale.value) + 1;
        update();
    }, false);

    document.getElementById("dec-scale").addEventListener("click", function () {
        plotScale.value = parseFloat(plotScale.value) - 1;
        update();
    }, false);
}

function setCanvasSize(width, height) {
    canvas.width = width;
    canvas.height = height;

    canvas.style['width'] = width + 'px';
    canvas.style['height'] = height + 'px';

    origo = new Point(canvas.width / 2, canvas.height / 2);

    ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.translate(canvas.width / 2, canvas.height / 2);

    points.push(new Point(variable, 0));
}

function canvasMouseDown(e) {
    points.forEach(function (point) {
        if (Math.abs(point.x - e.offsetX + canvas.width / 2) <= pointSize && Math.abs(point.y - e.offsetY + canvas.height / 2) <= pointSize) {
            grabbedIndex = points.indexOf(point);
        }
    });
    if (grabbedIndex == -1) {
        points.push(new Point(e.offsetX - canvas.width / 2, e.offsetY - canvas.height / 2));
        grabbedIndex = points.length - 1;
    }
    update();
}

function canvasMouseMove(e) {
    if (grabbedIndex > 0) {
        points[grabbedIndex].x = e.offsetX - canvas.width / 2;
        points[grabbedIndex].y = e.offsetY - canvas.height / 2;
    } else if (grabbedIndex == 0) {
        variable = e.offsetX - canvas.width / 2;
        points[grabbedIndex].x = e.offsetX - canvas.width / 2;
    }
    update();
}

function canvasMouseUp(e) {
    grabbedIndex = -1;
}

function update() {
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    drawCoordGrid();
    updateResult();

    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = "#00FF00";

    if (points.length > 1) {
        drawLagrange();
    }

    for (let i = 1; i < points.length; i++) {
        ctx.fillRect(points[i].x - pointSize / 2, points[i].y - pointSize / 2, pointSize, pointSize);
    }
}

function updateResult() {
    scale = parseFloat(document.getElementById("plot-scale").value);
    if (scale < 5) {
        scale = 5;
    }

    ctx.fillStyle = '#FF0000';
    ctx.strokeStyle = '#FF0000';
    value = evaluate(variable);
    document.getElementById('result-label').innerText = 'Value at ' + (variable / scale) + ': ' + (-value / scale);
    ctx.fillRect(variable - pointSize / 2, 0, pointSize, pointSize);

    ctx.beginPath();
    ctx.moveTo(variable, 0);
    ctx.lineTo(variable, value);
    ctx.stroke();
}

function drawLagrange() {
    let a = -canvas.width / 2;
    let b = canvas.width / 2;
    let t = a;

    let x0, y0, x1, y1;
    x0 = t //* scale;
    y0 = 0;
    for (let i = 1; i < points.length; i++) {
        y0 += interpolate(i, t) * points[i].y;
    }
    //y0 *= scale;

    ctx.beginPath();

    while (t < b) {
        t++;
        x1 = t //* scale;
        y1 = 0;

        for (let i = 1; i < points.length; i++) {
            y1 += interpolate(i, t) * points[i].y;
        }
        //y1 *= scale;

        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);

        x0 = x1;
        y0 = y1;
    }

    ctx.stroke();
}

function drawCoordGrid() {
    ctx.beginPath();
    ctx.lineWidth = 1;

    for (var x = 0; x < canvas.width / 2; x += scale) {
        ctx.moveTo(x, -canvas.height);
        ctx.lineTo(x, canvas.height);
    }

    for (var x = 0; x > -canvas.width / 2; x -= scale) {
        ctx.moveTo(x, -canvas.height / 2);
        ctx.lineTo(x, canvas.height / 2);
    }

    for (var y = 0; y < canvas.height / 2; y += scale) {
        ctx.moveTo(-canvas.width / 2, y);
        ctx.lineTo(canvas.width / 2, y);
    }

    for (var y = 0; y > -canvas.height / 2; y -= scale) {
        ctx.moveTo(-canvas.width / 2, y);
        ctx.lineTo(canvas.width / 2, y);
    }

    ctx.strokeStyle = "#AAAAAA";
    ctx.stroke();
}

function interpolate(index, x) {
    let s = 1;
    for (let i = 1; i < points.length; i++) {
        if (i != index) {
            s *= (x - points[i].x) / (points[index].x - points[i].x);
        }
    }
    return s;
}

function evaluate(x) {
    y = 0;
    for (let i = 1; i < points.length; i++) {
        y += interpolate(i, x) * points[i].y;
    }
    return y;
}

function relativeToOrigo(point) {
    return new Point(point.x - origo.x, point.y - origo.y);
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}