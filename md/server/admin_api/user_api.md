# 用户

## 获取用户token
#### 地址
```
http://domain/admin/user/get_token
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| clientId | string | 是 | 客户端ID |
> clientId为客户端ID，客户端SDK有获取clientId的接口

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| imToken | string | 是 | 用户token |

#### 示例
```
curl -X POST -H "nonce:14723" -H "timestamp":"1539698981861" -H "sign":"9e9f98672f466a81e6dd61570689528cf38e6418" -H "Content-Type:application/json" -d "{\"userId\":\"a\",\"clientId\":\"xxxxx\"}" http://localhost/admin/user/get_token

{
  "code":0,
  "msg":"success",
  "result":{
    "userId":"a",
    "imToken":"hN0AF2XX6+pOWqMS7iQiZnCFfGA53r1r"
  }
}
```

## 注册/更新用户
#### 地址
```
http://domain/admin/user/create
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 否 | 用户ID，如果传空，系统会自动生成一个用户id |
| name | string | 是 | 登陆名 |
| password | string | 否 | 用户密码，可以为空，如果为空，用户不可以在野火IM服务器登陆 |
| displayName | string | 是 | 显示名字 |
| portrait | string | 否 | 用户头像 |
| mobile | string | 否 | 用户手机号码 |
| email | string | 否 | 用户邮箱 |
| address | string | 否 | 用户地址 |
| company | string | 否 | 用户公司 |
| extra | string | 否 | 附加信息 |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |

#### 示例
```
curl -X POST -H "nonce:14723" -H "timestamp":"1539698981861" -H "sign":"9e9f98672f466a81e6dd61570689528cf38e6418" -H "Content-Type:application/json" -d "{\"name\":\"a\",\"displayName\":\"A\",\"password\":\"123456\"}" http://localhost/admin/user/create

{
  "code":0,
  "msg":"success",
  "result":{
    "userId":"a",
  }
}
```
## 获取用户信息
#### 地址
```
http://domain/admin/user/get_info
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 否 | 用户ID |
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
curl -X POST -H "nonce:14723" -H "timestamp":"1539698981861" -H "sign":"9e9f98672f466a81e6dd61570689528cf38e6418" -H "Content-Type:application/json" -d "{\"userId\":\"a\"}" http://localhost/admin/user/get_info

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
http://domain/admin/user/update_block_status
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
curl -X POST -H "nonce:14723" -H "timestamp":"1539698981861" -H "sign":"9e9f98672f466a81e6dd61570689528cf38e6418" -H "Content-Type:application/json" -d "{\"userId\":\"a\", \"status\":1}" http://localhost/admin/user/update_block_status

{
  "code":0,
  "msg":"success"
}
```

## 查询用户状态
#### 地址
```
http://domain/admin/user/check_block_status
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
curl -X POST -H "nonce:14723" -H "timestamp":"1539698981861" -H "sign":"9e9f98672f466a81e6dd61570689528cf38e6418" -H "Content-Type:application/json" -d "{\"userId\":\"a\"}" http://localhost/admin/user/check_block_status

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
http://domain/admin/user/get_blocked_list
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
curl -X POST -H "nonce:14723" -H "timestamp":"1539698981861" -H "sign":"9e9f98672f466a81e6dd61570689528cf38e6418" -H "Content-Type:application/json" -d "{\"userId\":\"a\"}" http://localhost/admin/user/get_blocked_list

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
http://domain/admin/user/onlinestatus
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| status | int | 是 | 0 online, 1 have session offline, 2 no session |

#### 示例
```
curl -X POST -H "nonce:14723" -H "timestamp":"1539698981861" -H "sign":"9e9f98672f466a81e6dd61570689528cf38e6418" -H "Content-Type:application/json" -d "{\"userId\":\"a\"}" http://localhost/admin/user/onlinestatus

{
  "code":0,
  "msg":"success",
  "result":{
    "status":0
  }
}
```
