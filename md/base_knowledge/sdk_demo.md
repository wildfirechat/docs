# 客户端SDK与Demo的关系
## 客户端SDK
IM SDK分为ChatClient和ChatUIKit，其中ChatClient提供IM能力，另外附加群组关系托管，用户信息托管和好友关系托管，只提供能力，不包括UI界面。ChatUIKit提供常用的UI界面，客户可以直接使用ChatUIKit的UI来进行二次开发，也可以只使用ChatClient自己来开发UI。

音视频SDK包括WebRTC库和AVEngineKit库。WebRTC是标准的库，我们没有做任何修改，您可以从WebRTC官方找到对应源码；AVEngineKit是我们提供的音视频封装，是闭源的。野火的音视频有3个版本，具体信息请参考[野火音视频简介](../blogs/野火音视频简介.md)。音视频库仅为功能库，音视频相关UI在ChatUIKit库中，是开源的，可以进行而开。

其他还包括有朋友圈SDK和对接SDK等，也都是功能库闭源收费，UI开源。

## Demo
Demo是使用了野火SDK的应该应用。演示如何集成我们的SDK

## 我们提供的支持
SDK相关UI部分和Demo开源，都采用MIT版权。但我们对SDK和Demo提供不同的技术支持。

对于SDK的ChatClient，我们提供完全的维护工作，建议客户不要修改这个SDK，如果有bug请提交issue，如果缺少IM的某些功能导致应用无法完成某项功能，也可以提issue给我们。

对于ChatUIKit和Demo，建议用户自己修改，如果有issue可以给我们提Pull Request。
