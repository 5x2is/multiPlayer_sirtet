'use strict';
console.log('index.js');

const socket = io.connect();
const canvas = document.getElementById('maincanvas');
const screen = new Screen(socket,canvas);
const validCode = [37,38,39,40,65,68,83];
window.addEventListener('keydown',(key)=>{
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
    console.log(document.sendName.userName.value);
    const startForm = document.getElementById('controller');
    startForm.remove();
});
