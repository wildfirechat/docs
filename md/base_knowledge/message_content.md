# 消息内容
消息内容(Message Content)是消息中最重要的部分，在网络传输中，消息内容会转化为消息负载(Message Payload)，接收到消息负载后会转化为消息内容。消息内容有一个共同的抽象基类MessageContent。各种消息类型都派生与此基类。此外客户也可以自定义消息内容，继承基类，然后调用sdk的注册消息函数即可（注意必须在连接之前注册）。

Android：
```
public abstract class MessageContent implements Parcelable {
    public abstract MessagePayload encode();
    public abstract void decode(MessagePayload payload);
    public abstract String digest();

    public int getType() {
        ContentTag tag = getClass().getAnnotation(ContentTag.class);
        if(tag != null) {
            return tag.type();
        }
        return -1;
    }

    public PersistFlag getPersistFlag() {
        ContentTag tag = getClass().getAnnotation(ContentTag.class);
        if(tag != null) {
            return tag.flag();
        }
        return PersistFlag.No_Persist;
    }
}
```
iOS：
```
@protocol WFCCMessageContent <NSObject>

/**
 消息编码

 @return 消息的持久化内容
 */
- (WFCCMessagePayload *)encode;

/**
 消息解码

 @param payload 消息的持久化内容
 */
- (void)decode:(WFCCMessagePayload *)payload;

/**
 消息类型，必须全局唯一。1000及以下为系统内置类型，自定义消息需要使用1000以上。

 @return 消息类型的唯一值
 */
+ (int)getContentType;

/**
 消息的存储策略

 @return 存储策略
 */
+ (int)getContentFlags;

/**
 消息的简短信息

 @return 消息的简短信息，主要用于通知提示和会话列表等需要简略信息的地方。
 */
- (NSString *)digest;

@end
```
