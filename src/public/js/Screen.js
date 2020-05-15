'use strict';
class Screen{
    constructor(socket,canvas){
        this.socket = socket;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.canvas.width = SharedSettings.FIELD_WIDTH;
        this.canvas.height = SharedSettings.FIELD_HEIGHT;
        this.canvas.style.backgroundColor = 'gray';

        this.initSocket();
    }
    initSocket(){
        this.socket.on('connect',()=>{
            this.socket.emit('enter-the-game');
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
        for(let fX=0; fX<fieldDat.length; fX++){
            for(let fY=0; fY<fieldDat[fX].length; fY++){
                if(fieldDat[fX][fY]){
                    this.context.fillStyle = fieldDat[fX][fY].color;
                    this.context.fillRect(fX*20,fY*20,20,20);
                    if(fieldDat[fX][fY].id === this.socket.id){
                        this.context.strokeStyle = 'rgb(255,0,0)';
                        this.context.strokeRect(fX*20,fY*20,20,20);
                    }
                }
            }
        }
    }
}
