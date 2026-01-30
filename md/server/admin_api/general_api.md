# 通用API

## 创建/更新机器人
[创建/更新机器人](./user_api.md#注册/更新机器人)

## 设置用户设置
仅专业版IM服务支持此接口，用户设置相关知识请参考[基础知识-用户设置](../../base_knowledge/user_setting.md)。使用此接口时需要慎重。

#### 地址
```
http://domain:18080/admin/user/put_setting
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| scope | int | 是 | 设置类型 |
| key | string | 否 | 设置的Key值 |
| value | string | 否 | 设置的Value |


#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"userId\":\"a\",\"scope\":1001,\"key\":\"b\",\"value\":\"c\"}" http://localhost:18080/admin/user/put_setting

{
  "code":0,
  "msg":"success",
  "result":{
  }
}
```

## 获取用户设置
仅专业版IM服务支持此接口，用户设置相关知识请参考[基础知识-用户设置](../../base_knowledge/user_setting.md)

#### 地址
```
http://domain:18080/admin/user/get_setting
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| scope | int | 是 | 设置类型 |
| key | string | 否 | 设置的Key值 |


#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| scope | int | 是 | 设置类型 |
| key | string | 否 | 设置的Key值 |
| value | string | 否 | 设置的Value |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"userId\":\"a\",\"scope\":1001,\"key\":\"b\",\"value\":\"c\"}" http://localhost:18080/admin/user/get_setting

{
  "code":0,
  "msg":"success",
  "result":{
    \"userId\":\"a\",
    \"scope\":1001,
    \"key\":\"b\",
    \"value\":\"c\"
  }
}
```

## 获取系统设置
获取系统级别的设置信息。

#### 地址
```
http://domain:18080/admin/get_setting
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| id | int | 是 | 设置ID |

#### 响应

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| id | int | 是 | 设置ID |
| value | string | 是 | 设置值 |
| desc | string | 否 | 设置描述 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"id\":1}" http://localhost:18080/admin/get_setting

{
  "code":0,
  "msg":"success",
  "result":{
    "id":1,
    "value":"setting_value",
    "desc":"setting description"
  }
}
```

## 设置系统设置
设置系统级别的配置信息。

#### 地址
```
http://domain:18080/admin/modify_setting
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| id | int | 是 | 设置ID |
| value | string | 是 | 设置值 |
| desc | string | 否 | 设置描述 |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"id\":1,\"value\":\"new_value\",\"desc\":\"description\"}" http://localhost:18080/admin/modify_setting

{
  "code":0,
  "msg":"success"
}
```

## 获取会话文件列表(仅专业版支持)
获取指定会话中的文件消息列表。

#### 地址
```
http://domain:18080/admin/file/conversation_files
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| conversation | [json](./models.md#Conversation) | 是 | 会话 |
| count | int | 是 | 每页数量 |
| fromTime | long | 否 | 起始时间（时间戳，毫秒） |
| order | int | 否 | 排序方式，0倒序，1正序 |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| result | Object[] | 是 | 文件消息列表 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"userId\":\"user1\",       \
    \"conversation\":{              \
      \"type\":1,            \
      \"target\":\"user2\",      \
      \"line\":0           \
    },                        \
    \"count\":10,                        \
    \"order\":0                        \
  }"                                \
  http://localhost:18080/admin/file/conversation_files

{
  "code":0,
  "msg":"success",
  "result":[...]
}
```

## 获取用户文件列表(仅专业版支持)
获取指定用户的所有文件消息列表。

#### 地址
```
http://domain:18080/admin/file/user_files
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| offset | int | 是 | 偏移量 |
| desc | bool | 否 | 是否倒序 |
| count | int | 是 | 每页数量 |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| result | Object[] | 是 | 文件消息列表 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"userId\":\"user1\",       \
    \"offset\":0,                        \
    \"desc\":true,                        \
    \"count\":10                        \
  }"                                \
  http://localhost:18080/admin/file/user_files

{
  "code":0,
  "msg":"success",
  "result":[...]
}
```

## 获取文件信息(仅专业版支持)
根据消息UID获取文件详细信息。

#### 地址
```
http://domain:18080/admin/file/get
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| messageUid | long | 是 | 消息UID |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| messageUid | long | 是 | 消息UID |
| filename | string | 是 | 文件名 |
| url | string | 是 | 文件URL |
| size | long | 是 | 文件大小 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"messageUid\":123456}" http://localhost:18080/admin/file/get

{
  "code":0,
  "msg":"success",
  "result":{
    "messageUid":123456,
    "filename":"document.pdf",
    "url":"http://example.com/files/document.pdf",
    "size":102400
  }
}
```

## 设置会话置顶
为用户设置会话置顶状态。

#### 地址
```
http://domain:18080/admin/conversation/top
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| conversation | [json](./models.md#Conversation) | 是 | 会话 |
| top | int | 是 | 是否置顶，1置顶，0取消置顶 |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"userId\":\"user1\",       \
    \"conversation\":{              \
      \"type\":1,            \
      \"target\":\"user2\",      \
      \"line\":0           \
    },                        \
    \"top\":1                        \
  }"                                \
  http://localhost:18080/admin/conversation/top

{
  "code":0,
  "msg":"success"
}
```

## 获取会话置顶状态
获取用户对指定会话的置顶状态。

#### 地址
```
http://domain:18080/admin/conversation/is_top
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| conversation | [json](./models.md#Conversation) | 是 | 会话 |

#### 响应

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| value | bool | 是 | 是否置顶 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"userId\":\"user1\",       \
    \"conversation\":{              \
      \"type\":1,            \
      \"target\":\"user2\",      \
      \"line\":0           \
    }                        \
  }"                                \
  http://localhost:18080/admin/conversation/is_top

{
  "code":0,
  "msg":"success",
  "result":{
    "value":true
  }
}
```

## 健康检查
检查IM服务的健康状态。

#### 地址
```
http://domain:18080/admin/healthcheck
```
#### body
N/A

#### 响应

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| status | string | 是 | 服务状态 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" http://localhost:18080/admin/healthcheck

{
  "code":0,
  "msg":"success",
  "result":{
    "status":"healthy"
  }
}
```

## 获取客户信息
获取当前客户（管理员）的信息。

#### 地址
```
http://domain:18080/admin/customer
```
#### body
N/A

#### 响应

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| customerId | string | 是 | 客户ID |
| customerName | string | 是 | 客户名称 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" http://localhost:18080/admin/customer

{
  "code":0,
  "msg":"success",
  "result":{
    "customerId":"customer1",
    "customerName":"测试客户"
  }
}
```
