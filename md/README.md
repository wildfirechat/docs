# 野火IM
## 什么是野火IM
野火IM是一套通用的即时通讯和实时音视频组件，能够更加容易地赋予客户IM和RTC能力，使客户可以快速的在自有产品上添加聊天和通话功能或者直接使用野火提供的应用。使用野火可以替代云通讯产品或减少自研即时通讯和实时音视频的工作量，降低客户研发成本和难度。

## 野火IM的目标是什么
一直以来给自己的产品加上即时通讯和实时音视频能力都是一件比较困难的事情，要么是架构落后性能不好（XMPP），要么是费用贵业务受制于人安全有隐忧（云通讯公司），要么功能不全二次开发困难。我们的目标是提供一个**安全可控高效易用低成本**的IM和RTC组件，让拥有IM和RTC能力不再是一种奢望，让沟通不再是难事。

## 我们提供的产品
野火IM提供完整的即时通讯和实时音视频解决方案，以及丰富的周边生态系统，主要包括：

1. 即时通讯服务(IM Server)，点击 [GitHub](https://github.com/wildfirechat/im-server) 或 [码云](https://gitee.com/wfchat/im-server)，查看源码
2. 应用服务，点击 [GitHub](https://github.com/wildfirechat/app-server) 或 [码云](https://gitee.com/wfchat/app-server)，查看源码
3. 推送服务，点击 [GitHub](https://github.com/wildfirechat/push_server) 或 [码云](https://gitee.com/wfchat/push_server)，查看源码
4. Android 客户端，点击 [GitHub](https://github.com/wildfirechat/android-chat) 或 [码云](https://gitee.com/wfchat/android-chat)，查看源码
5. iOS 客户端，点击 [GitHub](https://github.com/wildfirechat/ios-chat) 或 [码云](https://gitee.com/wfchat/ios-chat)，查看源码
6. PC 客户端，点击 [GitHub](https://github.com/wildfirechat/vue-pc-chat) 或 [码云](https://gitee.com/wfchat/vue-pc-chat)，查看源码
7. Web 客户端，点击 [GitHub](https://github.com/wildfirechat/vue-chat) 或 [码云](https://gitee.com/wfchat/vue-chat)，查看源码
8. 小程序 Demo，点击 [GitHub](https://github.com/wildfirechat/wx-chat) 或 [码云](https://gitee.com/wfchat/wx-chat)，查看源码
9. uni-app Demo，点击 [GitHub](https://github.com/wildfirechat/uni-chat) 或 [码云](https://gitee.com/wfchat/uni-chat)，查看源码
10. 机器人服务，点击 [GitHub](https://github.com/wildfirechat/robot_server) 或 [码云](https://gitee.com/wfchat/robot_server)，查看源码
11. 开发平台，点击 [GitHub](https://github.com/wildfirechat/open-platform) 或 [码云](https://gitee.com/wfchat/open-platform)，查看源码
12. 频道（公众号）管理系统，点击 [GitHub](https://github.com/wildfirechat/channel-platform) 或 [码云](https://gitee.com/wfchat/channel-platform)，查看源码
13. IM 管理后台系统
14. 更多内容，请点击 [Github](https://github.com/wildfirechat) 或 [码云](https://gitee.com/wfchat) 查看

请点击 [这儿](https://static.wildfirechat.cn/wf-gallery.html) 查看产品截图展示

## 野火IM的技术特点
* 极致地硬件利用率，IM服务最低128M内存即可运行，上不封顶。
* 协议先进，采用MQTT+Protobuf组合，流量和性能极致优化。
* 性能强大，专业版IM服务支持百万在线和集群部署。
* 部署运维简单，依赖服务少，稍加配置一键启动。
* 安全加密。网络连接AES加密。客户端数据库SqlCipher加密。安全无小事。
* 全平台客户端，四端同时在线（移动端，pc端，web端和小程序端），数据和状态多端完美同步。
* 支持国产化。支持国产化操作系统、国产化芯片和国产操作系统。支持国密加密。
* 客户端使用微信[mars](https://github.com/tencent/mars)连接库，野火IM可能是最适应中国网络国情的即时通讯服务。
* 支持加速点加速，即可用于全球应用，也可用于政企内外双网隔离的复杂网络环境。
* 支持阅读回执和在线状态功能，适用于办公环境。
* 音视频多种解决方案，丰俭由人，可自由选择。
* 高级音视频功能强大，支持9人以上的群组视频通话，支持1080P视频，支持会议模式，支持百人以上会议，支持服务器端录制。
* 全私有部署，可不依赖任何第三方服务，完全内网部署。
* 功能齐全，涵盖所有常见即时通讯功能。另外具有强大的可扩展能力。应用成熟完善，基本可以做到开箱即用，也可把SDK嵌入其它应用。
* 拥有应用开放平台，可以开发和创建自建应用，扩展您的工作台。
* API丰富，方便与其它服务系统的对接。
* 拥有机器人和频道功能，免费的频道（公众号）管理后台。
* 代码开源率高，二次开发简单。可以先试用3到6个月，二开搞定后再购买。

## 野火IM都有什么功能
野火IM提供能力库和UI库，支持单聊、群聊、聊天室、频道（类似与微信的公众号)和机器人。支持Server API。提供用户信息、好友关系和群组信息托管。支持常见消息类型和自定义消息。提供音视频通话能力，支持音视频会议功能。支持国产化系统，支持全平台客户端。

## 费用
野火提供免费的社区版IM服务和移动端，提供免费的推送服务、应用服务、频道（公众号）服务、开放平台服务、机器人服务，可以构建完整的基于移动端的即时通讯和实时音视频系统，可以无条件商用。其他端收费，收费价格十分优惠，详情请参考[收费项目说明](price/README.md)，可以先试用半年再购买。

## 体验
可以体验野火发布的应用，请点击[这里](demo/README.md)。也可以按照[quick_start](quick_start/README.md)说明来部署使用，快速配置可能十分钟就能互通消息和实时音视频。
