# 通用API
## 注册/更新机器人
机器人是一种特殊的用户角色，跟普通用户在用一个空间中，需要避免机器人用户id跟普通用户id冲突的可能。使用Server API来创建机器人，然后机器人服务使用robot api来发送消息。
#### 地址
```
http://domain:18080/admin/robot/create
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 否 | 用户ID，如果传空，系统会自动生成一个用户id |
| name | string | 是 | 登陆名 |
| displayName | string | 是 | 显示名字 |
| portrait | string | 否 | 用户头像 |
| mobile | string | 否 | 用户手机号码 |
| email | string | 否 | 用户邮箱 |
| address | string | 否 | 用户地址 |
| company | string | 否 | 用户公司 |
| extra | string | 否 | 附加信息 |
| owner | string | 是 | 机器人拥有者 |
| secret | string | 否 | 机器人密钥 |
| callback | string | 否 | 机器人消息回掉地址 |
| robotExtra | string | 否 | 机器人附加信息 |


#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 机器人用户ID |
| secret | string | 是 | 机器人密钥 |
> 如果创建时不填写secret，会自动生成一个

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"name\":\"a\",\"displayName\":\"A\",\"callback\":\"http://localhost/robot\",\"owner\":\"b\"}" http://localhost:18080/admin/robot/create

{
  "code":0,
  "msg":"success",
  "result":{
    "userId":"a",
    "secret":"xxxxx"
  }
}
```

## 创建/更新频道
频道是一种一对多的关系，类似于微信公众号，使用server api创建完频道后，可以使用channel api进行对接业务系统。

#### 地址
```
http://domain:18080/admin/channel/create
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| owner | string | 是 | 频道拥有者 |
| name | string | 是 | 频道名称 |
| targetId | string | 否 | 频道ID，如果传空，系统会自动生成一个用户id |
| callback | string | 否 | 频道消息回调地址 |
| portrait | string | 否 | 频道头像 |
| auto | int | 否 | 0，owner会接收到消息，如果配置callback同时会转发消息；1，owner不会接收消息，如果配置callback会转发消息到callback |
| desc | string | 否 | 描述信息 |
| state | int | 否 | [频道权限](../../base_knowledge/channel.md##频道状态) |
| secret | string | 否 | 频道密钥，如果为空系统会自动生成 |
| extra | string | 否 | 附加信息 |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| targetId | string | 是 | 频道ID |
| secret | string | 是 | 频道密钥 |
> 如果创建时不填写secret，会自动生成一个

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"name\":\"a\",\"callback\":\"http://localhost/admin\",\"owner\":\"b\"}" http://localhost:18080/admin/channel/create

{
  "code":0,
  "msg":"success",
  "result":{
    "targetId":"a",
    "secret":"xxxxx"
  }
}
```
