# 媒体服务
野火IM的消息分为普通消息和媒体消息。媒体消息一般比较大，发送时需要先上传媒体文件到媒体服务器，得到一个url地址，然后再把包含这个url地址的消息发出去。野火IM同时支持内置媒体服务器和七牛媒体服务器。客户端不用修改。

#### 使用内置媒体服务器。
修改如下配置，```media.server.use_qiniu```配置为0，这样所有媒体文件都将上传到fs目录，按照日期和类型存放。
```
media.server.use_qiniu 0
local.media.storage.root ../fs
```
> 内置文件服务器不是一个商业化的媒体服务器，有很大的限制。受限于linux的inode数，文件不能太多，需要定时清理，另外媒体文件提交较大，没有cdn加速下载会很慢，强烈建议客户在正式商用时使用七牛媒体服务器。

#### 七牛服务器
去七牛官网申请存储服务，修改如下配置，```media.server.use_qiniu```配置为1，填写```access_key```和```secret_key```，```server_url```为上传地址，跟您选择的区有关，请选择正确的地址。然后为不同类型的媒体文件创建不同的bucket，并配置正确。主要要区分长期保存的bucket和会清理的bucket。另外bucket的权限要选择公开，这样接收方可以使用url来访问资源。
```
media.server.use_qiniu 1
qiniu.server_url  http://up.qbox.me
qiniu.access_key tU3vdBK5BL5j4N7jI5N5uZgq_HQDo170w5C9Amnn
qiniu.secret_key YfQIJdgp5YGhwEw14vGpaD2HJZsuJldWtqens7i5

qiniu.bucket_general_name media
qiniu.bucket_general_domain http://pghnpyzos.bkt.clouddn.com
qiniu.bucket_image_name media
qiniu.bucket_image_domain http://pghnpyzos.bkt.clouddn.com
qiniu.bucket_voice_name media
qiniu.bucket_voice_domain http://pghnpyzos.bkt.clouddn.com
qiniu.bucket_video_name media
qiniu.bucket_video_domain http://pghnpyzos.bkt.clouddn.com
qiniu.bucket_file_name media
qiniu.bucket_file_domain http://pghnpyzos.bkt.clouddn.com
qiniu.bucket_portrait_name media
qiniu.bucket_portrait_domain http://pghnpyzos.bkt.clouddn.com
qiniu.bucket_favorite_name media
qiniu.bucket_favorite_domain http://pghnpyzos.bkt.clouddn.com
```
> 一定要使用不同的bucket，至少要区分长期保存和短期保存。头像/收藏等需要长期保存，其它根据情况可能会定期清除。
> bucket公开的安全性问题不是很大，每个文件上传会生成一长串随机数名字，基本不可能穷举到的。如果要选择私有，需要在客户端进行处理，对链接的访问加上七牛的鉴权信息，具体信息请查阅七牛的技术文档。

#### 使用其它服务器
上述两种服务服务器的url中都带有32位的uuid，基本上不会被穷举。但生成的url没有访问控制，传输过程中也没有加密，因此如果客户需要传输非常敏感的媒体文件，请在客户端上传文件到自己的应用服务器，然后再调用sdk发送消息。
