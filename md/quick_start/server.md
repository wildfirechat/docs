# 服务器部署
服务器提供社区版本和Demo服务版本，从[这里](http://www.baidu.com)下载。其中wildfirechat是服务器软件，app是demo应用软件。

## 环境需求
Windows/Linux/MacOS都可以，需要JRE1.8以上，需要网络环境。如果没有外网，也可以在局域网内体验。需要开通```1883```、```80```和```8888```端口。

## 火信服务器的部署
#### 配置修改
wildfirechat软件下载解压后，修改```/config/moquette.conf```文件，修改```http_port```为80，修改```server.ip```为服务器ip地址。
>> 这里有个限制http_port必须为80端口，如果使用其它端口，在使用七牛文件服务器时，发送媒体消息会失败

#### 运行
在mac/linux系统下，执行```sh ./bin/moquette.sh```;在windows系统下，执行```bin\moquette.bat```。等待10秒钟后，在浏览器中输入```http://${服务器的IP}/api/version```，查看版本信息。注意一定到在```bin```的同级目录下执行，不要到```bin```内执行

## Demo应用服务器的部署
#### 配置修改
app软件下载解压后，修改```/config/sms.properties```文件，设置```superCode```为```66666```

#### 运行
执行```java -jar app-xxxx.jar```。
