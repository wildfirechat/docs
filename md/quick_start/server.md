# 服务器部署
服务器提供[社区版](https://github.com/wildfirechat/server/releases)和[Demo服务](https://github.com/wildfirechat/app_server/releases)软件。社区版是IM通讯服务器，负责发送消息等IM业务；Demo服务是模拟客户的应用服务，提供登陆等功能。

## 环境需求
Windows/Linux/MacOS都可以，需要JRE1.8以上，需要网络环境。如果没有公网IP，也可以在局域网内体验。需要开通```1883```、```80```和```8888```端口。

## 野火IM服务器的部署
#### 配置修改
wildfirechat软件下载解压后，修改```/config/wildfirechat.conf```文件，修改```http_port```为80，修改```server.ip```为服务器ip地址。
>> 这里有个限制http_port必须为80端口，如果使用其它端口，在使用七牛文件服务器时，发送媒体消息会失败

#### 运行
在mac/linux系统下，执行```sh ./bin/wildfirechat.sh```;在windows系统下，使用命令行窗口执行```bin\wildfirechat.bat```（双击执行不可用，必须命令行)。等待10秒钟后，在浏览器中输入```http://${服务器的IP}/api/version```，查看版本信息。注意一定到在```bin```的同级目录下执行，不要到```bin```内执行

## Demo应用服务器的部署
#### 配置修改
app软件下载解压后，修改```/config/sms.properties```文件，设置```superCode```为```66666```
>> 发送短信需要购买短信服务，在没有短信服务的情况下，使用superCode作为验证码来登陆。

#### 运行
执行```java -jar app-0.0.1-SNAPSHOT.jar```。
