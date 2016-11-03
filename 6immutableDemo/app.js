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
    var actions2 = require('todoAction2')();
    var store2 = require('todoStore2')(actions2);
    var todoTpl = require('todoTpl');

    exports.init = function(view) {
        todoTpl.app({
            container: document.getElementById("app"),
            actions:   actions,
            store:     store,
            actions2:  actions2,
            store2:    store2,
        });
    }
})