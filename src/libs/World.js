'use strict';
const User = require('./User.js');
const GameSetting = require('./GameSetting.js');

module.exports = class World{
    constructor(io){
        this.io = io;
        this.setUser = new Set();//ユーザリスト
    }
    addUser(id){
        const user = new User(id);
        this.setUser.add(user);

        return user;
    }
    removeUser(user){
        this.setUser.delete(user);
    }
    createFieldData(){
        const fieldData = new Array(GameSetting.FIELD_WIDTH);
        for(let fX=0; fX<GameSetting.FIELD_WIDTH; fX++){
            const fieldColumn = new Array(GameSetting.FIELD_HEIGHT);
            fieldData[fX] = fieldColumn;
        }
        for(const user of this.setUser){
            for(const block of user.setBlock){
                if(block.stat === 'ready'){
                    for(let cell=0; cell<4; cell++){
                        fieldData[block.fX + block.shape[cell].x][block.fY + block.shape[cell].y] = {
                            color: block.color,
                            id: user.id
                        };
                    }
                }
            }
        }

        return fieldData;
    }
};

