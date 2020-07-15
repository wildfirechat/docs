# 推送说明

### 推送设计及原则
Android和/iOS系统需要推送服务，但由于推送厂家太多，而且还在不断变化中，因此推送服务从IM服务中独立出来。当某用户需要推送时，IM服务会调用推送服务进行推送。
这样做的好处就是IM系统与推送系统独立，当推送发生变化时，不用修改IM服务。

推送没有选择第三方推送，都是直接根据型号，推送到各个厂家的推送服务去，这样就大大提高了推送成功率，但难度也提高很多，需要对接众多厂家。好消息是目前手机的头部市场已经形成，Android排名前5的厂家已经占据市场的90%以上，并且还在不断集中，能够减少对接的工作量。

有推送服务的厂家使用厂家的推送服务，没有推送服务的厂家，使用小米推送。在实际使用中小米推送与第三方推送在非小米手机上的表现差不多。

### 配置
在```wildfirechat.conf```配置文件中修改推送服务器地址
```
#*********************************************************************
# Push server configuration
#*********************************************************************
##安卓推送服务器地址
push.android.server.address http://localhost:8085/android/push
##苹果推送服务器地址
push.ios.server.address http://localhost:8085/ios/push
```

### 调用参数
使用post方式，内容为json，参数如下
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| sender | string | 是 | 发送者ID |
| senderName | string | 是 | 发送者姓名 |
| convType | int | 是 | 会话类型 |
| target | string | 是 | 接收用户ID |
| targetName | string | 是 | 接收用户名称 |
| line | int | 否 | 会话线路，缺省为0 |
| serverTime | long | 是 | 消息时间 |
| pushMessageType | int | 是 | 0 普通消息；1 voip消息。在支持透传的系统上，voip消息用透传 |
| pushType | int | 是 | 推送类型，android推送分为小米/华为/魅族等。ios分别为开发和发布。 |
| pushContent | string | 是 | 消息推送内容 |
| pushData | string | 否 | 消息推送数据 |
| unReceivedMsg | int | 是 | 服务器端没有接收下来的消息数（只计算计数消息） |
| mentionedType | int | 否 | 消息提醒类型，0，没提醒；1，提醒了当前用户；2，提醒了所有人 |
| packageName | string | 否 | 应用包名 |
| deviceToken | int | 否 | 设备token |
| isHiddenDetail | bool | 否 | 是否要隐藏推送详情 |
| language | string | 否 | 接收者的手机语言 |

### demo推送服务
我们开发了[推送服务](https://github.com/wildfirechat/push_server)，客户可以拿来直接使用。目前demo推送服务已经对接了iOS/华为/小米/魅族，其中魅族还需要调试。另外客户可以自行对接OPPO和VIVO。
