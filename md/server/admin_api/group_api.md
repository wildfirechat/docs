# 群组
群组的所有写操作都有可选```line```和```payload```参数。因为写操作会触发通知消息，如果系统默认通知消息不符合您的需求，可以使用这两个参数来自定义通知消息，详情请参考[常见问题](../../faq/gneral.md##15. 我不想收到某人退出群组消息该怎么处理？（让某些消息不显示该怎么处理？）)

## 自定义群通知
所有的写操作都会触发群通知。群通知有两个作用，一个是用来告知用户状态改变；另外一个作用是触发客户端协议栈从服务器更新群信息。协议栈需要解析群通知内容来决定是否更新本地群信息，所以当需要自定义群通知时，一定要确保通知消息的内容和格式和消息类型保持不变，可以扩展jsoin的内容，或者使用extra，否则就会出现群信息更新不及时的问题。

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
| to_lines | int[] | 否 | 会话线路，默认为0 |
| notify_message | [json](./models.md##MessagePayload) | 否 | 消息负载，如果不填写，系统会发出内置通知消息，如果填写，覆盖系统通知消息 |


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
		         \"member_id\": \"memberId1\",  \
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
| to_lines | int[] | 否 | 会话线路，默认为0 |
| notify_message | [json](./models.md##MessagePayload) | 否 | 消息负载，如果不填写，系统会发出内置通知消息，如果填写，覆盖系统通知消息 |


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
  "msg":"success",
  "result":{
    "target_id":"groupId1",
    "name":"老王的朋友们",
    "owner":"laowang",
    "type":3
  }
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
| to_lines | int[] | 否 | 会话线路，默认为0 |
| notify_message | [json](./models.md##MessagePayload) | 否 | 消息负载，如果不填写，系统会发出内置通知消息，如果填写，覆盖系统通知消息 |


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

## 修改群组信息
#### 地址
```
http://domain:18080/admin/group/modify
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| operator | string | 是 | 操作者用户ID |
| group_id | string | 是 | 群组ID |
| type | int | 是 | 修改资料类型, 0 群名, 1 群头像, 2 群extra, 3 群全局禁言, 4 群加入方式, 5 禁止私聊 |
| value | string | 是 | 修改资料的值，**请仔细阅读后面针对value字段的说明** |
| new_owner | string | 是 | 新群主用户ID |
| to_lines | int[] | 否 | 会话线路，默认为0 |
| notify_message | [json](./models.md##MessagePayload) | 否 | 消息负载，如果不填写，系统会发出内置通知消息，如果填写，覆盖系统通知消息 |

value在不同的type下具有不同的意义。boolean值转化为"0"和"1", int类型转化为字符串，比如“1”/”2“/“3”。

| type | type含义 | value类型 | value含义 |
| ------ | ------ | --- | ------ |
| 0 | 群名 | string | 群名称 |
| 1 | 群头像 | string | 群头像链接地址 |
| 2 | 群extra | string | 群附加信息，系统不会发默认群通知，如果需要群通知，请自定义新的群通知，然后发送时带上对应消息payload |
| 3 | 群全局禁言 | boolean | 0 取消禁言；1全局禁言 |
| 4 | 群加入方式 | int | 0 所有人都可以加入；1 仅群成员邀请加入；2仅群管理员或群主邀请加入。更复杂控制，请应用服务进行二次开发 |
| 5 | 禁止私聊 | boolean | 0 允许私聊；1 禁止群成员私聊 |


#### 响应
无

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"operator\":\"a\",       \
    \"group_id\":\"groupId1\",    \
    \"type\":3,    \
    \"value\":\"1\"    \
    }"                                \
  http://localhost:18080/admin/group/modify

{
  "code":0,
  "msg":"success"
}
```

## 获取群组成员列表
#### 地址
```
http://domain:18080/admin/group/member/list
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| groupId | string | 是 | 群组ID，参数是驼峰式的，为了兼容旧的SDK保持现状吧 |


#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| GroupMember | list<[json](./models.md##GroupMember)> | 是 | 群成员 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"groupId\":\"groupId1\"    \
    }"                                \
  http://localhost:18080/admin/group/member/list

{
  "code":0,
  "msg":"success",
  "result":[{
    "member_id":"groupMember1",
    "alias":"laoda",
    "type":2
  },
  {
    "member_id":"groupMember1",
    "type":0
  }
  ]
}
```

## 添加群组成员
#### 地址
```
http://domain:18080/admin/group/member/add
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| operator | string | 是 | 操作者用户ID |
| group_id | string | 是 | 群组ID |
| members | list<[json](./models.md##GroupMember)> | 是 | 群成员，成员类型只能为0/1 |
| to_lines | int[] | 否 | 会话线路，默认为0 |
| notify_message | [json](./models.md##MessagePayload) | 否 | 消息负载，如果不填写，系统会发出内置通知消息，如果填写，覆盖系统通知消息 |


#### 响应
无

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"operator\":\"a\",       \
    \"group_id\":\"groupId1\",    \
    \"members\": [                  \
        {                              \
          \"member_id\": \"memberId1\",  \
          \"name\": \"老王的朋友们\",       \
          \"owner\": \"laowang\"        \
        }                            \
      ]                            \
    }"                                \
  http://localhost:18080/admin/group/member/add

{
  "code":0,
  "msg":"success"
}
```

## 移除群组成员
#### 地址
```
http://domain:18080/admin/group/member/del
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| operator | string | 是 | 操作者用户ID |
| group_id | string | 是 | 群组ID |
| members | list<string> | 是 | 群成员id，不能包含群主。 |
| to_lines | int[] | 否 | 会话线路，默认为0 |
| notify_message | [json](./models.md##MessagePayload) | 否 | 消息负载，如果不填写，系统会发出内置通知消息，如果填写，覆盖系统通知消息 |


#### 响应
无

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"operator\":\"a\",       \
    \"group_id\":\"groupId1\",    \
    \"members\": [                  \
        \"memberId1\",  \
        \"memberId2\"  \
      ]                            \
    }"                                \
  http://localhost:18080/admin/group/member/del

{
  "code":0,
  "msg":"success"
}
```

## 群组成员退出
#### 地址
```
http://domain:18080/admin/group/member/quit
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| operator | string | 是 | 退群用户ID |
| group_id | string | 是 | 群组ID |
| to_lines | int[] | 否 | 会话线路，默认为0 |
| notify_message | [json](./models.md##MessagePayload) | 否 | 消息负载，如果不填写，系统会发出内置通知消息，如果填写，覆盖系统通知消息 |


#### 响应
无

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"operator\":\"a\",       \
    \"group_id\":\"groupId1\"    \
    }"                                \
  http://localhost:18080/admin/group/member/quit

{
  "code":0,
  "msg":"success"
}
```

## 设置/修改群组成员昵称
#### 地址
```
http://domain:18080/admin/group/member/set_alias
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| operator | string | 是 | 操作者用户ID |
| group_id | string | 是 | 群组ID |
| memberId | string | 是 | 群组成员用户ID |
| alias | string | 否 | 群昵称 |
| to_lines | int[] | 否 | 会话线路，默认为0 |
| notify_message | [json](./models.md##MessagePayload) | 否 | 消息负载，如果不填写，系统会发出内置通知消息，如果填写，覆盖系统通知消息 |


#### 响应
无

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"operator\":\"a\",       \
    \"group_id\":\"groupId1\",    \
    \"memberId\":\"memberId1\",   \
    \"alias\":\"hello\"   \
    }"                                \
  http://localhost:18080/admin/group/member/set_alias

{
  "code":0,
  "msg":"success"
}
```

## 设置/修改群组成员附加信息
#### 地址
```
http://domain:18080/admin/group/member/set_extra
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| operator | string | 是 | 操作者用户ID |
| group_id | string | 是 | 群组ID |
| memberId | string | 是 | 群组成员用户ID |
| extra | string | 否 | 群成员附加信息 |
| to_lines | int[] | 否 | 会话线路，默认为0 |
| notify_message | [json](./models.md##MessagePayload) | 否 | 消息负载，如果不填写，系统会发出内置通知消息，如果填写，覆盖系统通知消息 |


#### 响应
无

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"operator\":\"a\",       \
    \"group_id\":\"groupId1\",    \
    \"memberId\":\"memberId1\",   \
    \"extra\":\"hello extra\"   \
    }"                                \
  http://localhost:18080/admin/group/member/set_extra

{
  "code":0,
  "msg":"success"
}
```

## 设置/取消群管理员
#### 地址
```
http://domain:18080/admin/group/manager/set
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| operator | string | 是 | 操作者用户ID |
| group_id | string | 是 | 群组ID |
| members | list<string> | 是 | 群成员ID |
| is_manager | boolean | 是 | true 设置为群管理；false 取消群管理员。 |
| to_lines | int[] | 否 | 会话线路，默认为0 |
| notify_message | [json](./models.md##MessagePayload) | 否 | 消息负载，如果不填写，系统会发出内置通知消息，如果填写，覆盖系统通知消息 |


#### 响应
无

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"operator\":\"a\",       \
    \"group_id\":\"groupId1\",    \
    \"members\": [                  \
        \"memberId1\",  \
      ]                            \
    }"                                \
  http://localhost:18080/admin/group/manager/set

{
  "code":0,
  "msg":"success"
}
```

## 获取用户的群列表（不建议高频使用，以防止有性能问题）
#### 地址
```
http://domain:18080/admin/group/of_user
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID，参数是驼峰式的，为了兼容旧的SDK保持现状吧 |


#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| groupIds | list<string> | 是 | 群id列表 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"userId\":\"userId1\"    \
    }"                                \
  http://localhost:18080/admin/group/of_user

{
  "code":0,
  "msg":"success",
  "result":{
    "groupIds":["groupId1", "groupId2", "groupId3"]
  }
}
```
