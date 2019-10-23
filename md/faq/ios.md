# iOS FAQ

#### Q. 1编译WildfireChat工程报错，提示找不到部分依赖？
A. WildfireChat隐式依赖于WFChatUIKit和WFChatClient，第一次运行必须先运行WFChatClient，再运行WFChatUIKit。运行之后会自动把库文件和依赖资源拷贝到对应目录，WildfireChat就可以编译运行了。

#### Q. 2如何修改野火IM标题栏颜色
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

#### Q. 3如何打包上架
A. 野火IM中使用了动态库，包含了x86_64架构（模拟器需要这种架构），因此上线前需要移除这种架构。以野火IM的demo为例，首先在ios-chat项目空间运行到真机运行，然后关掉空间。命令行到```$ProjectPath/ios-chat/wfchat```目录下，执行```sh removex86.sh```进行依赖库瘦身。然后打开```WildFireChat.xcodeproj```进行打包（注意一定不要打开```ios-chat```空间打包，在这个空间打包会从新把一些依赖去拷贝过去，导致有x86架构打包失败)。

#### Q. 崩溃在协议栈中
A. 这种问题一般是使用不当造成的，请确保不要改动chatclient和协议栈的任何代码，然后在使用chatclient之前必须做如下初始化：
```
    [WFCCNetworkService startLog];
    [[WFCCNetworkService sharedInstance] setServerAddress:IM_SERVER_HOST port:IM_SERVER_PORT];
    [[WFCCNetworkService sharedInstance] connect:userId token:token];
```
如果还出问题，请打日志出来，在调用connect之后打出日志，在crash调用之前打出日志，把日志和截图贴到论坛或者github给我们分析
