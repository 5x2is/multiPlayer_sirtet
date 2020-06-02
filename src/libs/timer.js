'use strict';
let startTime = null;
exports.start = ()=>{
    const time = new Date();
    startTime = time.getTime();
};
exports.end = ()=>{
    const time = new Date();
    const interval = time.getTime()-startTime;
    console.log('time:'+interval);
};
