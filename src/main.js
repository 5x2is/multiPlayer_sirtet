'use strict';
console.log('ver1.0.1');

//port関係
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
//パス指定用モジュール
const path = require('path');
//webSocket
const io = require('socket.io').listen(app.listen(PORT));
//ゲームクラス
const Game = require('./libs/game.js');

//PORT番ポートで待ちうける
app.listen(PORT,()=>{
	console.log('server listening port:'+PORT);
});

const game = new Game();
game.start(io);

//静的ファイルのルーティング
app.use(express.static(path.join(__dirname,'public')));

//その他のリクエストに対する404エラー
app.use((req,res)=>{
    res.sendStatus(404);
});
