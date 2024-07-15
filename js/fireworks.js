"use strict";

function updateCoords(e) {
    pointerX = (e.clientX || e.touches[0].clientX) - canvasEl.getBoundingClientRect().left;
    pointerY = e.clientY || e.touches[0].clientY - canvasEl.getBoundingClientRect().top;
}

function setParticuleDirection(e) {
    var t = anime.random(0, 360) * Math.PI / 180,
        a = anime.random(20, 60), // 减小粒子的初始扩散范围
        n = [-1, 1][anime.random(0, 1)] * a;
    return { x: e.x + n * Math.cos(t), y: e.y + n * Math.sin(t) };
}

function createParticule(e, t) {
    var a = {};
    return a.x = e,
        a.y = t,
        a.color = colors[anime.random(0, colors.length - 1)],
        a.radius = anime.random(10, 20),
        a.endPos = setParticuleDirection(a),
        a.draw = function () {
            ctx.beginPath(),
                ctx.arc(a.x, a.y, a.radius, 0, 2 * Math.PI, !0),
                ctx.fillStyle = a.color,
                ctx.fill();
        },
        a;
}

function renderParticule(e) {
    for (var t = 0; t < e.animatables.length; t++) {
        e.animatables[t].target.draw();
    }
}

function animateParticules(e, t) {
    for (var n = [], i = 0; i < numberOfParticules; i++) {
        n.push(createParticule(e, t));
    }
    anime.timeline().add({
        targets: n,
        x: function (e) { return e.endPos.x },
        y: function (e) { return e.endPos.y },
        radius: [anime.random(10, 20), 0], // 粒子半径从初始值变为0，实现消散效果
        opacity: { value: 0, duration: 500 }, // 添加透明度变化，快速消散
        duration: anime.random(1000, 1500), // 减少动画持续时间
        easing: "easeOutExpo",
        update: renderParticule
    });
}

function debounce(e, t) {
    var a;
    return function () {
        var n = this,
            i = arguments;
        clearTimeout(a), a = setTimeout(function () {
            e.apply(n, i)
        }, t)
    }
}

var canvasEl = document.querySelector(".fireworks");
if (canvasEl) {
    var ctx = canvasEl.getContext("2d"),
        numberOfParticules = 30,
        pointerX = 0,
        pointerY = 0,
        tap = "mousedown",
        colors = ["#FF1461", "#18FF92", "#5A87FF", "#FBF38C"];

    var setCanvasSize = debounce(function () {
        canvasEl.width = 2 * window.innerWidth,
        canvasEl.height = 2 * window.innerHeight,
        canvasEl.style.width = window.innerWidth + "px",
        canvasEl.style.height = window.innerHeight + "px",
        ctx.scale(2, 2)
    }, 500),

    render = anime({
        duration: 1 / 0,
        update: function () {
            ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        }
    });

    document.addEventListener(tap, function (e) {
        "sidebar" !== e.target.id && "toggle-sidebar" !== e.target.id && "A" !== e.target.nodeName && "IMG" !== e.target.nodeName && (render.play(), updateCoords(e), animateParticules(pointerX, pointerY))
    }, !1),

    setCanvasSize(),

    window.addEventListener("resize", setCanvasSize, !1);
}