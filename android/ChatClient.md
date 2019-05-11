## ChatClient简介

ChatClient是协议栈在Android平台的wrapper和平台实现，只加上了少量逻辑，ChatClient和协议栈一起完成了所有的能力，但不包括任何的UI。

协议栈处理连接/发送/接收/状态同步等任务，并且内置有SQLite数据库，组织管理各种数据。具有如下功能：

- 基础功能

- 消息功能

- 会话管理功能

- 消息管理功能

- 群组功能

- 用户功能

- 好友功能

- 个人设置

- 聊天室功能

- 频道(和微信公众号类似)功能

  

#### 简单使用步骤

​	初始化操作，只需在主进程进行，下面只列出最简步骤，详情请参考[android-chat](<https://github.com/wildfirechat/android-chat>)项目

1. 初始化

   ```java	
   ChatManager.init(application, Config.IM_SERVER_HOST, Config.IM_SERVER_PORT);
   ```

2. 置事件回调

   ```java
   ChatManager chatManager = ChatManager.Instance();
   chatManager.startLog();
   chatManager.addOnReceiveMessageListener(OnReceiveMessageListener listener);
   chatManager.addRecallMessageListener(OnReceiveMessageListener listener)
   // ... 设置其他时间回调监听，更多请参考ChatManger
   ```

3. 初始化音视频

   ```java
   AVEngineKit.init(application, AVEngineKit.AVEngineCallback);
   AVEngineKit avEngineKit = AVEngineKit.Instance();
   avEngineKit.addIceServer(Config.ICE_ADDRESS, Config.ICE_USERNAME,Config.ICE_PASSWORD);
   ```

4. 连接IM 服务器

   ```java
   chatManager.connect(id, token);
   ```

5. 等待时间回调通知，如收到新消息、用户信息更新等。

#### 信息获取说明

1. 用户信息/群组信息/频道信息/好友信息/设置信息等，客户端的DB中会存储上一次从服务器更新来的信息，因此当UI获取这些信息时可能返回为空**(Android 平台，为了减少UI层的判断压力，采用了Null Object Pattern，返回值并不是```NULL```， 而是```NullUserInfo```等，```NullUserInfo```等对象uid是正确```uid```但其他信息是默认值，可参考具体的代码)**。
2. 另外有些场景UI希望是获取旧的信息尽快展示到UI上，然后同时刷新以便有更新显示正确。
3. 因此当本地信息不存在或获取信息时强制刷新，协议栈回去IM服务器同步该信息，如果信息有变更，则会有对应的回调通知。

```java

public interface OnUserInfoUpdateListener {
    void onUserInfoUpdate(List<UserInfo> userInfos);
}

//ChatManager.java
/**
1. 当返回为NullUserInfo，会触发onUserInfoUpdate
2. 当refresh为true时，如果是信息有更新，则会触发onUserInfoUpdate
*/
UserInfo getUserInfo(String userId, boolean refresh);

```



#### 函数说明

请参考```ChatManger```这个类

