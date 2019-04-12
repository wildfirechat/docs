# ChatClient简介
ChatClient是协议栈在iOS平台的wrapper和平台实现，只加上了少量逻辑，ChatClient和协议栈一起完成了所有的能力，但不包括任何的UI。

协议栈处理连接/发送/接收/状态同步等任务，并且内置有SQLite数据库，组织管理各种数据。具有如下功能：

* 基础功能
* 消息功能
* 会话管理功能
* 消息管理功能
* 群组功能
* 用户功能
* 好友功能
* 个人设置
* 聊天室功能
* 频道功能

#### 信息获取的一个原则
用户信息/群组信息/频道信息/好友信息/设置信息等，客户端的DB中会存储上一次从服务器更新来的信息，因此当UI获取这些信息时可能返回为空。另外有些场景UI希望是获取旧的信息尽快展示到UI上，然后同时刷新以便有更新现实正确。因此当本地信息不存在或获取信息时强制刷新，协议栈回去IM服务器同步该信息，如果信息有变更，会发出一个通知，如果没有变更则结束。比如用户信息
```
//用户信息更新通知
extern NSString *kUserInfoUpdated;


/**
 获取用户信息

 @param userId 用户ID
 @param refresh 是否强制从服务器更新，如果本地没有或者强制，会从服务器刷新，然后发出通知kUserInfoUpdated。
 @return 本地的用户信息，可能为空
 */
- (WFCCUserInfo *)getUserInfo:(NSString *)userId
                      refresh:(BOOL)refresh;
```

#### 函数声明
由于函数太多，就不一一说明了，请找到```WFCCNetworkService.h```和```WFCCIMService.h```头文件，里面有所有ChatClient对外暴露的功能。
