# 用户关系

## 设置用户好友关系
设置为好友和取消好友是双向关系

#### 地址
```
http://domain:18080/admin/friend/status
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID|
| friendUid | string | 是 | 对方ID |
| status | int | 是 | 双方关系，0为好友，1为陌生人 |
> 好友关系与黑名单关系是分开的，如果处理黑名单请用黑名单接口

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"userId\":\"a\",\"friendUid\":\"b\",\"status\":0}" http://localhost:18080/admin/friend/status

{
  "code":0,
  "msg":"success",
}
```
#### 获取好友列表
#### 地址
```
http://domain:18080/admin/friend/list
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID|


#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"userId\":\"a\"}" http://localhost:18080/admin/friend/status

{
  "code":0,
  "msg":"success",
  "result":[
    "b"
  ]
}
```

## 设置黑名单
设置为黑名单是单向关系

#### 地址
```
http://domain:18080/admin/blacklist/status
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID|
| targetUid | string | 是 | 对方ID |
| status | int | 是 | 双方关系，1为取消黑名单，2为设置为黑名单 |


#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"userId\":\"a\",\"targetUid\":\"b\",\"status\":1}" http://localhost:18080/admin/blacklist/status

{
  "code":0,
  "msg":"success",
}
```
#### 获取黑名单列表
#### 地址
```
http://domain:18080/admin/blacklist/list
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID|


#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"userId\":\"a\"}" http://localhost:18080/admin/blacklist/status

{
  "code":0,
  "msg":"success",
  "result":[
    "b"
  ]
}
```

## 设置备注
设置某个用户对另外一个用户的备注名，比如用户A设置用户B的备注名为“领导”

#### 地址
```
http://domain:18080/admin/friend/set_alias
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| operator | string | 是 | 用户ID|
| targetId | string | 是 | 对方ID |
| alias | string | 否 | 备注名 |


#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"operator\":\"a\",\"targetId\":\"b\",\"alias\":\"Mr.Hello\"}" http://localhost:18080/admin/friend/set_alias

{
  "code":0,
  "msg":"success"
}
```

#### 获取备注
#### 地址
```
http://domain:18080/admin/friend/get_alias
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| operator | string | 是 | 用户ID|
| targetId | string | 是 | 用户ID|


#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| operator | string | 是 | 操作者 |
| targetId | string | 是 | 目标用户 |
| alias | string | 是 | 备注 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"operator\":\"a\",\"targetId\":\"a\"}" http://localhost:18080/admin/friend/get_alias

{
  "code":0,
  "msg":"success",
  "result":{
      "operator":"a",
      "targetId":"b",
      "alias":"Mr.Hello"
  }
}
```

## 设置好友附加信息
设置某个用户对另外一个用户的附加信息，用于扩展各种业务能力

#### 地址
```
http://domain:18080/admin/friend/set_extra
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| operator | string | 是 | 用户ID|
| targetId | string | 是 | 对方ID |
| extra | string | 否 | 附加信息 |


#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"operator\":\"a\",\"targetId\":\"b\",\"extra\":\"{jsonstring}\"}" http://localhost:18080/admin/friend/set_extra

{
  "code":0,
  "msg":"success"
}
```

## 发送好友请求
#### 地址
```
http://domain:18080/admin/friend/send_request
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID|
| friendUid | string | 是 | 对方ID |
| reason | string | 是 | 附加信息 |
| force | bool | 否 | 是否强制，false时会作为普通用户发出请求，可能受限与请求次数、请求间隔、拉黑等操作。true突破所有的限制 |


#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"userId\":\"a\",\"friendUid\":\"b\",\"reason\":\"hello\",\"force\":true}" http://localhost:18080/admin/friend/send_request

{
  "code":0,
  "msg":"success"
}
```

#### 获取两个用户之间的所有关系
#### 地址
```
http://domain:18080/admin/relation/get
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| first | string | 是 | 用户ID |
| second | string | 是 | 目标用户 |


#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 操作者 |
| targetId | string | 是 | 目标用户 |
| alias | string | 否 | 备注 |
| extra | string | 否 | 附加信息 |
| isFriend | bool | 否 | 是否是好友 |
| isBlacked | bool | 否 | 是否是拉黑 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"operator\":\"a\",\"targetId\":\"a\"}" http://localhost:18080/admin/relation/get

{
  "code":0,
  "msg":"success",
  "result":{
      "userId":"a",
      "targetId":"b",
      "alias":"Mr.Hello",
      "isFriend":true
  }
}
```
