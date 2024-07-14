# 内置消息说明
在野火IM系统中内置消息和自定义消息没有什么区别，唯一的区别就是内置消息是野火团队预先定义好的，自定义消息是客户自主添加的。阅读本章节，需要先详细阅读和真正理解几个概念：[消息内容](../base_knowledge/message_content.md)、[消息负载](../base_knowledge/message_payload.md)和[自定义消息内容](../base_knowledge/custom_message_content.md)。

在服务器端，任何消息发送的格式都是[MessagePayload](https://gitee.com/wfchat/im-server/blob/wildfirechat/common/src/main/java/cn/wildfirechat/pojos/MessagePayload.java)。下面是各个消息与客户端消息的对应


## 文本消息
```json
{
  "type":1,
  "persistFlag":3,
  "searchableContent":"hello world",
}
```
json中类型为1，存储标志为3，searchableContent存放文本消息的内容。


如果文本消息@某人，mentionedType值为1，mentionedTarget为被@的对象。如果@所有人，mentionedType值为2。加上mention信息的json为：
```json
{
  "type":1,
  "persistFlag":3,
  "searchableContent":"hello world",
  "mentionedType":1,
  "mentionedTarget":["user1", "user2"]
}
```

如果文本消息引用某条消息，引用的json为：
```
{
  "quote":{
    "u":messageUid,
    "i":"userId",
    "n":"user nick name",
    "d":"message digest"  
  }
}
```
u为消息的uid，i为发送着的用户id，n为发送者的昵称，d为消息的摘要。此json字符串的字节做base64编码，放到base64edData字段中。加上引用内容的文本消息json为：
```json
{
  "type":1,
  "persistFlag":3,
  "searchableContent":"hello world",
  "mentionedType":1,
  "mentionedTarget":["user1", "user2"],
  "base64edData":"ewogICJxdW90ZSI6ewogICAgInUiOm1lc3NhZ2VVaWQsCiAgICAiaSI6InVzZXJJZCIsCiAgICAibiI6InVzZXIgbmljayBuYW1lIiwKICAgICJkIjoibWVzc2FnZSBkaWdlc3QiICAKICB9Cn0=",
}
```
