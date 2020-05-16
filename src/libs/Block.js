'use strict';
const GameSetting = require('./GameSetting.js');
module.exports = class Block{
    constructor(blockID){
        this.data = this.blockData(blockID);
        this.fX = this.data.initialPos.x;
        this.fY = this.data.initialPos.y;
        this.color = this.data.color;
        this.blockID = blockID;
        this.angle= 0;
        this.shape = this.setShape();
        this.stat= 'ready';//nextBlockのときはnext1,next2,next3 holdのときはholdが入る。
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
    setShape(){
        return this.data.shape[this.angle];
    }
    rotate(direction){
        if(direction === 83){ //右回転
            this.angle++;
            if(this.angle === 4){
                this.angle = 0;
            }
        }else if(direction === 65){ //左回転
            this.angle--;
            if(this.angle === -1){
                this.angle = 3;
            }
        }
        this.shape = this.setShape();
    }
    blockData(id){
        const data = {
            I:{
                shape:[
                    [{x:-2,y:0},{x:-1,y:0},{x:0,y:0},{x:1,y:0}],
                    [{x:0,y:-1},{x:0,y:0},{x:0,y:1},{x:0,y:2}],
                    [{x:-2,y:1},{x:-1,y:1},{x:0,y:1},{x:1,y:1}],
                    [{x:-1,y:-1},{x:-1,y:0},{x:-1,y:1},{x:-1,y:2}]
                ],
                color:'rgb(102,255,255)',
                initialPos:{x:GameSetting.START_POS+1,y:-1}
            },
            O:{
                shape:[
                    [{x:0,y:0},{x:0,y:1},{x:1,y:0},{x:1,y:1}],
                    [{x:0,y:0},{x:0,y:1},{x:1,y:0},{x:1,y:1}],
                    [{x:0,y:0},{x:0,y:1},{x:1,y:0},{x:1,y:1}],
                    [{x:0,y:0},{x:0,y:1},{x:1,y:0},{x:1,y:1}]
                ],
                color:'rgb(255,255,0)',
                initialPos:{x:GameSetting.START_POS-1,y:-2}
            },
            T:{
                shape:[
                    [{x:0,y:-1},{x:-1,y:0},{x:0,y:0},{x:1,y:0}],
                    [{x:0,y:-1},{x:0,y:0},{x:1,y:0},{x:0,y:1}],
                    [{x:-1,y:0},{x:0,y:0},{x:1,y:0},{x:0,y:1}],
                    [{x:0,y:-1},{x:-1,y:0},{x:0,y:0},{x:0,y:1}]
                ],
                color:'rgb(153,0,204)',
                initialPos:{x:GameSetting.START_POS,y:-1}
            },
            J:{
                shape:[
                    [{x:-1,y:-1},{x:-1,y:0},{x:0,y:0},{x:1,y:0}],
                    [{x:0,y:-1},{x:1,y:-1},{x:0,y:0},{x:0,y:1}],
                    [{x:-1,y:0},{x:0,y:0},{x:1,y:0},{x:1,y:1}],
                    [{x:0,y:-1},{x:0,y:0},{x:-1,y:1},{x:0,y:1}]
                ],
                color:'rgb(0,0,255)',
                initialPos:{x:GameSetting.START_POS,y:-1}
            },
            L:{
                shape:[
                    [{x:1,y:-1},{x:-1,y:0},{x:0,y:0},{x:1,y:0}],
                    [{x:0,y:-1},{x:0,y:0},{x:0,y:1},{x:1,y:1}],
                    [{x:-1,y:0},{x:0,y:0},{x:1,y:0},{x:-1,y:1}],
                    [{x:-1,y:-1},{x:0,y:-1},{x:0,y:0},{x:0,y:1}]
                ],
                color:'rgb(255,102,0)',
                initialPos:{x:GameSetting.START_POS,y:-1}
            },
            S:{
                shape:[
                    [{x:0,y:-1},{x:1,y:-1},{x:-1,y:0},{x:0,y:0}],
                    [{x:0,y:-1},{x:0,y:0},{x:1,y:0},{x:1,y:1}],
                    [{x:0,y:0},{x:1,y:0},{x:-1,y:1},{x:0,y:1}],
                    [{x:0,y:-1},{x:-1,y:0},{x:0,y:0},{x:-1,y:1}]
                ],
                color:'rgb(0,255,0)',
                initialPos:{x:GameSetting.START_POS-1,y:-1}
            },
            Z:{
                shape:[
                    [{x:-1,y:-1},{x:0,y:-1},{x:0,y:0},{x:1,y:0}],
                    [{x:1,y:-1},{x:0,y:0},{x:1,y:0},{x:0,y:1}],
                    [{x:-1,y:0},{x:0,y:0},{x:0,y:1},{x:1,y:1}],
                    [{x:0,y:-1},{x:-1,y:0},{x:0,y:0},{x:-1,y:1}]
                ],
                color:'rgb(255,0,0)',
                initialPos:{x:GameSetting.START_POS,y:-2}
            }
        };

        return data[id];
    }
};
