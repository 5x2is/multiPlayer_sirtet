'use strict';
console.log('index.js');
let ctx;
let canvas;
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
const position = [0,0];

//初期化処理
const init = ()=>{
    console.log('init');
    canvas = document.getElementById('maincanvas');
    ctx = canvas.getContext('2d');
    canvas.width = SCREEN_WIDTH;
    canvas.height= SCREEN_HEIGHT;
    requestAnimationFrame(update);
};

const update = ()=>{
    console.log('update');
    render();
    requestAnimationFrame(update);
};

const render = ()=>{
    //全体をクリア
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = 'rgb(0,255,0)';
    ctx.fillRect(position[0]*20,position[1]*20,20,20);
};

window.addEventListener('load',init);
window.addEventLIstener('keydown',(key)=>{
    const keyName = key.key;
    
    switch (keyName){
        case 'aaa':
            break;
        default:
            break;
    }
});
