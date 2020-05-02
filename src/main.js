'use strict';
console.log('ver1.0.0');

//port関係
const express = require('express');
const app = express();
const http = require('http').Server(app);
const PORT = process.env.PORT || 4000;

app.get('/',(req,res)=>{
	res.sendFile(__dirname+'/index.html');
});
http.listen(PORT,()=>{
	console.log('server listening port:'+PORT);
});
