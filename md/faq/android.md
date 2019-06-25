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

A. [回答](android/q1.md)



#### Q. 后台无法弹出音视频界面

A. 检查是否在手机的权限管理里面打开了"允许应用在后台弹出界面"，如果更换过包名或```applicaitonId```，请继续检查[更换包名](#Q.更换包名)



#### Q. 更换包名

A. 产品上线之前，一定要更换包名和签名

1. ```client```module下的包名不可更改
2. 修改```chat/build.gradle```里面的```applicationId```

