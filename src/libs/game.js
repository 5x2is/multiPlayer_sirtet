'use strict';
const World = require('./World.js');

module.exports = class Game{
    constructor(){
        this.maxWorld = 5;
        this.worlds= new Array(this.maxWorld);
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
            //io.to(socket.id).emit('room_stat',this.getRoomStat);
            socket.on('sendName',(userName)=>{
                for(let i = 0; i <this.worlds.length; i++){
                    if(this.worlds[i] === null){
                        this.worlds[i] = new World(io,i);
                    }
                    if(this.worlds[i].setUser.size === 0){
                        user = this.worlds[i].addUser(socket.id,0,userName);
                        worldId = i;
                        break;
                    }else if(this.worlds[i].setUser.size === 1){
                        let emptyId;
                        for(const usr of this.worlds[i].setUser){
                            emptyId = (usr.userNo*-1)+1;
                        }
                        user = this.worlds[i].addUser(socket.id,emptyId,userName);
                        worldId = i;
                        break;
                    }
                }
                if(worldId === null){
                    io.to(socket.id).emit('room_is_full','');

                    return;
                }
                //ルーム内のユーザ情報を返す
                world = this.worlds[worldId];
                socket.join(worldId);
                console.log('new user: '+userName);
                console.log('room: '+worldId);
                if(world.setUser.size === 2){
                    io.to(worldId).emit('start_signal',this.getRoomData(io,world,worldId));
                }
                io.to(worldId).emit('gameStart',this.getRoomData(io,world,worldId));
                world.restart();
            });
            socket.on('move',(dat)=>{
                if(!user){
                    return;
                }
                if(!world.gameOn){
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
            socket.on('restart',()=>{
                if(world.setUser.size === 2){
                    io.to(worldId).emit('start_signal',this.getRoomData(io,world,worldId));
                }
                io.to(worldId).emit('restart');
                world.restart();
            });
        });
    }
    getRoomData(io,world,worldId){
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

        return roomData;
    }
    getRoomStat(){
        let worldCount = 0;
        for(const world of this.worlds){
            if(world){
                worldCount++;
            }
        }

        return {
            maxWorld:this.maxWorld,
            worldNo:worldCount
        };
    }
};
