/**
 * JSON支持
 * @param  {[type]} ){function f(n){return  n<10?"0"+n:n;}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds() [description]
 * @return {[type]}             [description]
 */
if (typeof JSON !== "object") {
    JSON = {};
}(function() {
    function f(n) {
        return n < 10 ? "0" + n : n;
    }
    if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function(key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null;
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
            return this.valueOf();
        };
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap, indent, meta = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        },
        rep;

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }

    function str(key, holder) {
        var i, k, v, length, mind = gap,
            partial, value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key);
        }
        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
            case "string":
                return quote(value);
            case "number":
                return isFinite(value) ? String(value) : "null";
            case "boolean":
            case "null":
                return String(value);
            case "object":
                if (!value) {
                    return "null";
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null";
                    }
                    v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                    gap = mind;
                    return v;
                }
                if (rep && typeof rep === "object") {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === "string") {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v);
                            }
                        }
                    }
                }
                v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
                gap = mind;
                return v;
        }
    }
    if (typeof JSON.stringify !== "function") {
        JSON.stringify = function(value, replacer, space) {
            var i;
            gap = "";
            indent = "";
            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }
            } else {
                if (typeof space === "string") {
                    indent = space;
                }
            }
            rep = replacer;
            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify");
            }
            return str("", {
                "": value
            });
        };
    }
    if (typeof JSON.parse !== "function") {
        JSON.parse = function(text, reviver) {
            var j;

            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function(a) {
                    return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                j = eval("(" + text + ")");
                return typeof reviver === "function" ? walk({
                    "": j
                }, "") : j;
            }
            throw new SyntaxError("JSON.parse");
        };
    }
}());
/**
 * modulejs 1.0.2
 * author:kpxu\jimyan\wowowang
 * description:
 *   modulejs是一款比seajs、commonjs更加简洁、小巧的javascript模块化开发管理工具。
 *   思路精巧优雅，包含注释在内只有222行，同时也吸收了seajs和requirejs的一些优点
 * see：https://github.com/eccued/modulejs
 * update----brianliu 20130924
 *           更新require.css支持alias
 */
var modulejs, require, define;
(function(global) {
    var mod, cfg, _modulejs, _define, _require;
    var version = "1.0.2";
    var isCache = true;
    var MODULE_LOADING = 1,
        MODULE_SUCCESS = 2; //模块加载的状态，  loading是发起loadScript， success是define成功
    var cacheTime = 60 * 60 * 24 * 30 * 1000; //一个月
    cfg = {
        debug: location.href.indexOf("mdebug=1") != -1 ? true : false, //调试模式。
        alias: {}, //模块的所在文件路径定义
        cssAlias: {}, //css文件别名
        moduleURI: {}, //模块的单独访问uri
        vars: {}, //变量模块名
        uris: {}, //加载文件列表 文件URL作为下标，true为已加载  false为未加载
        loadMod: {}, //正在加载的模块id，如果某个模块正在加载，那么不做加载处理
        modules: {}, //模块列表 模块id作为下标
        callback: [], //入口回调方法的数组,所有modulejs所定义的方法都压入这个数组
        actModules: {}, //被require激活使用的module列表
        cacheLoad: {}, //被加载的cache 模块列表
        cacheDel: {}, //被删除的module cache
        deps: {}, //记录运行中需要用到的依赖队列

        //记录加载某个模块时，需要同时并发加载的其他模块名
        //举例 {'moduleA': ['moduleB', 'moduleC']}
        //这样加载 moduleA 的同时，会并发地加载 moduleB 和 moduleC
        moduleDeps: {},
        events: {}, //消息队列
        timing: {} //所有与性能有关的数据
    };
    //读取预配置
    _modulejs.config = config;
    config(global["_moduleConfig"] ? global._moduleConfig : cfg);
    global["_moduleConfig"] = cfg;
    //输出api
    require = _require; //引用
    define = _define; //定义
    modulejs = _modulejs; //入口
    //监听模块准备就绪的事件,并检查需要回调module的相关依赖是否全部就绪
    on("module_ready", function(id, fromeCache) {
        cfg.callback = cleanArray(cfg.callback);
        var init = cfg.callback,
            l = init.length;
        //顺序扫描所有的回调方法，检查要回调的module是否完成依赖加载
        for (var i = 0; i < l; i++) {
            //如果依赖满足则开始执行并删除回调
            if (init[i] && checkDeps(init[i].dependencies)) {
                var cb = init[i].factory;
                var deps = init[i].dependencies;
                var mods = []; //把模块的相关依赖，依次作为参数传入
                var allDeps = [];
                var m;
                for (var j = 0; j < deps.length; j++) {
                    var m = _require(deps[j]);
                    allDeps.push(m.dependencies);
                    mods.push(m);
                }
                debug("callback_is_run=start", cb.toString(), cfg.callback);
                init[i] = null;
                cb.apply(null, mods);
                cfg.debug && emit("callback_is_run", cb.toString().replace(/[\r\n]/g, ""));
            }
        }
    });
    //module被引用
    on("module_require", function(id) {
        cfg.actModules[id] = cfg.actModules[id] ? (cfg.actModules[id] + 1) : 1;
    });
    //cache被删除
    on("module_cacheDel", function(id) {
        cfg.cacheDel[id] = 1;
    });
    //cache被加载
    on("cache_load", function(m) {

    });
    //module未定义
    on("module_loss_alias", function(id) {
        console.error("module_loss_alias:" + id);
    });


    //加载缓存的模块
    var cacheNow = new Date();
    _loadCache();
    cfg.timing['loadcache'] = new Date() - cacheNow;
    /**
     * 加载缓存的modules
     * @return {[type]} [description]
     */

    function _loadCache() {
        if (!_useCache()) {
            return false;
        }
        localStorage.removeItem("_modules"); //删除之前的cache
        //读cache，并清理无效内容
        //var _t=localStorage.getItem("_modules");
        //var ms=_t?JSON.parse(_t):{};
        for (var key in localStorage) {
            if (/^_m_/.test(key)) {
                var store = JSON.parse(localStorage.getItem(key));
                var i = key.substr(3);
                var now = (new Date()).getTime();
                var oneDay = 24 * 3600 * 1000;
                if (cfg.alias[i]) {
                    if (_getModuleURI(i) != store.path || store.deps.join(",").indexOf("{") > -1) {
                        emit("module_cacheDel", i);
                        localStorage.removeItem(key);
                        continue;
                    }
                } else {
                    //已经过期
                    if (now > store.cacheTime) {
                        emit("module_cacheDel", i);
                        localStorage.removeItem(key);
                        continue;
                    }
                }

                //有效期小于1天,缓存续期
                if (store.cacheTime - now < oneDay) {
                    store.cacheTime = (new Date()).getTime() + cacheTime; //更新过期时间，每次续期一个月
                    try {
                        localStorage.removeItem(key);
                        localStorage.setItem(key, JSON.stringify(store));
                    } catch (e) {}
                }
                //eval("store.factory = " + store.factory)
                cfg.cacheLoad[store.id] = store;
                emit("cache_load", store);
                /**ADD END**/

            }
        }
        /**
         * 这里对cache的检查有两个原则：
         * 1、path路径发生变化的cache一律作为，未来可能会考虑版本号的问题。这里不考虑
         * 2、本入口alisa中未定义的module可能会在其他入口中用到，不能随便清除，所以加一个有效期逻辑，超过有效期的cache做删除动作，防止localstorage无线增长。
         */
        /*
        for(var i in ms){
          //检查alisa中定义的module，path变化的要清理，无变化的修改最后使用时间并加载
          if(cfg.alias[i]){
            if(_getModuleURI(i)!=ms[i].path){
              emit("module_cacheDel",i);
              ms[i]=null; delete(ms[i]);
              continue;
            }
          }else{
            //alisa中未定义的module，检查最后使用时间，超过1个月未使用的module清理掉
            if(((new Date()).getTime()-60*60*24*30)>ms[i].cacheTime){
              emit("module_cacheDel",i);
              ms[i]=null; delete(ms[i]);
              continue;
            }
          }
          //走到这里说明cache有效也是alisa中要用到的module，可以直接加载，打标记，停止cache期间的define再次触发cache
          //重载过的module cache修改使用时间
          ms[i].cacheTime=(new Date()).getTime();
          isCache=false;
          emit("cache_load",ms[i]);
          _define(ms[i].id,ms[i].deps,eval("("+ms[i].factory+")"));
          isCache=true;
        }
        //cache加载结束再回写一下cache
        try{
          localStorage.removeItem("_modules");
          localStorage.setItem("_modules", JSON.stringify(ms));
        }
        catch(e){

        }*/
    }
    /**
     * 获取模块的唯一访问路径
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */

    function _getModuleURI(id) {
        return cfg.moduleURI[id] ? cfg.moduleURI[id] : cfg.alias[id];
    }
    /**
     * 使用模块缓存
     */

    function _useCache(id, deps, factory) {
        //return false;
        //不支持JSON对象的时候不启用cache
        if (typeof(JSON) == "undefined") {
            return false;
        }
        //cache开关关闭的的时候不使用cache
        if (!isCache) {
            return false;
        }
        //不支持JSON和localstorage则不做cache
        if (!(JSON && window.localStorage)) {
            return false;
        }
        //开发模式下不使用缓存
        if (cfg.debug) {
            return false;
        }

        var agent = navigator.userAgent.toLowerCase();
        if (agent.indexOf("msie") > 0) {
            var m = agent.match(/msie\s([\d\.]+);/i);
            if (m && m.length >= 2 && parseInt(m[1]) <= 6) {
                return false;
            }
        }

        //_下划线开头的module为临时module，不操作cache
        if (id && id.indexOf("_") == 0) {
            return false;
        }
        //factory代码中不包含关键词“_cacheThisModule_”的不缓存
        if (factory && factory.toString().indexOf("_cacheThisModule_") < 0) {
            return false;
        }
        return true;
    }


    /**
     * 缓存模块
     * @param  {[type]} id      [description]
     * @param  {[type]} deps    [description]
     * @param  {[type]} factory [description]
     * @return {[type]}         [description]
     */

    function _cacheModule(id, deps, factory) {
        //写入cache
        var key = "_m_" + id;
        var _t = localStorage.getItem(key);
        var ms = _t ? JSON.parse(_t) : {};
        ms = {
            "id": id,
            "deps": deps,
            "factory": factory.toString(),
            "path": _getModuleURI(id),
            "cacheTime": (new Date()).getTime() + cacheTime
        };
        try {
            localStorage.removeItem(key);
            localStorage.setItem(key, JSON.stringify(ms));
            emit("module_cached", id);
        } catch (e) {}

        /**
         * 把定义的模块从他同个分组之内的其他模块的加载地址中剔除。
         * 如cache模块和url device模块属于同个分组。那么他们的地址都是http://static.gtimg.com/c/=/js/cache.js,/js/url.js,/js/device.js
         * 那么当cache模块定义之后，url device模块对应的地址是：http://static.gtimg.com/c/=/js/url.js,/js/device.js
         * 这个优化只正对TX的legos平台生成的入口文件做的。
         */
        var _url = _moduleConfig.alias[id];
        //如果是单个分组，那么就不做任何处理。
        if (_url.indexOf("/c/=") == -1) {
            return true;
        }
        //如果没有设置domain，那么也直接返回
        if (_moduleConfig.domain == undefined) {
            return true;
        }
        //从URL中分析出所有的模块列表。
        var _ms = _url.replace(_moduleConfig.domain + "/c/=", "")
            .replace(/\/js\/version\/[\d]+\//g, "")
            .replace(/\.\d{12}\.js/g, "")
            .split(","),
            _mindex = -1,
            _muri = "",
            _urls = _url.replace(_moduleConfig.domain + "/c/=", "").split(","); //模块URLS

        for (var i = 0, l = _ms.length; i < l; i++) {
            //从URL中分析出对应的模块id.
            var _id = _ms[i];
            //如果当前的_id，记录当前的在分组中的index
            if (_id == id) {
                _mindex = i;
                break;
            }
        }

        //删除当前模块的URI。
        if (_mindex > -1) {
            _muri = _urls.splice(_mindex, 1);
            _moduleConfig.alias[_id] = _moduleConfig.domain + _muri;
        }
        //把当前模块从同组内其他模块的加载地址中删除
        for (var i = 0, l = _urls.length; i < l; i++) {
            //从URL中分析出对应的模块id.
            var _id = _urls[i].replace(/\/js\/version\/[\d]+\//g, "")
                .replace(/\.\d{12}\.js/g, "");
            //把所有模块的URL删除当前的模块。
            _moduleConfig.alias[_id] = _moduleConfig.domain + (_urls.length > 1 ? "/c/=" : "") + _urls.join(",");
            //如果_url已经加载 那么直接跳过加载，一般这种情况是多个模块合并同时加载回来，那么就默认为加载完成
            if (cfg.uris[_url]) {
                cfg.uris[_moduleConfig.alias[_id]] = 1;
            }
        }
    }
    //模块定义api，有三个参数的时候第2个参数为依赖array，2个参数时，第2个为回调

    function _define(id, deps, factory) {
        if (!id || (typeof(id) != "string"))
            return;
        //如果模块已经存在，并且不是_init模块，那么直接提示模块已经就绪
        if (id != "_init" && typeof(cfg.modules[id]) != "undefined") {
            emit("module_ready", id);
            return true;
        }
        //只有两个参数的时候，表示忽略了deps
        if (arguments.length === 2) {
            factory = deps;
            deps = null;
        }
        //保证deps一定是个array
        deps = isType("Array", deps) ? deps : (deps ? [deps] : []);
        //静态分析内容中的依赖
        if (isType("Function", factory)) {
            var _deps = parseDependencies(factory.toString());
        }
        _useCache(id, deps, factory) && _cacheModule(id, deps, factory);
        //合并明文依赖和分析依赖
        deps = mergeArray(deps, _deps);
        //将模块cache起来
        //构造一个model压入mod仓库
        var mod = new Module(id);
        mod.dependencies = deps || [];
        for (var i = mod.dependencies.length - 1; i >= 0; i--) {
            mod.dependencies[i] = parseVars(mod.dependencies[i]);
        }
        mod.factory = factory;
        //如果是_init的话，则放入回调模块数组，否则放入module序列
        if (id == "_init") {
            cfg.callback.push(mod);
        } else {
            //非_init则为普通模块，放入module序列
            cfg.modules[id] = mod;
        }
        if (typeof cfg.alias[id] !== "undefined") {
            //1. 如果define的模块名和alias中定义的模块名不一致，是走不进来的
            //2. 如果文件发布失败，比如发到beta环境下，js文件为空的情况，不会执行define，也是走不进来的
            cfg.uris[cfg.alias[id]] = MODULE_SUCCESS;
        }
        //广播消息处理
        emit("module_ready", id);
    }
    //模块实例化或返回实例

    function _require(id) {
        id = parseVars(id); //解析变量依赖
        var module = cfg.modules[id];

        emit("module_require", id);
        // 如果module不存在则返回null
        if (!module) {
            emit("module_error", id);
            return null
        }
        //如果module的exports不为null，则说明已经实例化了。
        if (module.exports) {
            return module.exports;
        }
        var now = new Date();
        //走到这里则说明module还没有被实例化
        var factory = module.factory;
        //判断factory类型，function则执行，obj的直接返回
        //为function的时候将被直接执行，执行时将会接收到3个参数factory(require,exports,module)
        var exports = isType("Function", factory) ? factory(require, module.exports = {}, module) : factory;
        module.exports = exports === undefined ? module.exports : exports;
        cfg.timing[id] = new Date() - now;
        return module.exports; //require一个模块的结果是返回该module的exports
    }

    _require.async = _modulejs;

    _require.css = function(path) {
            /*
            var node = document.createElement("link");
            node.charset = "utf-8";
            node.rel = "stylesheet"
            node.href = url

            var head = document.getElementsByTagName("head")[0] || document.documentElement;
            var baseElement = head.getElementsByTagName("base")[0];
            baseElement ? head.insertBefore(node, baseElement) : head.appendChild(node);
            */
            //update----brianliu 20130924 支持cssalias
            path = cfg.cssAlias && cfg.cssAlias[path] ? cfg.cssAlias[path] : path;
            if (!path) {
                return;
            }
            var l;
            if (!window["_loadCss"] || window["_loadCss"].indexOf(path) < 0) {
                l = document.createElement('link');
                l.setAttribute('type', 'text/css');
                l.setAttribute('rel', 'stylesheet');
                l.setAttribute('href', path);
                l.setAttribute("id", "loadCss" + Math.random());
                document.getElementsByTagName("head")[0].appendChild(l);
                window["_loadCss"] ? (window["_loadCss"] += "|" + path) : (window["_loadCss"] = "|" + path);
            }
            l && (typeof callback == "function") && (l.onload = callback);
            return true;
        }
        //入口方法

    function _modulejs(deps, factory) {
        //把入口回调作为一个回调模块定义，当有多个入口的时候，都放在数组里面
        _define("_init", deps, factory);
    }
    //递归检查深层依赖环境是否完成，并加载确实的module

    function checkDeps(deps) {
        //var list = cfg.deps,
        var list = {},
            flag = true;
        //重置依赖分析数组
        for (var i = 0; i < deps.length; i++) list[deps[i]] = 1;
        //for (var i in list) list[i] = 1;
        //构造当前依赖的递归依赖
        getDesps(deps, list);
        //依次检查依赖，发现有module遗失则返回flase。进入加载流程
        for (var i in list) {
            //检查该依赖模块是否遗失，如果遗失则中断检查去加载
            if (!cfg.modules[i]) {
                loadModule(i);
                flag = false;
            }
        }
        return flag;
        //获取深层依赖关系队列

        function getDesps(deps, list) {
            //循环检查新的依赖队列
            for (var i = 0; i < deps.length; i++) {
                //如果该module未在全局依赖队列中，则加入到全局队列中
                if (!list[deps[i]]) {
                    list[deps[i]] = 1;
                }
                //如果该module存在，则递归构造该module的依赖队列。
                //凡是构造过的module就把状态设置为2，防止循环依赖
                if (cfg.modules[deps[i]] && list[deps[i]] != 2) {
                    list[deps[i]] = 2;
                    getDesps(cfg.modules[deps[i]].dependencies, list);
                }
            }
        }
    }
    //解析变量模块名

    function parseVars(id) {
        var VARS_RE = /{([^{]+)}/g
        var vars = cfg.vars
        if (vars && id.indexOf("{") > -1) {
            id = id.replace(VARS_RE, function(m, key) {
                return isType("String", vars[key]) ? vars[key] : key
            })
        }
        return id
    }
    //配置方法

    function mergeObject(a, b) {
        for (var i in b) {
            if (!b.hasOwnProperty(i)) {
                continue;
            }
            if (!a[i]) {
                a[i] = b[i];
            } else if (Object.prototype.toString.call(b[i]) == "[object Object]") {
                mergeObject(a[i], b[i]);
            } else {
                a[i] = b[i];
            }
        }
        return a;
    }

    function config(obj) {
        return cfg = mergeObject(cfg, obj);
    }
    //module原型

    function Module(id) {
        this.id = id;
        this.dependencies = [];
        this.exports = null;
        this.uri = "";
    }
    //加载模块的对应文件

    function loadModule(id) {
        var m;
        if (m = cfg.cacheLoad[id]) {
            return _define(m.id, m.deps, eval("a = " + m.factory));
        }
        //如果module存在则直接返回
        if (cfg.modules[id]) {
            emit("module_ready", id);
            return;
        }
        //查找module所对应的文件
        //todo:这里可以考虑支持把没有alias配置的module按照某些规则生成一条url进行加载。
        var url = cfg.alias[id] ? cfg.alias[id] : "";
        if (!url) {
            emit("module_loss_alias", id);
            return;
        }
        //检查是否已经加载该文件，如果文件已经在加载队列，则返回，等待后续代码的执行
        if (cfg.uris[url]) {
            return;
        }
        //如果当前模块是不是已经发出加载请求，如果已经发出，那么不做加载。
        if (cfg.loadMod[id]) {
            return;
        }

        //开始加载
        cfg.uris[url] = MODULE_LOADING;
        cfg.loadMod[id] = 1;
        var head = document.getElementsByTagName("head")[0] || document.documentElement;
        var baseElement = head.getElementsByTagName("base")[0];
        var node = document.createElement("script");
        node.charset = "utf-8";
        node.async = true;
        node.src = url;
        var handler = function() {
            var callee = arguments.callee
            cfg.timing[callee.uri] = new Date() - callee.time;
        };
        handler.time = new Date();
        handler.uri = url;
        node.onload = handler;
        if (typeof(cfg.beforeLoad) === 'function' && (cfg.beforeLoad(node, cfg, url) === false))
            return;

        //todo:这里可以考虑监控一下文件加载失败的情况，方便报错和监控等后续的健壮性功能
        baseElement ? head.insertBefore(node, baseElement) : head.appendChild(node);
        cfg.debug && emit("file_loading", url);

        loadModuleDep(id);
    }

    /**
     * 同步地去加载一些模块
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    function loadModuleDep(id) {
        var dep = cfg.moduleDeps[id],
            len;

        //额外依赖是一个二维数组
        //举例
        // {
        //   "lg.guess": [
        //     ["react"],
        //     ["tpl_lot.component", "tpl_lg.guess.act"]  //同一个数组内的模块会被合并载入，实现了动态分组
        //   ]
        // }
        if (dep && (len = dep.length) > 0) {
            for (var i = len - 1; i >= 0; i--) {
                var item = dep[i],
                    len1 = item.length,
                    moduleToLoad = item[0];
                if (len1 === 1) {
                    loadModule(moduleToLoad);
                } else if (len1 > 1) {
                    var cmbUrl = cfg.domain + '/c/=',
                        cmbAr = [];
                    for (var j = len1 - 1; j >= 0; j--) {
                        var id1 = item[j];
                        if (cfg.moduleURI[id1] && !cfg.cacheLoad[id1] && !cfg.modules[id1]) {
                            cmbUrl += cfg.moduleURI[id1].replace(cfg.domain, '') + (j > 0 ? ',' : '');
                            cmbAr.push(id1);
                        }
                    }
                    var len1 = cmbAr.length;
                    if (len1 > 0) {
                        for (var j = len1 - 1; j >= 0; j--) {
                            //污染 alias 变量
                            cfg.alias[cmbAr[j]] = cmbUrl;
                        }
                        loadModule(cmbAr[0]);
                    }
                }
            };
        }
    }

    //事件监听

    function on(name, cb) {
        var cbs = cfg.events[name];
        if (!cbs) {
            cbs = cfg.events[name] = [];
        }
        cbs.push(cb);
    }

    //事件广播

    function emit(name, evt) {
        debug(name, evt);

        if (!cfg.events[name] || cfg.events[name].length == 0) {
            return;
        }
        //for (var i in cfg.events[name]) {
        for (var i = 0, l = cfg.events[name].length; i < l; i++) {
            cfg.events[name][i](evt);
        }
        if (name === 'error') {
            delete cfg.events[name];
        }
    }
    //清理数组中的空元素

    function cleanArray(a) {
        var n = [];
        for (var i = 0; i < a.length; i++) {
            a[i] && n.push(a[i]);
        }
        return n;
    }
    //去重合并数组

    function mergeArray(a, b) {
        for (var i = 0; i < b.length; i++) {
            (("," + a + ",").indexOf("," + b[i] + ",") < 0) && a.push(b[i]);
        }
        return a;
    }
    //对象类型判断

    function isType(type, obj) {
        return Object.prototype.toString.call(obj) === "[object " + type + "]"
    }
    //分析module的依赖关系

    function parseDependencies(code) {

        var commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:|^"|^']|^)\/\/(.*)$)/mg;
        var cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g;
        var ret = [];
        code.replace(commentRegExp, "").replace(cjsRequireRegExp, function(match, dep) {
            dep && ret.push(parseVars(dep));
        })
        return ret;
    }

    function debug() {
        if (!cfg.debug) {
            return true;
        }
        var a = [],
            l = arguments.length;
        for (var i = 0; i < l; i++) {
            a.push(arguments[i]);
        }
        try {
            // console.log.apply(console, a);
        } catch (e) {}
    }
}(this));
