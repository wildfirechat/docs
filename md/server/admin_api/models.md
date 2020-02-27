# 常用对象

## [MessagePayload](../../base_knowledge/message_payload.md)

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| type | int | 是 | [消息内容类型](../../base_knowledge/message_md#####contentType) |
| searchableContent | string | 否 | 消息可搜索内容 |
| pushContent | string | 否 | 消息推送内容 |
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
| type | int | 否 | 群成员类型，0 普通成员, 1 管理员 |

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
| type | int | 是 | 群类型，0 weixin 风格群组；2 qq 风格群组。移动端demo使用的是2 |
| extra | string | 否 | 群的extra信息供客户扩展使用 |

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
