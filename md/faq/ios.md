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
A. 野火IM所有库都使用了xcframework格式，因此不用瘦身直接Archive就行了。

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

#### Q. iOS扫码登录PC端或者Web端不成功？
A. 常见的一种可能是应用服务配置有个设置不正确，见下面代码，如果应用服务是https的需要打开这个开关，如果是http的需要关闭这个开关。
```
# 是否支持SSL，如果所有客户端调用appserver都支持https，请把下面开关设置为true，否则为false。
# 如果为false，在Web端和wx端的appserve的群公告等功能将不可用。
wfc.all_client_support_ssl=false
```

#### Q. 当有多个App使用同一个IM服务，多个APP之间出现互踢现象？
A. 当应用在appstore上架后，开发者账户下的所有应用在同一个手机上具有相同的vendor id。详情请参考(IDFV(identifierForVendor)使用陷阱)https://easeapi.com/blog/blog/63-ios-idfv.html。

这样如果同一个IM服务有多个应用，多个应用安装到同一个手机上，这样所有应用将具有相同的clientId，导致互踢现象产生。处理办法就是不使用identifierForVendor，随机生成UUID，然后固定使用这个UUID就行了，请参考 [bcdd957](https://github.com/wildfirechat/ios-chat/commit/bcdd957c7df94f97e223a048e32eb3197c022065)。如果已经上线了，需要注意更新后需要重新获取token。

#### Q. 如何打包野火SDK供其它项目使用？
A. 可以有2中方式在其它项目中使用野火SDK。第一种方式是主应用项目引入野火的SDK项目，注意还需要修改wfuikit目录下的```xcodescript.sh```脚本，把所需要的资源也一起拷贝到主应用项目下，并添加资源的依赖。第二种方式是打包野火的SDK，以库的形式加入到主应用项目中，打开野火的工程空间```ios-chat.xcworkspace```，选中```Release```Scheme，然后点击运行，就会编译野火SDK（可能会有个错误提示：```Could not delete `/codepath/ios-chat/wfclient/build` because it was not created by the build system.```，忽略掉这个提示），等待编译完成，就会打开生成SDK的访达窗口，把资源和SDK都引入到主项目中，注意SDK都是动态库，需要```Embed & Sign```。

#### Q. 如何用野火的demo连上客户私有部署的IM服务？
A. 野火IM连接只需要3个要素：野火用户ID，野火token和clientId。可以先用客户自己的手机连上xcode debug，登录找到这3个信息。然后下载野火IM最新demo，进行如下修改：

修改```AppDelegate.m```文件
```
//在中，找到方法中的下面两句，改成你抓获的用户id和token

//NSString *savedToken = [[NSUserDefaults standardUserDefaults] stringForKey:@"savedToken"];
//NSString *savedUserId = [[NSUserDefaults standardUserDefaults] stringForKey:@"savedUserId"];

NSString *savedToken = @"你抓取的野火的token";
NSString *savedUserId = @"你抓取的野火用户id";
```
修改```WFCCNetworkService.mm```文件
```
- (NSString *)getClientId {
    //这个方法中的代码全删掉，返回您在登录手机上的clientid
    return @"您登录的那个手机上的用户id";
}
```
注意默认IM服务不支持多端的，因此不要在抓取登录信息的手机上再打开客户的应用，否则会登录失效。

#### Q. 应用做了特殊处理，可以支持后台长时间运行，为什么后台后很快会断开？
A. 因为sdk中做了特殊处理，在进入到后台后，如果没有任务进行，3秒钟后会断开连接，如果有新消息，应该走APNS来通知。如果您的应用可以后台保活，可以去掉相关逻辑。在```WFCCNetworkService.mm```文件中搜索```onAppSuspend```和```onAppResume```，把这两个函数及所有调用这个函数的语句都去掉就可以了.

#### Q. 如何把iOS设备的类型从手机改成Pad？
A. 默认iOS设备都会被认为是手机，可以修改类型改成Pad，这样手机可以和pad共存。在```app_callback.mm```的```GetDeviceInfo```方法中，把```DeviceInfo```的```platform```改成8。另外在登录时，需要把```platform```也改成8。同理Android也可以改成Pad，请参考Android常见问题。
