# Android编译
部署完服务后就可以开始客户端的编译。客户端提供源码，从[这里](https://github.com/wildfirechat/android-chat)下载最新的源码。

## 修改配置
找到Config.java文件，修改```IM_SERVER_HOST```为你的IM服务器地址，比如```192.168.1.100```. 修改```IM_SERVER_PORT```为```80```.修改```APP_SERVER_ADDRESS```为你的应用服务器地址，比如```http://192.168.1.100:8888```。
> IM服务需要配置host和端口，APP服务配置host与端口组成的完整http地址。

## 运行
编译运行，填入您的手机号码，验证码填写服务器部署时指定的superCode ```66666```。
