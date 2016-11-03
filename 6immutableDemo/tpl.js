define("todoTpl", function(require, exports, module) {
    var React = require('react');
    var Reflux = require('reflux');

    var createTextComponent = function(obj){
        var store = obj.store;
        var TextComponent = React.createClass({
            mixins: [Reflux.connect(store)],
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
                console.log("createNum组件被更新了");
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
                console.log("createBtn组件被更新了");
                var clickEvent = this.props.type === 'on' ? this.clickOn : this.clickOff;
                return (
                    <input type="button" value={this.props.text} onClick={clickEvent.bind(this,1000)} />
                )
            }
        });
        return Btn;
    }
    
    //这里最好放在一个逻辑文件里面，这里为了简单起见
    exports.app = function(obj) {
        var container = obj.container || document.body,
            actions   = obj.actions,
            store     = obj.store,
            actions2  = obj.actions2,
            store2    = obj.store2,
            callback  = obj.callback;

        var Num = createNum({store:store,actions:actions}),
            TextComponent = createTextComponent({store:obj.store2,actions:actions2}),
            Btn = createBtn({store:store,actions:actions});

        var App = React.createClass({
            render: function(){
                return (
                    <div>
                        <Btn text="点击开始" type="on" />
                        <Btn text="点击结束" type="off" />
                        <Num />
                        <Num />
                        <Num />
                        <Num />
                        <Num />
                        <TextComponent />
                    </div>
                )
            }
        });
        React.render(<App />, container, callback);
    }
})