# 群组

## 创建群组
#### 地址
```
http://domain:18080/admin/group/create
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| operator | string | 是 | 操作者用户ID |
| group | [json](./models.md##Group) | 是 | 群参数，建议不填写群ID，由系统自动生成 |
| line | int | 否 | 会话线路，默认为0 |
| payload | [json](./models.md##MessagePayload) | 否 | 消息负载，如果不填写，系统会发出内置通知消息，如果填写，覆盖系统通知消息 |


#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| group_id | string | 是 | 群组ID |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"operator\":\"a\",       \
    \"group\":{                 \
        \"group_info\":{              \
		       \"name\": \"老王的朋友们\",     \
		       \"owner\": \"laowang\",      \
	         \"type\": 3                  \
	      },                              \
	      \"members\": [                  \
          {                              \
		         \"member_id\": \"groupId1\",  \
		         \"name\": \"老王的朋友们\",       \
		         \"owner\": \"laowang\"        \
	        }                            \
        ]                            \
      }                             \
    }"                                \
  http://localhost:18080/admin/group/create

{
  "code":0,
  "msg":"success",
  "result":{
    "group_id":"groupId1"
  }
}
```

## 销毁群组
#### 地址
```
http://domain:18080/admin/group/del
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| operator | string | 是 | 操作者用户ID |
| group_id | string | 是 | 群组ID |
| line | int | 否 | 会话线路，默认为0 |
| payload | [json](./models.md##MessagePayload) | 否 | 消息负载，如果不填写，系统会发出内置通知消息，如果填写，覆盖系统通知消息 |


#### 响应
无

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"operator\":\"a\",       \
    \"group_id\":\"groupId1\"    \
    }"                                \
  http://localhost:18080/admin/group/del

{
  "code":0,
  "msg":"success"
}
```

## 获取群组信息
#### 地址
```
http://domain:18080/admin/group/get_info
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| groupId | string | 是 | 群组ID，参数是驼峰式的，为了兼容旧的SDK保持现状吧 |


#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| GroupInfo | [json](./models.md##GroupInfo) | 是 | 群资料 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"groupId\":\"groupId1\"    \
    }"                                \
  http://localhost:18080/admin/group/get_info

{
  "code":0,
  "msg":"success"
}
```

## 转移群组
#### 地址
```
http://domain:18080/admin/group/transfer
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| operator | string | 是 | 操作者用户ID |
| group_id | string | 是 | 群组ID |
| new_owner | string | 是 | 新群主用户ID |
| line | int | 否 | 会话线路，默认为0 |
| payload | [json](./models.md##MessagePayload) | 否 | 消息负载，如果不填写，系统会发出内置通知消息，如果填写，覆盖系统通知消息 |


#### 响应
无

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"operator\":\"a\",       \
    \"group_id\":\"groupId1\",    \
    \"new_owner\":\"newOwner\",    \
    }"                                \
  http://localhost:18080/admin/group/transfer

{
  "code":0,
  "msg":"success"
}
```
