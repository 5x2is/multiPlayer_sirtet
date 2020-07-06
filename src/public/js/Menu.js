'use strict';
class Menu{
    constructor(socket,canvas){
        this.canvas = canvas;
        this.socket= socket;
        this.SS = ScreenSetting;
        this.canvas.width = this.SS.CANVAS_WIDTH;
        this.canvas.height = this.SS.CANVAS_HEIGHT;
        this.init();
    }
    init(){
        this.context = this.canvas.getContext('2d');

        this.socket.on('start_signal',(roomData)=>{
            this.roomData = roomData;
            //0.0-1.5 静止
            this.params = {
                bgOpacity:0.8,
                redX:0,
                blueX:0,
                vsOpacity:1
            };
            this.draw();
            //初期位置で描画
            //タイマーセット
            //タイマーストップ
            //1.5-2.0 消える
            setTimeout(this.move.bind(this),1700);
        });
        this.socket.on('penalty',(penaltyData)=>{
            for(const penaltyCell of penaltyData.penaltyCells){
                this.fillCell(penaltyCell.x,penaltyCell.y);
            }
            setTimeout(()=>{
                this.context.font = '20pt Arial';
                this.context.fillStyle = 'white';
                this.context.textBaseline = 'middle';
                this.context.textAlign = 'center';
                this.context.fillText('- '+penaltyData.penalty,this.SS.cell*(penaltyData.position.X+6),this.SS.cell*(penaltyData.position.Y+3));
                setTimeout(()=>{
                    this.context.globalCompositeOperation = "destination-out";
                    this.context.lineWidth = 4;
                    this.context.strokeText('- '+penaltyData.penalty,this.SS.cell*(penaltyData.position.X+6),this.SS.cell*(penaltyData.position.Y+3));
                    this.context.globalCompositeOperation = "source-over";
                },1000);
            },160);
        });
    }
    fillCell(x,y){
        this.context.fillStyle = 'rgba(255,255,255,0.8)';
        this.context.fillRect(this.SS.cell*(x+5),this.SS.cell*(y+2),this.SS.cell,this.SS.cell);
        setTimeout(()=>{
            this.context.globalCompositeOperation = "destination-out";
            this.context.fillStyle = 'white';
            this.context.fillRect(this.SS.cell*(x+5),this.SS.cell*(y+2),this.SS.cell,this.SS.cell);
            this.context.globalCompositeOperation = "source-over";
        },150);
    }
    move(){
        this.frameCounter = 0;
        //25フレーム
        this.signalInterval = setInterval(this.nextFrame.bind(this),300/25);
    }
    nextFrame(){
        this.frameCounter++;
        if(this.frameCounter > 25){
            clearInterval(this.signalInterval);
            this.context.clearRect(0,0,this.canvas.width,this.canvas.height);

            return;
        }
        this.params.bgOpacity -= 0.8/25;
        this.params.redX -= 4;
        this.params.blueX += 4;
        this.params.vsOpacity -= 1/25;
        this.draw();
    }
    draw(){
        //画面クリア
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        //背景色設定
        this.canvas.style.backgroundColor = 'rgba(0,0,0,'+this.params.bgOpacity+')';
        //赤
        this.context.beginPath();
        const redStartGrad = this.context.createLinearGradient(
            this.canvas.width*this.params.redX/100,
            0,
            (this.SS.cell*39)+(this.canvas.width*this.params.redX/100),
            0
        );
        redStartGrad.addColorStop(0,'red');
        redStartGrad.addColorStop(1,'rgba(0,0,0,0)');
        this.context.fillStyle = redStartGrad;
        this.context.fillRect(
            this.canvas.width*this.params.redX/100,
            this.SS.cell*9,
            this.canvas.width,
            this.SS.cell*4
        );
        //青
        this.context.beginPath();
        const blueStartGrad = this.context.createLinearGradient(
            this.canvas.width+(this.canvas.width*this.params.blueX/100),
            0,
            (this.SS.cell*-10)+(this.canvas.width*this.params.blueX/100),
            0
        );
        blueStartGrad.addColorStop(0,'blue');
        blueStartGrad.addColorStop(1,'rgba(0,0,0,0)');
        this.context.fillStyle = blueStartGrad;
        this.context.fillRect(
            this.canvas.width*this.params.blueX/100,
            this.SS.cell*16,
            this.canvas.width,
            this.SS.cell*4
        );
        //Name
        this.context.font = '45pt Arial';
        this.context.fillStyle = 'white';
        this.context.textBaseline = 'middle';
        for(const user of this.roomData.userList){
            if(user.userNo === 0){
                this.context.textAlign = 'start';
                this.context.fillText(user.userName,this.SS.cell+(this.canvas.width*this.params.redX/100),this.SS.cell*11.3);
            }else{
                this.context.textAlign = 'end';
                this.context.fillText(user.userName,(this.SS.cell*28)+(this.canvas.width*this.params.blueX/100),this.SS.cell*18.3);
            }
        }
        //VS
        this.context.font = '35pt Arial';
        this.context.textAlign = 'center';
        this.context.fillStyle = 'rgba(255,255,255,'+this.params.vsOpacity+')';
        this.context.fillText('V S',this.SS.cell*14.5,this.SS.cell*14.6);
    }
}
