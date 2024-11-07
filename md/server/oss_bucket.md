# 对象存储桶
使用野火系统，各种媒体/资源文件是放到那个桶里的，这里简单介绍一下。下面是个典型的桶的配置
```
## bucket名字及Domain
media.bucket_general_name media
media.bucket_general_domain http://cdn.wildfirechat.cn
media.bucket_image_name media
media.bucket_image_domain http://cdn.wildfirechat.cn
media.bucket_voice_name media
media.bucket_voice_domain http://cdn.wildfirechat.cn
media.bucket_video_name media
media.bucket_video_domain http://cdn.wildfirechat.cn
media.bucket_file_name media
media.bucket_file_domain http://cdn.wildfirechat.cn
media.bucket_sticker_name media
media.bucket_sticker_domain http://cdn.wildfirechat.cn
media.bucket_moments_name media
media.bucket_moments_domain http://cdn.wildfirechat.cn
media.bucket_portrait_name storage
media.bucket_portrait_domain http://cdn2.wildfirechat.cn
media.bucket_favorite_name storage
media.bucket_favorite_domain http://cdn2.wildfirechat.cn
```
在上面的配置中，可以看到有9种类型桶配置。示例配置为了简单，只配置了2个桶。实际上可以为每个类型配置一个独立的桶，方便进行更精细的控制。建议为每个类型创建一个桶。

在客户端上传是有2个接口实现的，一个是```uploadMedia```，另外一个是发送媒体类消息。在```uploadMedia```方法，其中有个参数为 ```mediaType```，它的取值为：
```
enum MessageContentMediaType {
   GENERAL(0),
   IMAGE(1),
   VOICE(2),
   VIDEO(3),
   FILE(4),
   PORTRAIT(5),
   FAVORITE(6),
   STICKER(7),
   MOMENTS(8);
}
```
可以看到正好是9个值，跟IM服务配置里的桶是一一对应的。使用```uploadMedia```上传时，会根据这个参数上传到对应的桶中。比如```mediaType```为 0 时，文件会上传到 ```media.bucket_general_name``` 指定的桶中。

发送媒体类消息时，消息```encode```时会指定```mediaType```，预置的消息对应关系分别如下：
```
图片消息  -》 IMAGE(1)
语音消息  -》 VOICE(2)
视频消息  -》 VIDEO(3)
文件消息  -》 FILE(4)
表情消息  -》 STICKER(7)
```
如果要自定义媒体类消息，也需要指定```mediaType```，从而上传到这9个桶中的一个。

用户在修改头像时，会调用```uploadMedia```使用```PORTRAIT```作为```mediaType```，把头像放入到头像的桶中。朋友圈会上传文件会使用```MOMENTS```。

当一个用户收藏某个媒体类对象时，会调用应用服务的API，应用服务调用对象存储的SDK把文件从原来的桶拷贝到```FAVORITE```指定的桶中。
