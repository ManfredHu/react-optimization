define("todoTpl", function(require, exports, module) {
    var React = require('react');
    var Reflux = require('reflux');

    var createTextComponent = function(obj){
        var store = obj.store;
        var TextComponent = React.createClass({
            mixins: [Reflux.connect(store)],
            shouldComponentUpdate: function(nextProps, nextState) {
                var data = this.state.data;
                var data2 = nextState.data;
                return data.get('defaultText') !== data2.get('defaultText')
                        && data.get('textShow') !== data2.get('textShow')
                        && data.get('showTimes') !== data2.get('showTimes')

            },
            render: function(){
                console.log("TextComponent被更新了");
                var text = this.state.data.get('defaultText');
                var longText = "";
                if(this.state.data.get('textShow')) {
                    for(var i=0,len=this.state.data.get('showTimes');i<len;i++){
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
            shouldComponentUpdate:function(nextProps, nextState){
                return this.state.data.get('num') !== nextState.data.get('num')
            },
            render: function() {
                console.log("createNum组件被更新了");
                var num = this.state.data.get('num');
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
            shouldComponentUpdate:function(nextProps, nextState){
                return this.props.text !== nextProps.text
            },
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
                    <input type="button" value={this.props.text} onClick={clickEvent.bind(this,50)} />
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