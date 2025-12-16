# 野火API说明
这里说明野火的各个端SDK的接口说明。

## Server SDK
[Server SDK](../server/sdk.md)是[Server API](../server/admin_api)的Java实现，SDK的接口的代码在[这里](https://gitee.com/wfchat/im-server/tree/wildfirechat/sdk/src/main/java/cn/wildfirechat/sdk)，接口的参数请参考[Server API](../server/admin_api)的说明。

## PC SDK
PC客户端有个接口层[wfc](https://gitee.com/wfchat/vue-pc-chat/tree/master/src/wfc)目录。这个接口层实现了几个功能，一个是把C++接口转化为js的接口，另外一个就是消息和负载的转换。关于IM的接口请参考[wfc.js](https://gitee.com/wfchat/vue-pc-chat/blob/master/src/wfc/client/wfc.js)。关于音视频的接口请参考[avenginekitproxy.js](https://gitee.com/wfchat/vue-pc-chat/blob/master/src/wfc/av/engine/avenginekitproxy.js)。

## Web SDK
Web客户端同样有个接口层[wfc](https://gitee.com/wfchat/vue-chat/tree/master/src/wfc)目录。关于IM的接口请参考[wfc.js](https://gitee.com/wfchat/vue-chat/blob/master/src/wfc/client/wfc.js)。关于音视频的接口请参考[avenginekitproxy.js](https://gitee.com/wfchat/vue-chat/blob/master/src/wfc/av/engine/avenginekitproxy.js)。

## Uniapp SDK
Uniapp客户端同样有个接口层[wfc](https://gitee.com/wfchat/uni-chat/tree/main/wfc)目录。关于IM的接口请参考[wfc.js](https://gitee.com/wfchat/uni-chat/blob/main/wfc/client/wfc.js)。关于音视频的接口请参考[avenginekitproxy.js](https://gitee.com/wfchat/uni-chat/blob/main/wfc/av/engine/avenginekitproxy.js)。
