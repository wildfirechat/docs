# 服务器部署
服务器提供[社区版](https://github.com/wildfirechat/server/releases)和[Demo应用服务](https://github.com/wildfirechat/app_server/releases)软件。社区版是IM通讯服务器，负责发送消息等IM业务；Demo服务是模拟客户的应用服务，提供登陆等功能。

## 环境需求
Windows/Linux/MacOS都可以，需要JRE1.8以上，需要网络环境。如果没有公网IP，也可以在局域网内体验。需要开通```1883```、```80```和```8888```端口。

## 野火IM服务器的部署
#### 配置修改
社区版软件下载**（[点这儿去下载编译好的版本](https://github.com/wildfirechat/server/releases)，如果想自行编译的话，请用git clone整个仓库下来，别打包下载zip压缩包，压缩包会编译错误!）**解压后，修改```/config/wildfirechat.conf```文件，修改```http_port```为80，修改```server.ip```为服务器ip地址。***注意一定要改成客户端可以访问的地址，不能用127.0.0.1或localhost***
>> 这里有个限制http_port必须为80端口，如果使用其它端口，在使用七牛文件服务器时，发送媒体消息会失败

#### 运行

**注意一定到在```bin```的同级目录下执行命令，不要到```bin```内执行**

#####mac/linux系统

  1. 命令行到解压目录

  2. **使用root用户**，执行``` sh ./bin/wildfirechat.sh```


#####windows系统

1. 使用命令行窗口执行```bin\wildfirechat.bat```（双击执行不可用，必须命令行)。



执行相应系统的启动命令之后，等待10秒钟后，在浏览器中输入```http://${服务器的IP}/api/version```，查看版本信息。

## Demo应用服务器的部署
#### 配置修改
app软件下载解压后，修改```/config/sms.properties```文件，设置```superCode```为```66666```
>> 发送短信需要购买短信服务，在没有短信服务的情况下，使用superCode作为验证码来登陆。

#### 运行
执行```java -jar app-0.0.1-SNAPSHOT.jar```。

#### 检查程序可用性
等待10秒钟，在浏览器中输入```http://${服务器的IP}:8888/```，查看是否返回OK。
