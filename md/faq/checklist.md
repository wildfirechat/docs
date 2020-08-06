#  野火IM快速部署检查单

**请仔细阅读下面的检查单，并结合各个配置项处的注释，进行修改!!!**

体验野火IM，至少需要部署以下服务，请先完成所有服务的部署：

1. IM Server
2. app-server
3. 手机端

------

## IM Server

### 社区版版IM Server
0. 服务器防火墙或安全组是否开放了```80```、```1883```的外网访问权限?
1. ```server.ip``` 是否修改为域名或者机器的外网ip？
2. ```port``` 是否保持原样?
3. ```http_port``` 是否保持原样？

### 专业版IM Server
todo

## app-server
0. 服务器防火墙或安全组是否开放了```8888```的外网访问权限？
1. ```im.properties```里面的```im.admin_url```是否修改了指向已部署的```im server```

## Android
1. ```Config.java```里面的```IM_HOST```是否修改？
2. ```Config.java```里面的```APP_SERVER_ADDRESS```是否修改？

## iOS
1. ```config.m```里面的```IM_HOST```是否修改？
2. ```config.m```里面的```APP_SERVER_ADDRESS```是否修改？

## web-chat
1. ```proto.min.js```是否已替换?
2. ```config.js```里面的```APP_SERVER```是否已修改？
3. ```config.js```里面的```WEB_APP_ID```是否已修改？
4. ```config.js```里面的```WEB_APP_KEY```是否已修改？
5. ```config.js```里面的```USE_WSS```是否已修改？

## pc-chat
1. ```.node```文件是否已经替换？
2. 替换了```.node```文件之后，是否执行了```npm run copy-xxx```?
3. ```config.js```里面的```APP_SERVER```是否已修改？

## wx-chat
1. ```proto.min.js```是否已替换?
2. ```config.js```里面的```APP_SERVER```是否已修改？
3. ```config.js```里面的```WEB_APP_ID```是否已修改？
4. ```config.js```里面的```WEB_APP_KEY```是否已修改？
5. ```config.js```里面的```USE_WSS```是否已修改？
6. 是否参考```wx-chat```的```README```进行了开发工具的配置？

---------
**完成上面的检查之后**，如果还存在问题，请给我们提供客户端日志。