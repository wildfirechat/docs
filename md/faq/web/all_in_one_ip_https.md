
# `vue-chat`、`app-server` 和 `im-server` 部署在同一台服务器，且没有域名，如何开启 https?
仅当用户量很小的情况下可以这么部署，不然不建议部署在同一台服务器上！

## 前置说明
0. 由于 ip 的 ssl 证书比较难采购；自签证书的话，浏览器默认不信任，需要手动处理，故这种方式是不推荐的
1. 生产环境，也不建议采用这种方式部署，此种方式仅限于快速体验
2. 使用 nginx 来处理 https 和 wss
3. 需要准备一个 ip，多个端口，并准备对应 ip 的证书
   1. 8888 http 访问 app-server 的端口
   2. 8884 https 访问 app-server 的端口
   3. 80 http 方式访问 im-server 的端口，im-server 默认监听，一定要求支持，移动端需要
   4. 443 https 方式访问 im-server 的端口
   5. 1883 im-server 长连接端口
   6. 8083 im-server websocket 端口
   7. 8084 im-server secure websocket 端口
   8. 8013 http 方式访问 web 前端页面的端口
   9. 8443 https 方式访问 web 前端页面的端口
4. 安全组/防火墙需要放行上一步中的所有端口

## 修改```vue-chat```代码，启用https
1. 替换`proto.min.js`，用通过邮件获取的，绑定`{your_ip}`的`proto.min.js`替换项目里面对应的原始文件
2. 修改`vue-chat`项目`config.js`文件，开启`WSS`，设定端口，并修改`appserver`为HTTPS地址：

```
// 开启WSS
static USE_WSS = true;
// HTTPS 端口
static ROUTE_PORT = 443;

// APP SERVER的地址。启用https时，APP SERVER必须是https地址
static APP_SERVER = 'https://{your_ip}:8884';
```

3. 执行`npm run build` 打包`vue-chat`项目

## 网页站点支持https
下面是nginx参考配置，部署完成之后，通过`https://{ip}:8443` 来访问站点
```
# web.conf
server{
    listen 8013
    rewrite ^(.*)$  https://{ip}:8443 permanent;
    location ~ / {
        index index.html index.php index.htm;
    }
}

server {
    listen 8443 ssl;

    root /var/www/wildfirechat_web/dist; #将 vue-chat 打包出来的 dist 目录下的所有内容放到这儿，不是 dist 目录
    ssl_certificate /etc/nginx/certs/your_ip.pem; # 配置通配符证书，或者域名证书
    ssl_certificate_key /etc/nginx/certs/your_ip.key;

    location / {
        index  index.html;
    }
}
```

执行`nginx -t` 检查配置是否正确

执行`nginx -s reload` 让配置生效

> 检查项：
> 1. 浏览器访问`https://{ip}:8443`，看是否返回`vue-chat`前端页面

## app-server支持https
下面是app-server nginx 参考配置
```
# app.conf
server {
        listen 8884 ssl;

        root html;
        index index.html index.htm;
        client_max_body_size  10m; #文件最大大小
        ssl_certificate   certs/your_ip.pem; #配置证书
        ssl_certificate_key  certs/your_ip.key;
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

执行`nginx -t` 检查配置是否正确

执行`nginx -s reload` 让配置生效

> 检查项：
> 1. 访问`https://{ip}:8888`，确认是否返回`OK`两个字符
> 2. 访问`https://{ip}:8884`，确认是否返回`OK`两个字符

## im-server支持https

### 修改 im-server 配置
```
server.ip             {your_ip}
http_port             80 # 这个端口不能修改，除非使用自定义端口的 SDK，否则修复后客户端将连不上 im-server
websocket_port        8083 # ws 端口
local_port            8080 # 和 nginx 配置文件里面的 8080 对应
# 使用代理的方式处理 secure websocket
websocket_proxy_host  {your_ip}
websocket_proxy_secure_port 8084 # wss 端口

# 使用代理的方式处理 secure websocket 时，https_port、secure_websocket_port 等不用配置，保持被注释掉的状态

```

> 检查项
> 1. 访问`http://{your_ip}/api/version`，看是否返回一个 json 文本
> 2. 用这个[在线工具](http://docs.wildfirechat.cn/web/wstool/index.html)，检查 `ws://{your_ip}:8083` 是否工作正常

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
        root html;
        index index.html index.htm;
        ssl_certificate   certs/your_ip.pem; #配置证书
        ssl_certificate_key  certs/your_ip.key;
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

执行 `nginx -t` 检查配置是否正确

执行 `nginx -s reload` 让配置生效

> 检查项
> 1. 访问`https://{your_ip}/api/version`，看是否返回一个 json 文本
> 2. 访问`http://{your_ip}/api/version`，看是否返回一个 json 文本
> 3. 前面两项都必须正确返回才行

#### 配置wss
```
# im-wss.conf
upstream ws_node1  {
    server 127.0.0.1:8083; # 8083 对应 im-server 配置文件里面的 websocket_port
}

server {
    listen 8084 ssl; # 8084 对应 im-server 配置文件里面的 websocket_proxy_secure_port

    root html;
    index index.html index.htm;
    ssl_certificate   certs/your_ip.pem; # 配置证书
    ssl_certificate_key  certs/your_ip.key;
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


执行 `nginx -t` 检查配置是否正确

执行 `nginx -s reload` 让配置生效

> 检查项
> 1. 用这个[在线工具](http://docs.wildfirechat.cn/web/wstool/index.html)，检查 `wss://{your_ip}:8084` 是否工作正常
> 2. 如果内网使用，不能用在线监测工具时，可以下载[离线测试工具](https://static.wildfirechat.cn/wstool-offline.zip)