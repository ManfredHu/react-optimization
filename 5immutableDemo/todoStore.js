define('todoStore', function(require, exports, module) {
    var reflux = require('reflux');
    var Immutable = require('immutable');
    
    var option = {
        num: 0,
        timer: null,
        //文字组件属性
        defaultText: '我真的是一个段落', //text组件的文本
        textShow: true, //text组件是否显示
        showTimes: 10000 //text要复制的次数
    };
    module.exports = function(actions) {
        var store = reflux.createStore({
            listenables: [actions],
            onAddOne: function( item ) {
                // this.data = this.data.update('num',function(v){ //update写法
                //     return v+1;
                // });
                this.data = this.data.set('num',this.data.get('num')+1); //set写法
                this.trigger(this);
            },
            getInitialState: function() {
                this.data = Immutable.fromJS(option);
                return this;
            }
        });
        return store;
    }
});