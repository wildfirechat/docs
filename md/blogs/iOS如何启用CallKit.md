# iOS如何启用CallKit
目前在国内使用CallKit是不合规的，因此CallKit主要给国外使用。使用callkit需要客户端和推送服务同时支持，下面介绍一下如何在野火开启：

## 客户端
客户端的修改需要3部分，分别是iOS SDK（包括client和avenginekit）、iOS Demo和其他端。

### iOS SDK
iOS SDK包括client和avenginekit都需要更新到2022.4.26日以后的版本就可以了。SDK内部的修改主要是把部分音视频消息从avenginekit移动到client，然后这些消息的encode方法把部分信息放到pushData中。

### iOS Demo
iOS Demo也就是iOS应用了，需要在appdelegate.m中处理callkit。把代码更新到2022.4.26以后的代码，在代码中搜索```USE_CALL_KIT```，把开关打开。目前跑通了基本功能，可能还有细节需要进一步优化。此外还需要把callkit和pushkit系统库添加依赖。

### 其他端
如果您有其他端，也需要同步修改，因为其他端打来的信息也需要带上足够的信息。请把其他端的client和avenginekit都更新到2022.4.26以后的版本。

## 推送服务
推送服务也需要更新到2022.4.26日以后版本，修改主要在```ApnsServer.java```文件中，voip推送加上了足够的信息。另外需要打开voip推送开关，修改```apns.properties```文件，把```apns.voip_feature```开关改为true。

## 如何共存
目前demo的做法是一刀切，要么开启callkit要么关闭callkit，可能有部分客户需要国内关掉callkit，国外开启callkit。这个需求就需要二次开发了，客户端应用每次启动时主动联系推送服务告诉他自己是否支持callkit，然后在客户端本地也需要做好支持与否的切换，开发应该比较简单。
