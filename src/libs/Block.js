'use strict';
const GameSetting = require('./GameSetting.js');
module.exports = class Block{
    constructor(blockID){
        this.fX = 10;
        this.fY = 1;
        this.stat= 'ready';//nextBlockのときはnext1,next2,next3 holdのときはholdが入る。
        this.type = 0;
        this.shape = this.setShape(blockID);
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
    setShape(blockID){
        let shape;
        switch(blockID){ //[x,y]
            case 'I':
                shape = [{x:-1,y:0},{x:0,y:0},{x:1,y:0},{x:2,y:0}];
                break;
            case 'O':
                shape = [{x:0,y:0},{x:0,y:1},{x:1,y:0},{x:1,y:1}];
                break;
            case 'T':
                shape = [{x:0,y:-1},{x:-1,y:0},{x:0,y:0},{x:1,y:0}];
                break;
            case 'J':
                shape = [{x:-1,y:-1},{x:-1,y:0},{x:0,y:0},{x:1,y:0}];
                break;
            case 'L':
                shape = [{x:1,y:-1},{x:-1,y:0},{x:0,y:0},{x:1,y:0}];
                break;
            case 'S':
                shape = [{x:0,y:-1},{x:1,y:-1},{x:-1,y:0},{x:0,y:0}];
                break;
            case 'Z':
                shape = [{x:-1,y:-1},{x:0,y:-1},{x:0,y:0},{x:1,y:0}];
                break;
            default:
                break;
        }

        return shape;
    }
};
