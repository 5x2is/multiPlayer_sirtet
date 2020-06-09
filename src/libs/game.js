'use strict';
const World = require('./World.js');
const GameSetting = require('./GameSetting.js');

module.exports = class Game{
    constructor(){
        this.worlds= new Array(5);
        this.init();
    }
    init(){
        for(let i = 0; i<this.worlds.length; i++){
            this.worlds[i] = null;
        }
    }
    start(io){
        io.on('connection',(socket)=>{
            let user = null;
            let worldId = null;
            let world= null;
            socket.on('enter-the-game',()=>{
                io.to(socket.id).emit('setting',GameSetting.CLIENT_SETTING);
            });
            socket.on('sendName',(userName)=>{
                for(worldId = 0; worldId <this.worlds.length; worldId++){
                    if(this.worlds[worldId] === null){
                        this.worlds[worldId] = new World(io,worldId);
                    }
                    if(this.worlds[worldId].setUser.size === 0){
                        user = this.worlds[worldId].addUser(socket.id,0,userName);
                        break;
                    }else if(this.worlds[worldId].setUser.size === 1){
                        let emptyId;
                        for(const usr of this.worlds[worldId].setUser){
                            emptyId = (usr.userNo*-1)+1;
                        }
                        user = this.worlds[worldId].addUser(socket.id,emptyId,userName);
                        break;
                    }
                }
                //ルーム内のユーザ情報を返す
                world = this.worlds[worldId];
                socket.join(worldId);
                console.log('new user: '+userName);
                console.log('room: '+worldId);
                let userI = 0;
                const userList = [];
                for(const usr of world.setUser){
                    userList[userI] = {
                        userNo:usr.userNo,
                        userName:usr.name
                    };
                    userI++;
                }
                const roomData = {
                    roomId:worldId,
                    userList
                };
                io.to(socket.id).emit('gameStart',roomData);
                for(const usr of world.setUser){
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
                if(world.setUser.size === 0){
                    world.stopUpdate();
                    this.worlds[worldId] = null;
                }
            });
        });
    }
};
