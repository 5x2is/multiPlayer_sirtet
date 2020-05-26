'use strict';
const World = require('./World.js');
const GameSetting = require('./GameSetting.js');

module.exports = class Game{
    constructor(){
        this.rooms = new Array(5);
        this.init();
    }
    init(){
        for(let i = 0; i<this.rooms.length; i++){
            this.rooms[i] = [null,null,null];
        }
    }
    start(io){
        io.on('connection',(socket)=>{
            let user = null;
            let roomId = null;
            let room = null;
            socket.on('enter-the-game',()=>{
                for(let i = 0; i<this.rooms.length; i++){
                    if(this.rooms[i][0] === null){
                        if(this.rooms[i][2] === null){
                            this.rooms[i][2] = new World(io,i);
                        }
                        this.rooms[i][0] = socket.id;
                        roomId = i;
                        break;
                    }else if(this.rooms[i][1] === null){
                        if(this.rooms[i][2] === null){
                            this.rooms[i][2] = new World(io,i);
                        }
                        this.rooms[i][1] = socket.id;
                        roomId = i;
                        break;
                    }
                }
                room = this.rooms[roomId][2];
                socket.join(roomId);
                console.log('new user: '+socket.id);
                console.log('room: '+roomId);
                user = room.addUser(socket.id);
                io.emit('setting',GameSetting.CLIENT_SETTING);
            });
            socket.on('move',(keyCode)=>{
                if(!user){
                    return;
                }
                if(keyCode === 65|| keyCode === 83){
                    user.rotateBlock(keyCode);
                }else{
                    user.moveBlock(keyCode);
                }
            });
            socket.on('disconnect',()=>{
                console.log('disconnect');
                if(!user){
                    return;
                }
                user.stopDrop();
                room.removeUser(user);
                user = null;
            });
        });
    }
};
