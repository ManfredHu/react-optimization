> 不久前，看过这么一篇[文章](http://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=2651551351&idx=1&sn=c80dc72165d02227748f402b3a8ba46c&chksm=8025a1b6b75228a059cd9d4a9d016838612e0a4aeaebfd86f47b945e4b48539f5e9445968b81&mpshare=1&scene=1&srcid=1027nuLZwkKpBQsBljHyCAs3#wechat_redirect)，大概就是说，现在前端开发行业，一年一小变，三年一大变。框架层出不穷。里面也很有意思的，讲了几个现在很火的框架。其中第一个便是React

## React
React的优点有很多，现在很多应用都接入React这个框架。
在我看来，有下列优点：
- Facebook团队研发并维护——有团队维护更新且有质量保证
- 在MVVM结构下只起View的作用——简单接入，不需要花费大量人力重构代码
- 组件化形式构建Web应用——复用性强，提高开发效率
- 用Virtual DOM减少对DOM的频繁操作提高页面性能——批量操作减少重排（reflows）和重绘(repaints)次数——性能对比旧的方式有提高

## React对重排和重绘的提高
雅虎性能优化比较重要的点，老司机自行忽略。
如下图，HTML被浏览器解析为DOM树，CSS代码加载进来解析为样式结构体，两者关联组成渲染树，之后浏览器把渲染树绘制出来就是我们看到的网页了。这里如果我们对DOM树或者样式结构体做一些操作，如删除某个节点，样式改为隐藏（display:none）等等，会触发重排进而导致重绘。
![repaintAndReflow.JPG](重排与重绘)

### 触发重排的条件
- DOM元素的数量属性变化
- DOM树的结构变化——节点的增减、移动
- 某些布局属性的读取和设置触发重排——offsetTop/offsetWidth/scrollTop等等
导致子级、后续兄弟元素、父节点因重新计算布局而重排

### 触发重绘的条件
- 简单样式属性的变化——颜色、背景色等
- 重排导致的重绘

而React维护了一个Virtual DOM将短时间的操作合并起来一起同步到DOM，所以这也是它对整个前端领域提出的最重要的改变。

## 为什么引入Reflux？
上面说了React在MVVM结构下只起View的作用，那么除了View，MVVM下还有Model，ViewModel。
而纯粹的View，会让整个逻辑耦合在一层下，数据也需要层层传递，不方便控制和复用。
[componentProblem.JPG](组件化遇到的问题)

故业内也有一堆的分层框架——如最早的flux，现在部门在用的Reflux，以及Redux。
对比Redux，Reflux更容易理解和上手——这也是现状，学习成本越低，接入现有业务就越容易。

## Reflux
reflux的架构非常简单，就是三部分

1. Action 理解为一个命令或者动作，通过它来向组件发出"指令"
2. Store 为ViewModel部分，组件的一些状态属性会存储在这里
3. View Component 为组件模板
[reflux.JPG](reflux的架构)

所以Reflux只是让我们，更好的去操作组件，通过一个Action命令，叫组件去干嘛，组件自己通过写好的代码，对命令做出反应(变化为不同的state状态)。

## React+Reflux起到的作用
**现在你已经有了两个小工具了，写一个组件，通过Action调用组件就可以了。**
写到这里，你应该能体会到，所有的引入就是为了让代码写起来更有效率，更易用，复用性更强。

## Pure Component
纯净的组件：在给定相同props和state的情况下会渲染出同样结果
其优点有这么几点：

1. 我们写的组件都应该是只依赖props和state的，而不应该依赖其他全局变量或参数
2. 纯净的组件方便复用、测试和维护

## 组件生命周期
React组件有两部分

第一部分是初始化的生命周期:

- getDefaultProps
- geInitialState
- componentWillMount
- render
- componentDidMount

第二部分是被action触发，需要更新：
- shouldComponentUpdate
- componentWillUpdate
- render
- conponentDidUpdate

## shouldComponentUpdate
**shouldComponentUpdate**这个方法可以说是一个预留的插入接口。
在上面更新的时候，第一步就是调用的这个方法判断组件是否该被重新渲染。

shouldComponentUpdate是在React组件更新的生命周期中，用于判断组件是否需要重新渲染的一个接口，它有两个返回值：
- 返回true，则进入React的Virtual DOM比较过程
- 返回false，则跳过Virtual DOM比较与渲染等过程

[SCUAndvDOMEqual.JPG]()

如上图，这是一棵React Virtual DOM的树。

- C1在`ShouldComponentUpdate`返回了true，即默认值，代表需要更新，进入`Virtual DOM Diff`过程，返回false，不相同，需要更新
- C2在`ShouldComponentUpdate`返回了false,不再更新，C4,C5因为被父节点在`ShouldComponentUpdate`中返回了false，所以不再更新
- C3在`ShouldComponentUpdate`返回了true进入`Virtual DOM Diff`过程，比对结果为false，新旧不一样，需要更新
- 轮到C6,`ShouldComponentUpdate`返回了true，进入`Virtual DOM Diff`的过程，返回了false，即新旧两个节点不相同，所以这个节点需要更新
- C7在`ShouldComponentUpdate`返回了false，即不需要更新，节点不变
- C8在`ShouldComponentUpdate`返回了true,进入`Virtual DOM Diff`比对过程，结果为true，新旧相等，不更新

大概就是这么一个过程，在这里，Diff算法其实还是比较复杂的，比较好的做法是我们来写入ShouldComponentUpdate来自己控制组件的更新，而不是依赖React帮我们做比较。

## 进入正文
前面讲了那么多，相信懂React的都懂了，就不再详细讲了，Diff算法有兴趣的可以自己去翻源码，网上也有一堆模拟实现的例子。

接下来介绍一个探索reflux&react渲染优化的例子。
这里试图，模拟一个比较现实的例子，抛开很多业务代码，让问题变得直接。

首先例子有三个组件，两个按钮，5个数字，还有一个重复打印文本的大组件。

- 1basicDemo 是没有优化的例子，每50ms会发出action更改store数据触发渲染
- 2perfDemo 使用addons插件Perf分析页面性能的例子
- 3pureRenderMixinDemo 使用addons插件pureRenderMixin优化页面性能的例子
- 4updateDemo 使用了addons插件update优化页面性能的例子
- 5immutableDemo 使用了`Immutable.js`优化页面性能的例子

## 说明
- gulpfile.js为gulp构建代码，会将`tpl.js`的JSX代码翻译为js代码，需要的可以自己修改，每次转化模板需要`gulp`运行一下
- modulejs模块加载器和myView单页SPA框架为腾讯通讯与彩票业务部前端团队这边的基本框架，具体的请戳[这里](https://github.com/TC-FE)查看
- 需要关注的文件
    + index.html 页面入口，规定了执行的模块
    + app.js 应用程序入口
    + todoAction.js (reflux架构下，demo的action)
    + todoStore.js (reflux架构下，demo的store)
    + tpl.js 组件的jsx文件

## 简单用法
1. `cd ./xxx/`(这里的xxx为上面对应的 ......./4updateDemo/ 目录)
2. `http-server -p 8888`端口可以自定义，http-server模块已在`node_module`目录下，担心版本依赖问题，已上传`node_module`目录，直接打开就可以了
3. 打开浏览器便可浏览，详情请看控制台

## 1.basicDemo

1basicDemo目录是一个最原始的目录，这里你可以看到我们哪里出现了问题。

`cd ./example` 打开这个没优化过的例子的目录
`http-server -p xxxx` 这里端口随意，不冲突就好
浏览器访问并打开控制台，会看到
```
5 tpl.js:32 createNum组件被更新了
  tpl.js:10 TextComponent被更新了
2 tpl.js:57 createBtn组件被更新了
```
初始化createNum组件被渲染了5次，因为有5个，createBtn组件被渲染了两次，因为有点击开始和点击结束两个按钮。通过不同的传参而改变形态。

点击开始会触发`action`，让store的数据每次+1，点击结束会清除定时器

点击开始可以看到**控制台的数据每次都会刷新整个界面的所有组件，特别是有一个大组件`TextComponent`**，是重复5000次文本的，每次重新渲染就有很多的损耗。这就是我们要优化的地方——减少某些**关键部分**的重新渲染的次数，减少无用对比的消耗

这里你可以打开Chrome控制台的Timeline来看一下，点击开始，打开Timeline面板，每1S左右会有一个脚本执行的高峰期。

我们知道特别是在移动端，CPU和内存的资源显得尤为稀缺（大概只能占用正常CPU和内存的10%，微信手Q等可能会因为友商系统对应用程序的优先级设计使这个限制略有提高——我说的就是小米哈哈哈），所以这样说来，性能这一块在移动手机web显得非常非常重要。

[50ms渲染一次，重复渲染200次的截图](http://www.manfredhu.com/images/github/1basicDemo.png)

## 2.Perl
Perl是react-addons带来的性能分析工具，这里的perfDemo是结合Chrome插件的例子。
要向全局暴露一个`window.Perl`变量，然后就可以愉快的配合Chrome插件使用了

- React-addons插件版本的[Perf插件](https://facebook.github.io/react/docs/perf.html)提供原生的API——用在首次渲染部分
- [Chrome插件](https://github.com/crysislinux/chrome-react-perf)——用在有交互的部分
- [console tool](https://github.com/garbles/why-did-you-update)——需要查看对比新旧值的情况下

这里的wasted time就是在做属性没变化的重复渲染的过程，可以优化。
**用法与Chrome开发工具的TimeLine用法类似，点击start开始记录，后点击stop结束**

[50ms渲染一次，重复渲染200次的截图](http://www.manfredhu.com/images/github/2perfDemo.png)

## 3.PureRenderMixin
一个简单的通用优化工具，通过**浅对比(shallowCompare)**方法对比新旧两个组件的状态，达到减少重复渲染的目的。

**注意这里组件的store必须无关联，原因是shallowCompare的时候，比较的是组件关联的store的数据，而例子里面store是一个，其他组件num的变化也会引起这里TextComponent组件的更新**

**这里将store与顶级组件APP关联起来，然后在子孙组件下自定采用props传递的方式处理(传递基本类型的数据)，这样就可以让pureRenderMixin的通用化了，唯一的缺点是，传递props要控制，只把组件需要的属性传递下去，这里会比较麻烦，但是这样又是性能较高又比较好理解的处理方式(相对其他要拷贝属性的方式)**

**store下，option里面的对象，受pureRenderMixin的限制，不可以出现引用类型*

>**PureRenderMixin其实是封装了更底层的shallowCompare接口的**

简单用法如下:
```js
var PureRenderMixin = require('react').addons.PureRenderMixin;
React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return <div className={this.props.className}>foo</div>;
  }
});
```

就加了一个mixins，看起来简单优雅有木有。可以在众多组件里面copy通用啊有木有
那这里干了什么？
```js
React.addons = {
  CSSTransitionGroup: ReactCSSTransitionGroup,
  LinkedStateMixin: LinkedStateMixin,
  PureRenderMixin: ReactComponentWithPureRenderMixin, //看这里
```

```js
var ReactComponentWithPureRenderMixin = {
  //帮你写了一个shouldComponentUpdate方法
  shouldComponentUpdate: function (nextProps, nextState) { 
    return shallowCompare(this, nextProps, nextState);
  }
};
```
```js
function shallowCompare(instance, nextProps, nextState) {
  //分别比较props和state属性是否相等
  return !shallowEqual(instance.props, nextProps) || !shallowEqual(instance.state, nextState);
}
```
```js
function shallowEqual(objA, objB) {
  if (objA === objB) { //store嵌套层级太深这里就会返回true，引用类型内存指向同一空间
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}
```
所以PureRenderMixin这个插件，只能比较state和props为基本类型的部分。
如果有更加深层次的store数据嵌套，就要借助于update插件或者Immutablejs来深拷贝store的数据另存一份了。

[50ms渲染一次，重复渲染200次的截图，引入pureRenderMixin](http://www.manfredhu.com/images/github/3pureRenderMixinDemo.png)

## 4.用update优化（也称Immutable Helper）
update是addons里面的一个方法，旨在对拷贝对象复杂的过程来做一些语法上的优化，具体可以看[react官方文档](https://facebook.github.io/react/docs/update.html)

```js
//extend复制对象属性的时候
var newData = extend(myData, {
  x: extend(myData.x, {
    y: extend(myData.x.y, {z: 7}),
  }),
  a: extend(myData.a, {b: myData.a.b.concat(9)})
});
```

```js
//用update的时候，提供了一些语法糖让你不用写那么多
var update = require('react-addons-update');
var newData = update(myData, {
  x: {y: {z: {$set: 7}}},
  a: {b: {$push: [9]}}
});
```

`cd ./updateDemo` 打开这个用addons.update优化过的例子的目录
`http-server -p xxxx` 这里端口随意，不冲突就好

这个例子与上面一个例子唯一的不同是这里用了**addons.update来进行store数据的复制**，具体的可以看todoStore和tpl这两个模块的代码，其他基本无修改

这里update是参考了MongoDB's query的部分语法，具体的可以看[这里](http://docs.mongodb.org/manual/core/crud-introduction/#query),类比数组方法，返回一个新的实例。

- {$push: array} 类似数组的push方法
- {$unshift: array} 类似数组的unshift方法
- {$splice: array of arrays} 类似数组的splice方法
- {$set: any} 整个替换目标
- {$merge: object} 合并目标和object的 keys.
- {$apply: function} 传递当前的值给 function 并用返回值更新它

但是由Timeline的观察来看，复制对象属性的性能远比刷新一个大组件的性能高。

[50ms渲染一次，重复渲染200次的截图，引入了update模块](http://www.manfredhu.com/images/github/4updateDemo.png)

## 5.Immutablejs
Immutable.js是Facebook为解决数据持久化而独立出来的一个库，传统的，比如我们有

```js
var a = {b:1};
function test(obj){
  obj.b = 10;
  return obj;
}
test(a); //10
```
函数对对象的操作，你不会知道这个函数对对象进行了什么操作。也就是说是封闭的。
而Immutable每次对对象的操作都会返回一个新对象

Immutable.js提供了7种不可变的数据类型:`List Map Stack OrderedMap Set OrderedSet Record`,对Immutable对象的操作均会返回新的对象，例如:

```js
var obj = {count: 1};
var map = Immutable.fromJS(obj);
var map2 = map.set('count', 2);

console.log(map.get('count')); // 1
console.log(map2.get('count')); // 2
```
引入Immutable.js，需要对现有的业务代码进行改动，通常是对tpl和store两部分进行操作，初始化数据的时候生成一个Immutable的数据类型，之后每次get,set操作都会返回一个共享的新的对象。

[50ms渲染一次，重复渲染200次的截图，引入了immutable用了其set方法](http://www.manfredhu.com/images/github/5immutable_set.png)

[50ms渲染一次，重复渲染200次的截图，引入了immutable用了其update方法](http://www.manfredhu.com/images/github/5immutableDemo_update.png)

## 6.seamless-immutable && Observejs
一个是immutable的阉割版，一个是AlloyTeam推的。
两者都是通过Object.defineProperty(IE9+)对set和get操作进行处理，优点是文件比较小。

## 7.写在最后
自己设想，组件化运用到极致，应该是像[微信weui](http://weui.github.io/weui/#/)那样

- 有一套非常适合接入，复用性非常强的组件库。拿来就用，不需要再次开发
- 应该兼顾起上面说的减少重复渲染的部分
- 开发友好

这里也思考一些可能做到的变化：

- 将一个组件的action/store/JSX/样式代码Style 写在**一个文件**里，这样方便修改和调用，封闭组件内部实现细节，对外只暴露action操作和store的一些get方法，这样可以修改或者是获取到组件的某些现在时刻的属性（也有同学是直接封装为一个对象，通过对象暴露其store,action）
- 组件共享或依赖的数据，应在公共父级的store或独立成一个单独的部分，然后采用props传递的形式或从独立的store里面取数据

## License
[MIT](LICENSE). Copyright (c) 2016 ManfredHu.






