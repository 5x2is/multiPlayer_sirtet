'use strict';
console.log('index.js');
let ctx;
let canvas;
const SCREEN_WIDTH = 500;
const SCREEN_HEIGHT = 500;
const position = [0,0];
const socketio = io();

//初期化処理
const init = ()=>{
    console.log('init');
    canvas = document.getElementById('maincanvas');
    canvas.style.backgroundColor = 'gray';
    ctx = canvas.getContext('2d');
    canvas.width = SCREEN_WIDTH;
    canvas.height= SCREEN_HEIGHT;
    requestAnimationFrame(update);
};

const update = ()=>{
    render();
    requestAnimationFrame(update);
};

const render = ()=>{
    //全体をクリア
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = 'rgb(0,255,0)';
    ctx.fillRect(position[0]*20,position[1]*20,20,20);
    console.log(position[1]);
};

window.addEventListener('load',init);
window.addEventListener('keydown',(key)=>{
    const keyCode = key.which;

    socketio.emit('message',keyCode);
    console.log(keyCode);
    switch (keyCode){
        case 39:
            position[0]++;
            break;
        case 37:
            position[0]--;
            break;
        case 38:
            position[1]--;
            break;
        case 40:
            position[1]++;
            break;
        default:
            break;
    }
    console.log(position[1]);
});
