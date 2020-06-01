# Web FAQ

## 前置说明
1. 仔细阅读[web二次开发](./../web/integration.md)
2. 请打开浏览器的控制台，查看网络请求和日志。

#### Q. Web SDK有UI吗？
A. Web SDK是功能库，是Web端的client，不包含UI。[web-chat](https://github.com/wildfirechat/web-chat)项目是基于Web SDK开发的，提供UI，客户可以进行体验、二次开发等。

#### Q. Web SDK购买提供源码吗？
A. Web SDK以发布包形式提供，不提供源码。另外Web SDK与专业版绑定，绑定域名。

#### Q. Web SDK可以跟社区版配合使用吗？
A. Web SDK必须跟专业版配合使用。因为Web SDK的同步机制与移动端和PC端不一致，相比而言更消耗性能，需要更高性能的专业版配合使用。

### Q. route返回22
A. 错误码22，表示未授权，请确认

    1. ```config.js```里面```WEB_APP_ID```和```WEB_APP_KEY```是否正确修改
    2. ```proto.min.js```是否正确替换
    3. ```config.js```里面是否正确修改```APP_SERVER```

> ```WEB_APP_ID```，```WEB_APP_KEY```，```proto.min.js```由邮件提供，请查阅相关邮件

### Q. 扫码之后，无法进入主页，连接状态返回-1
A. 参考上一个问题

### Q. ```Web SDK```到底有哪些依赖？
A. ```Web SDK```的依赖如下：

    'base64-arraybuffer'
    'long'
    'mobx'
    'long'
    'js-base64'
    'detectrtc'
    'events'
    'long'
    'events'
    'atob'
    'btoa'

其中,```mobx```不是必须，可将其从```wfc/messages/message.js```中移除。

### Q. 如何启用https?
A. [回答](./web/https.md)

### Q. 二维码不显示
A. 请确保已正确修改```config.js```里面的```APP_SERVER```，可控制台 -> 网络，看下pc_session请求是否正常访问你们部署的[app server](../quick_start/server.md)