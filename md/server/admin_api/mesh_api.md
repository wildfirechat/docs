# 网状网络管理 (Mesh)

本文讲述网状网络(Mesh)相关的接口。网状网络是一种分布式架构，允许多个独立域之间进行通信和数据同步。我们提供有Java版本的[SDK](../sdk.md)，建议使用Java语言的客户使用这个SDK，其它语言可以按照本文档对接。

## 域名管理

### 创建域名
创建一个新的网状网络域。

#### 地址
```
http://domain:18080/admin/domain/create
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| domainId | string | 否 | 域名ID，如果传空，系统会自动生成 |
| name | string | 是 | 域名名称 |
| desc | string | 否 | 域名描述 |
| extra | string | 否 | 附加信息 |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"name\":\"domain1\"}" http://localhost:18080/admin/domain/create

{
  "code":0,
  "msg":"success"
}
```

### 获取域名信息
获取指定域名的详细信息。

#### 地址
```
http://domain:18080/admin/domain/get
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| value | string | 是 | 域名ID |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| domainId | string | 是 | 域名ID |
| name | string | 是 | 域名名称 |
| desc | string | 否 | 域名描述 |
| extra | string | 否 | 附加信息 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"value\":\"domain1\"}" http://localhost:18080/admin/domain/get

{
  "code":0,
  "msg":"success",
  "result":{
    "domainId":"domain1",
    "name":"Domain 1"
  }
}
```

### 删除域名
删除指定的网状网络域。

#### 地址
```
http://domain:18080/admin/domain/destroy
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| value | string | 是 | 域名ID |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"value\":\"domain1\"}" http://localhost:18080/admin/domain/destroy

{
  "code":0,
  "msg":"success"
}
```

### 获取所有域名
获取系统中所有的域名列表。

#### 地址
```
http://domain:18080/admin/domain/list
```
#### body
N/A

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| result | Object[] | 是 | 域名信息列表 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" http://localhost:18080/admin/domain/list

{
  "code":0,
  "msg":"success",
  "result":[
    {
      "domainId":"domain1",
      "name":"Domain 1"
    }
  ]
}
```

### Ping域名
检查指定域名的连通状态。

#### 地址
```
http://domain:18080/admin/domain/ping
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| domainId | string | 是 | 域名ID |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| status | string | 是 | 域名状态 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"domainId\":\"domain1\"}" http://localhost:18080/admin/domain/ping

{
  "code":0,
  "msg":"success",
  "result":{
    "status":"online"
  }
}
```

## 用户管理

### 批量获取用户信息
根据用户ID列表批量获取用户信息。

#### 地址
```
http://domain:18080/admin/user/batch_get_infos
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| list | string[] | 是 | 用户ID列表 |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| result | Object[] | 是 | 用户信息列表 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"list\":[\"user1\",\"user2\"]}" http://localhost:18080/admin/user/batch_get_infos

{
  "code":0,
  "msg":"success",
  "result":[...]
}
```

### 搜索用户
根据关键词搜索用户。

#### 地址
```
http://domain:18080/admin/user/search_user
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| keyword | string | 是 | 搜索关键词 |
| searchType | int | 是 | 搜索类型 |
| userType | int | 是 | 用户类型 |
| page | int | 是 | 页码 |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| result | Object[] | 是 | 搜索结果列表 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"keyword\":\"test\",\"searchType\":0,\"userType\":0,\"page\":0}" http://localhost:18080/admin/user/search_user

{
  "code":0,
  "msg":"success",
  "result":[...]
}
```

## 关系管理

### 发送好友请求
向指定用户发送好友请求。

#### 地址
```
http://domain:18080/admin/friend/send_request
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 发送者用户ID |
| friendUid | string | 是 | 目标用户ID |
| reason | string | 否 | 申请理由 |
| force | bool | 否 | 是否强制添加 |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"userId\":\"user1\",\"friendUid\":\"user2\",\"reason\":\"加个好友\"}" http://localhost:18080/admin/friend/send_request

{
  "code":0,
  "msg":"success"
}
```

### 处理好友请求
接受或拒绝好友请求。

#### 地址
```
http://domain:18080/admin/friend/handle_send_request
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| friendUid | string | 是 | 好友用户ID |
| status | int | 是 | 处理状态，0拒绝，1接受 |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"userId\":\"user1\",\"friendUid\":\"user2\",\"status\":1}" http://localhost:18080/admin/friend/handle_send_request

{
  "code":0,
  "msg":"success"
}
```

## 消息管理

### 发送消息
在网状网络中发送消息。

#### 地址
```
http://domain:18080/admin/message/send
```
> 此接口复用普通消息发送接口，需要设置 `meshMessage=true`

#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| sender | string | 是 | 发送者ID |
| conv | [json](./models.md#Conversation) | 是 | 会话 |
| payload | [json](./models.md#MessagePayload) | 是 | 消息负载 |
| toUsers | string[] | 否 | 指定接收用户 |
| meshMessage | bool | 是 | 设置为true表示网状消息 |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| messageUid | long | 是 | 消息唯一ID |
| timestamp | long | 是 | 服务器处理时间 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"sender\":\"user1\",       \
    \"conv\": {              \
      \"type\":1,            \
      \"target\":\"user2\",      \
      \"line\":0           \
    },                        \
    \"payload\":{                 \
      \"type\":1,                       \
      \"searchableContent\":\"hello\"   \
    },                                   \
    \"meshMessage\":true                        \
  }"                                \
  http://localhost:18080/admin/message/send

{
  "code":0,
  "msg":"success",
  "result":{
    "messageUid":5323423532,
    "timestamp":13123423234324
  }
}
```

### 发布消息
向指定接收者发布消息。

#### 地址
```
http://domain:18080/admin/message/publish
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| messageData | Object | 是 | 消息数据 |
| receivers | string[] | 是 | 接收者ID列表 |
| messageId | long | 是 | 消息ID |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| messageUid | long | 是 | 消息唯一ID |
| timestamp | long | 是 | 服务器处理时间 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"messageData\":{...},                        \
    \"receivers\":[\"user1\",\"user2\"],                        \
    \"messageId\":123456                        \
  }"                                \
  http://localhost:18080/admin/message/publish

{
  "code":0,
  "msg":"success",
  "result":{
    "messageUid":5323423532,
    "timestamp":13123423234324
  }
}
```

## 群组管理

### 同步群组
将群组信息同步到网状网络。

#### 地址
```
http://domain:18080/admin/mesh/group_sync
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| group_info | [json](./models.md#GroupInfo) | 是 | 群组信息 |
| members | Object[] | 是 | 群成员列表 |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"group_info\":{...},                        \
    \"members\":[...]                        \
  }"                                \
  http://localhost:18080/admin/mesh/group_sync

{
  "code":0,
  "msg":"success"
}
```

> 以下群组接口复用普通群组API，需要设置 `meshMessage=true`：
> - 获取群组信息: `/admin/group/get_info`
> - 获取群组成员: `/admin/group/member/list`
> - 添加群成员: `/admin/group/member/add`
> - 批量获取群组: `/admin/group/batch_infos`
> - 退出群组: `/admin/group/member/quit`
> - 解散群组: `/admin/group/del`
> - 踢出群成员: `/admin/group/member/del`
> - 转让群组: `/admin/group/transfer`
> - 修改群组信息: `/admin/group/modify`

## 会议管理

### 用户会议请求
处理用户的会议请求。

#### 地址
```
http://domain:18080/admin/conference/user_request
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| clientID | string | 是 | 客户端ID |
| fromUser | string | 是 | 发起用户ID |
| request | string | 是 | 请求内容 |
| sessionId | long | 是 | 会话ID |
| roomId | string | 是 | 房间ID |
| data | string | 否 | 附加数据 |
| advanced | bool | 否 | 是否高级会议 |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| result | Object | 是 | 响应结果 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"clientID\":\"client1\",       \
    \"fromUser\":\"user1\",                        \
    \"request\":\"join\",                        \
    \"sessionId\":123456,                        \
    \"roomId\":\"room1\",                        \
    \"advanced\":false                        \
  }"                                \
  http://localhost:18080/admin/conference/user_request

{
  "code":0,
  "msg":"success",
  "result":{...}
}
```

### 用户会议事件
处理用户的会议事件。

#### 地址
```
http://domain:18080/admin/conference/user_event
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| data | string | 是 | 事件数据 |
| userId | string | 是 | 用户ID |
| clientId | string | 是 | 客户端ID |
| isRobot | bool | 否 | 是否机器人 |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"data\":\"event_data\",                        \
    \"userId\":\"user1\",                        \
    \"clientId\":\"client1\",                        \
    \"isRobot\":false                        \
  }"                                \
  http://localhost:18080/admin/conference/user_event

{
  "code":0,
  "msg":"success"
}
```
