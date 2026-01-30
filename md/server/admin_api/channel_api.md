# 频道

本文讲述频道相关的接口。频道是一种特殊类型的会话，类似于群组和聊天室，但更适合用于一对多的内容分发场景。我们提供有Java版本的[SDK](../sdk.md)，建议使用Java语言的客户使用这个SDK，其它语言可以按照本文档对接。

## 创建频道
#### 地址
```
http://domain:18080/admin/channel/create
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| owner | string | 是 | 频道拥有者用户ID |
| name | string | 是 | 频道名称 |
| portrait | string | 否 | 频道头像 |
| desc | string | 否 | 频道描述 |
| callback | string | 否 | 频道回调地址 |
| secret | string | 否 | 频道密钥 |
| auto | int | 否 | 是否自动加入，0否，1是 |
| state | int | 否 | 频道状态 |
| extra | string | 否 | 附加信息 |
| menus | Object[] | 否 | 频道菜单列表 |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| targetId | string | 是 | 频道ID |
| secret | string | 是 | 频道密钥 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"owner\":\"user1\",       \
    \"name\":\"官方频道\",                 \
    \"portrait\":\"http://example.com/portrait.jpg\",    \
    \"desc\":\"这是官方频道\",    \
    \"auto\":0    \
  }"                                \
  http://localhost:18080/admin/channel/create

{
  "code":0,
  "msg":"success",
  "result":{
    "targetId":"channel1",
    "secret":"secret123"
  }
}
```

## 销毁频道
#### 地址
```
http://domain:18080/admin/channel/destroy
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| channelId | string | 是 | 频道ID |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"channelId\":\"channel1\"}" http://localhost:18080/admin/channel/destroy

{
  "code":0,
  "msg":"success"
}
```

## 获取频道信息
#### 地址
```
http://domain:18080/admin/channel/get_info
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| channelId | string | 是 | 频道ID |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| channelId | string | 是 | 频道ID |
| name | string | 是 | 频道名称 |
| portrait | string | 否 | 频道头像 |
| desc | string | 否 | 频道描述 |
| extra | string | 否 | 附加信息 |
| owner | string | 是 | 频道拥有者 |
| state | int | 是 | 频道状态 |
| status | int | 是 | 状态 |
| updateDt | long | 是 | 更新时间 |
| callback | string | 否 | 回调地址 |
| automatic | int | 是 | 是否自动加入 |
| secret | string | 否 | 频道密钥 |
| menus | Object[] | 否 | 频道菜单列表 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"channelId\":\"channel1\"}" http://localhost:18080/admin/channel/get_info

{
  "code":0,
  "msg":"success",
  "result":{
    "channelId":"channel1",
    "name":"官方频道",
    "owner":"user1",
    "state":0
  }
}
```

## 订阅频道
让指定用户订阅频道。

#### 地址
```
http://domain:18080/admin/channel/subscribe
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| channelId | string | 是 | 频道ID |
| userId | string | 是 | 用户ID |
| state | int | 是 | 订阅状态，1订阅，0取消订阅 |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"channelId\":\"channel1\",       \
    \"userId\":\"user1\",                 \
    \"state\":1    \
  }"                                \
  http://localhost:18080/admin/channel/subscribe

{
  "code":0,
  "msg":"success"
}
```

## 取消订阅频道
让指定用户取消订阅频道。

#### 地址
```
http://domain:18080/admin/channel/subscribe
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| channelId | string | 是 | 频道ID |
| userId | string | 是 | 用户ID |
| state | int | 是 | 订阅状态，1订阅，0取消订阅 |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"channelId\":\"channel1\",       \
    \"userId\":\"user1\",                 \
    \"state\":0    \
  }"                                \
  http://localhost:18080/admin/channel/subscribe

{
  "code":0,
  "msg":"success"
}
```

## 检查用户是否订阅频道
检查指定用户是否订阅了频道。

#### 地址
```
http://domain:18080/admin/channel/is_subscribed
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| channelId | string | 是 | 频道ID |
| userId | string | 是 | 用户ID |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| value | bool | 是 | 是否已订阅 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"channelId\":\"channel1\",       \
    \"userId\":\"user1\"    \
  }"                                \
  http://localhost:18080/admin/channel/is_subscribed

{
  "code":0,
  "msg":"success",
  "result":{
    "value":true
  }
}
```
