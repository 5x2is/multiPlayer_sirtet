'use strict';
class SharedSettings{
    static get FIELD_WIDTH(){
        return 500;
    }
    static get FIELD_HEIGHT(){
        return 500;
    }
}
if(typeof module !=='undefined' && typeof module.exports !=='undefined'){
    module.exports = SharedSettings;
}
