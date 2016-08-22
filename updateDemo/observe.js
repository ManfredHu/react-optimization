/* observejs --- By dnt http://kmdjs.github.io/
 * Github: https://github.com/kmdjs/observejs
 * MIT Licensed.
 */
define('observe', function(require, exports, module) {
    (function (win) {
        /**
         * [observe 构造函数]
         * @param  {[type]}   target   [监听属性变化的对象]
         * @param  {[type]}   arr      [description]
         * @param  {Function} callback [属性变化时执行的回调函数]
         * @return {[type]}            [description]
         */
        var observe = function (target, arr, callback) {
            var _observe = function (target, arr, callback) {
                if (!target.$observer) target.$observer = this;
                var $observer = target.$observer;
                var eventPropArr = [];
                if (observe.isArray(target)) {
                    if (target.length === 0) {
                        target.$observeProps = {};
                        target.$observeProps.$observerPath = "#";
                    }
                    $observer.mock(target);

                }
                for (var prop in target) {
                    if (target.hasOwnProperty(prop)) {
                        if (callback) {
                            if (observe.isArray(arr) && observe.isInArray(arr, prop)) {
                                eventPropArr.push(prop);
                                $observer.watch(target, prop);
                            } else if (observe.isString(arr) && prop == arr) {
                                eventPropArr.push(prop);
                                $observer.watch(target, prop);
                            }
                        } else {
                            eventPropArr.push(prop);
                            $observer.watch(target, prop);
                        }
                    }
                }
                $observer.target = target;
                if (!$observer.propertyChangedHandler) $observer.propertyChangedHandler = [];
                var propChanged = callback ? callback : arr;
                $observer.propertyChangedHandler.push({ all: !callback, propChanged: propChanged, eventPropArr: eventPropArr });
            }
            //原型方法
            _observe.prototype = {
                "onPropertyChanged": function (prop, value, oldValue, target, path) {
                    if (value !== oldValue && this.propertyChangedHandler) {
                        var rootName = observe._getRootName(prop, path);
                        for (var i = 0, len = this.propertyChangedHandler.length; i < len; i++) {
                            var handler = this.propertyChangedHandler[i];
                            if (handler.all || observe.isInArray(handler.eventPropArr, rootName) || rootName.indexOf("Array-") === 0) {
                                handler.propChanged.call(this.target, prop, value, oldValue, path);
                            }
                        }
                    }
                    if (prop.indexOf("Array-") !== 0 && typeof value === "object") {
                        this.watch(target, prop, target.$observeProps.$observerPath);
                    }
                },
                "mock": function (target) {
                    var self = this;
                    observe.methods.forEach(function (item) {
                        target[item] = function () {
                            var old = Array.prototype.slice.call(this, 0);
                            var result = Array.prototype[item].apply(this, Array.prototype.slice.call(arguments));
                            if (new RegExp("\\b" + item + "\\b").test(observe.triggerStr)) {
                                for (var cprop in this) {
                                    if (this.hasOwnProperty(cprop) && !observe.isFunction(this[cprop])) {
                                        self.watch(this, cprop, this.$observeProps.$observerPath);
                                    }
                                }
                                //todo
                                self.onPropertyChanged("Array-" + item, this, old, this, this.$observeProps.$observerPath);
                            }
                            return result;
                        };
                        target['real'+item.substring(0,1).toUpperCase()+item.substring(1)] = function () {
                            return Array.prototype[item].apply(this, Array.prototype.slice.call(arguments));
                        };
                    });
                },
                //监听函数
                "watch": function (target, prop, path) {
                    if (prop === "$observeProps" || prop === "$observer") return; //跳过两个observer定义的属性
                    if (observe.isFunction(target[prop])) return; //跳过函数
                    if (!target.$observeProps) target.$observeProps = {};
                    if (path !== undefined) {
                        target.$observeProps.$observerPath = path;
                    } else {
                        target.$observeProps.$observerPath = "#"; //root path
                    }
                    var self = this;
                    //拷贝属性值，获取属性值
                    var currentValue = target.$observeProps[prop] = target[prop];
                    //覆盖原有对象的属性获取方式/set&get
                    Object.defineProperty(target, prop, {
                        //直接返回缓存的属性值
                        get: function () {
                            return this.$observeProps[prop];
                        },
                        //set则改变缓存的值
                        set: function (value) {
                            var old = this.$observeProps[prop];
                            this.$observeProps[prop] = value;
                            self.onPropertyChanged(prop, value, old, this, target.$observeProps.$observerPath);
                        }
                    });
                    if (typeof currentValue == "object") {
                        if (observe.isArray(currentValue)) {
                            this.mock(currentValue);
                            if (currentValue.length === 0) {
                                if (!currentValue.$observeProps) currentValue.$observeProps = {};
                                if (path !== undefined) {
                                    currentValue.$observeProps.$observerPath = path;
                                } else {
                                    currentValue.$observeProps.$observerPath = "#";
                                }
                            }
                        }
                        for (var cprop in currentValue) {
                            if (currentValue.hasOwnProperty(cprop)) {
                                this.watch(currentValue, cprop, target.$observeProps.$observerPath + "-" + prop);
                            }
                        }
                    }
                }
            }
            return new _observe(target, arr, callback)
        }
        observe.methods = ["concat", "copyWithin", "entries", "every", "fill", "filter", "find", "findIndex", "forEach", "includes", "indexOf", "join", "keys", "lastIndexOf", "map", "pop", "push", "reduce", "reduceRight", "reverse", "shift", "slice", "some", "sort", "splice", "toLocaleString", "toString", "unshift", "values", "size"]
        observe.triggerStr = ["concat", "copyWithin", "fill", "pop", "push", "reverse", "shift", "sort", "splice", "unshift", "size"].join(",")
        observe.isArray = function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
        observe.isString = function (obj) {
            return typeof obj === "string";
        }
        observe.isInArray = function (arr, item) {
            for (var i = arr.length; --i > -1;) {
                if (item === arr[i]) return true;
            }
            return false;
        }
        observe.isFunction = function (obj) {
            return Object.prototype.toString.call(obj) == '[object Function]'; //用typeof监测
        }
        observe._getRootName = function (prop, path) {
            if (path === "#") {
                return prop;
            }
            return path.split("-")[1];
        }

        observe.add = function (obj, prop, value) {
            obj[prop] = value;
            var $observer = obj.$observer;
            $observer.watch(obj, prop);
        }
        Array.prototype.size = function (length) {
            this.length = length;
        }

        if (typeof module != 'undefined' && module.exports && this.module !== module) { module.exports = observe }
        else if (typeof define === 'function' && define.amd) { define(observe) }
        else { win.observe = observe };
    })(Function('return this')()); //这里为什么不传入window?
});
