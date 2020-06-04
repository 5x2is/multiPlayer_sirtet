'use strict';
class Screen{
    constructor(socket,canvas){
        this.socket = socket;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.canvas.width;
        this.canvas.height;
        this.canvas.style.backgroundColor = 'rgb(20,20,20)';
        this.setting;

        this.initSocket();
    }
    initSocket(){
        this.socket.on('timer',(time)=>{
            const now = new Date();
            const delay = now.getTime()-time;
            this.context.clearRect(20,35,100,20);
            this.context.font = '16pt Arial';
            this.context.fillStyle = 'rgb(255,255,255)';
            this.context.textAlign = 'start';
            this.context.fillText('delay:'+delay,20,50);
        });
        this.socket.on('connect',()=>{
            this.socket.emit('enter-the-game');
        });
        this.socket.on('setting',(setting)=>{
            this.setting = setting.client;
            this.roomId = setting.roomId;
            this.canvas.width = this.setting.FIELD_WIDTH + (2*ScreenSetting.SIDE_MARGIN);
            this.canvas.height = this.setting.FIELD_HEIGHT + ScreenSetting.BOTTOM_MARGIN;
            this.context.strokeStyle = 'rgb(255,255,255)';
            this.context.lineWidth= 2;
            this.context.strokeRect(10,60,100,60);
            this.context.strokeRect(10,200,100,250);
            this.context.strokeRect(ScreenSetting.SIDE_MARGIN+this.setting.FIELD_WIDTH+10,60,100,60);
            this.context.strokeRect(ScreenSetting.SIDE_MARGIN+this.setting.FIELD_WIDTH+10,200,100,250);
            this.context.font = '16pt Arial';
            this.context.fillStyle = 'rgb(255,255,255)';
            this.context.fillText('room:'+this.roomId,30,30);
        });
        this.socket.on('update',(fieldDat)=>{
            this.render(fieldDat);
        });
        this.socket.on('next',(nextDat)=>{
            let startX;
            if(nextDat.id === this.socket.id){
                startX = ScreenSetting.SIDE_MARGIN+this.setting.FIELD_WIDTH+60;
                this.context.clearRect(ScreenSetting.SIDE_MARGIN+this.setting.FIELD_WIDTH+15,65,90,50);
                this.context.clearRect(ScreenSetting.SIDE_MARGIN+this.setting.FIELD_WIDTH+15,205,90,240);
            }else{
                startX = 60;
                this.context.clearRect(15,65,90,50);
                this.context.clearRect(15,205,90,240);
            }
            let nextCount = 0;
            for(let i = 0; i<nextDat.nextBlock.length; i++){
                if(nextDat.nextBlock[i].stat === 'next'){
                    const shape = blockShape.shape(nextDat.nextBlock[i].blockID);
                    this.context.fillStyle = shape.color;
                    for(const cell of shape.shape){
                        this.context.fillRect(startX+(cell.x*20),(nextCount*60)+250+(cell.y*20),20,20);
                    }
                    nextCount++;
                }
            }
            if(nextDat.hold){
                const shape = blockShape.shape(nextDat.hold);
                this.context.fillStyle = shape.color;
                for(const cell of shape.shape){
                    this.context.fillRect(startX+(cell.x*20),90+(cell.y*20),20,20);
                }
            }
            this.context.font = '16pt Arial';
            this.context.clearRect(startX-50,470,100,80);
            this.context.fillStyle = 'rgb(50,50,50)';
            this.context.fillRect(startX-50,470,100,60);
            this.context.textAlign = 'end';
            this.context.fillStyle = 'rgb(255,255,255)';
            this.context.fillText('SCORE',startX+35,500);
            this.context.fillText(nextDat.score,startX+35,520);
        });
    }
    render(fieldDat){
        //全体をクリア
        this.context.clearRect(ScreenSetting.SIDE_MARGIN,0,this.setting.FIELD_WIDTH,this.setting.FIELD_HEIGHT);
        if(!fieldDat.length){
            console.log('empty');

            return;
        }
        //console.log(fieldDat);
        fieldDat.forEach((fieldColumn,fX)=>{
            fieldColumn.forEach((fieldCell,fY)=>{
                if(fieldCell){
                    switch(fieldCell.type){
                        case 'wall':
                            this.context.fillStyle = fieldCell.color;
                            this.context.fillRect(ScreenSetting.SIDE_MARGIN+fX*20,fY*20,20,20);
                            break;
                        case 'block':
                            this.context.fillStyle = fieldCell.color;
                            this.context.fillRect(ScreenSetting.SIDE_MARGIN+fX*20,fY*20,20,20);
                            if(fieldCell.id === this.socket.id){
                                this.context.strokeStyle = 'rgb(255,255,255)';
                                this.context.strokeRect(ScreenSetting.SIDE_MARGIN+fX*20,fY*20,20,20);
                            }
                            break;
                        case 'fixed':
                            this.context.fillStyle = fieldCell.color;
                            this.context.fillRect(ScreenSetting.SIDE_MARGIN+fX*20,fY*20,20,20);
                            break;
                        default:
                            break;
                    }
                    if(fieldCell.isGhost && fieldCell.ghostId === this.socket.id){
                        this.context.strokeStyle = fieldCell.ghostColor;
                        this.context.strokeRect(ScreenSetting.SIDE_MARGIN+fX*20,fY*20,20,20);
                    }
                }
            });
        });
    }
}
