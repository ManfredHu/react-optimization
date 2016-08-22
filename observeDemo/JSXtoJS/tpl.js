define("todoTpl", function(require, exports, module) {
    var React = require('react');
    var Reflux = require('reflux');
    var ob = require('observe');

    var createTextComponent = function(obj){
        var store = obj.store;
        var TextComponent = React.createClass({displayName: "TextComponent",
            mixins: [Reflux.connect(store)],
            shouldComponentUpdate: function(nextProps, nextState) { //组件更新条件，这里过滤不更新的情况，优化渲染效率
                return nextState.defaultText !== nextState.$observeProps.defaultText
                       || nextState.textShow !== nextState.$observeProps.textShow
                       || nextState.showTimes !== nextState.$observeProps.showTimes
            },
            render: function(){
                console.log("TextComponent被更新了");
                var text = this.state.defaultText;
                var longText = "";
                if(this.state.textShow) {
                    for(var i=0,len=this.state.showTimes;i<len;i++){
                        longText += text; //这里故意用了字符串加法，而不是数组join
                    }
                }
                return (
                    React.createElement("div", null, longText)
                )
            }
        });
        return TextComponent;
    }
    
    var createNum = function(obj) {
        var store = obj.store;
        //数字计时器组件
        var Num = React.createClass({displayName: "Num",
            mixins: [Reflux.connect(store)],
            render: function() {
                var num = this.state.num;
                return (
                    React.createElement("p", null, num)
                )
            }
        });
        return Num;
    }

    var createBtn = function(obj){
        var store = obj.store;
        var actions = obj.actions;
        //开关按钮
        var Btn = React.createClass({displayName: "Btn",
            mixins: [Reflux.connect(store)],
            clickOn: function(time){
                Btn.timer = setInterval(function(){
                    actions.addOne();
                }.bind(this), time);
            },
            clickOff: function(){
                clearInterval(Btn.timer);
            },
            render: function() {
                var clickEvent = this.props.type === 'on' ? this.clickOn : this.clickOff;
                return (
                    React.createElement("input", {type: "button", value: this.props.text, onClick: clickEvent.bind(this,1000)})
                )
            }
        });
        return Btn;
    }
    



    exports.app = function(obj) {
        var container = obj.container || document.body,
            actions   = obj.actions,
            store     = obj.store,
            callback  = obj.callback;

        var Num = createNum(obj),
            TextComponent = createTextComponent(obj);
            Btn = createBtn(obj);

        var App = React.createClass({displayName: "App",
            render: function(){
                return (
                    React.createElement("div", null, 
                        React.createElement(Num, null), 
                        React.createElement(Num, null), 
                        React.createElement(Num, null), 
                        React.createElement(Num, null), 
                        React.createElement(Num, null), 
                        React.createElement(TextComponent, null), 
                        React.createElement(Btn, {text: "点击开始", type: "on"}), 
                        React.createElement(Btn, {text: "点击结束", type: "off"})
                    ) 
                )
            }
        });
        React.render(React.createElement(App, null), container, callback); //observe Store
    }
})