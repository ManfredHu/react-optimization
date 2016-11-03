define("todoTpl", function(require, exports, module) {
    var React = require('react');
    var Reflux = require('reflux');
    var PureRenderMixin = require('react').addons.PureRenderMixin;

    var createTextComponent = function(obj){
        var store = obj.store;
        var TextComponent = React.createClass({displayName: "TextComponent",
            mixins: [PureRenderMixin],
            render: function(){
                console.log("TextComponent被更新了");
                var text = this.props.defaultText;
                var longText = "";
                if(this.props.textShow) {
                    for(var i=0,len=this.props.showTimes;i<len;i++){
                        longText += text; //这里故意用了字符串加法，而不是数组join，消耗的资源会更多
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
            mixins: [PureRenderMixin],
            render: function() {
                console.log("Num组件被更新了");
                var num = this.props.num;
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
            mixins: [PureRenderMixin],
            clickOn: function(time){
                Btn.timer = setInterval(function(){
                    actions.addOne();
                }.bind(this), time);
            },
            clickOff: function(){
                clearInterval(Btn.timer);
            },
            render: function() {
                console.log("Btn组件被更新了");
                var clickEvent = this.props.type === 'on' ? this.clickOn : this.clickOff;
                return (
                    React.createElement("input", {type: "button", value: this.props.text, onClick: clickEvent.bind(this,50)})
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
            mixins: [Reflux.connect(store)],
            render: function(){
                var state = this.state;
                var defaultText = state.defaultText;
                var textShow = state.textShow;
                var showTimes = state.showTimes;
                var num = state.num;

                return (
                    React.createElement("div", null, 
                        React.createElement(Btn, {text: "点击开始", type: "on"}), 
                        React.createElement(Btn, {text: "点击结束", type: "off"}), 
                        React.createElement(Num, {num: num}), 
                        React.createElement(Num, {num: num}), 
                        React.createElement(Num, {num: num}), 
                        React.createElement(Num, {num: num}), 
                        React.createElement(Num, {num: num}), 
                        React.createElement(TextComponent, {defaultText: defaultText, textShow: textShow, showTimes: showTimes})
                    )
                )
            }
        });
        React.render(React.createElement(App, null), container, callback);
    }
})