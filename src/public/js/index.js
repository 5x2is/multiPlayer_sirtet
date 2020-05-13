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
    socketio.emit('enter-the-game');
};

const render = (positions)=>{
    if(isnotInit){
       return;
    }
    //全体をクリア
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(!positions.length){
        console.log('empty');

        return;
    }
    positions.forEach((position)=>{
        const {fX,fY} = position;
        ctx.fillStyle = 'rgb(0,255,0)';
        ctx.fillRect(fX*20,fY*20,20,20);
    });
};

window.addEventListener('load',init);
window.addEventListener('keydown',(key)=>{
    const keyCode = key.which;

    socketio.emit('move',keyCode);
});
socketio.on('update',(positions)=>{
    render(positions);
});
