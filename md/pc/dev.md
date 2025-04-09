# 二次开发
[vue-pc-chat](https://github.com/wildfirechat/vue-pc-chat)是一个可以直接使用的demo，推荐参考```vue-pc-chat```进行二次开发

## 基于```vue-pc-chat```二次开发
1. 修改```config.js```中的配置信息，如果不进行修改或修改错误，将不能正确连接IM：
   * ```APP_SERVER```：应用服务器地址，需要指向自行部署的```app-server```，注意端口不能省略。
   * ```ICE_ADDRESS```、```ICE_USERNAME```、```ICE_PASSWORD```：音视频通话相关的turn服务信息，开发测试的时候，可以直接使用现有配置，上线时，请修改了指向自行部署的turn服务。
2. 根据邮件的说明，替换```proto``` 目录下的相关文件
3. 根据项目下的说明来编译运行测试。

## 集成到自己的项目
> 集成过程，请随时参考```vue-pc-chat```

1. 将```src/wfc```目录、`src/wfc_custom_message`和```src/config.js```文件拷贝到自己项目，并且```wfc```目录和```config.js```处于同级目录。
2. 修改```config.js```中的配置信息，如果不进行修改或修改错误，将不能正确连接IM：
   * ```APP_SERVER```：应用服务器地址，需要指向自行部署的```app-server```，注意端口不能省略。
   * ```ICE_ADDRESS```、```ICE_USERNAME```、```ICE_PASSWORD```：音视频通话相关的turn服务信息，开发测试的时候，可以直接使用现有配置，上线时，请修改了指向自行部署的turn服务。
3. 根据邮件的说明，替换```proto```目录下相关文件
4. 初始化
   调用```wfc.init()```进行初始化，全局只需调用一次，需要在应用启动的时候调用。
5. 注册事件监听
   * 调用```wfc.eventEmitter.on```注册事件监听，支持的事件及每个事件的通知信息，请参考```wfc/client/wfcEvent.js```。事件监听一般在需要关心对应事件的页面注册；页面关闭，或者不在关心事件时，必须取消注册，否则会发生泄漏。
6. 获取```token```
   * 调用```APP SERVER```的```pc_session```接口获取```token```，可参考```vue-pc-chat```的login过程
7. 连接
   * 调用```wfc.connect```进行连接
   * 获取token和连接的流程，可参考```vue-pc-chat```
   * 连接结果，会通过事件(```EventType#ConnectionStatusChanged```)通知回调，需要关注进行并进行处理。
8. 连接成功之后，就可以进行其他操作了，具体参考```wfc.js```

## 在自己的应用服务登录
我们提供的```app-server```是为了演示如何跟客户系统对接，可以不使用这个服务，只需要在客户系统进行简单修改就行。当客户端（不仅是PC端，其它端也是一样）去客户系统服务登录时，验证通过后客户系统去IM服务为该客户端获取[token](../base_knowledge/user.md#用户Token)，获取到token后返回给客户端，客户端再调用connect。

在PC的demo中，我们实现的是扫码登录的逻辑，可以重写这个逻辑（改成你们期望的方式，比如用户名/密码登录，或者OAuth登录等等），用户登录时去客户系统登录，只需要返回token给IM，然后再参考我们demo的流程来处理就行。

当然Demo应用服务中还有一些其它逻辑，比如群公告，收藏等小功能也都需要移植到客户系统中并对接调试。
