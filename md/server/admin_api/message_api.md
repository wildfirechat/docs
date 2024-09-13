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
  http://localhost:18080/admin/message/broadcast

{
  "code":0,
  "msg":"success"
}
```
