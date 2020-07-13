'use strict';
console.log('index.js');

const socket = io.connect();
const maincanvas = document.getElementById('maincanvas');
const menucanvas = document.getElementById('menucanvas');
const bgcanvas = document.getElementById('bgcanvas');
const screen = new Screen(socket,maincanvas);
const background= new Background(bgcanvas);
const menu = new Menu(socket,menucanvas);
const validCode = [37,38,39,40,65,68,83];
window.addEventListener('keydown',(key)=>{
    if(key.which === 13 && document.getElementById('sendNameButton')){
        socket.emit('sendName',document.sendName.userName.value);

        return;
    }
    if(!validCode.includes(key.which)){
        return;
    }
    const keyCode = key.which;
    const now = new Date();
    const sendData = {
        keyCode,
        time:now.getTime()
    };
    socket.emit('move',sendData);
});
const sendNameButton = document.getElementById('sendNameButton');
sendNameButton.addEventListener('click',()=>{
    socket.emit('sendName',document.sendName.userName.value);
});
//スマホ用ボタン
document.getElementById('rotate-l').addEventListener('click',()=>{
    sendMove(65);
});
document.getElementById('drop').addEventListener('click',()=>{
    sendMove(38);
});
document.getElementById('rotate-r').addEventListener('click',()=>{
    sendMove(83);
});
document.getElementById('left').addEventListener('click',()=>{
    sendMove(37);
});
document.getElementById('down').addEventListener('click',()=>{
    sendMove(40);
});
document.getElementById('right').addEventListener('click',()=>{
    sendMove(39);
});
document.getElementById('hold').addEventListener('click',()=>{
    sendMove(68);
});
const sendMove = (keyCode)=>{
    const now = new Date();
    const sendData = {
        keyCode,
        time:now.getTime()
    };
    socket.emit('move',sendData);
};

//Controller
const controller = document.getElementById('controller');
controller.style.width = ScreenSetting.CANVAS_WIDTH+'px';
controller.style.height= ScreenSetting.CANVAS_HEIGHT+'px';
