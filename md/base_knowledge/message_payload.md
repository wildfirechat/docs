# 消息负载
消息内容需要在网络上传输或本地存储，而消息内容是复杂多变的。因此消息发送过程中先encode为消息负载；消息接收后由消息负载decode为对应的消息内容。在数据库从存取也是如此。

```
public class MessagePayload {

    public int contentType;
    public String searchableContent;
    public String pushContent;
    public String content;
    public byte[] binaryContent;

    public int mentionedType;
    public List<String> mentionedTargets;


    public MessageContentMediaType mediaType;
    public String remoteMediaUrl;


    //前面的属性都会在网络发送，下面的属性只在本地存储
    public String localMediaPath;

    //前面的属性都会在网络发送，下面的属性只在本地存储
    public String localContent;
}
```

#### contentType
消息内容类型，根据该类型decode成对应的消息内容

#### searchableContent
可搜索内容，用于本地搜索或者在服务器搜索

#### pushContent
对于自定义消息，如果需要推送需要encode此字段。推送内容会使用此字段。

#### mentionedType
提醒类型。0 不提醒；1 对mentionedTargets里的user进行提醒；2 对群内所有人提醒。

#### mediaType
媒体类型，媒体消息内容使用，用来区别在服务器端文件对应的bucket。

#### local****
本地使用内容，不会在网络发送。比如媒体文件下载下来需要记录路径，或者本地处理过需要标记一些内容等。
