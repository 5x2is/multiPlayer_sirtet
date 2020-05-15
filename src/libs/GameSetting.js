'use strict';
module.exports = class GameSetting{
    static get FRAMERATE(){
        if(process.argv.length === 3){
            console.log('debug mode');
            return process.argv[2];
        }

        return 20;
    }
    static get FIELD_WIDTH(){
        return 25;
    }
    static get FIELD_HEIGHT(){
        return 25;
    }
};
