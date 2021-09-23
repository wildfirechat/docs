# 用户

## 获取用户token
#### 地址
```
http://domain:18080/admin/user/get_token
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| clientId | string | 是 | 客户端ID |
| platform | int | 是 | 平台类型iOS 1, Android 2, Windows 3, OSX 4, WEB 5, 小程序 6，linux 7 |
> clientId为客户端ID，客户端SDK有获取clientId的接口。
> platform为客户端类型标识，必须正确填写，否则connect的时候，会失败或者多端互踢等功能失效。


#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| token | string | 是 | 用户token |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"userId\":\"a\",\"clientId\":\"xxxxx\",\"platform\":1}" http://localhost:18080/admin/user/get_token

{
  "code":0,
  "msg":"success",
  "result":{
    "userId":"a",
    "token":"hN0AF2XX6+pOWqMS7iQiZnCFfGA53r1r"
  }
}
```

## 注册/更新用户
#### 地址
```
http://domain:18080/admin/user/create
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 否 | 用户ID，如果传空，系统会自动生成一个用户id。***必须保证唯一性。*** |
| name | string | 是 | 帐号名，***必须保证唯一性。*** |
| displayName | string | 是 | 显示名字 |
| portrait | string | 否 | 用户头像 |
| mobile | string | 否 | 用户手机号码 |
| email | string | 否 | 用户邮箱 |
| address | string | 否 | 用户地址 |
| company | string | 否 | 用户公司 |
| extra | string | 否 | 附加信息 |

> userId是用户在系统中的唯一ID，会一直保持不变，一般是对用户不可见的。name是用户的可见账户ID，可以是登录名，特殊情况下可以修改，但要保持唯一性。以微信为例，微信号就是我们的“name”，可以看见，可以用来登录使用，可以查找用户，也可以修改；另外微信还给每个用户分配一个UUID，这个是不可见的，也会是一直保持不变的，这个就对应我们的”userId“。

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"name\":\"a\",\"displayName\":\"A\",\"password\":\"123456\"}" http://localhost:18080/admin/user/create

{
  "code":0,
  "msg":"success",
  "result":{
    "userId":"a",
  }
}
```

## 更新用户
#### 地址
```
http://domain:18080/admin/user/update
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| flag | int | 是 | 更新用户信息的字段信息，第0bit位为1时更新userInfo中的昵称信息，第1位更新头像，第2位更新性别，第3更新电话，第4位更新email，第5位更新地址，第6位更新公司，第7位更新社交信息，第8位更新extra信息，第9位更新name信息。比如更新用户头像和昵称，flag应该位 0x03 |
| userInfo | [json](./models.md##UserInfo) | 是 | 要更新的用户信息，与创建用户参数一致，注意必须带有userId参数，其它带上flag指定修改的字段 |


#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"flag\":1, \"userInfo\":{\"userId\":\"user1\",\"displayName\":\"A\"}}" http://localhost:18080/admin/user/update

{
  "code":0,
  "msg":"success"
}
```
> 创建用户接口和更新用户接口都可以更新用户信息，区别是创建用户接口会覆盖原有信息，更新接口只更新flag指定的字段。更新接口在社区版0.55版本才支持。

## 获取用户信息
#### 地址
```
http://domain:18080/admin/user/get_info
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
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"userId\":\"a\"}" http://localhost:18080/admin/user/get_info

{
  "code":0,
  "msg":"success",
  "result":{
    "userId":"a",
    "name":"usera"
  }
}
```

## 更新用户状态
封禁/禁言用户
#### 地址
```
http://domain:18080/admin/user/update_block_status
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| status | int | 是 | 用户状态，0 正常；1 被禁言，2 被封禁 |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"userId\":\"a\", \"status\":1}" http://localhost:18080/admin/user/update_block_status

{
  "code":0,
  "msg":"success"
}
```

## 查询用户状态
#### 地址
```
http://domain:18080/admin/user/check_block_status
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| status | int | 是 | 用户状态，0 正常；1 被禁言，2 被封禁 |


#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"userId\":\"a\"}" http://localhost:18080/admin/user/check_block_status

{
  "code":0,
  "msg":"success",
  "result":{
    "status":0
  }
}
```
## 获取封禁/禁言用户列表
#### 地址
```
http://domain:18080/admin/user/get_blocked_list
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| imToken | string | 是 | 用户token |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"userId\":\"a\"}" http://localhost:18080/admin/user/get_blocked_list

{
  "code":0,
  "msg":"success",
  "result":[
    {
      "userId":"a",
      "status":1,
    },
    {
      "userId":"b",
      "status":2,
    },
    {
      "userId":"c",
      "status":3,
    },
  ]
}
```

## 获取用户在线状态
#### 地址
```
http://domain:18080/admin/user/onlinestatus
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| sessions | json list | 是 | 所有端的连接情况 |

#### session
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| clientId | string | 是 | 客户端ID |
| userId | string | 是 | User Id |
| platform | int | 是 | platform |
| status | int | 是 | 0 online, 1 have session offline |
| lastSeen | long | 是 | 最后一次可见时间 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"userId\":\"a\"}" http://localhost:18080/admin/user/onlinestatus

{
  "code":0,
  "msg":"success",
  "result":[{
    "clientId":"clientidxxx",
    "userId":"useridxxx",
    "platform":0,
    "status":0,
    "lastSeen":1392312342
  }]
}
```
