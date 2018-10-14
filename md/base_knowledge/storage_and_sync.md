# 存储与同步
除了Web端以外的客户端内置有Sqlite数据库，基本上所有的信息都会有缓存。不同类型的数据缓存是有所区别的。

#### 消息
消息是IM中最主要的数据，消息的收取是协议栈自动处理，消息收取后自动存储在数据库中。因此从数据库中读取消息和会话是当时最新的状态。此外需要监听新消息回调，收到新消息后重新从数据库中读取或者更新之前读取的数据即可。

#### 其它类型信息
群组信息，群成员信息，用户信息，好友信息等，这类信息变更没有推送功能，因此需要在合适的时机去服务器刷新。这类信息的获取一般都是带有一个从服务器强制刷新参数refresh。数据不存在或者refresh为true时，协议栈会强制去网络刷新，如果数据有变动会发出通知。在应用中需要考虑信息取回来是空的可能，另外需要监听对应信息刷新事件。

获取用户信息接口：
```
public UserInfo getUserInfo(String userId, boolean refresh);
```

用户信息刷新通知：
```
public static final String ACTION_ON_USERINFO_UPDATED = "cn.wildfirechat.client.on_userinfo_updated";
```
