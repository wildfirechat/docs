# 消息

## 发送消息
#### 地址
```
http://domain:18080/admin/message/send
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| sender | string | 是 | 发送者ID |
| conv | json | 是 | 会话 |
| conv.type | int | 是 | [会话类型](../../base_knowledge/conversation.md#####会话类型) |
| conv.target | string | 是 | 会话目标 |
| conv.line | int | 否 | 会话线路，缺省为0 |
| payload | json | 是 | 消息负载 |
| payload.type | int | 是 | [消息内容类型](../../base_knowledge/message_payload.md#####contentType) |
| payload.searchableContent | string | 否 | 消息可搜索内容 |
| payload.pushContent | string | 否 | 消息推送内容 |
| payload.content | string | 否 | 消息内容 |
| payload.base64edData | string | 否 | 消息二进制内容，base64编码 |
| payload.mediaType | int | 否 | 媒体消息类型 |
| payload.remoteMediaUrl | string | 否 | 媒体内容链接 |
| payload.expireDuration | long | 否 | 消息过期时间 |
| payload.mentionedType | int | 否 | 消息提醒类型 |
| payload.mentionedTarget | string list | 否 | 消息提醒对象列表 |


#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| messageUid | long | 是 | 消息唯一ID |
| timestamp | long | 是 | 服务器处理时间 |

##nonce = "76616", timestamp = "1558350862502", sign = "b98f9b0717f59febccf1440067a7f50d9b31bdde"
http.admin.no_check_time false
#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"sender\":\"a\",       \
    \"conv\": {              \
      \"type\":1,            \
      \"target\":\"a\",      \
      \"line\":0,           \
    },                        \
    \"payload\":{                 \
      \"type\":1,                       \
      \"searchableContent\":\"hello\"   \
    }                                   \
  }"                                \
  http://localhost:18080/admin/message/send

{
  "code":0,
  "msg":"success",
  "result":{
    "messageUid":5323423532,
    "timestamp":13123423234324,
  }
}
```
## 撤回消息
#### 地址
```
http://domain:18080/admin/message/recall
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| operator | string | 是 | 撤回者 |
| messageUid | long | 是 | 消息唯一ID |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"operator\":\"a\",\"messageUid\":5323423532}" http://localhost/admin/message/recall

{
  "code":0,
  "msg":"success",

}
```
