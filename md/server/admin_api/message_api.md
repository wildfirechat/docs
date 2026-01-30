# 消息
本文讲述消息相关的接口。我们提供有Java版本的[SDK](../sdk.md)，建议使用Java语言的客户使用这个SDK，其它语言可以按照本文档对接。

## 发送消息
#### 地址
```
http://domain:18080/admin/message/send
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| sender | string | 是 | 发送者ID |
| conv | [json](./models.md#Conversation) | 是 | 会话 |
| payload | [json](./models.md#MessagePayload) | 是 | 消息负载 |
| toUsers | string[] | 否 | 群组或者频道中发给指定用户 |

> 消息内容对应的json格式payload请参考[内置消息](../predefined_message_content.md)

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| messageUid | long | 是 | 消息唯一ID |
| timestamp | long | 是 | 服务器处理时间 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"sender\":\"a\",       \
    \"conv\": {              \
      \"type\":1,            \
      \"target\":\"a\",      \
      \"line\":0,           \
    },                        \
    \"payload\":{                 \
      \"type\":1,                       \
      \"searchableContent\":\"hello\"   \
    }                                   \
  }"                                \
  http://localhost:18080/admin/message/send

{
  "code":0,
  "msg":"success",
  "result":{
    "messageUid":5323423532,
    "timestamp":13123423234324,
  }
}
```

## 更新消息(仅专业版支持)
#### 地址
```
http://domain:18080/admin/message/update
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| messageUid | long | 是 | 消息唯一ID |
| payload | [json](./models.md#MessagePayload) | 是 | 消息负载 |
| distribute | int | 是 | 是否重新分发给用户，0不重新分发，1重新分发，建议用1 |

> 消息内容对应的json格式payload请参考[内置消息](../predefined_message_content.md)

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"messageUid\":5323423532,       \
    \"distribute\":1,            \
    \"payload\":{                 \
      \"type\":1,                       \
      \"searchableContent\":\"world\"   \
    }                                   \
  }"                                \
  http://localhost:18080/admin/message/update

{
  "code":0,
  "msg":"success"
}
```

## 撤回消息

#### 地址
```
http://domain:18080/admin/message/recall
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| operator | string | 是 | 撤回者 |
| messageUid | long | 是 | 消息唯一ID |

> Server API撤回不受时间限制，可以撤回任意时间内的消息。

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"operator\":\"a\",\"messageUid\":5323423532}" http://localhost:18080/admin/message/recall

{
  "code":0,
  "msg":"success",

}
```

## 组播消息
#### 地址
```
http://domain:18080/admin/message/multicast
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| sender | string | 是 | 发送者ID |
| targets | list<string> | 是 | 接收者ID列表 |
| line | int | 否 | 会话线路，缺省为0 |
| payload | [json](./models.md#MessagePayload) | 是 | 消息负载 |


#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| messageUid | long | 是 | 消息唯一ID |
| timestamp | long | 是 | 服务器处理时间 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"sender\":\"a\",       \
    \"targets\": [\"userId1\",\"userId2\"],                        \
    \"payload\":{                 \
      \"type\":1,                       \
      \"searchableContent\":\"hello\"   \
    }                                   \
  }"                                \
  http://localhost:18080/admin/message/multicast

{
  "code":0,
  "msg":"success",
  "result":{
    "messageUid":5323423532,
    "timestamp":13123423234324,
  }
}
```


## 广播消息(仅专业版支持)
#### 地址
```
http://domain:18080/admin/message/broadcast
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| sender | string | 是 | 发送者ID |
| line | int | 否 | 会话线路，缺省为0 |
| payload | [json](./models.md#MessagePayload) | 是 | 消息负载 |


#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| messageUid | long | 是 | 消息唯一ID |
| count | int | 是 | 发送对象数目 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"sender\":\"a\",       \                       \
    \"payload\":{                 \
      \"type\":1,                       \
      \"searchableContent\":\"hello\"   \
    }                                   \
  }"                                \
  http://localhost:18080/admin/message/broadcast

{
  "code":0,
  "msg":"success",
  "result":{
    "messageUid":5323423532,
    "count":130002
  }
}
```

## 删除消息(仅专业版支持)
#### 地址
```
http://domain:18080/admin/message/delete
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| messageUid | long | 是 | 消息唯一ID |


#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"messageUid\":123413241234123       \
  }"                                \
  http://localhost:18080/admin/message/delete

{
  "code":0,
  "msg":"success"
}
```

## 清除用户消息(仅专业版支持)
清除指定用户在指定会话中的消息。

#### 地址
```
http://domain:18080/admin/message/clear_by_user
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| conversation | [json](./models.md#Conversation) | 是 | 会话 |
| startTime | long | 否 | 起始时间（时间戳，毫秒） |
| endTime | long | 否 | 结束时间（时间戳，毫秒） |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"userId\":\"user1\",       \
    \"conversation\":{              \
      \"type\":1,            \
      \"target\":\"a\",      \
      \"line\":0           \
    },                        \
    \"startTime\":1609459200000,                        \
    \"endTime\":1609545600000                        \
  }"                                \
  http://localhost:18080/admin/message/clear_by_user

{
  "code":0,
  "msg":"success"
}
```

## 清除会话(仅专业版支持)
清除指定用户的会话。

#### 地址
```
http://domain:18080/admin/conversation/delete
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| conversation | [json](./models.md#Conversation) | 是 | 会话 |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"userId\":\"user1\",       \
    \"conversation\":{              \
      \"type\":1,            \
      \"target\":\"a\",      \
      \"line\":0           \
    }                        \
  }"                                \
  http://localhost:18080/admin/conversation/delete

{
  "code":0,
  "msg":"success"
}
```

## 获取单条消息
获取指定消息UID的消息详情。

#### 地址
```
http://domain:18080/admin/message/get_one
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| messageUid | long | 是 | 消息唯一ID |

#### 响应

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| messageId | long | 是 | 消息ID |
| sender | string | 是 | 发送者ID |
| conv | [json](./models.md#Conversation) | 是 | 会话 |
| payload | [json](./models.md#MessagePayload) | 是 | 消息负载 |
| toUsers | string[] | 否 | 指定接收用户列表 |
| timestamp | long | 是 | 服务器时间戳 |
| client | Object | 否 | 客户端信息 |
| senderUserInfo | Object | 否 | 发送者用户信息 |
| targetUserInfo | Object | 否 | 目标用户信息 |
| targetGroupInfo | Object | 否 | 目标群组信息 |
| targetChannelInfo | Object | 否 | 目标频道信息 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"messageUid\":5323423532}" http://localhost:18080/admin/message/get_one

{
  "code":0,
  "msg":"success",
  "result":{
    "messageId":123,
    "sender":"user1",
    "conv": {...},
    "payload": {...},
    "timestamp":13123423234324
  }
}
```

## 撤回广播消息(仅专业版支持)
撤回之前发送的广播消息。

#### 地址
```
http://domain:18080/admin/message/recall_broadcast
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| operator | string | 是 | 操作者ID |
| messageUid | long | 是 | 消息唯一ID |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"operator\":\"admin\",\"messageUid\":5323423532}" http://localhost:18080/admin/message/recall_broadcast

{
  "code":0,
  "msg":"success"
}
```

## 撤回组播消息
撤回之前发送的组播消息，可以为部分接收者撤回。

#### 地址
```
http://domain:18080/admin/message/recall_multicast
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| operator | string | 是 | 操作者ID |
| messageUid | long | 是 | 消息唯一ID |
| receivers | string[] | 是 | 接收者ID列表 |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"operator\":\"admin\",       \
    \"messageUid\":5323423532,                        \
    \"receivers\":[\"user1\",\"user2\"]                        \
  }"                                \
  http://localhost:18080/admin/message/recall_multicast

{
  "code":0,
  "msg":"success"
}
```

## 删除广播消息(仅专业版支持)
删除之前发送的广播消息。

#### 地址
```
http://domain:18080/admin/message/delete_broadcast
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| operator | string | 是 | 操作者ID |
| messageUid | long | 是 | 消息唯一ID |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"operator\":\"admin\",\"messageUid\":5323423532}" http://localhost:18080/admin/message/delete_broadcast

{
  "code":0,
  "msg":"success"
}
```

## 删除组播消息
删除之前发送的组播消息，可以为部分接收者删除。

#### 地址
```
http://domain:18080/admin/message/delete_multicast
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| operator | string | 是 | 操作者ID |
| messageUid | long | 是 | 消息唯一ID |
| receivers | string[] | 是 | 接收者ID列表 |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"operator\":\"admin\",       \
    \"messageUid\":5323423532,                        \
    \"receivers\":[\"user1\",\"user2\"]                        \
  }"                                \
  http://localhost:18080/admin/message/delete_multicast

{
  "code":0,
  "msg":"success"
}
```

## 获取会话已读时间戳
获取指定用户对指定会话的已读时间戳。

#### 地址
```
http://domain:18080/admin/message/conv_read
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| type | int | 是 | 会话类型 |
| target | string | 是 | 会话目标 |
| line | int | 是 | 会话线路 |

#### 响应

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| timestamp | long | 是 | 已读时间戳 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"userId\":\"user1\",       \
    \"type\":1,                        \
    \"target\":\"user2\",                        \
    \"line\":0                        \
  }"                                \
  http://localhost:18080/admin/message/conv_read

{
  "code":0,
  "msg":"success",
  "result":{
    "timestamp":13123423234324
  }
}
```

## 获取消息投递状态
获取指定用户的消息投递时间戳。

#### 地址
```
http://domain:18080/admin/message/delivery
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |

#### 响应

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| timestamp | long | 是 | 投递时间戳 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"userId\":\"user1\"}" http://localhost:18080/admin/message/delivery

{
  "code":0,
  "msg":"success",
  "result":{
    "timestamp":13123423234324
  }
}
```
