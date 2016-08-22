define('todoStore', function(require, exports, module) {
    var reflux = require('reflux');

    var ob = require('observe'); //引入observe模块

    module.exports = function(actions) {
        var store = reflux.createStore({
            listenables: [actions],
            onAddOne: function( item ) {
                var num = this.data.num+1;
                this.data.num = num;
                this.trigger(this.data);
            },
            getInitialState: function() {
                this.data = {
                    num: 0,
                    timer: null,
                    //文字组件属性
                    defaultText: '我真的是一个段落', //text组件的文本
                    textShow: true, //text组件是否显示
                    showTimes: 1000, //text要复制的次数
                    obFunc: null
                };

                ob(this.data); //初始化store的时候ob一下

                return this.data; //there to return to the state,means this.data = this.state
            }
        });
        return store;
    }
});