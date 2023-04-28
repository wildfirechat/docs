# Android编译
部署完服务后就可以开始客户端的编译。客户端提供源码，从[Github](https://github.com/wildfirechat/android-chat)或者[码云](https://gitee.com/wfchat/android-chat)下载最新的源码。

## 修改配置
1. 找到```Config.java```文件，仔细阅读文件里面的注释，修改```IM_SERVER_HOST```为你的IM服务器地址，比如```192.168.1.100```.
2. 找到```AppService.java```文件，仔细阅读相文件里面的注释，修改```APP_SERVER_ADDRESS```为你的应用服务器地址，比如```http://192.168.1.100:8888```。

注意：

1. IM_SERVER_HOST：仅需填写host即可，没有http开头，也没有端口结尾!!!
2. APP_SERVER_ADDRESS：需要APP SERVER完整的地址!!!


## 运行
编译运行，填入您的手机号码，验证码填写服务器部署时指定的```superCode```，默认是 ```66666```（五个6）。
