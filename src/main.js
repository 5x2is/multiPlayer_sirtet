'use strict';
console.log('ver1.0.0');

//port関係
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
//パス指定用モジュール
const path = require('path');
//webSocket
const io = require('socket.io').listen(app.listen(PORT));
let timerId = 0;

//PORT番ポートで待ちうける
app.listen(PORT,()=>{
	console.log('server listening port:'+PORT);
});


//静的ファイルのルーティング
app.use(express.static(path.join(__dirname,'public')));

//その他のリクエストに対する404エラー
app.use((req,res)=>{
    res.sendStatus(404);
});
const position = [0,0];

io.on('connection',(socket)=>{
    clearInterval(timerId);
    timerId = setInterval(()=>{
        io.emit('message',position);
    },100);
    socket.on('message',(keyCode)=>{
        switch (keyCode){
            case 39:
                position[0]++;
                break;
            case 37:
                position[0]--;
                break;
            case 38:
                position[1]--;
                break;
            case 40:
                position[1]++;
                break;
            default:
                break;
        }
    });
});

