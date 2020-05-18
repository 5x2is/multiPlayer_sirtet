'use strict';
class Screen{
    constructor(socket,canvas){
        this.socket = socket;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.canvas.width;
        this.canvas.height;
        this.canvas.style.backgroundColor = 'white';

        this.initSocket();
    }
    initSocket(){
        this.socket.on('connect',()=>{
            this.socket.emit('enter-the-game');
        });
        this.socket.on('setting',(setting)=>{
            this.canvas.width = setting.FIELD_WIDTH;
            this.canvas.height = setting.FIELD_HEIGHT;
        });
        this.socket.on('update',(fieldDat)=>{
            this.render(fieldDat);
        });
    }
    render(fieldDat){
        //全体をクリア
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        if(!fieldDat.length){
            console.log('empty');

            return;
        }
        //console.log(fieldDat);
        fieldDat.forEach((fieldColumn,fX)=>{
            fieldColumn.forEach((fieldCell,fY)=>{
                if(fieldCell){
                    this.context.fillStyle = fieldCell.color;
                    this.context.fillRect(fX*20,fY*20,20,20);
                    if(fieldCell.id === this.socket.id){
                        this.context.strokeStyle = 'rgb(255,0,0)';
                        this.context.strokeRect(fX*20,fY*20,20,20);
                    }
                }
            });
        });
    }
}
