'use strict';
const User = require('./User.js');
const GameSetting = require('./GameSetting.js');

module.exports = class World{
    constructor(io){
        this.io = io;
        this.setUser = new Set();//ユーザリスト
        this.fixedBlock = this.initFixedBlock();
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
    initFixedBlock(){
        const fixedBlock = new Array(GameSetting.FIELD_WIDTH+2);
        for(let fX=0; fX<GameSetting.FIELD_WIDTH+2; fX++){
            fixedBlock[fX] = new Array(GameSetting.FIELD_HEIGHT+3);
        }

        return fixedBlock;
    }
    addFixedBlock(block){
        for(const cell of block.shape){
            this.fixedBlock[block.fX + cell.x][block.fY + cell.y] = {
                type:'fixed',
                color:block.color
            };
        }
    }
    createFieldData(){
        const fieldData = this.initField();
        for(const user of this.setUser){
            for(const block of user.setBlock){
                if(block.stat === 'ready'){
                    for(const cell of block.shape){
                        fieldData[block.fX + cell.x][block.fY + cell.y] = {
                            type:'block',
                            color: block.color,
                            id: user.id
                        };
                    }
                }
            }
        }
        for(let fX = 0; fX<this.fixedBlock.length; fX++){
            for(let fY = 0; fY<this.fixedBlock[fX].length; fY++){
                if(this.fixedBlock[fX][fY]){
                    fieldData[fX][fY] = {
                        type:'fixed',
                        color:this.fixedBlock[fX][fY].color
                    };
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

