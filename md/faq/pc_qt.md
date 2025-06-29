# PC 常见问题

## Q. 如何抓取日志
A. 协议栈会自己抓取最近5M的日志，将会对问题的解决提供非常大的帮助。协议栈日志在不同系统上存在不同的目录。在MAC上的目录是```~/Library/Application Support/{包名， 也就是package.json 里面的 appId}/wildfirechat/{用户Id}/wfchat_{日期}.xlog```；在Linux上的目录是```~/.wildfirechat/data/{用户Id}/wfchat_{日期}.xlog```；在windows上的目录在```C:\Users\{登电脑登录用户名}\AppData\Roaming\wildfirechat\{用户Id}\wfchat_{日期}.xlog```。log是[mars](https://github.com/Tencent/mars)的```xlog```格式，没有密码。用户可以自己解压后分析，也可以发给我们分析问题。

## Q. 手机端扫码提示会话不存在或者已过期？
A. 只有手机端和PC端所对应的APP、IM Server都相同时，才能扫码登录PC端。

    1. PC端需要购买```PC SDK```才能连接自己部署的服务，默认只能连接官方服务。确认是否想官方购买了```PC SDK```，如果未购买，可[申请试用](../quick_start/trial.md)
    2. 确认PC端```config.js```和手机端```Config.java```或```WFCConfig.m```所配置的```APP_SERVER```是否一致。

## Q. 扫码无法登录，如果让PC端连接自己部署的服务？
A. 请参考上一问题。

## Q. 二维码不显示
A. 控制台 -> 网络，看下pc_session请求是否正常访问你们部署的[app server](../quick_start/server.md)

## Q. 手机扫码，提示未登录或者错误
A. AppServer从0.40版本起引入了shiro，所有移动端的请求都需要进行认证，您需要把移动端升级到最新版本另外退出重新登录一下，具体原因请参考[这里](https://gitee.com/wfchat/app-server/blob/master/README.md#版本兼容)。如果还是无法解决问题，请自行DEBUG一下，相关部分所有代码都是开源的。

## Q. 如何将登录方式修改为账号密码登录？
A. IM本身只需要```userId```和```token```即可进行连接，故可以参考移动端的登录逻辑，去获取```userId```和```token```，其中需要注意的是：```token```和```clientId```、```platform```是绑定的，登录获取```token```时，这两个字段不能随便填写，需要分别通过```wfc.getClientId()```和```Config.getWFCPlatform()```获取。

## Q. 登录了，但是连不上
A. 首先，这并不是一个比较有效的问题，但总有小伙伴这么问。请根据如下步骤进行排查：
1. PC SDK 是绑定域名或者IP的，也就是说PC SDK和IM Server是绑定的，换域名或IP时，需要同时更换
2. 确保IM SERVER部署成功，并且配置文件里面配置的```server.ip```就是PC SDK所绑定的域名或者IP
3. 确保已修改```config.cpp```里面的```APP_SERVER```地址，并且该APP SERVER配置里面所指向的IM SERVER是PC SDK所绑定的那个
4. 确保已用邮件里面的动态库文件替换了```proto```目录下对应的动态库文件，所有平台的都需要替换，最好一次就把所有的都替换了
5. 如果还是有问题，请参考最上面，给我们提供日志

## Q. 在Windows系统缓存目录，存在wildfirechat目录，如何去掉？
A. 有2处需要修改，在```package.json```中把```name```属性改为您的应用英文名；还有一处在connect和获取clientid之前或者初始化时，调用SDK的```setAppName```方法，名字改为您的应用英文名。另外如果是Max系统，还需要修改应用的包名。

## Q. 不支持音视频通话
A. 目前暂无支持计划。

## Q. win7的虚拟机几台设备共用同一个帐号，会导致clientId是重复的，导致被踢下线
A. 问题的原因是野火PC客户端默认每个账户生成一个UUID作为clientId，如果用同一个账户登录，那么就有相同的clientId，在IM服务端，根据clientId来判别客户端，从而认为是换用户登录，导致之前登录的账户被踢下来。解决办法如下：
1. 修改登录方法，把登录分成2部分，第一步登录不上传clientId和平台，登录成功后，不获取token，只返回客户端当前用户的用户ID。
2. 调用SDK的```setAppDataPath```方法为此用户设置唯一的路径，建议系统账户用户目录下+用户ID拼接路径。
3. 调用sdk获取clientId（一定要在第二步之后才调用，之前不要调用），调用登录的第二部分，参数包括clientId和平台，获取IMtoken，得到token之后调用connect。
4. 如果是记录token自动登录，需要同时记录用户id和token，在调用connect之前要执行步骤2设置数据存储路径。

## Q. 如何修改数据/日志目录名称？
A. PC 端默认的数据/日志文件路径包含`wildfirechat`字样，如：`/Users/wf/Library/Application Support/cn.wildfire.qt-pc-chat/wildfirechat/uiuJuJcc`。如果客户不希望看到`wildfirechat`字样时，可通过修改`appName`实现，具体请参考前面`setAppName`方法，需要注意的是，`setAppName`方法必需需要在`getClientId` 和 `connect` 之前调用。另外如果是Max系统，还需要修改应用的包名。
