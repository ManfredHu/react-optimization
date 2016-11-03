define("todoAction2", function(require, exports, module) {
    var reflux = require('reflux');

    /**
     * 事件声明
     * @param  {[type]} actions [description]
     * @return {[type]}         [description]
     */
    module.exports = function(actions){
        var actions = reflux.createActions([]);

        return actions;
    };
});

define('todoStore2', function(require, exports, module) {
    var reflux = require('reflux');
    var Immutable = require('immutable');
    
    module.exports = function(actions) {
        var store = reflux.createStore({
            listenables: [actions],
            getInitialState: function() {
                this.data = {
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