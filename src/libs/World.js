'use strict';
const User = require('./User.js');
module.exports = class World{
    constructor(io){
        this.io = io;
        this.setUser = new Set();//ユーザリスト
    }
    addUser(){
        const user = new User();
        this.setUser.add(user);

        return user;
    }
};

