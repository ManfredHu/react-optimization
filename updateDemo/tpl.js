define("todoTpl", function(require, exports, module) {
    var React = require('react');
    var Reflux = require('reflux');

    var createTextComponent = function(obj){
        var store = obj.store;
        var TextComponent = React.createClass({
            mixins: [Reflux.connect(store)],
            shouldComponentUpdate: function(nextProps, nextState) {
                var state = this.state;
                return state.defaultText !== nextState.defaultText
                        && state.textShow !== nextState.testShow
                        && state.showTimes !== nextState.showTimes

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
                    <div>{longText}</div>
                )
            }
        });
        return TextComponent;
    }
    
    var createNum = function(obj) {
        var store = obj.store;
        //数字计时器组件
        var Num = React.createClass({
            mixins: [Reflux.connect(store)],
            render: function() {
                var num = this.state.num;
                return (
                    <p>{num}</p>
                )
            }
        });
        return Num;
    }

    var createBtn = function(obj){
        var store = obj.store;
        var actions = obj.actions;
        //开关按钮
        var Btn = React.createClass({
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
                    <input type="button" value={this.props.text} onClick={clickEvent.bind(this,1000)} />
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

        var App = React.createClass({
            render: function(){
                return (
                    <div>
                        <Num />
                        <Num />
                        <Num />
                        <Num />
                        <Num />
                        <TextComponent />
                        <Btn text="点击开始" type="on" />
                        <Btn text="点击结束" type="off" />
                    </div>
                )
            }
        });
        React.render(<App />, container, callback);
    }
})