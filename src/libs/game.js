'use strict';
const World = require('./World.js');
const GameSetting = require('./GameSetting.js');

module.exports = class Game{
    start(io){
        const world =new World(io);
        io.on('connection',(socket)=>{
            let user = null;
            socket.on('enter-the-game',()=>{
                console.log('enter: '+socket.id);
                user = world.addUser();
            });
            socket.on('move',(keyCode)=>{
                //console.log('move:'+socket.id);
                if(!user){
                    return;
                }
                user.move(keyCode);
            });
            socket.on('disconnect',()=>{
                if(!user){
                    return;
                }
                world.removeUser(user);
                user = null;
            });
        });
        setInterval(()=>{
            io.emit('update',Array.from(world.setUser));
        },1000/GameSetting.FRAMERATE);
    }
};
