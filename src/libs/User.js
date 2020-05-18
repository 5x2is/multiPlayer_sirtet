'use strict';
const Block = require('./Block.js');
module.exports = class User{
    constructor(id,worldClass){
        this.setBlock = [];
        this.id = id;
        this.world = worldClass;
        this.blockBag = this.initBlockBag();
        this.init();
    }
    init(){
        for(let i = 0; i<4; i++){
            this.addBlock();
        }
        this.setBlock[0].start();
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
    }
    moveBlock(key){
        this.setBlock[0].move(key);
    }
    rotateBlock(key){
        this.setBlock[0].rotate(key);
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
    initBlockBag(){
        return ['I','O','T','J','L','S','Z'];
    }
};
