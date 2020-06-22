'use strict';
const User = require('./User.js');
const GameSetting = require('./GameSetting.js');

module.exports = class World{
    constructor(io,id){
        console.log('create new room '+id);
        this.io = io;
        this.worldId = id;
        this.setUser = new Set();//ユーザリスト
        this.ghost = [];
        this.gameOn = false;
        this.init();
    }
    init(){
        this.update = null;
        this.fixedBlock = this.initFixedBlock();
        this.dropSpeed = GameSetting.DROP_SPEED;
        this.level = 1;
        this.gameStart();
    }
    gameStart(){
        this.update = setInterval(()=>{
            if(!this.gameOn){
                return;
            }
            this.setGhost();
            this.io.to(this.worldId).emit('update',this.createFieldData());
        },Math.floor(1000/GameSetting.FRAMERATE));
        for(const user of this.setUser){
            user.init();
        }
        //update Next
        this.gameOn = true;
    }
    addUser(id,idInRoom,userName){
        const user = new User(id,this,idInRoom,userName);
        this.setUser.add(user);

        return user;
    }
    removeUser(user){
        this.setUser.delete(user);
    }
    stopUpdate(){
        clearInterval(this.update);
    }
    initField(){
        const fieldData = new Array(GameSetting.FIELD_WIDTH+2);
        for(let fX=0; fX<GameSetting.FIELD_WIDTH+2; fX++){
            fieldData[fX] = new Array(GameSetting.FIELD_HEIGHT+3);
            for(let fY=0; fY<GameSetting.FIELD_HEIGHT+3; fY++){
                fieldData[fX][fY] = {
                    type:null,
                    color:'',
                    id:'',
                    isGhost:false,
                    ghostColor:'',
                    ghostId:''
                };
            }
        }
        //縦の壁
        for(let fY = 0; fY<GameSetting.FIELD_HEIGHT+3; fY++){
            this.setWall(fieldData[0][fY]);
            this.setWall(fieldData[GameSetting.FIELD_WIDTH+1][fY]);
        }
        //上下の壁
        for(let fX = 1; fX<GameSetting.FIELD_WIDTH+1; fX++){
            this.setWall(fieldData[fX][GameSetting.FIELD_HEIGHT+2]);
        }

        return fieldData;
    }
    speedUp(){
        this.dropSpeed -= 30;
        this.level++;
    }
    setWall(cell){
        cell.type = 'wall';
    }
    initFixedBlock(){ //ライン消しの都合上、fixedBlockはy,xの順にする
        const fixedBlock = new Array(GameSetting.FIELD_HEIGHT+3);
        for(let fY=0; fY<GameSetting.FIELD_HEIGHT+3; fY++){
            fixedBlock[fY] = new Array(GameSetting.FIELD_WIDTH+2);
        }

        return fixedBlock;
    }
    addFixedBlock(block){
        let score = 0;
        for(const cell of block.shape){
            this.fixedBlock[block.fY + cell.y][block.fX + cell.x] = {
                type:'fixed',
                color:block.color
            };
        }
        //ライン判定
        for(let fY = 2; fY<GameSetting.FIELD_HEIGHT+2; fY++){
            let line = true;
            for(let fX = 1; fX<GameSetting.FIELD_WIDTH+1; fX++){
                if(!this.fixedBlock[fY][fX]){
                    line = false;
                    break;
                }
            }
            if(line === true){
                //ラインを消す
                //fYを消して、先頭に要素を追加する
                this.fixedBlock.splice(fY,1);
                this.fixedBlock.unshift(new Array(GameSetting.FIELD_WIDTH+2));
                //得点の追加
                score = 100+(score*2);
                //加速
                this.speedUp();
            }
        }
        //マイナスポイント確認
        score -= this.checkPenalty(block);

        return score;
    }
    checkPenalty(block){
        //下に空白を作ったとき(下1段は免除)
        let emptySpace = 0;
        let penalty = 0;
        for(const cell of block.shape){
            if(block.fY+cell.y === 26){
                emptySpace = 0;
                break;
            }
            for(let y = 1; block.fY+cell.y+y < this.fixedBlock.length-1; y++){
                if(this.fixedBlock[block.fY+cell.y+y][block.fX+cell.x]){
                    break;
                }else{
                    emptySpace++;
                }
            }
        }
        penalty += emptySpace*(54-((GameSetting.DROP_SPEED-this.dropSpeed)/15));
        //孤立マスを作った場合
        /*
        const emptyCell = this.initFixedBlock(){ //ライン消しの都合上、fixedBlockはy,xの順にする
        const emptyCellList = [];
        for(const cell of block.shape){
            //十字方向に探索、空欄があったら空白リストに追加
            if(this.fixedBlock[block.fY+cell.y][block.fX+cell.x] === undefined){
                if(emptyCell[block.fY+cell.y][block.fX+cell.x] = undefined){
                    emptyCell[block.fY+cell.y][block.fX+cell.x] = 1;//1で追加
                    emptyCellList.push([block.fY+cell.y,block.fX+cell.x]);
                    //空白から上にたどって行って、fixedBlockがなければ孤立マスではない。
                    for(y = block.fY+cell.y; y>0; y--){
                        if(this.fixedBlock[block.fY]
                    }
            //上に辿れない空白があった場合はそのマスの十字方向に空白を探す。
            //探した空白がすでに検証済みで無いかを確認。
        }
        */

        return penalty;
    }
    checkGameOver(){
        for(let x = 5; x<14; x++){
            for(let y = 0; y<2; y++){
                if(this.fixedBlock[y][x]){
                    console.log('gameover');

                    return true;
                }
            }
        }

        return false;
    }
    gameOver(){
        this.gameOn = false;
        this.stopUpdate();
        const gameOverData = [];
        let userI = 0;
        for(const user of this.setUser){
            gameOverData[userI] ={
                id:user.id,
                score:user.score,
                name:user.name
            };
            user.reset();
            userI++;
        }
        this.io.to(this.worldId).emit('gameOver',gameOverData);
    }
    restart(){
        this.stopUpdate();
        this.init();
    }
    createFieldData(){
        const fieldData = this.initField();
        for(const user of this.setUser){
            for(const block of user.setBlock){
                if(block.stat === 'ready'){
                    for(const cell of block.shape){
                        fieldData[block.fX + cell.x][block.fY + cell.y].type = 'block';
                        fieldData[block.fX + cell.x][block.fY + cell.y].color= block.color;
                        fieldData[block.fX + cell.x][block.fY + cell.y].id = user.id;
                    }
                }
            }
        }
        for(let fY = 0; fY<this.fixedBlock.length; fY++){
            for(let fX = 0; fX<this.fixedBlock[fY].length; fX++){
                if(this.fixedBlock[fY][fX]){
                    fieldData[fX][fY].type = 'fixed';
                    fieldData[fX][fY].color= this.fixedBlock[fY][fX].color;
                }
            }
        }
        for(const ghostShape of this.ghost){
            for(const cell of ghostShape.shape){
                fieldData[cell.x][cell.y].isGhost = true;
                fieldData[cell.x][cell.y].ghostColor = 'rgb(255,255,255)';
                fieldData[cell.x][cell.y].ghostId = ghostShape.user;
            }
        }

        return fieldData;
    }
    setGhost(){
        const ghost = [];
        for(const user of this.setUser){
            const nextShape = this.getGhost(user)[0];
            ghost.push({
                shape:nextShape,
                user:user.id
            });
        }
        this.ghost = ghost;
    }
    getGhost(user){
        const nextShape = [];
        let collision;
        for(const cell of user.setBlock[0].shape){
            nextShape.push({...cell});
        }
        for(const cell of nextShape){
            cell.x += user.setBlock[0].fX;
            cell.y += user.setBlock[0].fY;
        }
        let drop;
        for(drop = 1; drop< GameSetting.FIELD_HEIGHT+3; drop++){
            for(const cell of nextShape){
                cell.y++;
            }
            //1マスごと下げていって、干渉するか確認する。
            collision = this.collisionCheck(nextShape,user.id);

            if(collision !== true){
                break;
            }
        }
        for(const cell of nextShape){
            cell.y--;
        }

        return [nextShape,drop-1,collision];
    }
    collisionCheck(shape,userId){
        const fieldData = this.createFieldData();
        for(const cell of shape){
            //エリア外か
            if(cell.y <0){
                return 'fixed';
            }
            //壁がないか。
            if(fieldData[cell.x] && fieldData[cell.x][cell.y]){
                if(fieldData[cell.x][cell.y].type === 'wall'){
                    return 'fixed';
                }
            }
            //fixedBlockがないか
            if(this.fixedBlock[cell.y][cell.x]){
                if(this.fixedBlock[cell.y][cell.x].type === 'fixed'){
                    return 'fixed';
                }
            }
            //別のブロックがないか
            for(const user of this.setUser){
                if(user.id !== userId){
                    for(const otherCell of user.setBlock[0].shape){
                        if(otherCell.x+user.setBlock[0].fX === cell.x && otherCell.y+user.setBlock[0].fY === cell.y){
                            return 'block';
                        }
                    }
                }
            }
        }

        return true;//trueなら干渉していない
    }
    updateNext(setBlock,hold,userNo,score){
        const blockId = [];
        for(let i = 0; i<setBlock.length; i++){
            blockId.push({
                blockID:setBlock[i].blockID,
                stat:setBlock[i].stat
            });
        }
        const nextData = {
            nextBlock: blockId,
            hold:hold && hold.blockID,
            id:userNo,
            score,
            level:this.level
        };
        this.io.to(this.worldId).emit('next',nextData);
    }
};
