# 消息
消息定义为```message```对象。消息与会话的关系是一对多，一条消息对应于一个会话，一个会话可以有多条消息。它具有如下属性：

#### messageId
消息ID，如果消息内容是存储类型的，messageId对应于本地数据库中的自增id，同一条消息在发送方和接收方都可能是不同的，甚至在多端的情况下也不能保证相同。如果消息内容是非存储的，messageId为0.

#### messageUid
消息唯一ID，由服务器分配的全局唯一ID。消息只有发送成功才会拥有唯一ID。

#### conversation
所属的会话

#### fromUser
发送者

#### direction
消息方向，是发送的还是接收的。

#### status
消息状态，分为如下值
    * Sending
    * Sent
    * Send_Failure
    * Mentioned
    * AllMentioned
    * Unread
    * Readed
    * Played

#### serverTime
消息在服务器处理的时间戳

#### content
消息的内容，消息内容可以是多种格式，比如图片/文本/语音/地理位置等。火信支持自定义消息内容类型，可以任意定义消息内容来服务您的业务需求。
