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
        // console.log(addOns)

        // var actions = actions();
        // var store = store(actions);
        // console.log(store);
        // todoTpl({

        // })
        // console.log(action)
        // console.log(store)
        //读取 url 参数 -- Param
        // var param = getUrlParam();
        //事件声明 -- Actions
        // var actions = require('game.center.action');
        //创建数据中心 -- Data
        // var store = require('game.center.store')(actions, param);

        //构建视图层 -- View
        // tplView.app(view.mc.container, actions, store, function() {
        //     lotTool.itilByType('DIAOYUCENTER_ENTRA',  _getItilMap()); //ITIL~ [钓鱼游戏个人中心]钓鱼个人中心进入量 DIAOYUCENTER_ENTRA wx|mqq|app

        //     //tab已加载完数据的状态量
        //     loadTabData._isLoad = [false, false, false];    

        //     //加载用户个人登录数据-- Ajax
        //     //加入shoRecords中继续等待战绩数据
        //     loadData(actions, store);

        //     //传入当前tab加载对应tab数据
        //     loadTabData({
        //         tab: store.getNowTab(),
        //         actions: actions
        //     });

        //     //绑定 跨模块 和 平台级 事件
        //     eventBind(actions, store);
        // });
    }
})