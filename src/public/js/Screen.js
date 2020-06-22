'use strict';
class Screen{
    constructor(socket,canvas){
        this.socket = socket;
        this.SS = ScreenSetting;
        this.canvas = canvas;
        this.canvas.width = this.SS.CANVAS_WIDTH;
        this.canvas.height =this.SS.CANVAS_HEIGHT;
        this.context = this.canvas.getContext('2d');

        this.initSocket();
    }
    setTextContext(){
        this.context.font = '18pt Arial';
        this.context.fillStyle = 'white';
        this.context.textAlign = 'center';
        this.context.textBaseline= 'middle';
    }
    setNameContext(){
        this.context.font = '26pt Arial';
        this.context.fillStyle = 'white';
        this.context.textBaseline= 'bottom';
    }
    initSocket(){
        this.socket.on('timer',(time)=>{
            const now = new Date();
            const delay = now.getTime()-time;
            this.context.clearRect(this.SS.cell*23,this.SS.cell*1.8,this.SS.cell*6,this.SS.cell*1.5);
            this.setTextContext();
            this.context.fillText(delay+' ms',this.SS.cell*26,this.SS.cell*2.6);
        });
        this.socket.on('connect',()=>{
            this.socket.emit('enter-the-game');
        });
        this.socket.on('gameStart',(roomData)=>{
            this.roomId = roomData.roomId;
            console.log(this.roomId);
            this.setTextContext();
            this.context.clearRect(this.SS.cell*6,0,this.SS.cell*17,this.SS.cell*3);
            this.context.fillText('ROOM ID: '+this.roomId,this.SS.cell*14.5,this.SS.cell,this.SS.cell*17);
            //左右の統一
            for(const user of roomData.userList){
                this.setNameContext();
                if(user.userNo === 0){
                    this.context.clearRect(0,this.SS.cell*29,this.SS.cell*14.5,this.SS.cell*3);
                    this.context.textAlign = 'start';
                    this.context.fillText(user.userName,this.SS.cell*0.5,this.SS.cell*31.6,this.SS.cell*13);
                }else{
                    this.context.clearRect(this.SS.cell*14.5,this.SS.cell*29,this.SS.cell*14.5,this.SS.cell*3);
                    this.context.textAlign = 'end';
                    this.context.fillText(user.userName,this.SS.cell*28.5,this.SS.cell*31.6,this.SS.cell*13);
                }
            }
        });
        this.socket.on('gameOver',(gameOverData)=>{
            const gameOverDiv = document.createElement('div');
            gameOverDiv.id = 'game_over';
            const h1 = document.createElement('h1');
            h1.textContent = 'score: '+gameOverData[0].score;
            const restartButton = document.createElement('button');
            restartButton.textContent = 'RESTART';
            restartButton.addEventListener('click',()=>{
                    this.socket.emit('restart',this.roomId);
            });
            gameOverDiv.appendChild(h1);
            gameOverDiv.appendChild(restartButton);
            const cont = document.getElementById('cont');
            cont.appendChild(gameOverDiv);
        });
        this.socket.on('restart',()=>{
            document.getElementById('game_over').remove();
        });
        this.socket.on('update',(fieldDat)=>{
            this.render(fieldDat);
        });
        this.socket.on('next',(nextDat)=>{
            let startX;
            if(nextDat.id === 0){
                startX = 0;
            }else if(nextDat.id === 1){
                startX = 23;
            }
            this.context.clearRect(this.SS.cell*startX,this.SS.cell*5,this.SS.cell*6,this.SS.cell*21);
            //NEXT
            let nextCount = 0;
            for(let i = 0; i<nextDat.nextBlock.length; i++){
                if(nextDat.nextBlock[i].stat === 'next'){
                    const shape = blockShape.shape(nextDat.nextBlock[i].blockID);
                    this.context.fillStyle = shape.color;
                    for(const cell of shape.shape){
                        this.context.fillRect(this.SS.cell*(startX+2.5+cell.x),(this.SS.cell*((nextCount*4)+cell.y+13.5)),this.SS.cell,this.SS.cell);
                    }
                    nextCount++;
                }
            }
            if(nextDat.hold){
                const shape = blockShape.shape(nextDat.hold);
                this.context.fillStyle = shape.color;
                for(const cell of shape.shape){
                    this.context.fillRect(this.SS.cell*(startX+2.5+cell.x),(this.SS.cell*(cell.y+7.5)),this.SS.cell,this.SS.cell);
                }
            }
            //SCORE
            this.setTextContext();
            this.context.clearRect(this.SS.cell*startX,this.SS.cell*26.5,this.SS.cell*6,this.SS.cell*2);
            this.context.fillText(nextDat.score,this.SS.cell*(3+startX),this.SS.cell*27.6,this.SS.cell*6);
            //LEVEL
            this.context.clearRect(0,this.SS.cell*1.5,this.SS.cell*6,this.SS.cell*2);
            this.context.fillText(nextDat.level,this.SS.cell*3,this.SS.cell*2.6,this.SS.cell*6);
        });
    }
    drawRect(x,y,color){
        this.context.fillStyle = color;
        this.context.fillRect(this.SS.cell*(x+5),this.SS.cell*(y+2),this.SS.cell,this.SS.cell);
    }
    drawFrame(x,y){
        this.context.strokeStyle = 'white';
        this.context.lineWidth= 1.5;
        this.context.strokeRect(this.SS.cell*(x+5),this.SS.cell*(y+2),this.SS.cell,this.SS.cell);
    }
    render(fieldDat){
        //全体をクリア
        this.context.clearRect(this.SS.cell*6,this.SS.cell*2,this.SS.cell*17,this.SS.cell*27);
        if(!fieldDat.length){
            console.log('empty');

            return;
        }
        fieldDat.forEach((fieldColumn,fX)=>{
            fieldColumn.forEach((fieldCell,fY)=>{
                if(fieldCell){
                    switch(fieldCell.type){
                        case 'wall':
                            break;
                        case 'block':
                            this.drawRect(fX,fY,fieldCell.color);
                            if(fieldCell.id === this.socket.id){
                                this.drawFrame(fX,fY);
                            }
                            break;
                        case 'fixed':
                            this.drawRect(fX,fY,fieldCell.color);
                            break;
                        default:
                            break;
                    }
                    if(fieldCell.isGhost && fieldCell.ghostId === this.socket.id){
                        this.drawFrame(fX,fY);
                    }
                }
            });
        });
    }
}
