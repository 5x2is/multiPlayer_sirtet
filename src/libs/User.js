'use strict';
const Block = require('./Block.js');
module.exports = class User{
    constructor(id){
        this.setBlock = new Set();
        this.id = id;
        this.blockBag = this.initBlockBag();
        this.addBlock();
    }
    addBlock(){
        const block = new Block(this.selectBlock());
        this.setBlock.add(block);
    }
    removeBlock(block){
        this.setBlock.delete(block);
    }
    moveBlock(key){
        for(const block of this.setBlock){
            if(block.stat === 'ready'){
                block.move(key);
            }
        }
    }
    stopDrop(){
        for(const block of this.setBlock){
            if(block.stat === 'ready'){
                block.stopDrop();
            }
        }
    }
    selectBlock(){
        if(this.blockBag.lenght === 0){
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
