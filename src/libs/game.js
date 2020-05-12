'use strict';
module.exports = class Game{
    constructor(io){
        this.io = io;
    }
    start(){
        const position = [0,0];
        let timerId = 0;
        this.io.on('connection',(socket)=>{
            clearInterval(timerId);
            timerId = setInterval(()=>{
                this.io.emit('message',position);
            },50);
            socket.on('message',(keyCode)=>{
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
            });
        });
    }
};
