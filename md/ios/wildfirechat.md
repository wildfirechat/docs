# Wildfire Chat简介
Wildfire Chat是使用ChatClient和ChatUIKit的示范应用。

1. 应用在```application:didFinishLaunchingWithOptions:```对ChatClient进行初始化，
2. 关于推送方面的处理，当获取到token后，调用ChatClient的接口，设置token
3. 检查是否已经登陆成功，登陆成功直接连接，否则跳转到登陆界面。
4. 调用完connect后，打开主界面```WFCBaseTabBarController```，主界面有4个tab页面，分表是```WFCUConversationTableViewController```、```WFCUContactListViewController```、```DiscoverViewController```和```WFCMeTableViewController```。前两个是ChatUIKit中的界面。
5. 除了第三方库以为的源码不算太多，请仔细阅读Chat的源码特别是```AppDelegate```的，以便掌握SDK的使用
