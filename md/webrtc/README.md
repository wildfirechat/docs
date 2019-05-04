# 音视频

Webrtc是目前主流的音视频解决方案，它提供了媒体能力，信令需要另外来扩展。webrtc官方提供的demo使用起来非常麻烦，我们基于野火IM的通信能力，构建了一套信令系统，非常方便的使用。我们提供的的音视频库只支持1对1通话，可以免费给客户使用，但不提供源码。我们也可以定制开发多人音视频功能。

#### 野火音视频的组成部分
野火音视频系统有如下几部分组成

1. 野火IM，作为信令传输通道，负责把信令在通话两端传递。
2. EingineKit，封装了WebRTC及信令，做成了一个简单易用的音视频库，用户只需要startCall，endCall来使用。已经集成到Android/iOS Demo应用中了。
3. Turn服务，需要部署开源turn服务器，不需要另外部署服务器。

#### 使用方法
1. 确保野火IM功能正常，确保通话双方能够收发消息

2. 部署Turn服务器，建议部署coTurn，部署方法请使用百度查询。部署完毕后，使用[这个链接](https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/)检查turn服务是否部署成功
![图片](turn_check.jpeg)

> 当Type为"relay"时表明turn服务部署成功

3. 修改客户端配置
在客户端的config文件中，修改地址为您部署的turn服务器地址

```
NSString *IM_SERVER_HOST = @"192.168.1.101";
int IM_SERVER_PORT = 80;

NSString *APP_SERVER_HOST = @"192.168.1.101";
int APP_SERVER_PORT = 8888;

NSString *ICE_ADDRESS = @"turn:turn.liyufan.win:3478";
NSString *ICE_USERNAME = @"wfchat";
NSString *ICE_PASSWORD = @"wfchat";
```
> 野火IM提供了体验用的环境，环境配置为1C1G1M，建议上线使用时一定要切换到自己的Turn服务器。
