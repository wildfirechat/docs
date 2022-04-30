# PC 常见问题

## Q. 如何抓取日志
A. 协议栈会自己抓取最近5M的日志，将会对问题的解决提供非常大的帮助。协议栈日志在不同系统上存在不同的目录。在MAC上的目录是```~/Library/Application Support/{包名}/wildfirechat/{用户Id}/wfchat_{日期}.xlog```；在Linux上的目录是```~/.wildfirechat/data/{用户Id}/wfchat_{日期}.xlog```；在windows上的目录在```C:\Users\{登电脑登录用户名}\AppData\Roaming\wildfirechat\{用户Id}\wfchat_{日期}.xlog```。log是[mars](https://github.com/Tencent/mars)的```xlog```格式，没有密码。用户可以自己解压后分析，也可以发给我们分析问题。

## Q. 手机端扫码提示会话不存在或者已过期？
A. 只有手机端和PC端所对应的APP、IM Server都相同时，才能扫码登录PC端。

    1. PC端需要购买```PC SDK```才能连接自己部署的服务，默认只能连接官方服务。确认是否想官方购买了```PC SDK```，如果未购买，可[申请试用](../quick_start/trial.md)
    2. 确认PC端```config.js```和手机端```Config.java```或```WFCConfig.m```所配置的```APP_SERVER```是否一致。

## Q. 扫码无法登录，如果让PC端连接自己部署的服务？
A. 请参考上一问题。

## Q. 二维码不显示
A. 控制台 -> 网络，看下pc_session请求是否正常访问你们部署的[app server](../quick_start/server.md)

## Q. 手机扫码，提示未登录或者错误
A. AppServer从0.40版本起引入了shiro，所有移动端的请求都需要进行认证，您需要把移动端升级到最新版本另外退出重新登录一下，具体原因请参考[这里](https://github.com/wildfirechat/app-server/blob/master/README.md#版本兼容)。如果还是无法解决问题，请自行DEBUG一下，相关部分所有代码都是开源的。

## Q. 开发者模式如何打开？发布版本如何关闭
A. 我们默认的快捷键Ctrl(mac下CMD)+G，可以在代码中搜索```toggleDevTools```找到如下代码，可以修改或者注释掉这个功能。但我们还是建议客户保留这个功能，如果出现问题可以进行调试。可以设置一个比较复杂的组合键防止客户误触。
```
globalShortcut.register('CommandOrControl+G', () => {
    mainWindow.webContents.toggleDevTools();
})
```

## Q. 如何更换icon等
A. 替换```build/icons```目录下的所有文件，此外，也需要替换```public/images```和```src/assets/images```下面的相应图片。

## Q. 如何将登录方式修改为账号密码登录？
A. IM本身只需要```userId```和```token```即可进行连接，故可以参考移动端的登录逻辑，去获取```userId```和```token```，其中需要注意的是：```token```和```clientId```、```platform```是绑定的，登录获取```token```时，这两个字段不能随便填写，需要分别通过```wfc.getClientId()```和```Config.getWFCPlatform()```获取。

## Q. 登录了，但是连不上
A. 首先，这并不是一个比较有效的问题，但总有小伙伴这么问。请根据如下步骤进行排查：
0. 仔细阅读```npm run dev```时的前置提示
1. PC SDK 是绑定域名或者IP的，也就是说PC SDK和IM Server是绑定的，换域名或IP时，需要同时更换
2. 确保IM SERVER部署成功，并且配置文件里面配置的```server.ip```就是PC SDK所绑定的域名或者IP
3. 确保已修改```config.js```里面的```APP_SERVER```地址，并且该APP SERVER配置里面所指向的IM SERVER是PC SDK所绑定的那个
4. 确保已用邮件里面的```.node```文件替换了```proto```目录下对应的```.node```文件，所有平台的都需要替换，最好一次就把所有的都替换了
5. 确保重新执行```npm run dev```等
6. 如果还是有问题，请参考最上面，给我们提供日志

## Q. 纯内网环境，不能显示表情
A. 表情是采用加载图片的方式实现的，demo里面的表情图片存储在七牛云上，内网不能访问，故内网不能显示表情，解决办法如下：
  1. 将```src/assets/twemoji```目录上传到一个内网能访问的服务器，比如部署```app serhier```的服务器
  2. 确保通过```http(s)://base_twemoji_url/72x72/1f1e6.png```能访问到对应表情，此处```1f1e6.png```蓝底白字大写字母A
  3. 修改```twemoji.js```，将```https://static.wildfirechat.net/twemoji/assets/```替换成新部署的```http(s)://base_twemoji_url/```，需要注意，最后一个```/```不能省略
  4. 修改```MessageInput.vue```中```message = message.replace(/<img class="emoji" draggable="false" alt="/g, '').replace(/" src="https:\/\/static\.wildfirechat\.net\/twemoji\/assets\/72x72\/[0-9a-z-]+\.png">/g, '')```将链接地址替换成新部署的。

## Q. 在Windows系统缓存目录，存在wildfirechat目录，如何去掉？
A. 有2处需要修改，在```package.json```中把```name```属性改为您的应用英文名；还有一处在```PROJECT_HOME/src/wfc/proto/proto.min.js```文件中，把```proto.setAppName('mychat');```注释打开，名字改为您的应用英文名。

## Q. 音视频通话无法接通
A. 请按如下流程排查：
0. 确保手机端已调通音视频功能
1. 确认电脑支持音视频通话，[点这儿](https://docs.wildfirechat.cn/webrtc/abilitytest/)开始测试
2. 在 Local Storage 中添加一条音视频调试控制项: ```key: enable_voip_debug```，```value: 1```，添加之后，音视频通话时，会自动打开音视频通话窗口的调试窗口。
3. 确定所用音视频SDK版本，必现都使用一样的版本，才能互通。 音视频通话界面调试窗口的控制台，如果输出```wfc avengine-multi```字样，则说明所用的 SDK  是多人版；如果输出```wfc avengine-conference```字样，则说明所用的 SDK 是高级版。 具体的版本说明，请参考[这儿](https://github.com/wildfirechat/vue-pc-chat/tree/master/src/wfc/av/internal)
4. 将音视频发起方和接听方音视频窗口控制台日志发给我们
