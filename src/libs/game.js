'use strict';
const World = require('./World.js');
const GameSetting = require('./GameSetting.js');

module.exports = class Game{
    start(io){
        const world =new World(io);
        io.on('connection',(socket)=>{
            let user = null;
            socket.on('enter-the-game',()=>{
                console.log('new user'+socket.id);
                user = world.addUser(socket.id);
                io.emit('setting',GameSetting.CLIENT_SETTING);
            });
            socket.on('move',(keyCode)=>{
                //console.log('move:'+socket.id);
                if(!user){
                    return;
                }
                user.moveBlock(keyCode);
            });
            socket.on('disconnect',()=>{
                console.log('disconnect');
                if(!user){
                    return;
                }
                user.stopDrop();
                world.removeUser(user);
                user = null;
            });
        });
        setInterval(()=>{
            io.emit('update',world.createFieldData());
        },1000/GameSetting.FRAMERATE);
    }
};
