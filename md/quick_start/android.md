# Android编译
部署完服务后就可以开始客户端的编译。客户端提供源码，从[Github](https://github.com/wildfirechat/android-chat)或者[码云](https://gitee.com/wfchat/android-chat)下载最新的源码。

## 修改配置
1. 找到```uikit/src/main/java/cn/wildfire/chat/kit/Config.java```文件，仔细阅读文件里面的注释，修改```IM_SERVER_HOST```为你的IM服务器地址，比如```192.168.1.100```.
2. 找到```chat/src/main/java/cn/wildfire/chat/app/AppService.java```文件，仔细阅读相文件里面的注释，修改```APP_SERVER_ADDRESS```为你的应用服务器地址，比如```http://192.168.1.100:8888```。

注意：

1. IM_SERVER_HOST：仅需填写host即可，没有http开头，也没有端口结尾!!!
2. APP_SERVER_ADDRESS：需要APP SERVER完整的地址!!!


## 运行
编译运行，填入您的手机号码，验证码填写服务器部署时指定的```superCode```，默认是 ```66666```（五个6）。

## 在线编译
> 推荐搭建本地开发环境，如果想快速看到效果的话，可以选择在线编译

**非常重要，在线编译，打包的产物是 debug 版本 apk，不支持音视频通话，原因请参考项目 README 上的说明。**
1. Fork [android-chat](https://github.com/wildfirechat/android-chat)
2. 参考上面的 [修改配置](#修改配置) 部分修改相关配置，并提交、推送修改到 Github
3. 在自己 Fork 的 `android-chat`仓库下，依次点击`Actions` -> `Workflows` -> `Android CI`  -> `Run workflow`
4. 稍等片刻，待编译成功之后，刷新页面，即可从`Artifacts`处下载
