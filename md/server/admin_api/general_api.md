# 通用API
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
| state | int | 否 | [频道权限](../../base_knowledge/channel.md#频道属性) |
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

## 创建/更新机器人
[创建/更新机器人](./user_api.md#注册/更新机器人)

## 设置用户设置
仅专业版IM服务支持此接口，用户设置相关知识请参考[基础知识-用户设置](../../base_knowledge/user_setting.md)。使用此接口时需要慎重。

#### 地址
```
http://domain:18080/admin/user/put_setting
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| scope | int | 是 | 设置类型 |
| key | string | 否 | 设置的Key值 |
| value | string | 否 | 设置的Value |


#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"userId\":\"a\",\"scope\":1001,\"key\":\"b\",\"value\":\"c\"}" http://localhost:18080/admin/user/put_setting

{
  "code":0,
  "msg":"success",
  "result":{
  }
}
```

## 获取用户设置
仅专业版IM服务支持此接口，用户设置相关知识请参考[基础知识-用户设置](../../base_knowledge/user_setting.md)

#### 地址
```
http://domain:18080/admin/user/get_setting
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| scope | int | 是 | 设置类型 |
| key | string | 否 | 设置的Key值 |


#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |
| scope | int | 是 | 设置类型 |
| key | string | 否 | 设置的Key值 |
| value | string | 否 | 设置的Value |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"userId\":\"a\",\"scope\":1001,\"key\":\"b\",\"value\":\"c\"}" http://localhost:18080/admin/user/get_setting

{
  "code":0,
  "msg":"success",
  "result":{
    \"userId\":\"a\",
    \"scope\":1001,
    \"key\":\"b\",
    \"value\":\"c\"
  }
}
```
