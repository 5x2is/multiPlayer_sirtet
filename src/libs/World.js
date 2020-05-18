'use strict';
const User = require('./User.js');
const GameSetting = require('./GameSetting.js');

module.exports = class World{
    constructor(io){
        this.io = io;
        this.setUser = new Set();//ユーザリスト
    }
    addUser(id){
        const user = new User(id,this);
        this.setUser.add(user);

        return user;
    }
    removeUser(user){
        this.setUser.delete(user);
    }
    initField(){
        const fieldData = new Array(GameSetting.FIELD_WIDTH+2);
        const wallData = {
            type:'wall',
            color:'rgb(50,50,50)'
        };
        for(let fX=0; fX<GameSetting.FIELD_WIDTH+2; fX++){
            fieldData[fX] = new Array(GameSetting.FIELD_HEIGHT+3);
        }
        for(let fY = 0; fY<GameSetting.FIELD_HEIGHT+3; fY++){
            fieldData[0][fY] = wallData;
            fieldData[GameSetting.FIELD_WIDTH+1][fY] = wallData;
        }
        for(let fX = 1; fX<GameSetting.FIELD_WIDTH+1; fX++){
            fieldData[fX][GameSetting.FIELD_HEIGHT+2] = wallData;
            if(fX <= (GameSetting.FIELD_WIDTH/2)-3 || fX > (GameSetting.FIELD_WIDTH/2)+3){
                fieldData[fX][0] = wallData;
                fieldData[fX][1] = wallData;
            }
        }

        return fieldData;
    }
    createFieldData(){
        const fieldData = this.initField();
        for(const user of this.setUser){
            for(const block of user.setBlock){
                if(block.stat === 'ready'){
                    for(let cell=0; cell<4; cell++){
                        fieldData[block.fX + block.shape[cell].x][block.fY + block.shape[cell].y] = {
                            type:'block',
                            color: block.color,
                            id: user.id
                        };
                    }
                }
            }
        }

        return fieldData;
    }
    collisionCheck(shape){
        const fieldData = this.createFieldData();
        //横にはみ出ていないか。
        for(const cell of shape){
            if(fieldData[cell.x][cell.y]){
                if(fieldData[cell.x][cell.y].type === 'wall'){
                    return false;
                }
            }
        }

        return true;
    }
};

