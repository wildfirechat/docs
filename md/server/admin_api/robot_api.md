# 机器人API
机器人是一种特殊的用户角色，跟普通用户在用一个空间中，需要避免机器人用户id跟普通用户id冲突的可能。使用Server API来创建机器人，然后机器人服务使用robot api来发送消息。

## 注册/更新机器人
#### 地址
```
http://domain/admin/robot/create
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
curl -X POST -H "nonce:14723" -H "timestamp":"1539698981861" -H "sign":"9e9f98672f466a81e6dd61570689528cf38e6418" -H "Content-Type:application/json" -d "{\"name\":\"a\",\"displayName\":\"A\",\"callback\":\"http://localhost/robot\",\"owner\":\"b\"}" http://localhost/admin/robot/create

{
  "code":0,
  "msg":"success",
  "result":{
    "userId":"a",
    "secret":"xxxxx"
  }
}
```
