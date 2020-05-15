'use strict';
const Block = require('./Block.js');
module.exports = class User{
    constructor(){
        this.setBlock = new Set();
        this.addBlock();
    }
    addBlock(){
        const block = new Block();
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
};
