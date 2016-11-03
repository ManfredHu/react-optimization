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
    var Perf = require('react').addons.Perf;

    exports.init = function(view) {
        //引入全局Perf，然后在Chrome浏览器点击start和end
        //注意在非生产环境要将这里的钩子去掉
        window.Perf = Perf;

        todoTpl.app({
            container: document.getElementById("app"),
            actions:   actions,
            store:     store
        });
    }
})