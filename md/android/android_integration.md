
# 集成说明
野火客户端是分层的，客户可以只集成[ChatClient](chatclient.md)，然后自己实现所有的UI和交互，难度和工作量都比较大；也可以集成[ChatClient](chatclient.md)和[ChatUIKit](chatuikit.md)，省掉大部分的UI开发。

## 集成ChatUIKit
1. 将`uikit`作为一个`module`引入到目标项目
   > 引入方法是：将`uikit`目录拷贝到目标项目，然后在目标项目`setting.gradle`里面添加`include ':uikit'`，同时在目标项目`app module`里面添加` implementation project(':uikit')`，引入其他`module`也是一样的办法
2. 将`uikit`所依赖的`modeule`引入目标项目，目前依赖于`client`、`avenginekit`、`badgeview`、`menu`、`uikit-aar-dep`等，具体可以参考`uikit/build.gradle`
3. 在项目`Application`子类里面初始化`UIKit`。初始化操作，只需要再主进程进行即可。可以参考`android-chat`里面的`MyApp.java`
    ```
    WfcUIKit wfcUIKit = WfcUIKit.getWfcUIKit();
    // 初始化
    wfcUIKit.init(this);
    // 应用后台运行时，是否允许本地通知
    wfcUIKit.setEnableNativeNotification(true);
    // 设置应用服务，ChatUIKit有些操作，比如群公告等，需要上层来完成，需要设置appServiceProvider，快速集成时可以先注释掉。
    wfcUIKit.setAppServiceProvider(AppService.Instance());
    // 推送初始化
    PushService.init(this, BuildConfig.APPLICATION_ID);
    // 注册自定义消息
    MessageViewHolderManager.getInstance().registerMessageViewHolder(LocationMessageContentViewHolder.class, R.layout.conversation_item_location_send, R.layout.conversation_item_location_send);

    // 设置组织结构服务
    wfcUIKit.setOrganizationServiceProvider(organizationService);

    // 设置默认头像提供者
    ChatManager.Instance().setDefaultPortraitProviderClazz(WfcDefaultPortraitProvider.class);
    // 双网时，设置 url 重定向
    ChatManager.Instance().setUrlRedirectorClazz(TestUrlRedirector.class);

    ```
4. 参考`android-chat/MainActivity`，使用`uikit`里面实现的`ConversationListFragment`、`ContactListFragment`等 UI 组件，进行快速开发
5. 参考`android-chat/MainActivity`，处理被踢等情况下的重新登录逻辑
5. 获取到`userId`和`token`之后，进行连接
   ```
   ChatManager.Instance().connect(userId, token)
   ```

## 集成ChatClient
`ChatClient`只是个功能库，所有的UI都是需要自己来实现，难度也比较高，需要资深研发工程师进行集成。首先参考集成`ChatUIKit`的方法，只引入`client`模块，然后去掉所有关于`ChatUIKit`和音视频的操作。然后参考`ChatClient`库中`ChatManager`里面的方法进行各种接口调用和回调监听。如果有问题可以参考`ChatUIKit`的代码。
