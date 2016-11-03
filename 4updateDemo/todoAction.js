define("todoAction", function(require, exports, module) {
    var reflux = require('reflux');

    /**
     * 事件声明
     * @param  {[type]} actions [description]
     * @return {[type]}         [description]
     */
    module.exports = function(actions){
        var actions = reflux.createActions([
            "addOne"          
        ]);

        return actions;
    };
});