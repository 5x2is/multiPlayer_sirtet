'use strict';
const GameSetting = require('./GameSetting.js');
module.exports = class Block{
    constructor(blockID,worldClass){
        this.data = this.blockData(blockID);
        this.world = worldClass;
        this.fX = this.data.initialPos.x;
        this.fY = this.data.initialPos.y;
        this.color = this.data.color;
        this.blockID = blockID;
        this.angle= 0;
        this.shape = this.setShape(this.angle);
        this.stat= 'ready';//nextBlockのときはnext1,next2,next3 holdのときはholdが入る。
        this.dropInterval = setInterval(this.drop.bind(this,this),GameSetting.DROP_SPEED);
    }
    move(key){
        switch (key){
            case 39:
                if(this.world.collisionCheck(this.nextShape(this.fX+1,this.fY,this.angle))){
                    this.fX++;
                }
                break;
            case 37:
                if(this.world.collisionCheck(this.nextShape(this.fX-1,this.fY,this.angle))){
                    this.fX--;
                }
                break;
            case 38:
                break;
            case 40:
                if(this.world.collisionCheck(this.nextShape(this.fX,this.fY+1,this.angle))){
                    this.fY++;
                }
                break;
            default:
                break;
        }
    }
    drop(){
        if(this.world.collisionCheck(this.nextShape(this.fX,this.fY+1,this.angle))){
            this.fY++;
        }
    }
    stopDrop(){
        clearInterval(this.dropInterval);
    }
    setShape(angle){
        return this.data.shape[angle];
    }
    rotate(direction){
        if(direction === 83){ //右回転
            let nextAngle = this.angle + 1;
            if(nextAngle === 4){
                nextAngle = 0;
            }
            if(this.world.collisionCheck(this.nextShape(this.fX,this.fY,nextAngle))){
                this.angle = nextAngle;
            }
        }else if(direction === 65){ //左回転
            let nextAngle = this.angle - 1;
            if(nextAngle === -1){
                nextAngle = 3;
            }
            if(this.world.collisionCheck(this.nextShape(this.fX,this.fY,nextAngle))){
                this.angle = nextAngle;
            }
        }
        this.shape = this.setShape(this.angle);
    }
    nextShape(fX,fY,angle){
        const nextFX = fX;
        const nextFY = fY;
        const nextAngle = angle;
        const shape = this.setShape(nextAngle);
        const blockField = [{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}];
        for(let cell = 0; cell<4; cell++){
            blockField[cell].x = shape[cell].x + nextFX;
            blockField[cell].y = shape[cell].y + nextFY;
        }

        return blockField;
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
