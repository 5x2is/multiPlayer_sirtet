'use strict';
console.log('ver1.0.0');

//port関係
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const path = require('path');

//PORT番ポートで待ち受ける
app.listen(PORT,()=>{
	console.log('server listening port:'+PORT);
});
app.use(express.static(path.join(__dirname,'public')));

app.use((req,res)=>{
    res.sendStatus(404);
});
