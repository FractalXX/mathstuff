window.addEventListener('load', onLoad, false);

let numBits;
let exponentBits = 4;
let fractionBits = 4;

let input = 0;
let exponent = '';
let mantissa = '';

let signed = false;
let translateExponent = false;

function onLoad() {
    numBits = 8;

    $('input[name="bits"]').change(function () {
        numBits = $(this).val();
        document.getElementById('exp-fr').max = numBits;
        update();
    });

    $('input[name="exp-fr"]').change(function () {
        exponentBits = $(this).val();
        fractionBits = numBits - $(this).val();
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

    updateBits();
    convert();

    let i = 0;
    document.querySelectorAll('.bit').forEach(function (element) {
        if (i == 0 && signed) {
            element.innerHTML = input > 0 ? 0 : 1;
        } else {
            let offset = signed ? 1 : 0;
            element.innerHTML = exponent[i - offset] ? exponent[i - offset] : mantissa[i - exponent.length - offset];
        }
        i++;
    });

    document.getElementById('exp-label').innerText = exponentBits;
    document.getElementById('fra-label').innerText = fractionBits;
}

function convert() {
    exponent = '';
    mantissa = '';
    let buffer = Math.trunc(input);
    for (let i = 0; i < exponentBits; i++) {
        if (Math.abs(buffer / 2) > 0) {
            exponent += Math.abs(Math.trunc((buffer % 2))).toString();
            buffer = buffer / 2;
        } else {
            exponent += '0';
        }
    }

    buffer = Math.abs(input) - Math.trunc(Math.abs(input));

    for (let i = 0; i < 32; i++) {
        if (i < fractionBits) {
            buffer *= 2;
            if (buffer > 0) {
                mantissa += Math.trunc(buffer);
            } else {
                mantissa += 0;
            }
            if (buffer >= 1) {
                buffer -= 1;
            }
        } else {
            mantissa += '0';
        }
    }

    exponent = exponent.split('').reverse().join('');

    if (translateExponent) {
        let trimmed = trimLeadingZeros(exponent);
        let offset = trimmed.length - 1;
        exponent = ((127 + offset) >>> 0).toString(2);
        mantissa = trimmed.substring(1, trimmed.length) + mantissa;
    }
}

function trimLeadingZeros(number) {
    let i = 0;
    while (number[i] != '1' && i < number.length) {
        i++;
    }
    return number.substring(i, number.length);
}