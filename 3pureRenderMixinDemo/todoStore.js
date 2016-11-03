define('todoStore', function(require, exports, module) {
    var reflux = require('reflux');
    
    function getInitOption(){
        return {
            num: 0,
            //文字组件属性
            defaultText: '我真的是一个段落', //text组件的文本
            textShow: true, //text组件是否显示
            showTimes: 10000 //text要复制的次数
        }
    }

    module.exports = function(actions) {
        var option = getInitOption();
        var getApi = {
            getTextProps: function(){
                return option.textProps;
            }
        };

        var store = reflux.createStore({
            listenables: [actions],
            mixins: [getApi], //getter的api
            onAddOne: function( item ) {
                option.num++;
                this.trigger(option);
            },
            getInitialState: function() {
                return option;
            }
        });
        return store;
    }
});