# Channel API接口
Channel API是供频道服务器调用的。所有的请求都是POST请求，请求body使用json格式。所有接口的调用都必须经过签名。所有的响应数据都是JSON格式。***端口使用80端口，不同于Sever API的端口(默认18080)***。

我们提供有Java版本的[SDK](../sdk.md)，建议使用Java语言的客户使用这个SDK，其它语言可以按照本文档对接。

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

## 频道属性
频道是可以开放给第三方使用的，因此有着严格的权限要求。频道的到的权限定义请参考[频道属性](../../base_knowledge/channel.md#频道属性)。

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
| payload | [json](../admin_api/models.md#MessagePayload) | 是 | 消息负载 |


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
  http://localhost/channel/channel/send

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
| name | string | 否（三个参数必须且只能存在一个）  | 登录名 |
| mobile | string | 否（三个参数必须且只能存在一个）  | 用户手机号码 |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID  |
| name | string | 是 | 登录名 |
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
| state | int | 是 | [频道属性](../../base_knowledge/channel#频道信息) |
| automatic | string | 否 | 消息是否发给owner，0 发送；1 不发送 |

频道信息
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

## 查询所有订阅者ID
#### 地址
```
http://domain/channel/subscriber_list
```
#### body
无

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| list | list<string> | 是 | 订阅用户ID列表 |

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

## 验证用户
此方法是用于开放平台应用验证用户身份的，详情请参考[开放平台](../../open/README.md).
#### 地址
```
http://domain/channel/application/get_user_info
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| authCode | string | 是  | 验证码（前端页面通过jssdk调用im sdk获取得到） |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| displayName | string | 否(如果存在用户信息则一定存在) | 用户昵称 |
| portraitUrl | string | 否(如果存在用户信息则一定存在) | 用户头像 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "cid":"channelId1" -d "{\"authCode\":\"auth_code\"}" http://localhost/channel/application/get_user_info

{
  "code":0,
  "msg":"success"
  "result":{
    "userId":"userid1",
    "dispalyName":"name1",
    "portraitUrl":"url"
  }
}
```

## config签名
此方法是用于签名当前应用，应用前端页面调用jssdc来认证应用，详情请参考[开放平台](../../open/README.md).

#### 签名方法
此功能不涉及与IM服务交互，在本地按照规则签名，然后再经JSSDK调用IMSDK，最终在IM服务使用同样的规则验证。

签名的计算方法： ```sign = sha1(nonce + "|" + channelId + "|" + timestamp + "|" + channelSecret)```。其中channelSecret为频道的密钥。客户端调用jssdk的config方法的参数appid、apptype、timestamp、signature分别对应channelId、1、签名的时间戳、签名。
