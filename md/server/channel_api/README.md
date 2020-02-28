# Channel API接口
Channel API是供频道服务器调用的。所有的请求都是POST请求，请求body使用json格式。所有接口的调用都必须经过签名。所有的响应数据都是JSON格式。***端口使用```http_port```端口（80端口），不同于Sever API的端口(默认18080)***

## 签名规则
以下参数需要放在Http Request Header中

| 参数| 参数说明 |
| ---- | ------|
| nonce | 随机数 |
| timestamp | 当前的时间戳，为了防止重放攻击，时间戳与野火IM服务器时间戳差2个小时的请求会被拒绝 |
| sign | 签名 |
| cid | 频道id |

> 签名的计算方法： ```sign = sha1(nonce + "|" + SECRET_KEY + "|" + timestamp)```。其中SECRET_KEY为频道密钥。

## Content-Type
```
"Content-Type": "application/json; charset=utf-8"
```

## 响应
所有响应都是如下这个格式。成功时code为0，result为请求返回对于的数据；失败时code为错误码，msg为失败提示。
```
{
  "code":0,
  "msg":"success",
  "result":{
    "userId":"a"
  }
}
```

## 发送消息
#### 地址
```
http://domain/channel/message/send
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| line | int | 否 | 会话线路，默认为0 |
| targets | list<string> | 否 | 指定发送对象，如果为空，将广播所有关注者。如果不为空将发送给指定对象，注意如果目标用户不在关注者列表中将被抛弃 |
| payload | [json](../admin_api/models.md##MessagePayload) | 是 | 消息负载 |


#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| messageUid | long | 是 | 消息唯一ID |
| timestamp | long | 是 | 服务器处理时间 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "cid":"channelId1" -d   \
  "{                       \
    \"payload\":{                 \
      \"type\":1,                       \
      \"searchableContent\":\"hello\"   \
    }                                   \
  }"                                \
  http://localhost/robot/channel/send

{
  "code":0,
  "msg":"success",
  "result":{
    "messageUid":5323423532,
    "timestamp":13123423234324,
  }
}
```
## 获取用户信息
#### 地址
```
http://domain/channel/user_info
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 否（三个参数必须且只能存在一个） | 用户ID |
| name | string | 否（三个参数必须且只能存在一个）  | 登陆名 |
| mobile | string | 否（三个参数必须且只能存在一个）  | 用户手机号码 |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID  |
| name | string | 是 | 登陆名 |
| displayName | string | 是 | 显示名字 |
| portrait | string | 否 | 用户头像 |
| mobile | string | 否 | 用户手机号码 |
| email | string | 否 | 用户邮箱 |
| address | string | 否 | 用户地址 |
| company | string | 否 | 用户公司 |
| extra | string | 否 | 附加信息 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "cid":"channelId1" -d "{\"userId\":\"a\"}" http://localhost/channel/user_info

{
  "code":0,
  "msg":"success",
  "result":{
    "userId":"a",
    "name":"usera"
  }
}
```
## 获取频道信息
#### 地址
```
http://domain/channel/get_profile
```
#### body
无

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| channelId | string | 是 | 频道ID  |
| name | string | 是 | 频道名称 |
| desc | string | 是 | 频道描述 |
| portrait | string | 否 | 频道头像 |
| extra | string | 否 | 频道附加信息 |
| owner | string | 否 | 频道的拥有者 |
| updateDt | string | 否 | 频道更新日期 |
| callback | string | 否 | 频道回调地址 |
| state | int | 是 | [频道状态](../../base_knowledge/channel##频道状态) |
| automatic | string | 否 | 消息是否发给owner，0 发送；1 不发送 |

频道状态
#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "cid":"channelId1"  http://localhost/channel/get_profile

{
  "code":0,
  "msg":"success",
  "result":{
    "channelId":"channela",
    "name":"channela"
  }
}
```

## 修改频道组信息
#### 地址
```
http://domain/channel/update_profile
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| type | int | 是 | 修改资料类型 |
| value | string | 是  | 值 |

Value在不同的type下具有不同的意义。boolean值转化为"0"和"1", int类型转化为字符串，比如“1”/”2“/“3”。

| type | type含义 | value类型 | value含义 |
| ------ | ------ | --- | ------ |
| 0 | 频道名 | string | 频道名称 |
| 1 | 频道头像 | string | 频道头像链接地址 |
| 2 | 频道描述 | string | 频道描述 |
| 3 | 频道extra | string | 频道附加信息 |
| 4 | 频道密钥 | string | 频道密钥 |
| 5 | 频道回调地址 | string | 频道回调地址 |
| 6 | 频道仅回调 | bool | 频道的消息只回调给频道服务，不推送给频道的owner |

#### 响应
无

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "cid":"channelId1" -d "{\"type\":0,\"value\":\"野火官方频道\"}" http://localhost/channel/update_profile

{
  "code":0,
  "msg":"success"
}
```

## 订阅/取消订阅频道
#### 地址
```
http://domain/channel/subscribe
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| target | string | 是 | 目标用户 |
| subscribe | int | 是  | 1 订阅；0 取消订阅 |

#### 响应
无

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "cid":"channelId1" -d "{\"type\":0,\"value\":\"野火官方频道\"}" http://localhost/channel/subscribe

{
  "code":0,
  "msg":"success"
}
```

## 订阅/取消订阅频道
#### 地址
```
http://domain/channel/subscriber_list
```
#### body
无

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| list | list<string> | 是 | 订阅用户列表 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "cid":"channelId1" " http://localhost/channel/subscriber_list

{
  "code":0,
  "msg":"success",
  "result":{
    "list":["a","b"]
  }
}
```
