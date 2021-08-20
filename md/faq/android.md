# Android FAQ

####Q.编译错误

A：发生编译错误时，可按如下流程处理

1. 项目根目录执行```./gradlew clean build```，看是否能编译通过，如果能编译通过，说明代码没问题。

2. 确定Android Studio 是否为最新版本，并关闭 Instant Run 再次尝试。

3. 根据错误提示，网上搜索一下。



#### Q.编译错误，提示大量```Glide.xxx```相关错误

A. 请关闭```Instant Run```，再次尝试，或者尝试命令行下编译。



####Q. 编译错误，提示GlideApp相关错误

A. 其他编译错误引起，不是Glide问题。



#### Q. 如何把项目导入到IDE中？

A. [回答](./android/q1.md)



#### Q. 后台无法弹出音视频界面

A. 检查是否在手机的权限管理里面打开了"允许应用在后台弹出界面"，如果更换过包名或```applicaitonId```，请继续检查[更换包名](#Q.更换包名)



#### Q. 更换包名

A. 产品上线之前，一定要更换包名和签名

1. ```client```module下的包名不可更改
2. 修改```chat/build.gradle```里面的```applicationId```

#### Q. 重复收到消息/同一条消息，触发多次onReceiveMessage回调

A. 野火IM SDK 只允许在主进程进行初始化，即```ChatManager.init```或```WfcUIKit.init```只需在主进程调用一次，可参考```MyApp.java```

#### Q. 如何抓取日志

A. [回答](./android/q3.md)

#### 	Q. 小米手机收不到音视频相关推送

A. [回答](./android/q4.md)

#### Q. 发送消息时显示正常，但接收方显示未知消息；同时，发送方退出，再次进入时，也显示位置消息

A. 继承```MessageContent```自定义消息时，一定要确保自定义消息包含一个```无参构造函数```。

#### Q. 点击消息推送通知，如何根据消息类型，跳转到不同的界面？

A. [回答](./android/q5.md)

#### Q. 无法收到推送

A. [回答](./android/q6.md)

#### Q. 如果改大AS的终端缓存区大小以便抓取更多的日志
A. 先使用快捷键 ```Ctrl + Shift + A```(Mac下```Ctrl```换成```Cmd```)，然后输入```registry```，选中之后弹出一个界面，向下滚动到```terminal.buffer.max.lines.count```，默认值应该是5000，可以改成50000，然后重启。
