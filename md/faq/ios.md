# iOS FAQ

#### Q. 编译WildfireChat工程报错，提示找不到部分依赖？
A. WildfireChat隐式依赖于WFChatUIKit和WFChatClient，第一次运行必须先运行WFChatClient，再运行WFChatUIKit。运行之后会自动把库文件和依赖资源拷贝到对应目录，WildfireChat就可以编译运行了。

#### Q. 如何修改野火IM标题栏颜色
A. 在野火IM Demo应用的AppDelegate.m文件中，有对全局navi的设置，在这里可以修改标题栏颜色
```
- (void)setupNavBar {
    [UIApplication sharedApplication].statusBarStyle = UIStatusBarStyleLightContent;

    UINavigationBar *bar = [UINavigationBar appearance];
    bar.barTintColor = [UIColor colorWithRed:0.1 green:0.27 blue:0.9 alpha:0.9];
    bar.tintColor = [UIColor whiteColor];
    bar.titleTextAttributes = @{NSForegroundColorAttributeName : [UIColor whiteColor]};
    bar.barStyle = UIBarStyleBlack;
}
```

#### Q. 如何打包上架
A. 野火IM中使用了动态库，包含了x86_64架构（模拟器需要这种架构），因此上线前需要移除这种架构。以野火IM的demo为例，首先在ios-chat项目空间运行到真机运行，然后关掉空间。命令行到```$ProjectPath/ios-chat/wfchat```目录下，执行```sh removex86.sh```进行依赖库瘦身。然后打开```WildFireChat.xcodeproj```进行打包（注意一定不要打开```ios-chat```空间打包，在这个空间打包会从新把一些依赖去拷贝过去，导致有x86架构打包失败)。

#### Q. 崩溃在协议栈中
A. 这种问题一般是使用不当造成的，请确保不要改动chatclient和协议栈的任何代码，然后在使用chatclient之前必须做如下初始化：
```
    [WFCCNetworkService startLog];
    [[WFCCNetworkService sharedInstance] setServerAddress:IM_SERVER_HOST];
    [[WFCCNetworkService sharedInstance] connect:userId token:token];
```
> 可以不用在同一个地方，比如应用启动时开启日志和设置服务器地址。然后再合适的时机connect，但一定要确保调用任何接口之前要先调用connect

最近发现的另外一个问题就是重复多次调用connect，这个会引起问题，因为调用connect时会重新打开数据库，如果这是正在进行数据库操作很容易出现崩溃在数据库中。请一定要避免多次调用connect，野火IM底层能够自动做好重连操作，不要手动处理。

如果还出问题，请打日志出来，在调用connect之后打出日志，在crash调用之前打出日志，把日志和截图贴到论坛或者github给我们分析

#### Q. 苹果手机上图片打不开
A. 因为图片访问方式默认使用的是http方式，根据[ATS](https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&tn=84053098_3_dg&wd=ios%20ats&oq=ats&rsv_pq=befae743006ab63c&rsv_t=bf550nXKa277BSCevvQ%2FlxRsKTxtKRlHFBTAjnNQpciyfz5LbxtXPDStdwHb0IgTctBAPw&rqlang=cn&rsv_enter=1&rsv_dl=tb&rsv_sug3=6&rsv_sug1=3&rsv_sug7=100&rsv_sug2=0&inputT=2653&rsv_sug4=2992)的限制，应用服务无法访问HTTP的资源。解决办法要么关掉ATS或者在ATS中加上例外，要么是配置资源的HTTPS访问方式并在配置中配上https的资源路径。建议在ATS中加上文件存储服务的例外，解决办法请自行百度。另外上传不受ATS影响。

#### Q. 野火IM是否支持bitcode
A. 最新版本协议栈和imclient已经支持bitcode，但imuikit和chat依赖于webrtc库，而谷歌官方发布webrtc库不支持bitcode，所以如果imuikit和chat要支持bitcode必须移除掉音视频功能（移除掉wfavengkit库和webrtc库，屏蔽掉相关代码）。或者找到我们对应版本支持bitcode的webrtc库。

#### Q. 如何移除音视频功能
A. 在imuikit和chat的工程中搜索```WFCU_SUPPORT_VOIP```，找到2处宏定义的地方，改为0。然后依赖库中去掉对wfavengkit和webrtc两个库的依赖。

#### Q. 为什么SDK不支持armv7架构了？
A. 从iphone5s起，架构已经是arm64了。目前iphone5及之前的设备基本上没有了，可以不用再支持armv7架构了。省去armv7架构可以有效的减少sdk及软件包的大小，请移除armv7架构的支持。

#### Q. 国内不允许使用CallKit功能怎么办？
A. 苹果不允许不使用CallKit功能的应用使用Voip推送，针对这个问题的处理很简单，那就是使用普通推送呗。由于SDK中对CallKit.framework有依赖，所以打包必须带上这个依赖。Appstore上架是没有问题的。
