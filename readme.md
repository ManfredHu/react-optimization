# what?
这是一个探索reflux&react渲染优化的例子。

- example 没有优化的地方，会不断渲染
- updateDemo 使用了react的addons插件的例子
- observeDemo 使用了observejs的例子

## observejs改动
1. 修改模块化模式，支持 modulejs
2. isFunction判定改为typeof判定
3. 传入window对象改为this传入
4. 增加部分注释
5. 增加可不传入回调函数的部分，原来的observe模块必须传入回调函数

## 用法
1. `cd ./xxx/`(这里的xxx为上面对应的example/updateDemo/observeDemo目录)
2. `http-server -p 8888`端口可以自定义，http-server模块已在`node_module`目录下，担心版本问题，上传`node_module`目录
3. 打开浏览器便可浏览，详情请看控制台


