# 专业版IM服务的网络说明
社区版比较简单，客户端直接连接就好了。专业版功能更多，网络也就更复杂了。这里想用这篇文章来说清楚专业版IM服务的网络情况和给出如何配置专业版IM服务的网络。

## 名词解释
1. JS客户端，指基于JS协议栈的客户端，包括Web客户端和小程序客户端，通过websocket与IM服务建立长连接。
1. 原生客户端，指基于C++协议栈的客户端，包括所有移动端客户端和PC客户端，通过TCP与IM服务建立长连接。
3. 公网地址或者公网IP，这里是个相对概念，是指客户端可以直接连到的地址，在互联网上就是公网IP地址，在政企专网内，为所有客户端能够访问到的地址。
4. NG和负载均衡，野火的部分部署方式需要负载均衡，一般情况下NG就可以很好的满足需求。也有部分客户有更昂贵的负载均衡或者其他工具。下面提到的NG都可以替换为其他负载工具，配置也可以参考NG的配置

## 专业版IM服务的网络工作流程
无论如何部署，客户端（包括原生客户端和JS客户端）和专业版IM服务的关于网络的工作流程都是如下：
1. 客户端HTTP调用IM_HOST地址，如果是JS客户端也可能是HTTPS调用IM_HOST地址。
2. IM服务收到请求后，根据客户端的信息计算分配这个客户端所属节点，并把所属节点的网络配置返回给客户端，包括server.ip和端口，如果是原生客户端，端口包括HTTP_PORT和PORT。如果是JS客户端，端口包括WS_PORT和WSS_PORT。
3. 客户端收到所属的节点的配置，然后建立长连接。

## 野火IM专业版部署方法
部署方法有单机部署、多节点直连和但入口模式3种办法。分别对应不同的场景。
1. 单机部署：这种部署方式最简单，只部署一台IM服务，且IM服务的地址和端口公网暴露。有种情况是IM服务部署在内网，然后用端口映射的方法，这种情况也算单机部署。
2. 多节点直连：这种部署方式在常见普通客户中最常见，部署多个节点，每个节点都有公网地址和端口。另外还有一个NG。只有一个节点和NG，也算是多节点直连。
3. 单入口模式：这种部署方式常见一些政企客户，只有一个公网地址部署NG，所有节点都只有内网地址，所有请求都只能通过NG中转。

简单来说，如果只有一个节点且具有公网地址就是单机部署；如果每个节点都有公网IP地址就是多节点直连；如果多个节点只有一个公网地址就是单入口模式。多节点直连和单入口模式都需要NG。

## 单机部署
修改IM服务配置文件，server.ip配置为授权地址。如果授权地址为域名，需要注意把授权地址域名解析到当前IM服务的公网地址。端口配置保持默认既可以。如果有Web客户端，需要打开websocket_port 8083的配置。如果需要支持HTTPS，需要打开https_port和secure_websocket_port，另外配置好JKS证书（包括jks_path，key_store_password和key_manager_password）。

防火墙放开80，1883的入访权限。如果有web客户端，需要放开8083的入访权限，如果支持https，需要另外放开443和8084的入访权限。

检查HTTP端口，浏览器打开http://授权地址/api/version 看看是否返回json.

检查TCP端口，安装telnet工具后 telnet 授权地址 1883 看看是否能够连上。

如果有web客户端，http://docs.wildfirechat.cn/web/wstool/index.html 用这个连接检查一下websocket。

如果web客户端是https的，用浏览器打开https://授权地址/api/version 看看是否返回json。http://docs.wildfirechat.cn/web/wstool/index.html 用这个连接检查一下websocket ssl。

## 多节点直连部署
修改IM服务配置文件，server.ip配置为每个节点的公网IP地址。端口配置保持默认既可以。如果有Web客户端，需要打开websocket_port 8083的配置。

NG的地址为授权地址，NG需要负载每个节点的80端口，可以参考专业版IM服务软件包下nginx目录下的imserver.conf文件。这个文件中的关于SSL的配置如果没有HTTPS的JS客户端，可以去掉。

每个节点的防火墙放开80，1883的入访权限。如果有web客户端，需要放开8083的入访权限。

如果需要支持HTTPS的JS客户端，上面提到的***专业版IM服务软件包下nginx目录下的imserver.conf文件***里的SSL配置需要保留，443处理SSL后转到各个节点的80端口。另外还需要对每个节点增加websocket ssl的配置。首先需要为每个节点分配一个WS和WSS的端口，比如节点1为5017&5020，节点2为5018&5021，节点3为5019&5022依次类推（此处为举例，可以更换为其他端口，不能端口重复）。然后把每个节点IM服务配置文件中的websocket_proxy_host打开，配置为授权地址，每个节点的websocket_proxy_port和websocket_proxy_secure_port分别配置为对应地址。

NG需要添加对每个节点的wss代理，可以参考专业版IM服务软件包下nginx目录下的proxy目录，里面有个readme.txt。

检查HTTP端口，浏览器打开http://授权地址/api/version 看看是否返回json。在把授权地址改成每个节点的IP地址，看看是否返回同样的JSON

检查TCP端口，安装telnet工具后 telnet 节点IP地址 1883 看看是否能够连上。

如果有web客户端，http://docs.wildfirechat.cn/web/wstool/index.html 用这个连接检查一下每个节点的websocket。

如果web客户端是https的，用浏览器打开https://授权地址/api/version 看看是否返回json。http://docs.wildfirechat.cn/web/wstool/index.html 用这个连接检查一下每个节点的websocket ssl。

## 单入口模式
参考专业版IM服务软件包下nginx目录下的single_address目录，里面有个single_address.md。按照此说明即可。
