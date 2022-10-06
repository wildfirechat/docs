# IM服务配置
专业版IM服务默认只开启了对原生客户端的支持。如果有基于websocket的客户端，比如Web客户端和小程序客户端，需要在IM服务配置中修改配置来支持它们。具体配置方法跟专业版IM服务的部署方式有关，可以分为下面几种情况。

## IM服务单机部署
这种部署方式是指单机部署一个IM服务，前面没有Nginx或者负载均衡。客户端直连IM服务。这种使用方式应该是最简单的。修改IM服务的配置文件```wildfirechat.conf```，修改server.ip为授权域名或者授权IP，打开配置```https_port```、```websocket_port```、```secure_websocket_port```、```jks_path```及证书的两个密码。证书要为授权域名的证书，不能用自签名的。

## IM服务集群部署，节点直连
这种部署方式是指部署一个或者多个IM服务，授权域名指向Nginx或者负载均衡，客户端先通过http方式获取到自己的节点再直连到自己的节点上的方式。这种方式应该是最常见的集群部署方式。修改IM服务的配置文件```wildfirechat.conf```，修改server.ip为节点域名，打开配置```websocket_port```、```secure_websocket_port```、```jks_path```及证书的两个密码。证书要为授权域名的证书，不能用自签名的。另外Nginx或者负载均衡需要添加443的配置，脱掉S后转到IM服务的80端口。

与单机部署的区别就是https的访问通过nginx来脱S。另外每个节点都有自己的节点域名，需要配置节点的证书。

## IM服务集群部署，单入口方式
这种部署方式是指部署一个或者多个IM服务，授权域名指向Nginx或者负载均衡，客户端的http访问和长连接都是通过Nginx或者负载均衡进行。这种方式应该是安全单位最常见的集群部署方式。修改IM服务的配置文件```wildfirechat.conf```，修改server.ip为授权域名，打开配置```websocket_port```，为每个节点配置为不同的ws端口。具体方法请参考IM服务软件包nginx目录下的单入口方式配置说明。

## 代理部署方式
还可以使用nginx或者负载均衡来支持websocket的接入。修改IM服务配置文件```wildfirechat.cof```，打开配置```websocket_port```端口（可以固定为8083）。另外打开代理配置，包括```websocket_proxy_host```、```websocket_proxy_port```和```websocket_proxy_secure_port```，端口每个节点要分开。```websocket_proxy_host```指向一个Nginx或者负载均衡，在Nginx或者负载均衡代理对应的```websocket_proxy_port```到对应的节点的```websocket_port```端口。同理对应的```websocket_proxy_secure_port```脱掉S后转到对应节点的```websocket_port```端口。

## Websocket的代理
单入口方式和代理方式中，websocket都要通过nginx或则负载均衡的代理，注意跟普通http的方式不一样，请从网上查找具体配置，另外开启链接保持10分钟以上。

## 防火墙和安全组
需要开放对应的端口入访权限.
