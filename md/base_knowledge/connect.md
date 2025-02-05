# 连接

#### 连接
连接之前需要先获取token。调用connect之后，SDK会自动处理断网重连/网络切换/前后台切换等逻辑。应用只需要实现网络状态的回调，反映出当前的状态即可。断开连接有参数确认是否继续接收推送和保留本地的历史消息。

连接流程请参考[登录](../architecture/index.html#登录)

#### 异步调用与回调
connect函数没有回调函数，只能通过连接回调来判断连接状态。调用connect后，数据库立即可用。连接状态一般情况下只需要展示给用户即可，但有部分状态需要干预，比如token过期或者错误，用户被封禁等。

#### 连接状态
当协议栈连接状态发生变化时，会通过回调返回给上层，具体连接状态如下:

|  状态码   | 值  | 意义  | 处理方法 |
|  ----  | ----  | ----  |  ----- |
| ConnectionStatusTimeInconsistent  | -9 | 客户端和IM 服务端时间不同步| 当客户端和 IM-Server 时间差超过两个小时时，会出现此错误，请进行时钟同步。 |
| ConnectionStatusNotLicensed  | -8 | IM 服务未授权或已过期 | 专业版IM-Server 是绑定域名或者 ip 的，只能通过所绑定的域名去连接，并且是有有效期的。当未授权或授权过期时，提示此错误 |
| ConnectionStatusKickedOff  | -7 | 被踢下线 | 同一用户，被其他端踢下载时 |
| ConnectionStatusSecretKeyMismatch  | -6 | 会话密钥错误 | 一般是clientId没有从SDK中连接，或者有多个IM服务，获取token跟客户端连接的服务不是同一个。 |
| ConnectionStatusTokenIncorrect  | -5 | token错误 | 需要检查token是否错误 |
| ConnectionStatusServerDown  | -4 | IM Server服务无法连通 |  需要检查服务器是否宕机或者网络出现问题 |
| ConnectionStatusRejected  | -3 | 连接被服务器拒绝 | 一般是用户被封禁 |
| ConnectionStatusLogout  | -2 | 退出登录 |        |
| ConnectionStatusUnconnected  | -1 | 未连接 |    |
| ConnectionStatusConnecting  | 0 | 连接中 |        |
| ConnectionStatusConnected  | 1 | 已连接 |  正常状态，所有业务可用 |
| ConnectionStatusReceiveing  | 2 | 正在同步信息 |  登录以后要先同步消息，可能同步数据量比较大，这时可以选择等待连接状态变为1时来统一更新UI |
