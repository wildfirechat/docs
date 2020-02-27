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
