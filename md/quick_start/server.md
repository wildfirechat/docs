# 服务器部署
服务器提供编译好的发布版本，从[这里](http://www.baidu.com)下载。

## 环境需求
Windows/Linux/MacOS都可以，需要JRE1.8以上，需要网络环境。如果没有外网，也可以在局域网内体验。需要开通```1883```和```80```端口。

## 配置修改
安装包下载下来后，修改```/config/moquette.conf```文件，修改```local.media.server.ip```和```server.ip```为服务器ip地址。

## 运行
在mac/linux系统下，执行```sh ./bin/moquette.sh```;在windows系统下，执行```bin\moquette.bat```。等待10秒钟后，在浏览器中输入```http://${服务器的IP}/api/version```，查看版本信息。

## 注册测试账户
使用脚本```/tool/register.py```注册测试账户。首先需要修改脚本里IM服务器的地址。之后运行python register.py username password 来注册测试用户。
