# 集成
[web-chat](https://github.com/wildfirechat/web-chat)是一个可以直接使用的demo，推荐参考```web-chat```进行二次开发，如果不想基于```web-chat```进行二次开发，可以按以下步骤进行集成：

## 集成步骤
1. 将```src/js/wfc```和```src/js/config.js```拷贝到自己项目，并```wfc```目录和```config.js```处于同级目录。
2. 修改```config.js```中的配置信息：
   * ```APP_SERVER```：应用服务器地址
   * ```ICE_ADDRESS```、```ICE_USERNAME```、```ICE_PASSWORD```：音视频通话相关的turn服务信息，开发测试的时候，可以直接使用现有配置，上线时，请修改了指向自行部署的turn服务。
   * ```WEB_APP_ID```、```WEB_APP_KEY```：对应的```appId```和```appKey```
3. 初始化
   调用```wfc.init()```进行初始化，全局只需调用一次，需要在应用启动的时候调用。
4. 注册事件监听
   * 调用```wfc.eventEmitter.on```注册事件监听，支持的事件及每个事件的通知信息，请参考```wfc/client/wfcEvent.js```。事件监听一般在需要关心对应事件的页面注册；页面关闭，或者不在关心事件时，必须取消注册，否则会发生泄漏。
   * 连接状态时间内
5. 获取```token```
   * 调用```APP SERVER```的```pc_session```接口获取```token```，可参考```web-chat```的login过程
6. 连接
   * 调用```wfc.connect```进行连接
   * 获取token和连接的流程，可参考```web-chat```
   * 连接结果，会通过事件(```EventType#ConnectionStatusChanged```)通知回调，需要关注进行并进行处理。
7. 连接成功之后，就可以进行其他操作了，具体参考```wfc.js```
8. ***推荐参考```web-chat```进行二次开发***



    