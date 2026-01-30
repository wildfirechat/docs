# 聊天室


## 创建/更新聊天室
#### 地址
```
http://domain:18080/admin/chatroom/create
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| chatroomId | string | 否 | 聊天室ID，如果传空，系统会自动生成一个 |
| title | string | 是 | 聊天室名称 |
| desc | string | 否 | 聊天室的详情描述 |
| portrait | string | 否 | 聊天室的头像 |
| extra | string | 否 | 附加信息，可用来扩展字段，建议用json |
| state | int | 否 | 聊天室状态，请使用0 |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| chatroomId | string | 是 | 聊天室ID |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"title\":\"火热聊天室\"}" http://localhost:18080/admin/chatroom/create

{
  "code":0,
  "msg":"success",
  "result":{
    "chatroomId":"aaaa",
  }
}
```

## 获取聊天室信息
#### 地址
```
http://domain:18080/admin/chatroom/info
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| chatroomId | string | 是 | 聊天室ID |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| chatroomId | string | 否 | 聊天室ID，如果传空，系统会自动生成一个 |
| title | string | 是 | 聊天室名称 |
| desc | string | 否 | 聊天室的详情描述 |
| portrait | string | 否 | 聊天室的头像 |
| extra | string | 否 | 附加信息，可用来扩展字段，建议用json |
| memberCount | int | 否 | 当前用户数 |
| createDt | long | 否 | 创建的时间戳 |
| updateDt | long | 否 | 更新的时间戳 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"chatroomId\":\"aaaa\"}" http://localhost:18080/admin/chatroom/info

{
  "code":0,
  "msg":"success",
  "result":{
    "chatroomId":"aaaa",
    "title":"火热聊天室",
    "memberCount":100,
    "createDt":xxxx,
    "updateDt":xxxx
  }
}
```

## 销毁聊天室
#### 地址
```
http://domain:18080/admin/chatroom/del
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| chatroomId | string | 是 | 聊天室ID |

#### 响应
无

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"chatroomId\":\"aaaa\"}" http://localhost:18080/admin/chatroom/del

{
  "code":0,
  "msg":"success"
}
```

## 设置/取消聊天室黑名单
仅专业版支持
#### 地址
```
http://domain:18080/admin/chatroom/set_black_status
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| chatroomId | string | 是 | 聊天室ID |
| userId | string | 是 | 目标用户Id |
| status | int | 是 | 0，取消拉黑；1，禁言；2，禁止进入 |
| expiredTime | long | 否 | 当拉黑或禁止进入时，过期的时间戳，0为不限时。 |

#### 响应
无

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"chatroomId\":\"aaaa\",\"userId\":\"usea\",\"status\":1}" http://localhost:18080/admin/chatroom/set_black_status

{
  "code":0,
  "msg":"success"
}
```

## 获取聊天室黑名单
仅专业版支持
#### 地址
```
http://domain:18080/admin/chatroom/get_black_status
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| chatroomId | string | 是 | 聊天室ID |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| infos | ChatroomBlackInfo[] | 是 | 拉黑用户信息列表 |


ChatroomBlackInfo

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 目标用户Id |
| state | int | 是 | 0，取消拉黑；1，禁言；2，禁止进入 |
| expiredTime | long | 否 | 当拉黑或禁止进入时，过期的时间戳，0为不限时 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"chatroomId\":\"aaaa\"}" http://localhost:18080/admin/chatroom/get_black_status

{
  "code":0,
  "msg":"success",
  "result":{
    infos:[
      {"userId":"user1","state":1,expiredTime:0},
      {"userId":"user2","state":2,expiredTime:365400}
    ]
  }

}
```

## 设置/取消聊天室管理员
仅专业版支持
#### 地址
```
http://domain:18080/admin/chatroom/set_manager
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| chatroomId | string | 是 | 聊天室ID |
| userId | string | 是 | 目标用户Id |
| status | int | 是 | 0，取消管理员；1，设置管理员 |

#### 响应
无

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"chatroomId\":\"aaaa\",\"userId\":\"usea\",\"status\":1}" http://localhost:18080/admin/chatroom/set_manager

{
  "code":0,
  "msg":"success"
}
```

## 获取聊天室黑名单
仅专业版支持
#### 地址
```
http://domain:18080/admin/chatroom/get_manager_list
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| chatroomId | string | 是 | 聊天室ID |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| list | String[] | 是 | 管理员用户ID列表 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"chatroomId\":\"aaaa\"}" http://localhost:18080/admin/chatroom/get_manager_list

{
  "code":0,
  "msg":"success",
  "result":{
    list:["user1"，"user2"]
  }
}
```

## 设置/取消聊天室全员禁言
仅专业版支持
#### 地址
```
http://domain:18080/admin/chatroom/mute_all
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| chatroomId | string | 是 | 聊天室ID |
| status | int | 是 | 0，取消全员禁言；1，设置全员禁言 |

#### 响应
无

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"chatroomId\":\"aaaa\",\"status\":1}" http://localhost:18080/admin/chatroom/mute_all

{
  "code":0,
  "msg":"success"
}
```

## 获取聊天室成员列表
获取指定聊天室的成员列表。

#### 地址
```
http://domain:18080/admin/chatroom/members
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| chatroomId | string | 是 | 聊天室ID |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| list | string[] | 是 | 成员用户ID列表 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"chatroomId\":\"aaaa\"}" http://localhost:18080/admin/chatroom/members

{
  "code":0,
  "msg":"success",
  "result":{
    "list":["user1","user2","user3"]
  }
}
```

## 获取用户的聊天室
获取指定用户所在的聊天室信息。

#### 地址
```
http://domain:18080/admin/chatroom/user_chatroom
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| chatroomId | string | 否 | 聊天室ID |
| title | string | 是 | 聊天室名称 |
| desc | string | 否 | 聊天室的详情描述 |
| portrait | string | 否 | 聊天室的头像 |
| extra | string | 否 | 附加信息 |
| memberCount | int | 否 | 当前用户数 |
| createDt | long | 否 | 创建的时间戳 |
| updateDt | long | 否 | 更新的时间戳 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"userId\":\"user1\"}" http://localhost:18080/admin/chatroom/user_chatroom

{
  "code":0,
  "msg":"success",
  "result":{
    "chatroomId":"aaaa",
    "title":"火热聊天室",
    "memberCount":100
  }
}
```
