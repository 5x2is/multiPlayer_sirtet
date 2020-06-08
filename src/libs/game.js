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
            this.rooms[i] = {
                world:null,
                users:[{socket:null,name:null},{socket:null,name:null}]
            };
        }
    }
    start(io){
        io.on('connection',(socket)=>{
            let user = null;
            let roomId = null;
            let world= null;
            let idInRoom = null;
            socket.on('enter-the-game',()=>{
                io.to(socket.id).emit('setting',GameSetting.CLIENT_SETTING);
            });
            socket.on('sendName',(userName)=>{
                for(let i = 0; i<this.rooms.length; i++){
                    if(this.rooms[i].world === null){
                        this.rooms[i].world = new World(io,i);
                    }
                    if(this.rooms[i].users[0].socket === null){
                        this.rooms[i].users[0] = {
                            socket:socket.id,
                            name:userName
                        };
                        idInRoom = 0;
                        roomId = i;
                        break;
                    }else if(this.rooms[i].users[1].socket=== null){
                        this.rooms[i].users[1] = {
                            socket:socket.id,
                            name:userName
                        };
                        idInRoom = 1;
                        roomId = i;
                        break;
                    }
                }
                //ルーム無いのユーザ情報を返す
                world = this.rooms[roomId].world;
                socket.join(roomId);
                console.log('new user: '+userName);
                console.log('room: '+roomId);
                const roomData = {
                    roomId,
                    user:this.rooms[roomId].users
                };
                console.log(this.rooms[roomId].users[0].name);
                console.log(this.rooms[roomId].users[1].name);
                io.to(socket.id).emit('gameStart',roomData);
                user = world.addUser(socket.id,idInRoom);
                for(const usr of this.rooms[roomId].world.setUser){
                    usr.updateNext();
                }
            });
            socket.on('move',(dat)=>{
                if(!user){
                    return;
                }
                const keyCode = dat.keyCode;
                if(keyCode === 65|| keyCode === 83){
                    user.rotateBlock(keyCode);
                }else if(keyCode === 68){
                    user.hold();
                }else if(keyCode === 38){
                    user.hardDrop();
                }else{
                    user.moveBlock(keyCode);
                }
                io.to(socket.id).emit('timer',dat.time);
            });
            socket.on('disconnect',()=>{
                console.log('disconnect');
                if(!user){
                    return;
                }
                user.stopDrop();
                world.removeUser(user);
                this.rooms[roomId][idInRoom] = null;
            });
        });
    }
};
