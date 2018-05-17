window.addEventListener('load', onLoad, false);

let numBits;
let exponentBits = 4;
let fractionBits = 4;

let input = 0;
let exponent = '';
let fraction = '';

let signed = false;
let translateExponent = false;

function onLoad() {
    numBits = 8;

    $('input[name="bits"]').change(function () {
        numBits = $(this).val();
        update();
    });

    $('input[name="exp-fr"]').change(function () {
        exponentBits = numBits - $(this).val();
        fractionBits = $(this).val();
        update();
    });

    $('input[name="number"]').keyup(function () {
        input = parseFloat($(this).val());
        update();
    });

    $('input[name="signed"]').change(function () {
        signed = !signed;
        update();
    });

    $('input[name="translate"]').change(function () {
        translateExponent = !translateExponent;
        update();
    });

    update();
}

function updateBits() {
    document.querySelectorAll('.bit').forEach(function (element) {
        element.remove();
    });

    let bin = document.getElementById('binary-point');
    if (bin) {
        bin.remove();
    }

    let resultDiv = document.getElementById('result-div');
    for (let i = 0; i < numBits; i++) {
        let bitDiv = document.createElement('div');
        bitDiv.classList.add('bit');

        if (i == exponentBits) {
            let binaryPoint = document.createElement('span');
            binaryPoint.innerHTML = '.';
            binaryPoint.id = 'binary-point';
            resultDiv.appendChild(binaryPoint);
        }

        resultDiv.appendChild(bitDiv);
    }
}

function update() {
    document.getElementById('exp-fr').max = numBits;
    if (document.getElementById('exp-fr').value > numBits) {
        document.getElementById('exp-fr').value = numBits;
        exponentBits = 0;
        fractionBits = numBits;
    }

    updateBits();
    convert();

    let i = 0;
    document.querySelectorAll('.bit').forEach(function (element) {
        if (i == 0 && signed) {
            element.innerHTML = input > 0 ? 0 : 1;
        } else {
            element.innerHTML = exponent[i] ? exponent[i] : fraction[i - exponent.length];
        }
        i++;
    });

    document.getElementById('exp-label').innerText = exponentBits;
    document.getElementById('fra-label').innerText = fractionBits;
}

function convert() {
    exponent = '';
    fraction = '';
    let buffer = Math.trunc(input);
    for (let i = 0; i < exponentBits; i++) {
        if (Math.abs(buffer / 2) > 0) {
            exponent += Math.abs(Math.trunc((buffer % 2))).toString();
            buffer = buffer / 2;
        } else {
            exponent += '0';
        }
    }

    if (translateExponent) {
        let translationBase = Math.pow(2, exponentBits) - 1;
        let trimmed = trimLeadingZeros(exponent);
        let offset = trimmed.length - 1;
        // convert translated (with the method)
    }

    buffer = Math.abs(input) - Math.trunc(Math.abs(input));

    for (let i = 0; i < fractionBits; i++) {
        buffer *= 2;
        if (buffer > 0) {
            fraction += Math.trunc(buffer);
        } else {
            fraction += 0;
        }
        if (buffer >= 1) {
            buffer -= 1;
        }
    }

    exponent = exponent.split('').reverse().join('');
}

function trimLeadingZeros(number) {
    let i = 0;
    while (number[i] != '1') {
        i++;
    }
    return number.substring(i, number.length - 1);
}

function decToBin(number) {
    let buffer = Math.trunc(number);
    for (let i = 0; i < exponentBits; i++) {
        if (Math.abs(buffer / 2) > 0) {
            exponent += Math.abs(Math.trunc((buffer % 2))).toString();
            buffer = buffer / 2;
        } else {
            exponent += '0';
        }
    }
}