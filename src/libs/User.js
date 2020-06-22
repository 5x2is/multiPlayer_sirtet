'use strict';
const Block = require('./Block.js');
module.exports = class User{
    constructor(id,worldClass,userNo,name){
        this.setBlock = [];
        this.id = id;
        this.userNo = userNo;
        this.name = name;
        this.world = worldClass;
    }
    init(){
        this.blockBag = this.initBlockBag();
        this.score = 0;
        this.holdBlock = null;
        this.initBlock();
        console.log('initUser');
        for(let i = 0; i<4; i++){
            this.addBlock();
        }
        this.setBlock[0].start();
        this.updateNext();
    }
    updateNext(){
        this.world.updateNext(this.setBlock,this.holdBlock,this.userNo,this.score);
    }
    initBlock(){
        for(const block of this.setBlock){
            block.stopDrop();
        }
        this.setBlock = [];
    }
    addBlock(){
        const block = new Block(this.selectBlock(),this.world,this);
        this.setBlock.push(block);
    }
    removeBlock(){
        this.setBlock.shift();
    }
    nextBlock(){
        this.addBlock();
        this.removeBlock();
        this.setBlock[0].start();
        this.updateNext();
    }
    moveBlock(key){
        this.setBlock[0].move(key);
    }
    rotateBlock(key){
        this.setBlock[0].rotate(key);
    }
    hardDrop(){
        this.setBlock[0].hardDrop();
    }
    hold(){
        if(this.setBlock[0].holded){
            return;
        }
        const tempBlock = this.setBlock[0];
        if(this.holdBlock){
            this.setBlock[0] = this.holdBlock;
            this.setBlock[0].start();
            this.holdBlock = tempBlock;
            this.holdBlock.hold();
            this.updateNext();
        }else{
            this.holdBlock = tempBlock;
            this.holdBlock.hold();
            this.nextBlock();
        }
    }
    stopDrop(){
        this.setBlock[0].stopDrop();
    }
    selectBlock(){
        if(this.blockBag.length === 0){
            this.blockBag = this.initBlockBag();
        }
        const rand = Math.floor(Math.random()*this.blockBag.length);
        const nextBlockID = this.blockBag[rand];
        //選択したblockを取り除く
        this.blockBag.splice(rand,1);

        return nextBlockID;
    }
    reset(){
        this.stopDrop();
        this.score = 0;
        this.holdBlock = null;
        this.blockBag = this.initBlockBag();
        this.setBlock = [];
    }
    initBlockBag(){
        return ['I','O','T','J','L','S','Z'];
    }
};
