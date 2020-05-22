# 音视频

Webrtc是目前主流的音视频解决方案，它提供了媒体能力，信令需要另外来扩展。webrtc官方提供的demo使用起来非常麻烦，我们基于野火IM的通信能力，构建了一套信令系统，非常方便的使用。我们提供的的音视频库只支持1对1通话，可以免费给客户使用，但不提供源码。我们也可以定制开发多人音视频功能。

#### 野火音视频的组成部分
野火音视频系统有如下几部分组成。

1. 野火IM，作为信令传输通道，负责把信令在通话两端传递。与谷歌方案中的```Signailing Server```作用稍有不同，野火IM服务只作为透传信令到客户端，客户端SDK实现所有逻辑。
2. EingineKit，封装了WebRTC信令，做成了一个简单易用的音视频库，用户只需要startCall，endCall来使用。已经集成到Android/iOS Demo应用中了。
3. WebRTC库，直接使用谷歌提供编译好的软件包，android的版本是1.0.30039，iOS的版本是1.0.26195，PC使用的是Chromium v69.0.3497.128。
4. Turn服务，需要部署开源turn服务器，不需要另外部署服务器。不需要另外搭建STUN服务，因为Turn服务自带STUN服务的功能。服务与其它任何服务都没有依赖，可以单独部署，需开放TCP3478端口和所需要的UDP端口（默认需要开放所有UDP端口，也可以配置turn服务设定UDP端口范围).

#### 使用方法
1. 确保野火IM功能正常，确保通话双方能够收发消息

2. 部署Turn服务器，建议部署coTurn，部署方法请使用百度查询。部署完毕后，使用[这个链接](https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/)检查turn服务是否部署成功。***注意一定要是turn服务，不能是stun服务，一定要出现下图中红线标注的type***。
![图片](turn_check.jpeg)

> 当Type为"relay"且后面的地址为您的公网IP时，表明turn服务部署成功，否则为失败。

3. 修改客户端配置
在客户端的config文件中，修改地址为您部署的turn服务器地址

```
NSString *IM_SERVER_HOST = @"192.168.1.101";

NSString *APP_SERVER_HOST = @"192.168.1.101";
int APP_SERVER_PORT = 8888;

NSString *ICE_ADDRESS = @"turn:turn.liyufan.win:3478";
NSString *ICE_USERNAME = @"wfchat";
NSString *ICE_PASSWORD = @"wfchat";
```
> 注意如果客户分属多区域，可以部署多个turn服务器来提高用户体验。音视频添加turn服务信息的接口可以调用多次，每次增加一个turn服务器。

#### 上线一定要自己部署Turn服务
野火IM提供了体验用的环境，环境配置为1C1G1M，仅能够供应体验使用，上线商用时一定要切换到自己的Turn服务器。

#### 其它
1. 多人音视频授权绑定的是IM的域名，不是绑定的turn服务域名，所以可以使用任意turn服务器地址。
2. turn服务可以部署多个，在客户端多次调用addIceServer即可。当用户在全球多个区域分布式，可以在不同区域部署多个turn服务，提高体验。

#### 如何安装Turn服务
Turn服务不是野火IM的内容，就像mysql，redis之类的基础组件，需要客户自行安装的，这里也提供一个安装说明，仅供大家参考。点[如何安装Turn服务](./turn_server.md)了解详情。
