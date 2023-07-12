# Web FAQ

## 前置说明
1. Web 版，依赖于专业版IM Server，请确保已正确部署专业版IM Server，可通过[这个在线工具](http://docs.wildfirechat.cn/web/wstool/index.html)测试专业版 IM Server 是否成功监听 WebSocket 请求。注意，测试时，服务器地址，需要带上端口。
2. 仔细阅读[web二次开发](./../web/integration.md)
3. 请打开浏览器的控制台，查看网络请求和日志。

#### Q. Web SDK有UI吗？
A. Web SDK是功能库，是Web端的client，不包含UI。[web-chat](https://github.com/wildfirechat/web-chat)项目是基于Web SDK开发的，提供UI，客户可以进行体验、二次开发等。

#### Q. Web SDK购买提供源码吗？
A. Web SDK以发布包形式提供，不提供源码。另外Web SDK与专业版绑定，绑定域名。

#### Q. Web SDK可以跟社区版配合使用吗？
A. Web SDK必须跟专业版配合使用。因为Web SDK的同步机制与移动端和PC端不一致，相比而言更消耗性能，需要更高性能的专业版配合使用。

### Q. route返回22
A. 错误码22，表示未授权，请确认

    1. ```proto.min.js```是否正确替换
    2. ```config.js```里面是否正确修改```APP_SERVER```
    3. 是否已正确部署专业版```im-server```

### Q. 扫码之后，无法进入主页，连接状态返回-1
A. 参考上一个问题

### Q. ```Web SDK```到底有哪些依赖？
A. ```Web SDK```的依赖如下：

    'base64-arraybuffer'
    'long'
    'js-base64'
    'detectrtc'
    'events'
    'atob'
    'btoa'

### Q. 如何启用https?
A. [回答](./web/https.md)

### ```npm run serve```之后，页面白屏，什么也不显示
A. ```APP_SERVER```配置错误，具体请端口控制台，看下控制台提示。

### Q. 二维码不显示
A. 请确保已正确修改```config.js```里面的```APP_SERVER```，可控制台 -> 网络，看下pc_session请求是否正常访问你们部署的[app server](../quick_start/server.md)

### Q. ```pc_session```接口提示跨域
A. 非常可能是通过`nginx`等代理了`app-server`相关请求，但是`nginx`配置错误，请参考`app-server`项目`nginx`目录的参考配置。

### Q. 如何修改快捷键
 A. ```background.js```中搜索```regShortcut```