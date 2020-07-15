# 事件回调

#### 设置事件回调
请参考[配置](./server_config.md)说明

#### 接收消息回调
当服务收到发送消息请求后，把消息推送到配置指定的服务去。

#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| sender | string | 是 | 发送者ID |
| conv | json | 是 | 会话 |
| conv.type | int | 是 | 会话类型 |
| conv.target | string | 是 | 会话目标 |
| conv.line | int | 否 | 会话线路，缺省为0 |
| payload | json | 是 | 消息负载 |
| payload.type | int | 是 | 消息类型 |
| payload.searchableContent | string | 否 | 消息可搜索内容 |
| payload.pushContent | string | 否 | 消息推送内容 |
| payload.pushData | string | 否 | 消息推送数据 |
| payload.content | string | 否 | 消息内容 |
| payload.base64edData | string | 否 | 消息二进制内容，base64编码 |
| payload.mediaType | int | 否 | 媒体消息类型 |
| payload.remoteMediaUrl | string | 否 | 媒体内容链接 |
| payload.expireDuration | long | 否 | 消息过期时间 |
| payload.mentionedType | int | 否 | 消息提醒类型 |
| payload.mentionedTarget | string list | 否 | 消息提醒对象列表 |
| messageUid | long | 是 | 消息唯一ID |
| timestamp | long | 是 | 服务器处理时间 |

#### 响应
成功http code 200；失败非200


#### 事件回调
 * 用户在线状态回调
 * 群组成员变动回调
 * 好友关系变动回调
 * 用户信息变更回调
