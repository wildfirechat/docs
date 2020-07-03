# 二次开发
[pc-chat](https://github.com/wildfirechat/pc-chat)是一个可以直接使用的demo，推荐参考```pc-chat```进行二次开发

## 基于```pb-chat```二次开发
1. 修改```config.js```中的配置信息，如果不进行修改或修改错误，将不能正确连接IM：
   * ```APP_SERVER```：应用服务器地址，需要指向自行部署的```app-server```，注意端口不能省略。
   * ```ICE_ADDRESS```、```ICE_USERNAME```、```ICE_PASSWORD```：音视频通话相关的turn服务信息，开发测试的时候，可以直接使用现有配置，上线时，请修改了指向自行部署的turn服务。
2. 根据邮件的说明，替换```proto``` 目录下的相关文件
3. 没有其他配置了，执行```npm run dev```即可启动野火IM PC版本，然后用野火IM移动端扫码登录。

## 集成到自己的项目
> 集成过程，请随时参考```pc-chat```

1. 将```src/js/wfc```和```src/js/config.js```拷贝到自己项目，并且```wfc```目录和```config.js```处于同级目录。
2. 修改```config.js```中的配置信息，如果不进行修改或修改错误，将不能正确连接IM：
   * ```APP_SERVER```：应用服务器地址，需要指向自行部署的```app-server```，注意端口不能省略。
   * ```ICE_ADDRESS```、```ICE_USERNAME```、```ICE_PASSWORD```：音视频通话相关的turn服务信息，开发测试的时候，可以直接使用现有配置，上线时，请修改了指向自行部署的turn服务。
3. 根据邮件的说明，替换```proto```目录下相关文件
4. 初始化
   调用```wfc.init()```进行初始化，全局只需调用一次，需要在应用启动的时候调用。
5. 注册事件监听
   * 调用```wfc.eventEmitter.on```注册事件监听，支持的事件及每个事件的通知信息，请参考```wfc/client/wfcEvent.js```。事件监听一般在需要关心对应事件的页面注册；页面关闭，或者不在关心事件时，必须取消注册，否则会发生泄漏。
6. 获取```token```
   * 调用```APP SERVER```的```pc_session```接口获取```token```，可参考```pc-chat```的login过程
7. 连接
   * 调用```wfc.connect```进行连接
   * 获取token和连接的流程，可参考```pc-chat```
   * 连接结果，会通过事件(```EventType#ConnectionStatusChanged```)通知回调，需要关注进行并进行处理。
8. 连接成功之后，就可以进行其他操作了，具体参考```wfc.js```


    