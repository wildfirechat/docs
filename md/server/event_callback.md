# 事件回调
当其他服务需要知道IM服务中下述信息变动时，可以配置对应回调，当对应事件发生时，IM服务会推送事件到指定地址。需要注意的时IM服务内使用单线程推送，如果处理耗时较长，会产生较大延迟和拖累IM服务的性能。建议***服务器放到同一内网减少网络延迟，接收服务异步处理快速返回，不能处理完再返回***。

## 设置事件回调
请参考[配置](./server_config.md)说明

## 接收消息回调
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
http code 200


## 用户在线状态回调
当用户上线/下线时，会通知到配置指定的服务器去

#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| clientId | string | 是 | client ID |
| platform| int | 是 | 平台 |
| status | int | 是 | 状态。0 下线；1 上线； -1 客户端调用logout |
| packageName | string | 是 | 应用包名 |
| timestamp | long | 是 | 时间戳 |

#### 响应
http code 200

## 群组信息变动回调
当用户创建/修改/销毁群组时触发。

#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 操作的用户 |
| type | int | 是 | 0是创建，1是修改属性，2转移群组，3是禁言群组，4是取消禁言群组，5是销毁群组 |
| groupId | string | 是 | 群组ID |

#### 响应
http code 200

## 群组成员变动回调
当群组成员修改状态时触发。

#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| operatorId | string | 是 | 操作的用户 |
| groupId | string | 是 | 操作的用户 |
| memberId | string | 是 | 操作的用户 |
| type | int | 是 | 0加入群组，1离开群组，3群成员状态改变，4修改群昵称 |
| value | string | 否 | 当type为4时为群昵称，type为3时值为群成员新的状态 |
> 群组成员状态0，普通群成员；1，管理员；2，群主；3，禁言；5，白名单

#### 响应
http code 200

## 用户关系变动回调
当用户修改用户关系时。

#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| targetId | string | 是 | client ID |
| type | int | 是 | 0是好友关系，1是昵称，2是黑名单 |
| value | string | 是 | type为0时，“0”是非好友；“1”是好友。type为1时值为昵称。type2时，“0”非黑名单，“1”拉黑 |


#### 响应
http code 200

## 用户信息变更回调
当用户修改用户信息时。

#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| name | string | 是 | 帐号名 |
| displayName | string | 否 | 显示名字 |
| portrait | string | 否 | 用户头像 |
| mobile | string | 否 | 用户手机号码 |
| email | string | 否 | 用户邮箱 |
| address | string | 否 | 用户地址 |
| company | string | 否 | 用户公司 |
| extra | string | 否 | 附加信息 |

#### 响应
http code 200
