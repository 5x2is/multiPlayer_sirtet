'use strict';
console.log('index.js');
let ctx;
let canvas;
let isnotInit = true;
const SCREEN_WIDTH = 500;
const SCREEN_HEIGHT = 500;
const socketio = io();

//初期化処理
const init = ()=>{
    console.log('init');
    isnotInit = false;
    canvas = document.getElementById('maincanvas');
    canvas.style.backgroundColor = 'gray';
    ctx = canvas.getContext('2d');
    canvas.width = SCREEN_WIDTH;
    canvas.height= SCREEN_HEIGHT;
};

const render = (position)=>{
    if(isnotInit){
       return;
    }
    console.log('render');
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
});
socketio.on('message',(position)=>{
    console.log(position[0]);
    console.log(position[1]);
    render(position);
});
