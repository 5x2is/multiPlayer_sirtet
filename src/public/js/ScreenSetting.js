'use strict';
class ScreenSetting{
    static get cell(){
        return 18;
    }
    static get CANVAS_WIDTH(){
        return this.cell*29;
    }
    static get CANVAS_HEIGHT(){
        return this.cell*32;
    }
    static get FIELD_X1(){
        return this.cell*6;
    }
    static get FIELD_Y1(){
        return this.cell*2;
    }
    static get FIELD_WIDTH(){
        return this.cell*17;
    }
    static get FIELD_HEIGHT(){
        return this.cell*27;
    }
    static get SIDE_MARGIN(){
        return 120;
    }
    static get BOTTOM_MARGIN(){
        return 20;
    }
}
