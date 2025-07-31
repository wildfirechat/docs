
# 快速跑通`vue-chat`？

## 前置说明
0. 需要先官方申请试用`Web SDK`及专业版 IM-Server，申请试用请参考[试用服务](../../trial/README.md)
1. 将`app-server` 和 `im-server` 部署在同一台服务器，且暂不开启 https/wss 支持
2. 本教程仅仅演示如何快速跑通野火IM Web 端，线上使用时，需要配置 https 等
3. 由于浏览器限制，未配置 https  情况下，仅`http://localhost`访问页面时，支持音视频通话
4. 假设`Web SDK`和专业版 IM-Server 绑定的域名是`im.example.com`， 也可以是 ip，后面步骤里面的`im.example.com`要替换所绑定的具体域名或 ip

## 端口说明
1. 会使用到 80、1883、8083 端口，防火墙或安全组，一定要开放这些端口的访问
2. 如果端口被其他应用占用，请使用一台专门的主机

## 部署专业版 im-server

### 修改 im-server 配置
```
server.ip             im.example.com # 绑定的是 ip 时，填对应的 ip
http_port             80 # 这个端口不能修改，除非使用自定义端口的 SDK，否则修复后移动客户端将连不上 im-server
websocket_port        8083 # ws 端口，这行默认是注释了的，要取消注释
local_port            80 # 一定要保证和 http_port 一致

```

### 启动专业版 im-server
1. 参考[野火IM服务器的部署](../../quick_start/server.md#野火IM服务器的部署)


> 检查项
> 1. 访问`http://im.example.com/api/version`，看是否返回一个 json 文本
> 2. 用这个[在线工具](http://docs.wildfirechat.cn/web/wstool/index.html)，检查 `ws://im.example.com:8083` 是否工作正常

## 部署 app-server
0. 不用改任何配置，采用默认配置即可
1. 参考[应用服务器的部署](../../quick_start/server.md#应用服务器的部署)

> 检查项：
> 1. 访问`http://im.example.com:8888`，确认是否返回`OK`两个字符

##  本地运行 vue-chat
### 修改 vue-chat 配置
1. 替换`proto.min.js`，用通过邮件获取的，绑定`im.example.com`域名的`proto.min.js`替换项目里面对应的原始`proto.min.js`文件
2. 修改`vue-chat`项目`config.js`文件中相关配置，如下：

```
// 关闭WSS
static USE_WSS = false;
// HTTP 端口
static ROUTE_PORT = 80;

// APP SERVER的地址。启用https时，APP SERVER必须是https地址
static APP_SERVER = 'http://im.example.com:8888';
```

3. 执行`npm install --registry=https://registry.npmmirror.com --loglevel verbose` 安装相关依赖
4. 执行`npm run serve`启动`vue-chat`
5. 点击`使用密码/验证码登录` -> `使用验证码登录`，切换到使用验证码登录界面
6. 使用手机号 + 验证码登录，不用发送验证，默认验证码是 `66666`(5个6)。