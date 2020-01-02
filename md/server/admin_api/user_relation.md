# 用户关系

## 设置用户关系
#### 地址
```
http://domain:18080/admin/friend/status
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID|
| friendUid | string | 是 | 对方ID |
| status | int | 是 | 双方关系，0为好友，1为陌生人，2拉黑 |


#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"userId\":\"a\",\"friendUid\":\"b\",\"status\":0}" http://localhost/admin/friend/status

{
  "code":0,
  "msg":"success",
}
```
> 设置为好友，取消好友关系，拉黑都使用这个方法，区别是```status```的不同值。设置为好友和取消好友是双向关系。拉黑是单向

#### 获取用户关系列表
#### 地址
```
http://domain:18080/admin/friend/list
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID|
| status | int | 是 | 获取关系类型，0为好友，2黑名单 |


#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"userId\":\"a\",\"status\":0}" http://localhost/admin/friend/status

{
  "code":0,
  "msg":"success",
  "result":[
    "b"
  ]
}
```
