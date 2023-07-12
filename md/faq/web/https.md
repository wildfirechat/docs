# ```web-chat```如何启用https？
为了提高网站的安全性，建议启用HTTPS支持。启用https支持需要下面五步，注意必须全部实现缺一不可。

## 1. 修改```web-chat```代码，启用https
修改```web-chat```项目```config.js```文件，开启```WSS```，设定端口，并修改```appserver```为HTTPS地址：
```
// 开启WSS
static USE_WSS = true;
// HTTPS 端口
static ROUTE_PORT = 443;

// APP SERVER的地址。启用https时，APP SERVER必须是https地址
static APP_SERVER = 'https://app.wildfirechat.net';
```

## 2. 网页站点支持https
部署web站点时启用https支持，可以使用nginx来开启https。部署方法请自行解决，下面是我们的nginx配置，可以参考
```
server{
    listen 80;
    server_name web.wildfirechat.net;
    rewrite ^(.*)$  https://web.wildfirechat.net permanent;
    location ~ / {
        index index.html index.php index.htm;
    }
}

server {
    listen 443;
    server_name  web.wildfirechat.net;

    root /home/ubuntu/wildfirechat_web/src;
    ssl_certificate /etc/nginx/cert/web.pem;
    ssl_certificate_key /etc/nginx/cert/web.key;

    location / {
        index  index.html;
    }
}
```

## 3. appserver支持https
appserver开启https支持，部署方法请自行解决，下面是我们appserver的nginx配置，可以参考
```
server {
        listen 80;
        server_name app.wildfirechat.net;
        rewrite ^(.*)$  https://app.wildfirechat.net permanent;
        location ~ / {
            index index.html index.php index.htm;
        }
}

server {
        listen 443 ssl;
        server_name app.wildfirechat.net;

        root html;
        index index.html index.htm;
        client_max_body_size  10m; #文件最大大小
        ssl_certificate   cert/app.pem;
        ssl_certificate_key  cert/app.key;
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;

        ## 不需要添加 add_header Access-Control-Allow-Origin $http_origin; 等添加跨域相关 header 的配置，app-server 已经处理了跨域了，所有请求透传过去即可
        ##
        ## send request back to app server ##
        location / {
            proxy_pass http://127.0.0.1:8888;
        }

        ## 如果需要通过 path 来分流的话，请参考下的配置，path后面的/和 8888 后面的/ 都不能省略，可参考这儿：https://www.jb51.net/article/244331.htm
        #location /app/ {
        #    proxy_pass http://127.0.0.1:8888/;
        #}

}
```

## 4. imserver支持https
1. route接口支持https

    请查阅相关邮件，确定真实的```ROUTE_PORT```，通过```nginx```等手段，将访问该端口的```route```请求转到 im server，下面是我们的配置，可以参考:
    ```
    upstream imserver_cluster  {
    server 192.168.2.1;
    server 192.168.2.2;
    server 192.168.2.3;
    }

    server {
        listen 80;
        server_name  wildfirechat.net;

        root   html;
        index  index.html index.htm index.php;


        location /route {
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
            listen 443;
            server_name wildfirechat.net;
            ssl on;
            root html;
            index index.html index.htm;
            ssl_certificate   cert/a.pem;
            ssl_certificate_key  cert/a.key;
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

            location /api {
                    proxy_pass  http://imserver_cluster;
            }
    }
    ```
2. 配置wss

    请参考专业版IM的配置中关于 ***secret websocket*** 部分

## 5. 文件存储支持https
请参考[对象存储服务章节](../../server/oss.md)
