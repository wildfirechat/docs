# Android FAQ

####Q.编译错误

A：发生编译错误时，可按如下流程处理

1. 项目根目录执行```./gradlew clean build```，看是否能编译通过，如果能编译通过，说明代码没问题。
2. 确定Android Studio 是否为最新版本，并关闭 Instant Run 再次尝试。
3. 根据错误提示，网上搜索一下。



#### Q.编译错误，提示大量```Glide.xxx```相关错误

A. 请关闭```Instant Run```，再次尝试，或者尝试命令行下编译。



#### Q. 如何把项目导入到IDE中？

A. [回答](android/q1.md)



#### Q. 后台无法弹出音视频界面

A. 检查是否在手机的权限管理里面打开了"允许应用在后台弹出界面"，如果更换过包名、```applicaitonId```，请继续检查[更换包名](#Q.更换包名)



#### Q. 更换包名

A. 如果需要更换包名，请注意

1. ```client```module下的包名不可更换

2. 检查```Application```类里面，初始化野火服务的地方，是否修改。

   ```java
     // 只在主进程初始化, cn.wildfirechat.chat需要改成的applicationId
    if (getCurProcessName(this).equals("cn.wildfirechat.chat")) {
   	wfcUIKit = new WfcUIKit();
   	wfcUIKit.init(this);  
       ....
    }
   ```

3. 检查```AndroidManifest.xml``` 里面```intent-filter#action```是否和```WfcIntent```类里面的一致，并且做了和你们包名一直的修改。

