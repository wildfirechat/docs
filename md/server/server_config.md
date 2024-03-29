# 服务器配置

```config``` 目录下放有所有服务器的配置，部署时需要对配置进行修改，***本文只列出了常用配置，更多配置参考```config```目录下配置文件的注释，强烈讲义通读一下```wildfirechat.conf```中的各项配置***。此外还需要配置启动脚本```wildfirechat.sh```。

#### 服务器的地址
修改```wildfirechat.conf```文件，***把下面四个0替换成您的公网IP地址***（如果您在局域网内体验，请改成局域网内地址，不能使用127.0.0.1或localhost，上线时要根据[这里](../faq/server.md#Q_如何给IM服务器配置域名)改成域名），并且开通下面这3个端口的入访权限。注意80端口不能修改，不然无法使用！***如果您是要运行在linux服务器上，最好是在linux服务器上修改配置文件，遇见过部分客户在windows下改动引入了linux无法识别的字符，导致启动失败***

```
server.ip 0.0.0.0
http_port 80
port 1883
websocket_port 8083
```

#### 修改数据库
请参考[数据库配置](./db_config.md)

#### 修改服务器API密钥
把下面这个值换一个随机数，注意您调用这些接口的地方都要相应修改。
```
http.admin.secret_key 123456
```

#### 修改token密钥
服务器用此密钥生产token，客户端连接时会带上这个token，然后服务器去解token，来验证用户的有消息。此token非常重要，一定要在上线时修改，防止泄漏
```
##用来生产im token的私钥，只在服务器使用，客户端不用。正式使用时为了安全一定要修改这个值，切记切记
token.key hellomyimsecret

```

#### 配置对象存储服务器
请参考[对象存储服务器选择](./oss.md)

#### 推送配置
请参考[推送说明](https://github.com/wildfirechat/push_server)

#### 敏感词配置
```
#*********************************************************************
# Sensitive configuration
#*********************************************************************
##文本敏感词过滤处理方法，0 发送失败；1 发送成功但消息被服务器直接丢弃；2 命中的敏感词被替换成***
sensitive.filter.type 0
```

#### 消息转发
```
##消息转发地址
message.forward.url http://localhost:8087/message/forward
```

#### 用户在线事件回调
```
##用户在线状态事件回调地址
#user.online_status_callback http://localhost:8888/user/online_event
```

#### 群组信息变动事件回调
```
##群组信息变动事件回调地址
#group.group_info_update_callback http://localhost:8888/group/group_info_updated
```

#### 群组成员变动事件回调
```
##群组信息变动事件回调地址
#group.group_member_update_callback http://localhost:8888/group/group_member_updated
```

#### 用户关系变动事件回调
```
##用户信息变动事件回调地址
#relation.update_callback http://localhost:8888/relation/updated
```

#### 用户信息变动事件回调
```
##用户信息变动事件回调地址
#user.info_update_callback http://localhost:8888/user/user_info_updated
```

#### 更多配置
请参考```wildfirechat.conf```文件

#### 启动脚本的配置
启动脚本在```./bin/wildfirechat.sh```。windows也在对应目录有bat文件。在启动脚本中有各种的jvm的参数配置，其中最重要的是jvm堆内存大小的配置。
```
#JAVA_OPTS="$JAVA_OPTS -Xmx4G"
#JAVA_OPTS="$JAVA_OPTS -Xms4G"
```
默认是关闭的，请打开然后设置上给IM服务分配的大小。如果不设置将以来系统默认的jvm参数，如果默认堆内存太小会导致内存浪费甚至出现OOM问题。
