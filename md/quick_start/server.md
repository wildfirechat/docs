# 服务器部署

**包含两个服务：社区版IM服务(简称IM服务) 和 Demo应用服务(简称应用服务)**

服务器需要部署社区版IM服务和Demo应用服务。IM服务负责发送消息等IM业务；应用服务是模拟客户的应用服务，提供登录等功能。

## 环境需求
1. 系统要求

   Windows/Linux/MacOS都可以，需要网络环境。如果没有公网IP，也可以在局域网内体验。需要开通```1883```、```80```和```8888```端口的入防防火墙权限。上线时```open files```需配置为10万以上。
2. 软件要求

   JRE：1.8

## 野火IM服务器的部署
#### 准备软件版本
IM服务可以直接下载我们发布的[最新版本](https://static.wildfirechat.cn/distribution-latest-bundle-tar.tar.gz)，也可以从[Github](https://github.com/wildfirechat/im-server)或者[码云](https://gitee.com/wfchat/im-server)下载源码编译。得到软件包后解压。
> 这里有个限制IM服务要使用80端口，因为客户端强制绑定的是80端口。在云服务器上运行必须经过备案才能和域名一起使用80端口。另外还需要使用1883端口，请确保80/1883 TCP端口畅通。

> 如果您下载的是源码，请按照说明编译出软件包来运行。

> **第一次部署时，强烈建议直接部署，别引入 nginx、docker 等，待部署成功之后，再按需引入。**

#### 运行

##### mac/linux系统

1. 命令行到解压目录，注意目录不要有空格和中文。然后进入到bin目录中。

2. **使用root用户**，执行``` bash ./wildfirechat.sh```，**请注意本命令为前台运行，退出终端后，程序将停止运行。**
> 后台执行可以使用命令```nohup bash ./wildfirechat.sh 2>&1 &```，确保退出终端时程序能够继续运行

##### windows系统

1. 命令行到解压目录，注意目录不要有空格和中文。然后进入到bin目录中。

2. 执行命令 ```wildfirechat.bat```（双击执行不可用，必须命令行)。

> 在windows下编辑过，可能会保存为windows格式，在放到linux上执行时，有可能会出现错误，处理方法请参考[FAQ](https://docs.wildfirechat.cn/faq/server.html)


执行相应系统的启动命令之后，等待10秒钟后，在浏览器中输入```http://${服务器的IP}/api/version```，查看版本信息。

#### 停止
当需要重启时，关掉``` sh ./wildfirechat.sh```的进程并不能关掉服务，linux用户请用下面命令找到服务的PID，然后用```kill```命令停掉服务.
```
ps -ef | grep wildfirechat
```
> windows用户可以用任务管理器找到wildfirechat进程，并杀掉它。
> kill命令不要用-9，因为关闭时有些数据是要回写到数据库的，-9会导致丢消息

## 应用服务器的部署
#### 下载软件
应用服务软件可以直接下载我们发布的[最新版本](https://static.wildfirechat.cn/app-server-release-latest.tar.gz)，也可以从[Github](https://github.com/wildfirechat/app_server)或者[码云](https://gitee.com/wfchat/app_server)下载源码编译。下载的软件包解压后得到一个jar包和一个config文件，如果是自己编译，需要把源码中的config文件拷贝到jar包的同目录下。

#### 运行
执行```java -jar app-0.xx.jar```，**请注意本命令为前台运行，退出终端后，程序将停止运行。**
> 后台执行可以使用命令```nohup java -jar app-0.xx.jar 2>&1 &```，确保退出终端时程序能够继续运行

#### 检查程序可用性
等待10秒钟，在浏览器中输入```http://${服务器的IP}:8888/```，查看是否返回OK。

## 问题排查
如果部署后客户端无法连接，请按照[这里](../faq/server/q1.md)说明来排查。

## 更多
快速开始只是为了让客户更快更方便地体验到野火IM地功能，上线前需要仔细阅读整个文档（全部读下来只需要2～4个小时，但会有很大地帮助，强烈建议全部读一遍），然后按照[上线检查事项](../blogs/上线检查事项.md)，核对每一条是否完成。
