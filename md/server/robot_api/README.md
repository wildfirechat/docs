# Robot API接口
Robot API是供机器人服务器调用的。所有的请求都是POST请求，请求body使用json格式。所有接口的调用都必须经过签名。所有的响应数据都是JSON格式。***端口使用80端口，不同于Sever API的端口(默认18080)***。

我们提供有Java版本的[SDK](../sdk.md)，建议使用Java语言的客户使用这个SDK，其它语言可以按照本文档对接。

## 签名规则
以下参数需要放在Http Request Header中

| 参数| 参数说明 |
| ---- | ------|
| nonce | 随机数 |
| timestamp | 当前的时间戳，为了防止重放攻击，时间戳与野火IM服务器时间戳差2个小时的请求会被拒绝 |
| sign | 签名 |
| rid | 机器人用户id |

> 签名的计算方法： ```sign = sha1(nonce + "|" + SECRET_KEY + "|" + timestamp)```。其中SECRET_KEY在创建机器人时指定。

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
http://domain/robot/message/send
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| conv | [json](../admin_api/models.md#Conversation) | 是 | 会话 |
| payload | [json](../admin_api/models.md#MessagePayload) | 是 | 消息负载 |


#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| messageUid | long | 是 | 消息唯一ID |
| timestamp | long | 是 | 服务器处理时间 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "rid":"robota" -d   \
  "{                       \
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
  http://localhost/robot/message/send

{
  "code":0,
  "msg":"success",
  "result":{
    "messageUid":5323423532,
    "timestamp":13123423234324,
  }
}
```

## 更新消息
#### 地址
```
http://domain/robot/message/update
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| messageUid | long | 是 | 消息唯一ID |
| payload | [json](./models.md#MessagePayload) | 是 | 消息负载 |
| distribute | int | 是 | 是否重新分发给用户，0不重新分发，1重新分发，建议用1 |

> 消息内容对应的json格式payload请参考[内置消息](../predefined_message_content.md)
> 机器人只有普通用户的权限，不是所有消息都可以更新。可以更新的消息类型在IM服务配置文件中的message.allow_client_update_types列表中。

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "rid":"robota" -d   \
  "{                       \
    \"messageUid\":5323423532,       \
    \"distribute\":1,            \
    \"payload\":{                 \
      \"type\":1,                       \
      \"searchableContent\":\"world\"   \
    }                                   \
  }"                                \
  http://domain/robot/message/update

{
  "code":0,
  "msg":"success"
}
```

## 撤回消息
#### 地址
```
http://domain/robot/message/recall
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| messageUid | long | 是 | 消息唯一ID |

> 机器人只有普通用户的权限，一般情况下只能撤回自己发送的消息，且时限在IM服务配置的允许撤回的时间内。在群组中，如果机器人是群主或者群管理员，可以根据群主或者群管理员的权限来撤回其他人的消息。

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "rid":"robota" -d "{\"operator\":\"a\",\"messageUid\":5323423532}" http://domain/robot/message/recall

{
  "code":0,
  "msg":"success",

}
```

## 获取用户信息
#### 地址
```
http://domain/robot/user_info
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
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "rid":"robota" -d "{\"userId\":\"a\"}" http://localhost/robot/user_info

{
  "code":0,
  "msg":"success",
  "result":{
    "userId":"a",
    "name":"usera"
  }
}
```

## 设置回调地址
#### 地址
```
http://domain/robot/set_callback
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| url | string | 否 | 当前机器人消息回调地址 |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "rid":"robota" -d "{\"url\":\"http:://localhost:8081/robot/message\"}" http://localhost/robot/set_callback

{
  "code":0,
  "msg":"success",
}
```

## 获取回调地址
#### 地址
```
http://domain/robot/get_callback
```
#### body
N/A

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| url | string | 否 | 当前机器人消息回调地址 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "rid":"robota"  http://localhost/robot/get_callback

{
  "code":0,
  "msg":"success",
  "result":{
    "url":"http:://localhost:8081/robot/message"
  }
}
```

## 删除回调地址
注意不能使用设置回调地址为空的方式删除回调地址，必须调用删除回调地址接口。
#### 地址
```
http://domain/robot/delete_callback
```
#### body
N/A

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "rid":"robota" http://localhost/robot/delete_callback

{
  "code":0,
  "msg":"success",
}
```

## 获取用户信息
#### 地址
```
http://localhost/robot/get_info
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
| userId | string | 是 | 用户ID |
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
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "rid":"robota" -d "{\"userId\":\"a\"}" http://localhost/robot/get_info

{
  "code":0,
  "msg":"success",
  "result":{
    "userId":"a",
    "name":"usera"
  }
}
```

## 更新自己的信息
#### 地址
```
http://localhost/robot/update_profile
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| type | int | 是 | 更新那个字段。0，昵称；1，头像；2，性别；4，邮箱；5，地址；6，公司；7，社交账户；8，附加信息。如果要更新电话号码，需要使用admin api更新机器人信息 |
| value | string | 是  | 字段的新值 |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "rid":"robota" -d "{\"type\":1,\"value\":\"awsome robot\"}" http://localhost/robot/update_profile

{
  "code":0,
  "msg":"success"
}
```
## 群操作
[机器人群操作](./group_api.md)


## 验证用户
此方法是用于开放平台应用验证用户身份的，详情请参考[开放平台](../../open/README.md).
#### 地址
```
http://domain/robot/application/get_user_info
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
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "rid":"robotId1" -d "{\"authCode\":\"auth_code\"}" http://localhost/robot/application/get_user_info

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

签名的计算方法： ```sign = sha1(nonce + "|" + robotId + "|" + timestamp + "|" + robotSecret)```。其中robotSecret为机器人的密钥。客户端调用jssdk的config方法的参数appid、apptype、timestamp、signature分别对应channelId、0、签名的时间戳、签名。
