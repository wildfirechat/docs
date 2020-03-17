# PC 常见问题

#### Q. 如何抓取日志
A. 协议栈会自己抓取最近5M的日志，将会对问题的解决提供非常大的帮助。协议栈日志在不同系统上存在不同的目录。在MAC上的目录是```~/Library/Application Support/{包名}/wildfirechat/{用户Id}/wfchat_{日期}.xlog```；在Linux上的目录是```~/.wildfirechat/data/{用户Id}/wfchat_{日期}.xlog```；在windows上的目录在```C:\Users\{登电脑登录用户名}\AppData\Roaming\wildfirechat\{用户Id}\wfchat_{日期}.xlog```。log是[mars](https://github.com/Tencent/mars)的```xlog```格式，没有密码。用户可以自己解压后分析，也可以发给我们分析问题。

#### Q. 如何删掉截图依赖的QT
A. 有些客户自己有截图工具或者使用electron上的截图插件，就需要把官方PC版本所带的Qt依赖去掉。解决办法就是在pc工程目录下有{platform}-qt-denpendency，把其中除了```QtCore```以外的所有内容全部删掉。然后PC UI上截图按钮唤起自有的截图插件即可。
> ```QtCore```在不同平台有着不同的文件形式，windows下为```Qt5Core.dll```，mac下为```QtCore.framework```，linux下为```libQt5Core.so.5```。删除其他内容是需要保留```QtCore```的目录结构。

### Q. 手机端扫码提示会话不存在或者已过期？
A. 只有手机端和PC端所对应的APP、IM Server都相同时，才能扫码登录PC端。

    1. PC端需要购买```PC SDK```才能连接自己部署的服务，默认只能连接官方服务。确认是否想官方购买了```PC SDK```，如果未购买，可[申请试用](../quick_start/trial.md)
    2. 确认PC端```config.js```和手机端```Config.java```或```WFCConfig.m```所配置的```APP_SERVER```是否一致。
   
### Q. 扫码无法登陆，如果让PC端连接自己部署的服务？
A. 请参考上一问题。

