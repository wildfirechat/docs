# 服务器的维护工作
任何资源都是有限的，服务器需要定时清理来释放不用的资源。
#### 日志的清理
在```config```目录下的```wildfirechat-log.properties```是日志配置文件，默认的配置是最多有5个日志循环备份，最大为10M。日志文件最多占用50M的空间，如果需要更多的日志，需要改动日志配置。

#### 数据库的清理
消息是按照月份存储在36个message表只中，分别为```t_message_${month}```，可以按照月份来删除消息。集群版使用mongodb保存消息，可以不删除消息，给用户更好的体验。

#### 媒体文件的清理
媒体文件如果使用七牛，可以定时清理媒体消息内容的bucket，而头像和收藏等bucket要注意保留。

使用自带的对象存储服务器，受限于inode的节点数，一定要注意不能接近inode的节点数，使用```df -i```命令查看。文件存储在fs目录下，目录为${type}/${year}/${month}/${day}/${hour}/${uuid}。其中type分别表示如下类型
```
    Media_Type_GENERAL = 0,
    Media_Type_IMAGE = 1,
    Media_Type_VOICE = 2,
    Media_Type_VIDEO = 3,
    Media_Type_File = 4,
    Media_Type_PORTRAIT = 5,
    Media_Type_FAVORITE = 6
```
头像和收藏等bucket要注意保留。
