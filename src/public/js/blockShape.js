'use strict';
class blockShape{
    static shape(ID){
        const data = {
            I :{
                shape:[{x:-2,y:0},{x:-1,y:0},{x:0,y:0},{x:1,y:0}],
                color:'rgb(102,255,255)'
            },
            O:{
                shape:[{x:-1,y:-1},{x:-1,y:0},{x:0,y:-1},{x:0,y:0}],
                color:'rgb(255,255,0)'
            },
            T:{
                shape:[{x:0,y:-1},{x:-1,y:0},{x:0,y:0},{x:1,y:0}],
                color:'rgb(153,0,204)'
            },
            J:{
                shape:[{x:-1,y:-1},{x:-1,y:0},{x:0,y:0},{x:1,y:0}],
                color:'rgb(0,0,255)'
            },
            L:{
                shape:[{x:1,y:-1},{x:-1,y:0},{x:0,y:0},{x:1,y:0}],
                color:'rgb(255,102,0)'
            },
            S:{
                shape:[{x:0,y:-1},{x:1,y:-1},{x:-1,y:0},{x:0,y:0}],
                color:'rgb(0,255,0)'
            },
            Z:{
                shape:[{x:-1,y:-1},{x:0,y:-1},{x:0,y:0},{x:1,y:0}],
                color:'rgb(255,0,0)'
            }
        };

        return data[ID];
    }
}
