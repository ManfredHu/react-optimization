/**
 * 个人中心 
 * @param  {[type]} require [description]
 * @param  {[type]} exports [description]
 * @param  {[type]} module  [description]
 * @return {[type]}         [description]
 */
define("app", function(require, exports, module) {
    
    var actions = require('todoAction')();
    var store = require('todoStore')(actions);
    var todoTpl = require('todoTpl');

    exports.init = function(view) {
        todoTpl.app({
            container: document.getElementById("app"),
            actions:   actions,
            store:     store
        });
    }

})