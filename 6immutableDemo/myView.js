/**
 * mytouch 移动开发框架
 * @version 2.0.1
 * @author kpxu\jimyan\wowowang
 * @description  modulejs("mytouch",function(m){ m.init(); })
 * mytouch框架主要是基于hashchange来进行模块的切换和加载，根据hash规则中描述的module和action进行实例化和执行。
 * 1、hash规则：#后以key1=value1&key2=value2的格式表示，第一个key表示要调用的module，第一个value表示要调用的action
 * 2、具备hash切换前后的析构和构造方法的检查，构造方法为:action_construct，析构方法为:action_destroy;通过构造和析构函数可以灵活实现如预缓存和资源销毁动作
 * 3、业务中需要定义module，并将相关页面的处理方法定义为action，则相应的调用url为：url#module=action&var1=values1...
 */
define('myView', function(require, exports, module) {
    var _cacheThisModule_;
    var $ = require("{jquery}"); //modulejs所支持的变量模块名，通过vars配置会翻译成最终的module
    var inf = require("inf"); //消息通讯模块
    var cfg = {
        "index": [], //如：["frame","index"]，首页模块的module名及默认action名字，首页主模块是指主框架初始化完成后首先调用的默认业务模块的名字
        "debug": false, //是否调试模式，如果为true，mytouch会打印相关的节点log到控制台
        "extender": "", //view方法扩展器
        "containerId": "", //主容器id
        "modelRouteMap": {}, //模块路由映射表，用于把一个module的请求转发到另外一个module上。action映射暂时不要

        /*
        moduleActionMap:{
        	card:{
        		detail:['lot.card.christmas','detail'],
        		list:['lot.card.christmas','list']
        	}
        }
         */
        "moduleActionMap": {}, //模块 ACTION的路由。
        //以下为内部参数
        "container": "", //主容器指针
        "extendMod": "", //view扩展module
        "history": [], //历史记录
        "views": {}, //view列表
        "currHash": "", //当前view
        "_his": [], //访问链条
        "isInit": false //是否已经初始化
    };
    exports.init = function() {
        //启动引擎
        $(function() {
            new enginer().init();
        });
    }

    exports.getHis = function() {
        return cfg._his;
    }

    exports.getCfg = function() {
        return cfg;
    }

    /**
     * 获取当前的view
     * @return {[type]} [description]
     */
    exports.getView = function() {
        return cfg.views[cfg.currHash.join()];
    }

    //调度引擎
    function enginer() {
        //初始化
        this.init = function() {
            //防止重复调用
            if (cfg.isInit) {
                return false;
            }
            //读取配置，配置参数放在一个全局变量_mytouchConfig中，结构参考cfg变量
            window["_mytouchConfig"] || (window["_mytouchConfig"] = {});
            //合并配置
            for (var i in window["_mytouchConfig"]) {
                cfg[i] = window["_mytouchConfig"][i];
            }
            //同步配置到全局变量上
            window["_mytouchConfig"] = cfg;
            //获取主容器的指针，contianerId不存在的话，就返回body
            (cfg.container = document.getElementById(cfg.containerId)) || (cfg.container = document.body);
            //设置为已经初始化
            cfg.isInit = true;
            //绑定框架事件监控
            bindEvents(this);
            //预加载扩展模块
            this.loadExtendMod(cfg, function() {
                //触发当前hash的执行，启动框架
                inf.emit("mt_firstHash");
            })
        };
        //加载view进行展示
        this.loadView = function(hash) {
                var x = getCurrHash()
                cfg.currHash = hash ? hash : getCurrHash();

                var new_module_action_r = inf.emit("new_module_action", cfg.currHash);
                //new_model_action做一次校验
                if (new_module_action_r === "cancel") {
                    return true;
                }

                var tempTime = new Date();
                //加载view的module
                loadViewMod(cfg, function(cView, notFirst) {
                    if (!cView.mc.memberFunc) {
                        inf.emit("mt_moudle_load_error", cView.mc.hash);
                        return false;
                    }
                    if (!notFirst) {
                        cView.time = [tempTime, new Date()];
                    }
                    cfg.history.push(cfg.currHash); //添加历史记录

                    cfg._his.push([cfg.currHash, new Date().getTime()]);
                    if (cfg._his.length > 10) {
                        cfg._his = cfg._his.slice(-10);
                    }

                    var pView = getPrevView(); //上一个view
                    inf.emit("module_run_start", cView.mc.hash);
                    cView.construct(); //当前hash开始构造
                    //转场动画控制，销毁在动画后再执行。
                    pView && (pView.mc.hash.join() != cView.mc.hash.join()) && pView.destroy(cfg); //上一个hash开始销毁
                    cView.memberFunc(); //当前hash正式执行
                    //广播moudle执行完成的事件
                    inf.emit("module_run_success", cView.mc.hash);
                });
            }
            //加载view扩展模块
        this.loadExtendMod = function(cfg, callback) {
                if (cfg.extender) {
                    modulejs(cfg.extender, function(m) {
                        cfg.extendMod = m;
                        //调用extender的全局模块
                        m["_extenderInit"] && m["_extenderInit"](cfg);
                        //合并路由映射表
                        if (m["_modelRouteMap"]) {
                            for (var i in m["_modelRouteMap"]) {
                                cfg.modelRouteMap[i] = m["_modelRouteMap"][i];
                            }
                        }
                        callback();
                    });
                } else {
                    cfg.extendMod = {};
                    callback()
                }
            }
            //加载view对应的module到view中
        function loadViewMod(cfg, callback) {
            if (cfg.views[cfg.currHash.join()]) {
                callback(cfg.views[cfg.currHash.join()], true);
                return true;
            }
            var view = new viewer(cfg.currHash, cfg);
            cfg.views[cfg.currHash.join()] = view;
            modulejs(view.mc.mod, function(m) {
                var act = view.mc.act;
                //合并extender中定义的config，等于业务中对view进行的全局配置
                if (cfg.extendMod.config) {
                    for (var i in cfg.extendMod.config) {
                        view.mc[i] = cfg.extendMod.config[i];
                    }
                }
                //合并业务module中的配置，等于某个view自己的特殊配置
                if (m[act + "_config"]) {
                    for (var i in m[act + "_config"]) {
                        view.mc[i] = m[act + "_config"][i];
                    }
                }
                //从module中提取view需要的方法
                //当前module提供的destroy方法-destroy
                view.mc.destroy = m[act + "_destroy"] ? m[act + "_destroy"] : empty;
                //当前module提供的构造方法-construct
                view.mc.construct = m[act + "_construct"] ? m[act + "_construct"] : empty;
                //当前module提供的主业务方法-memberFunc
                view.mc.memberFunc = m[act] ? m[act] : "";
                //合并extender到view中,有同名则加前缀_,无同名则直接放上去
                for (var i in cfg.extendMod) {
                    if (view[i]) { //todo:_开头的属性不应该合并
                        view["_" + i] = cfg.extendMod[i];
                    } else {
                        view[i] = cfg.extendMod[i];
                    }
                }
                callback(view);
            });
        }
        //空方法
        function empty() {
            return true;
        }
        //获取当前要处理的hash动作
        function getCurrHash() {
            //没有设置默认hash的时候使用默认的module、action
            var module = (getHashModuleName() || cfg.index[0]);
            var action = (getHashActionName() || cfg.index[1]);

            //允许业务由于某种原因临时更改路由
            var ma = inf.emit("myView.route.change", module, action);
            if (ma && Object.prototype.toString.call(ma) == "[object Array]") {
                module = ma[0];
                action = ma[1] || action;
            }

            if (cfg.moduleActionMap && cfg.moduleActionMap[module] && cfg.moduleActionMap[module][action]) {
                return cfg.moduleActionMap[module][action];
            }
            //解析hash映射表
            if (cfg.modelRouteMap[module]) {
                module = cfg.modelRouteMap[module];
            }
            return [module, action];
        }
        //获取上一个hash
        function getPrevHash() {
            if (cfg.history.length > 1) {
                return cfg.history[cfg.history.length - 2];
            } else {
                return [];
            }
        }
        //获取上一个hash对应的view
        function getPrevView() {
            var h = getPrevHash();
            if (!h[0]) {
                return "";
            } else {
                return cfg.views[h.join()];
            }
        }
        //绑定框架事件监控
        function bindEvents(enginer) {

            //setTimeout(function(){
            //hash监控
            $(window).on("hashchange", function(e) {
                inf.emit("mt_hashChanged");
            });
            //todo：左划事件
            //todo：右划事件
            //todo: 上下拉事件
            //hash变化
            inf.on("mt_hashChanged", enginer.loadView);
            //当前hash启动
            inf.on("mt_firstHash", enginer.loadView);
            //module的action未定义
            inf.on("mt_moudle_load_error", function(id) {
                console.error("mt_moudle_load_error:" + id);
            });
            //},0);
        };
        /**
         * 获取当前url中的hash值
         * @param url
         * @return String
         */
        function getHash(url) {
            var u = url || location.hash;
            return u ? u.replace(/.*#/, "") : "";
        }
        /*
         *	根据hash获取对应的模块名
         */
        function getHashModuleName() {
            var hash = getHash();
            return (hash ? hash.split("&")[0].split("=")[0] : "");
        }
        /*
         *	从hash中获取action
         */
        function getHashActionName() {
            var hash = getHash();
            if (hash == "") return "";
            return (hash ? hash.split("&") : [])[0].split("=")[1];
        }
    }

    function viewer(hash, cfg) {
        var mc = {
            isConstract: false, //是否已经构造
            isDestroyed: false, //是否已经销毁
            cache: false, //默认不cache view，可以通过module中act_config.cache来覆盖
            cacheTime: 1000 * 60 * 15, //默认cache有效15分钟
            hash: hash, //当前hash
            mod: hash[0], //当前module
            act: hash[1], //当前action
            timeouts: [], //当前view中所有的setTimeout
            intervals: [], //当前view中所有的setIntervals
            callbackProxy: [], //当前view中的callback
            loaderCallbacks: [], //接口请求的回调函数
            container: "" //容器
        };
        this.mc = mc;
        mc.container = creatContainer(hash, cfg);
        this.creatContainer = creatContainer;
        //为view创建一个新的container
        function creatContainer(hash, cfg) {
            var div = document.createElement("div");
            div.id = "c_" + hash.join("_");
            div.style.display = "none";
            cfg.container.appendChild(div);
            return div;
        }
        //销毁方法
        this.destroy = function(cfg) {
            mc.container.style.display = "none";
            //调用module的destroy方法
            mc.destroy(this);
            //如果有扩展方法就执行扩展方法
            this["_destroy"] && this["_destroy"](this);
            //如果模块不cache，则直接清除掉dom结构，以及view
            if (!mc.cache) {
                cfg.container.removeChild(mc.container);
                delete cfg.views[mc.hash.join()];
            }
            mc.isDestroyed = true;
            //销毁页面中所有的setTimeout
            for (var i = 0, iLen = mc.timeouts.length; i < iLen; i++) {
                if (mc.timeouts[i]) {
                    clearTimeout(mc.timeouts[i]);
                    mc.timeouts[i] = null;
                }
            }
            //销毁页面中所有的setInterval
            for (var m = 0, mLen = mc.intervals.length; m < mLen; m++) {
                if (mc.intervals[m]) {
                    clearInterval(mc.intervals[m]);
                    mc.intervals[m] = null;
                }
            }
            mc.timeouts = []; //清空setTimout数组
            mc.intervals = []; //清空setInterval数组
        };
        //启动方法
        this.construct = function() {
            //显示容器
            mc.container.style.display = "";
            //如果为进行构造过的话，就构造一次
            if (!mc.isConstract) {
                //如果有扩展方法就执行扩展方法
                this["_construct"] && this["_construct"](this);
                //调用module的construct方法
                mc.construct(this);
                mc.isConstract = true;
            }
        };
        //初始化
        this.memberFunc = function() {
            //调用module的memberFunc方法
            mc.memberFunc && mc.memberFunc(this);
            //如果有扩展方法就执行扩展方法
            this["_memberFunc"] && this["_memberFunc"](this);
        };
        //在container中输出html内容
        this.setContent = function(html) {
            //有扩展方法则只执行扩展方法
            if (this["_setContent"]) {
                this["_setContent"](html);
                return true;
            }
            //写入内容
            mc.container.innerHTML = html;
        };

        //当前view中的setTimeout代理，hash切换时统一销毁
        //调用方式： view.setTimout(function(){}, 2000);
        this.setTimeout = function(fn, millisec) {
            var timeout = setTimeout(fn, millisec);
            mc.timeouts.push(timeout);
            return timeout;
        };
        //当前view中的setInterval代理，hash切换时统一销毁
        //调用方式： view.setInterval(function(){}, 2000);
        this.setInterval = function(fn, millisec) {
            var interval = setInterval(fn, millisec);
            mc.intervals.push(interval);
            return interval;
        };
        //当前view中的callback代理，hash切换后，真实的callback不执行  eg: mdata.getXXData(v.callbackProxy(sucReq, this));
        //适用场景:1.ajax请求回调，弱网络环境下，ajax请求比较慢，回调回来之前，如果hash已经切换了却执行回调，会导致一些隐藏bug
        //		   2.某个处理过程的回调，内部封装了setTimout，ajax等异步逻辑，如果hash已经切换了却执行回调，会导致一些隐藏bug
        this.callbackProxy = function(fn, that) {
            that = that || window; //不传递则默认是window对象
            var theHash = mc.hash.join(); //闭包记录当前的hash
            return function() {
                if (!mc.isDestroyed && theHash === cfg.currHash.join()) {
                    fn.apply(that, arguments);
                } else {
                    console.warn("hash changed, callback in " + theHash + " expired!");
                }
            };
        };
    }
});
