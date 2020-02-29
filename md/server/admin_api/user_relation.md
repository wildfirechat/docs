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
| status | int | 是 | 双方关系，0为取消黑名单，1为设置为黑名单 |


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
N/A

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
