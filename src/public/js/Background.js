'use strict';
class Background{
    constructor(canvas){
        this.canvas = canvas;
        this.SS = ScreenSetting;
        this.canvas.width = this.SS.CANVAS_WIDTH;
        this.canvas.height = this.SS.CANVAS_HEIGHT;
        this.init();
    }
    init(){
        console.log('init');
        //背景を黒くする
        this.canvas.style.backgroundColor = 'black';
        //背景グラデーション赤
        const redBgCtx = this.canvas.getContext('2d');
        redBgCtx.beginPath();
        const redBgGrad = redBgCtx.createLinearGradient(0,this.canvas.height,this.canvas.width*0.4,this.canvas.height*0.8);
        redBgGrad.addColorStop(0,'red');
        redBgGrad.addColorStop(1,'black');
        redBgCtx.fillStyle = redBgGrad;
        redBgCtx.fillRect(0,0,this.canvas.width/2,this.canvas.height);
        //背景グラデーション青
        const blueBgCtx = this.canvas.getContext('2d');
        blueBgCtx.beginPath();
        const blueBgGrad = blueBgCtx.createLinearGradient(this.canvas.width,this.canvas.height,this.canvas.width*0.6,this.canvas.height*0.8);
        blueBgGrad.addColorStop(0,'blue');
        blueBgGrad.addColorStop(1,'black');
        blueBgCtx.fillStyle = blueBgGrad;
        blueBgCtx.fillRect(this.canvas.width/2,0,this.canvas.width,this.canvas.height);
        //白線
        const line = this.canvas.getContext('2d');
        line.strokeStyle = 'white';
        line.lineWidth= '2';
        const lineY = [3.5,5.5,9.5,11.5,15.5,19.5,23.5];
        for(let i=0; i<lineY.length; i++){
            line.beginPath();
            line.moveTo(0,this.SS.cell*lineY[i]);
            line.lineTo(this.canvas.width,this.SS.cell*lineY[i]);
            line.stroke();
        }
        //フィールド枠線
        const fieldBgLine = this.canvas.getContext('2d');
        fieldBgLine.fillStyle = 'white';
        fieldBgLine.fillRect(this.SS.FIELD_X1-2,this.SS.FIELD_Y1-2,this.SS.FIELD_WIDTH+4,this.SS.FIELD_HEIGHT+4);
        //フィールド背景
        const fieldBg = this.canvas.getContext('2d');
        fieldBg.fillStyle = 'black';
        fieldBg.fillRect(this.SS.FIELD_X1,this.SS.FIELD_Y1,this.SS.FIELD_WIDTH,this.SS.FIELD_HEIGHT);

        //出現ポイント赤
        const redStart = this.canvas.getContext('2d');
        redStart.beginPath();
        const redStartGrad = redStart.createLinearGradient(0,0,0,this.SS.cell*4);
        redStartGrad.addColorStop(0,'red');
        redStartGrad.addColorStop(1,'black');
        redStart.fillStyle = redStartGrad;
        redStart.fillRect(this.SS.cell*9,this.SS.FIELD_Y1,this.SS.cell*5,this.SS.cell*2);

        //出現ポイント青
        const blueStart = this.canvas.getContext('2d');
        blueStart.beginPath();
        const blueStartGrad = blueStart.createLinearGradient(0,0,0,this.SS.cell*4);
        blueStartGrad.addColorStop(0,'blue');
        blueStartGrad.addColorStop(1,'black');
        blueStart.fillStyle = blueStartGrad;
        blueStart.fillRect(this.SS.cell*15,this.SS.FIELD_Y1,this.SS.cell*5,this.SS.cell*2);

        //罫線
        line.strokeStyle = 'gray';
        line.lineWidth ='0.6';
        for(let i=1; i<27; i++){
            line.beginPath();
            line.moveTo(this.SS.FIELD_X1,this.SS.FIELD_Y1+(this.SS.cell*i));
            line.lineTo(this.SS.FIELD_X1+this.SS.FIELD_WIDTH,this.SS.FIELD_Y1+(this.SS.cell*i));
            line.stroke();
        }
        for(let i=1; i<17; i++){
            line.beginPath();
            line.moveTo(this.SS.FIELD_X1+(this.SS.cell*i),this.SS.FIELD_Y1);
            line.lineTo(this.SS.FIELD_X1+(this.SS.cell*i),this.SS.FIELD_Y1+this.SS.FIELD_HEIGHT);
            line.stroke();
        }
        //テキスト
        const text = this.canvas.getContext('2d');
        text.font = '18pt Arial';
        text.fillStyle = 'white';
        text.textAlign = 'center';
        text.textBaseline = 'middle';
        text.fillText('LEVEL',this.SS.cell*3,this.SS.cell);
        text.fillText('DELAY',this.SS.cell*26,this.SS.cell);
        text.fillText('HOLD',this.SS.cell*3,this.SS.cell*4.6);
        text.fillText('HOLD',this.SS.cell*26,this.SS.cell*4.6);
        text.fillText('NEXT',this.SS.cell*3,this.SS.cell*10.6);
        text.fillText('NEXT',this.SS.cell*26,this.SS.cell*10.6);
        text.fillText('SCORE',this.SS.cell*3,this.SS.cell*25.6);
        text.fillText('SCORE',this.SS.cell*26,this.SS.cell*25.6);
    }
}
