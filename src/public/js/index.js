'use strict';
console.log('index.js');

const socket = io.connect();
const canvas = document.getElementById('maincanvas');
const screen = new Screen(socket,canvas);
window.addEventListener('keydown',(key)=>{
    const keyCode = key.which;
    const now = new Date();
    const sendData = {
        keyCode,
        time:now.getTime()
    };
    socket.emit('move',sendData);
});
