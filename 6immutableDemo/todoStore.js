define("todoAction", function(require, exports, module) {
    var reflux = require('reflux');

    /**
     * 事件声明
     * @param  {[type]} actions [description]
     * @return {[type]}         [description]
     */
    module.exports = function(actions){
        var actions = reflux.createActions([
            "addOne"
        ]);

        return actions;
    };
});

define('todoStore', function(require, exports, module) {
    var reflux = require('reflux');
    var Immutable = require('immutable');
    
    module.exports = function(actions) {
        var store = reflux.createStore({
            listenables: [actions],
            onAddOne: function( item ) {
                this.data.num++;
                this.trigger(this.data);
            },
            getInitialState: function() {
                this.data = {
                    num: 0,
                    timer: null
                };

                return this.data; //there to return to the state,means this.data = this.state
            }
        });
        return store;
    }
});