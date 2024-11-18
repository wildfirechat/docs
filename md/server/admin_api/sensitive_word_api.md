# 敏感词
野火IM内置有敏感词过滤功能，对文本消息的内容进行过滤。

## 添加敏感词
#### 地址
```
http://domain:18080/admin/sensitive/add
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| words | list<string> | 是 | 敏感词数组 |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"words\":[\"a\",\"b\",\"c\"]}" http://localhost:18080/admin/sensitive/add

{
  "code":0,
  "msg":"success"
}
```

## 删除敏感词
#### 地址
```
http://domain:18080/admin/sensitive/del
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| words | list<string> | 是 | 敏感词数组 |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"words\":[\"a\",\"b\",\"c\"]}" http://localhost:18080/admin/sensitive/del

{
  "code":0,
  "msg":"success"
}
```

## 获取敏感词列表
#### 地址
```
http://domain:18080/admin/sensitive/query
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| words | list<string> | 是 | 敏感词数组 |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json"  http://localhost:18080/admin/sensitive/query

{
  "code":0,
  "msg":"success"
  "result": {
    "words":[\"a\",\"b\",\"c"]
  }
}
```

## 独立敏感词过滤服务
内置敏感词过滤功能只能对文本消息进行敏感词匹配。如果您有高级需求，比如对图片消息/语音消息或其它消息进行过滤。就需要独立的敏感词过滤服务了。这时有两种方法可以处理：
1. 配置敏感词服务器，在IM服务的配置文件```wildfirechat.conf```中，配置如下内容
```
## 消息内容审查服务。
sensitive.remote_server_url http://192.168.3.202:8888/message/censor
## 需要进行审查的消息类型
sensitive.remote_sensitive_message_type 1,2,3
## 是否进行等待审核之后才返回客户端
sensitive.remote_fail_when_matched false
```
注意处理延时，当```remote_fail_when_matched```为true时，如果延时过长会导致客户端发送失败。

2. 使用消息[转发功能](../event_callback.md#接收消息回调)，把需要过滤类型的消息转发过去，异步处理，如果命中敏感词，再调用[撤回](./message_api.md#撤回消息)方法对消息进行撤回。
