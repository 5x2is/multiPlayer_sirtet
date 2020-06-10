'use strict';
module.exports = class GameSetting{
    static get FRAMERATE(){
        if(process.argv.length === 3){
            console.log('debug mode');

            return process.argv[2];
        }

        return 30;//frame per sec
    }
    static get FIELD_WIDTH(){
        return 17;
    }
    static get FIELD_HEIGHT(){
        return 25;
    }
    static get START_POS(){
        return Math.floor(this.FIELD_WIDTH/2)+1;
    }
    static get CELL_SIZE(){
        return 20;
    }
    static get CLIENT_SETTING(){
        return {
            FIELD_HEIGHT: (this.FIELD_HEIGHT+3)*this.CELL_SIZE,
            FIELD_WIDTH: (this.FIELD_WIDTH+2)*this.CELL_SIZE
        };
    }
    static get DROP_SPEED(){
        return 810;
    }
};
