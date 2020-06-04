'use strict';
const GameSetting = require('./GameSetting.js');
module.exports = class Block{
    constructor(blockID,worldClass,userClass){
        this.data = this.blockData(blockID);
        this.world = worldClass;
        this.user = userClass;
        this.fX = null;
        this.fY = null;
        this.color = this.data.color;
        this.blockID = blockID;
        this.angle= 0;
        this.shape = this.setShape(this.angle);
        this.stat= 'next';//nextBlockのときはnext1,next2,next3 holdのときはholdが入る。
        this.dropInterval = null;
        this.holded = false;//1回しかholdできなくする。
    }
    start(){
        this.stat = 'ready';
        if(this.user.userNo === 0){
            this.fX = this.data.initialPos.x-3;
        }else{
            this.fX = this.data.initialPos.x+2;
        }
        this.fY = this.data.initialPos.y;
        this.dropInterval = setInterval(this.drop.bind(this,this),GameSetting.DROP_SPEED);
    }
    hold(){
        this.stat = 'hold';
        this.holded = true;
        if(this.dropInterval){
            this.stopDrop();
        }
    }
    move(key){
        let collision = null;
        switch (key){
            case 39:
                collision = this.collisionCheck(this.fX+1,this.fY,this.angle);
                if(collision === 'fixed' || collision === 'block'){
                    break;
                }
                this.fX++;
                break;
            case 37:
                collision = this.collisionCheck(this.fX-1,this.fY,this.angle);
                if(collision === 'fixed' || collision === 'block'){
                    break;
                }
                this.fX--;
                break;
            case 40:
                collision = this.collisionCheck(this.fX,this.fY+1,this.angle);
                if(collision === 'fixed'){
                    this.nextBlock();
                }else if (collision === 'block'){
                    break;
                }
                this.fY++;
                break;
            default:
                break;
        }
    }
    hardDrop(){
    }
    drop(){
        const collision = this.collisionCheck(this.fX,this.fY+1,this.angle);
        if(collision === 'fixed'){
            this.nextBlock();
        }else if (collision === 'block'){
            return;
        }
        this.fY++;
    }
    nextBlock(){
        const score = this.world.addFixedBlock(this);
        this.user.score += score;
        this.stopDrop();
        this.user.nextBlock();
    }
    stopDrop(){
        clearInterval(this.dropInterval);
    }
    setShape(angle){
        return this.data.shape[angle];
    }
    rotate(direction){
        if(!(direction === 83 || direction === 65)){
            return;
        }
        let nextAngle;
        if(direction === 83){ //右回転
            nextAngle = this.angle + 1;
            if(nextAngle === 4){
                nextAngle = 0;
            }
        }else if(direction === 65){ //左回転
            nextAngle = this.angle - 1;
            if(nextAngle === -1){
                nextAngle = 3;
            }
        }
        const collision = this.collisionCheck(this.fX,this.fY,nextAngle);
        if(collision === 'fixed' || collision === 'block'){
            return;
        }
        this.angle = nextAngle;
        this.shape = this.setShape(this.angle);
    }
    collisionCheck(fX,fY,angle){
        const nextFX = fX;
        const nextFY = fY;
        const nextAngle = angle;
        const shape = this.setShape(nextAngle);
        const blockField = [{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}];
        for(let cell = 0; cell<4; cell++){
            blockField[cell].x = shape[cell].x + nextFX;
            blockField[cell].y = shape[cell].y + nextFY;
        }

        return this.world.collisionCheck(blockField,this.user.id);
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
                initialPos:{x:GameSetting.START_POS+1,y:1}
            },
            O:{
                shape:[
                    [{x:0,y:0},{x:0,y:1},{x:1,y:0},{x:1,y:1}],
                    [{x:0,y:0},{x:0,y:1},{x:1,y:0},{x:1,y:1}],
                    [{x:0,y:0},{x:0,y:1},{x:1,y:0},{x:1,y:1}],
                    [{x:0,y:0},{x:0,y:1},{x:1,y:0},{x:1,y:1}]
                ],
                color:'rgb(255,255,0)',
                initialPos:{x:GameSetting.START_POS,y:0}
            },
            T:{
                shape:[
                    [{x:0,y:-1},{x:-1,y:0},{x:0,y:0},{x:1,y:0}],
                    [{x:0,y:-1},{x:0,y:0},{x:1,y:0},{x:0,y:1}],
                    [{x:-1,y:0},{x:0,y:0},{x:1,y:0},{x:0,y:1}],
                    [{x:0,y:-1},{x:-1,y:0},{x:0,y:0},{x:0,y:1}]
                ],
                color:'rgb(153,0,204)',
                initialPos:{x:GameSetting.START_POS,y:1}
            },
            J:{
                shape:[
                    [{x:-1,y:-1},{x:-1,y:0},{x:0,y:0},{x:1,y:0}],
                    [{x:0,y:-1},{x:1,y:-1},{x:0,y:0},{x:0,y:1}],
                    [{x:-1,y:0},{x:0,y:0},{x:1,y:0},{x:1,y:1}],
                    [{x:0,y:-1},{x:0,y:0},{x:-1,y:1},{x:0,y:1}]
                ],
                color:'rgb(0,0,255)',
                initialPos:{x:GameSetting.START_POS,y:1}
            },
            L:{
                shape:[
                    [{x:1,y:-1},{x:-1,y:0},{x:0,y:0},{x:1,y:0}],
                    [{x:0,y:-1},{x:0,y:0},{x:0,y:1},{x:1,y:1}],
                    [{x:-1,y:0},{x:0,y:0},{x:1,y:0},{x:-1,y:1}],
                    [{x:-1,y:-1},{x:0,y:-1},{x:0,y:0},{x:0,y:1}]
                ],
                color:'rgb(255,102,0)',
                initialPos:{x:GameSetting.START_POS,y:1}
            },
            S:{
                shape:[
                    [{x:0,y:-1},{x:1,y:-1},{x:-1,y:0},{x:0,y:0}],
                    [{x:0,y:-1},{x:0,y:0},{x:1,y:0},{x:1,y:1}],
                    [{x:0,y:0},{x:1,y:0},{x:-1,y:1},{x:0,y:1}],
                    [{x:0,y:-1},{x:-1,y:0},{x:0,y:0},{x:-1,y:1}]
                ],
                color:'rgb(0,255,0)',
                initialPos:{x:GameSetting.START_POS,y:1}
            },
            Z:{
                shape:[
                    [{x:-1,y:-1},{x:0,y:-1},{x:0,y:0},{x:1,y:0}],
                    [{x:1,y:-1},{x:0,y:0},{x:1,y:0},{x:0,y:1}],
                    [{x:-1,y:0},{x:0,y:0},{x:0,y:1},{x:1,y:1}],
                    [{x:0,y:-1},{x:-1,y:0},{x:0,y:0},{x:-1,y:1}]
                ],
                color:'rgb(255,0,0)',
                initialPos:{x:GameSetting.START_POS,y:2}
            }
        };

        return data[id];
    }
};
