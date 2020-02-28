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
