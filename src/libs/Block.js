'use strict';
const GameSetting = require('./GameSetting.js');
module.exports = class Block{
    constructor(){
        this.fX = 0;
        this.fY = 0;
        this.stat= 'ready';//nextBlockのときはnext1,next2,next3 holdのときはholdが入る。
        this.type = 0;
        this.dropInterval = setInterval(this.drop.bind(this,this),GameSetting.DROP_SPEED);
    }
    move(key){
        switch (key){
            case 39:
                this.fX++;
                break;
            case 37:
                this.fX--;
                break;
            case 38:
                this.fY--;
                break;
            case 40:
                this.fY++;
                break;
            default:
                break;
        }
    }
    drop(){
        this.fY++;
    }
    stopDrop(){
        clearInterval(this.dropInterval);
    }
};
