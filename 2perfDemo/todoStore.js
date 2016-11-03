define('todoStore', function(require, exports, module) {
    var reflux = require('reflux');
    
    module.exports = function(actions) {
        var store = reflux.createStore({
            listenables: [actions],
            onAddOne: function( item ) {
                this.data.num++;
                this.trigger(this.data);
            },
            getInitialState: function() {
                this.data = {
                    num: 0,
                    timer: null,
                    //文字组件属性
                    defaultText: '我真的是一个段落', //text组件的文本
                    textShow: true, //text组件是否显示
                    showTimes: 10000 //text要复制的次数
                };

                return this.data; //there to return to the state,means this.data = this.state
            }
        });
        return store;
    }
});