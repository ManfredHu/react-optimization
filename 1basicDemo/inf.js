/**
 * 消息管理模块
 */
define('inf', function(require, exports, module) {
    var _cacheThisModule_;
    var g = {
        __Msgs: {},
        time: 0
    };
    window["_infConfig"] = g;
    /**
     * 监听消息
     * @param  {[string]}   type 自定义的消息名称，必须
     * @param  {Function} fn   处理函数  必须
     * @param  {[domelement]}   dom  用于透传的dom ，非必须
     * @param  {[string]}   id   函数唯一标识，非必须
     * @return {[null]}        无返回
     */
    exports.on = function(type, fn, dom, id) {
            var __Msgs = g.__Msgs;
            __Msgs[type] = Object.prototype.toString.call(__Msgs[type]) == "[object Array]" ? __Msgs[type] : [];
            __Msgs[type].push({
                guid: id ? id : +new Date() + "" + g.time++,
                fn: fn,
                dom: dom
            })
        }
        /**
         * 消息广播
         * @param  {[string]} type 自定义的消息名称，必须
         *                         除type外的其他参数会透传给处理函数
         * @return {[object]}      必须符合规范
         *                         {
         *                         		msgBack: mixed,//任意类型，作为postMsg的返回值
         *                         		msgGoon :boolen,//true:执行后续事件处理函数，false:不执行
         *                         		sendMsg:string//新的广播消息的名称，空串则不广播
         *                            }
         *                         如果没有按照规范返回，则此值直接作为postMsg的返回值，且后续事件处理函数不会执行
         */
    exports.emit = function(type) {
        return function(center, args, queue, reValue, guid, o) {
            //纯粹调试用
            var debug = center["*"];
            if (debug) { //所有消息都执行
                for (var i = 0, j = debug.length; i < j; i++) {
                    debug[i].fn.apply(this, [type].concat(args));
                }
            }

            if (queue = center[type]) {
                var backData = {
                    msgBack: null, //函数返回值
                    msgGoon: true, //是否处理后续函数
                    sendMsg: "" //新的广播消息名称
                };
                for (var i = 0, j = queue.length; i < j; i++) {
                    o = queue[i];
                    reValue = o.fn.apply(o.dom, args);
                    if (Object.prototype.toString.call(reValue) == "[object Object]" && typeof(reValue) != "undefined") { //object类型
                        backData.msgBack = reValue.msgBack;
                        backData.msgGoon = reValue.msgGoon === false ? false : true;
                        backData.sendMsg = reValue.sendMsg;
                    } else {
                        backData.msgBack = reValue;
                        backData.msgGoon = true;
                        backData.sendMsg = "";
                    }

                    if (backData.sendMsg) { //需要广播新消息
                        exports.postMsg.apply(this, [backData.sendMsg].concat(args));
                    }
                    if (backData.msgGoon === false) { //阻止后续事件处理
                        break;
                    }
                }
                if (args.length >= 2) {
                    var t = args[1],
                        clickId = "";
                    if (type != "inf.report.click") {
                        exports.emit("inf.report.click", {}, t, type);
                    }
                }
                return backData.msgBack;
            }
        }(g.__Msgs, Array.prototype.slice.call(arguments, 1))
    }


    /**
     * 从队列中移除消息
     * @param  {[string]} type 自定义的消息名称，必须
     * @param  {[string]} id  函数唯一标识，非必须。
     *                         如果没有id，则删除type下所有处理函数
     *                         如果有id,则删除指定处理函数
     * @return {[object]}      调用者
     */
    exports.off = function(type, id) {
        var __Msgs = g.__Msgs;
        if (!id) { //没有id,则删除事件名称下所有处理函数
            delete __Msgs[type];
        } else {
            var _o = __Msgs[type] || [];
            for (var i in _o) {
                if (_o[i].guid == id) {
                    _o.splice(i--, 1);
                    break;
                }
            }
        }
        return this;
    }


    /**
     * 从队列中移除消息,非建议方法，不利于后续自动化扫描
     * @param  {[string]} type 自定义的事件名称，正则表达式
     * @return {[object]}      调用者
     */
    exports.offReg = function(type) {
        var __Msgs = g.__Msgs,
            reg = new RegExp(type);
        for (var i in __Msgs) {
            if (reg.test(i)) {
                delete __Msgs[i];
            }
        }
        return this;
    }
});
