
# `vue-chat`、`app-server` 和 `im-server` 部署在同一台服务器，如何开启 https?
仅当用户量很小的情况下可以这么部署，不然不建议部署在同一台服务器上！

## 前置说明
1. 生产环境，不建议采用这种方式部署，此种方式仅限于快速体验
2. 使用 nginx 来处理 https 和 wss
3. 需要准备准备三个域名，都解析到目标服务器
   1. web.example.com 用来访问 web 前端页面
   2. app.example.com 用来访问 app-server
   3. im.example.com 用来访问 im-server
4. 安全组/防火墙需要放行以下端口：80、443、1883、8084

## 修改```vue-chat```代码，启用https
1. 替换`proto.min.js`，用通过邮件获取的，绑定`im.example.com`域名的`proto.min.js`替换项目里面对应的原始文件
2. 修改`vue-chat`项目`config.js`文件，开启`WSS`，设定端口，并修改`appserver`为HTTPS地址：

```
// 开启WSS
static USE_WSS = true;
// HTTPS 端口
static ROUTE_PORT = 443;

// APP SERVER的地址。启用https时，APP SERVER必须是https地址
static APP_SERVER = 'https://app.example.com';
```

3. 执行`npm run build` 打包`vue-chat`项目

## 网页站点支持https
下面是nginx参考配置，部署完成之后，通过`https://web.example.com` 来访问站点
```
# web.conf
server{
    listen 80;
    server_name web.example.com;
    rewrite ^(.*)$  https://web.example.com permanent;
    location ~ / {
        index index.html index.php index.htm;
    }
}

server {
    listen 443 ssl;
    server_name  web.example.com;

    root /var/www/wildfirechat_web/dist; #将 vue-chat 打包出来的 dist 目录下的所有内容放到这儿，不是 dist 目录
    ssl_certificate /etc/nginx/cert/web.example.com.pem; # 配置通配符证书，或者域名证书
    ssl_certificate_key /etc/nginx/cert/web.example.com.key;

    location / {
        index  index.html;
    }
}
```

> 检查项：
> 1. 浏览器访问`https://web.example.com`，看是否返回`vue-chat`前端页面

## app-server支持https
下面是app-server nginx 参考配置
```
# app.conf
server {
        listen 80;
        server_name app.example.com;
        rewrite ^(.*)$  https://app.example.com permanent;
        location ~ / {
            index index.html index.php index.htm;
        }
}

server {
        listen 443 ssl;
        server_name app.example.com;

        root html;
        index index.html index.htm;
        client_max_body_size  10m; #文件最大大小
        ssl_certificate   cert/app.example.com.pem; #配置证书，可使用域名证书，或通配符证书
        ssl_certificate_key  cert/app.example.com.key;
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;

        ## 不需要添加 add_header Access-Control-Allow-Origin $http_origin; 等添加跨域相关 header 的配置，app-server 已经处理了跨域了，所有请求透传过去即可
        ##
        ## send request back to app server ##
        location / {
            proxy_pass http://127.0.0.1:8888; # app-server 默认端口是 8888
        }

        ## 如果需要通过 path 来分流的话，请参考下的配置，path后面的/和 8888 后面的/ 都不能省略，可参考这儿：https://www.jb51.net/article/244331.htm
        #location /app/ {
        #    proxy_pass http://127.0.0.1:8888/; # app-server 默认端口是 8888
        #}

}
```

> 检查项：
> 1. 访问`https://app.example.com`，确认是否返回`OK`两个字符

## im-server支持https

### 修改 im-server 配置
```
server.ip             im.example.com
http_port             80 # 这个端口不能修改，除非使用自定义端口的 SDK，否则修复后客户端将连不上 im-server
websocket_port        8083 # ws 端口
local_port            8080 # 和 nginx 配置文件里面的 8080 对应
# 使用代理的方式处理 secure websocket
websocket_proxy_host im.example.com
websocket_proxy_secure_port 8084 # wss 端口

# 使用代理的方式处理 secure websocket 时，https_port、secure_websocket_port 等不用配置，保持被注释掉的状态

```

> 检查项
> 1. 访问`http://im.example.com/api/version`，看是否返回一个 json 文本
> 2. 用这个[在线工具](http://docs.wildfirechat.cn/web/wstool/index.html)，检查 `ws://im.example.com:8083` 是否工作正常

### nginx 配置
#### 在nginx.conf的http区域添加下面map块

```
http {
    map $http_upgrade $connection_upgrade {
        default upgrade;
        '' close;
    }

    ## 其他配置项。。。

}

```

#### im-server route等接口支持https

```
# im-http.conf
upstream imserver_cluster  {
    server 127.0.0.1:8080; # 8080 对应 im-server 配置文件里面的 local_port
}

server {
    listen 80;
    server_name  im.example.com; #记得改成自己的域名

    root   html;
    index  index.html index.htm index.php;


    location /route {
        proxy_set_header  Host  $host;
        proxy_set_header  X-real-ip $remote_addr;
        proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass  http://imserver_cluster;
    }

    location /im {
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'p,cid,DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';

        proxy_set_header  Host  $host;
        proxy_set_header  X-real-ip $remote_addr;
        proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass  http://imserver_cluster;
        if ($request_method = 'OPTIONS') {
             return 204;
        }
    }

    location /fs {
        proxy_set_header  Host  $host;
        proxy_set_header  X-real-ip $remote_addr;
        proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass  http://imserver_cluster;
    }

    location /api {
        proxy_pass  http://imserver_cluster;
    }

}

server {
        listen 443 ssl;
        server_name im.example.com; # 记得改成自己的域名
        root html;
        index index.html index.htm;
        ssl_certificate   cert/im.example.com.pem; #配置证书，可使用域名证书，或者通配符证书
        ssl_certificate_key  cert/im.example.com.key;
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        location /route {
            proxy_set_header  Host  $host;
            proxy_set_header  X-real-ip $remote_addr;
            proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass  http://imserver_cluster;
        }

        location /im {
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods 'POST, OPTIONS';
            add_header Access-Control-Allow-Headers 'p,cid,DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';

            proxy_set_header  Host  $host;
            proxy_set_header  X-real-ip $remote_addr;
            proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass  http://imserver_cluster;
            if ($request_method = 'OPTIONS') {
                 return 204;
            }
        }

        location /fs {
            proxy_set_header  Host  $host;
            proxy_set_header  X-real-ip $remote_addr;
            proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass  http://imserver_cluster;
        }

        location /api {
                proxy_pass  http://imserver_cluster;
        }
}
```
> 检查项
> 1. 访问`https://im.example.com/api/version`，看是否返回一个 json 文本
> 2. 访问`http://im.example.com/api/version`，看是否返回一个 json 文本
> 3. 前面两项都必须正确返回才行

#### 配置wss
```
# im-wss.conf
upstream ws_node1  {
    server 127.0.0.1:8083; # 8083 对应 im-server 配置文件里面的 websocket_port
}

server {
    listen 8084 ssl; # 8084 对应 im-server 配置文件里面的 websocket_proxy_secure_port
    server_name im.example.com; # 记得改成你们自己的域名

    root html;
    index index.html index.htm;
    ssl_certificate   cert/im.example.com.pem; # 配置证书
    ssl_certificate_key  cert/im.example.com.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;

	location / {
        proxy_pass http://ws_node1;
        proxy_read_timeout 600s;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;

        proxy_set_header Host $host;
        proxy_set_header  X-real-ip $remote_addr;
        proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

```

> 检查项
> 1. 用这个[在线工具](http://docs.wildfirechat.cn/web/wstool/index.html)，检查 `wss://im.example.com:8084` 是否工作正常