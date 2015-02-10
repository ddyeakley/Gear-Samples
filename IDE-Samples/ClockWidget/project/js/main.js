/*global window, document, tizen, console, setTimeout */
/*jslint plusplus: true*/

var canvas, context, clockRadius;

window.requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        'use strict';
        window.setTimeout(callback, 1000 / 60);
    };

function renderDots() {
    'use strict';

    var dx = 0,
        dy = 0,
        i = 1,
        angle = null;

    context.save();

    //Assigns the clock creation location in the middle of the canvas
    context.translate(canvas.width / 2, canvas.height / 2);

    //Assign the style of the number which will be applied to the clock plate
    context.beginPath();

    context.fillStyle = '#999999';

    //Create 4 dots in a circle
    for (i = 1; i <= 4; i++) {
        angle = (i - 3) * (Math.PI * 2) / 4;
        dx = clockRadius * 0.9 * Math.cos(angle);
        dy = clockRadius * 0.9 * Math.sin(angle);

        context.arc(dx, dy, 3, 0, 2 * Math.PI, false);
        context.fill();
    }
    context.closePath();

    //Render center dot
    context.beginPath();

    context.fillStyle = '#ff9000';
    context.strokeStyle = '#fff';
    context.lineWidth = 4;

    context.arc(0, 0, 7, 0, 2 * Math.PI, false);
    context.fill();
    context.stroke();
    context.closePath();
}

function renderNeedle(angle, radius) {
    'use strict';
    context.save();
    context.rotate(angle);
    context.beginPath();
    context.lineWidth = 4;
    context.strokeStyle = '#fff';
    context.moveTo(6, 0);
    context.lineTo(radius, 0);
    context.closePath();
    context.stroke();
    context.closePath();
    context.restore();

}

function renderHourNeedle(hour) {
    'use strict';

    var angle = null,
        radius = null;

    angle = (hour - 3) * (Math.PI * 2) / 12;
    radius = clockRadius * 0.55;
    renderNeedle(angle, radius);
}

function renderMinuteNeedle(minute) {
    'use strict';

    var angle = null,
        radius = null;

    angle = (minute - 15) * (Math.PI * 2) / 60;
    radius = clockRadius * 0.75;
    renderNeedle(angle, radius);
}

function getDate() {
    'use strict';

    var date;
    try {
        date = tizen.time.getCurrentDateTime();
    } catch (err) {
        console.error('Error: ', err.message);
        date = new Date();
    }

    return date;
}

function watch() {
    'use strict';

    //Import the current time
    //noinspection JSUnusedAssignment
    var date = getDate(),
        hours = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds(),
        hour = hours + minutes / 60,
        minute = minutes + seconds / 60,
        nextMove = 1000 - date.getMilliseconds();

    //Erase the previous time
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    renderDots();
    renderHourNeedle(hour);
    renderMinuteNeedle(minute);

    context.restore();
    setTimeout(function () {
        window.requestAnimationFrame(watch);
    }, nextMove);
}

window.onload = function () {
    'use strict';

    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');
    clockRadius = document.width / 2;

    //Assigns the area that will use Canvas
    canvas.width = document.width;
    canvas.height = canvas.width;

    //add eventListener for tizenhwkey
    window.addEventListener('tizenhwkey', function (e) {
        if (e.keyName === 'back') {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (err) {
                console.error('Error: ', err.message);
            }
        }
    });

    window.requestAnimationFrame(watch);
};
