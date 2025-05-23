# 服务器端口说明
服务器使用了多个端口，大概分为2类，一类是对外端口，一类是对内端口。

## 对外端口
对外端口，顾名思义是对互联网开放的，使用者包括原生客户端、web/小程序客户端、机器人API和频道API。分别说明一下

### 原生客户端
野火原生客户端使用IM服务的80和1883端口，其中80端口是HTTP协议，1883端口是TCP协议。

### Web/小程序客户端
Web/小程序客户端是基于JS的，使用IM服务的80和8083端口，其中80端口是HTTP协议，8083端口是WebSocket协议。建议上线添加SSL，使用HTTPS和WSS，可能的端口就变成了443和8083。

### 机器人API和频道API
这两类都可以提供给其他第三方在公网使用，所以放到一起说，他们都使用IM服务的80端口。建议上线添加SSL，使用HTTPS，那么端口就可能是443。

## 对内端口
对内端口也就是文档中常说的Server API。供内部其他业务服务调用，拥有最高权限，默认为18080。

## 为什么机器人API和频道API使用80，而server api使用18080？
因为server api权限非常大，只能内部使用。而机器人api和频道api权限有限，可以提供给第三方开发更多的业务，所以放开到公网使用，所以端口不一样。
