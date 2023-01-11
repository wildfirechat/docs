# 野火API说明
这里说明野火的各个端SDK的接口说明。

## Server SDK
[Server SDK](../server/sdk.md)是[Server API](../server/admin_api)的Java实现，SDK的接口的代码在[这里](https://gitee.com/wfchat/im-server/tree/wildfirechat/sdk/src/main/java/cn/wildfirechat/sdk)，接口的参数请参考[Server API](../server/admin_api)的说明。

## Android SDK
Android的client sdk提供所有的IM服务的能力，包括连接、发送消息、会话列表等。接口文件在[这里](https://gitee.com/wfchat/android-chat/blob/master/client/src/main/java/cn/wildfirechat/remote/ChatManager.java)。接口文件中常用接口都有详细的注释。

Android的音视频SDK没有源码，但可以在android代码中搜索```AVEngineKit```，看一下demo中怎么使用音视频SDK。

## iOS SDK
iOS的client sdk有2个接口文件，分别是[WFCCNetworkService](https://gitee.com/wfchat/ios-chat/blob/master/wfclient/WFChatClient/Client/WFCCNetworkService.h)和[WFCCIMService](https://gitee.com/wfchat/ios-chat/blob/master/wfclient/WFChatClient/Client/WFCCIMService.h)。其中```WFCCNetworkService```是关于连接和回调的接口，```WFCCIMService```是业务的接口。接口上都有详细的注释。音视频的接口请参考[WFAVEngineKit](https://gitee.com/wfchat/ios-chat/blob/master/wfuikit/WFChatUIKit/AVEngine/WFAVEngineKit.xcframework/ios-arm64/WFAVEngineKit.framework/Headers/WFAVEngineKit.h)。

## PC SDK
PC客户端有个接口层[wfc](https://gitee.com/wfchat/vue-pc-chat/tree/master/src/wfc)目录。这个接口层实现了几个功能，一个是把C++接口转化为js的接口，另外一个就是消息和负载的转换。关于IM的接口请参考[wfc.js](https://gitee.com/wfchat/vue-pc-chat/blob/master/src/wfc/client/wfc.js)。关于音视频的接口请参考[avenginekitproxy.js](https://gitee.com/wfchat/vue-pc-chat/blob/master/src/wfc/av/engine/avenginekitproxy.js)。

## Web SDK
Web客户端同样有个接口层[wfc](https://gitee.com/wfchat/vue-chat/tree/master/src/wfc)目录。关于IM的接口请参考[wfc.js](https://gitee.com/wfchat/vue-chat/blob/master/src/wfc/client/wfc.js)。关于音视频的接口请参考[avenginekitproxy.js](https://gitee.com/wfchat/vue-chat/blob/master/src/wfc/av/engine/avenginekitproxy.js)。

## Uniapp SDK
Uniapp客户端同样有个接口层[wfc](https://gitee.com/wfchat/uni-chat/tree/main/wfc)目录。关于IM的接口请参考[wfc.js](https://gitee.com/wfchat/uni-chat/blob/main/wfc/client/wfc.js)。关于音视频的接口请参考[avenginekitproxy.js](https://gitee.com/wfchat/uni-chat/blob/main/wfc/av/engine/avenginekitproxy.js)。
