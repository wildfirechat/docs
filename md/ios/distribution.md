# 打包
前提条件是您已经熟练掌握了iOS打包上架的操作流程，如果您还没有掌握这方面的能力，需要您先掌握之后再查看本文。这里只讲述引入野火IM打包的问题。

打包情况分为两种，一种是直接基于野火IM开源Demo进行打包，另外一种是把野火IM的ChatUIKit和ChatClient作为动态库引入现有产品。下面分包讲述一下：

## 基于野火IM Demo打包
1. 先清除临时文件，清除```wfclient/bin```、```wfclient/bin_tmp```、```wfuikit/bin```和```wfuikit/bin_tmp```这4个目录。
2. 清除```wfuikit/WFChatUIKit/AVEngine/GoogleWebRTC/Frameworks/frameworks/WebRTC.framework```、```wfuikit/WFChatUIKit/AVEngine/WFAVEngineKit.framework```、```wfuikit/WFChatUIKit/Vendor/ZLPhotoBrowser/ZLPhotoBrowser.framework```和```wfchat/WildFireChat/SDWebImage/SDWebImage.framework```这4个库的x86_64架构。将来如果引入更多的动态库，也同样需要在上架之前移除x86_64架构。可以自行查找移除x86_64架构的方法，也可以执行项目目录下的```removex86.sh```脚本。
```
sh removex86.sh
```
3. 真机编译```wfclient```和```wfuikit```。选择真机，再先后选择这两个项目，分别点执行按钮。再第一步完成之后千万不要选择模拟器编译，如果选过模拟器编译，请再按照步骤一清理一遍。
4. 选择```Archive```菜单，等待打包完成即可。

注意：如果失败提示没有armv7架构，请修改一下编译设置中的架构，改为只有arm64架构，因为我们sdk是不支持armv7的。如果有其它第三方动态库，比如购买野火的朋友圈等，也需要移除x86_64架构。

## 引入野火IM SDK的打包
如果是野火IM SDK打包后，以动态库的方式引入新工程，只需要注意1：移除x86_64架构；2：不支持armv7，在工程中设置架构为arm64。

如果是建立工程依赖的方式引入新工程，需要按照基于野火IM Demo打包的方式去清除临时文件、移除x86_64架构。另外设置项目架构为arm64，不支持armv7。
