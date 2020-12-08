# 常用对象

## [MessagePayload](../../base_knowledge/message_payload.md)

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| type | int | 是 | [消息内容类型](../../base_knowledge/message_payload.md#####contentType) |
| searchableContent | string | 否 | 消息可搜索内容 |
| pushContent | string | 否 | 消息推送内容 |
| pushData | string | 否 | 消息推送数据 |
| content | string | 否 | 消息内容 |
| base64edData | string | 否 | 消息二进制内容，base64编码 |
| mediaType | int | 否 | 媒体消息类型 |
| remoteMediaUrl | string | 否 | 媒体内容链接 |
| expireDuration | long | 否 | 消息过期时间 |
| mentionedType | int | 否 | 消息提醒类型 |
| mentionedTarget | string list | 否 | 消息提醒对象列表 |

示例:
```
{"type":1,"searchableContent":"hello"}  
```

## [Conversation](../../base_knowledge/conversation.md)

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| type | int | 是 | [会话类型](../../base_knowledge/conversation.md#####会话类型) |
| target | string | 是 | 会话目标 |
| line | int | 否 | 会话线路，缺省为0 |

示例:
```
{"type":0,"target":"userId"}  
```

## GroupMember

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| member_id | string | 是 | 群成员的用户ID |
| alias | string | 否 | 群成员的群名片 |
| type | int | 否 | 群成员类型，0 普通成员, 1 管理员, 2 群主， 3 禁言，4 已经移除的成员，当修改群成员信息时，只能取值0/1，其他值由其他接口实现，暂不支持3|

示例:
```
{"member_id":"userId1","alias":"老王"}  
```

## GroupInfo

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| target_id | string | 否 | 群组ID，创建群组时为可选参数，获取群组信息时是必填项 |
| name | string | 否 | 群组名称 |
| portrait | string | 否 | 群组头像 |
| owner | string | 是 | 群主用户ID |
| type | int | 是 | 群类型，0 weixin 风格群组；2 qq 风格群组。移动端demo使用的是2，建议使用2. |
| extra | string | 否 | 群的extra信息供客户扩展使用 |
| mute | int | 否 | 是否全员禁言，0 不禁言；1 全员禁言。 |
| join_type | int | 否 | 加入群权限，0 所有人可以加入；1 群成员可以拉人；2 群管理员或群组可以拉人。 |
| private_chat | int | 否 | 是否禁止私聊，0 允许群成员发起私聊；1 不允许群成员发起私聊。 |
| searchable | int | 否 | 群是否可以被搜索，但目前没有实现。如果需要请在appserver实现。 |
| max_member_count | int | 否 | 群最大成员数，社区版该字段无效，群最大参加在t_setting表中配置。专业版可以指定某个群的最大成员数。 |
| history_message | int | 否 | 是否允许查看群成员查看加入群之前的历史消息，0 不允许；1 是允许。 |


示例:
```
{"target_id":"groupId1","name":"老王的朋友们","owner":"laowang","type":3}  
```

## Group

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| group_info | [json](./models.md##GroupInfo) | 是 | 群组ID |
| members | list<[json](./models.md##GroupMember)> | 否 | 群组成员列表 |


示例:
```
{
  "group_info":{"target_id":"groupId1","name":"老王的朋友们","owner":"laowang","type":3},
  "members":[{"member_id":"memberId1","name":"老王的朋友们","owner":"laowang","type":3}]
}
```
