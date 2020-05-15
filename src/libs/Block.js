'use strict';
module.exports = class Block{
    constructor(){
        this.fX = 0;
        this.fY = 0;
        this.stat= 'ready';//nextBlockのときはnext1,next2,next3 holdのときはholdが入る。
        this.type = 0;
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
};
