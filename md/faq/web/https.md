# ```web-chat```如何启用https？

## ```web-chat```启用https支持的，需要：
0. 修改```web-chat```代码，启用https
1. 网页本身支持https
2. appserver支持https
3. imserver支持https
4. 文件存储支持https

## 修改```web-chat```代码
参考```web-chat```项目```config.js```文件的注释

## 部署实践
### 网页本身
可采用nginx部署，让其支持nginx，参考配置如下：
```
## web.conf
server {
    listen 80;
    listen 443;
    server_name  web.wildfirechat.cn; # 分配给你的web端页面的域名，浏览器输入https://web.wildfirechat.cn访问web-chat

    root /home/ubuntu/wildfirechat_web/src; # 和web-chat编译生成的dist/src一致
    ssl_certificate /etc/nginx/cert/web.pem; #一定要是和分配给你的web端域名对应的证书
    ssl_certificate_key /etc/nginx/cert/web.key;

    location / {
        index  index.html;
    }
}

```
### app server
可采用nginx代理转发，让app server支持https，参考配置如下
```
## appserver.conf
server {
    listen 443; #https端口
    server_name  app.example.com; # 分配给app server的域名，

    ssl_certificate /etc/nginx/cert/web.pem; #证书一定要和域名对应
    ssl_certificate_key /etc/nginx/cert/web.key;

    location /{
        proxy_pass   http://localhost:8888;
    }
}

```
可采用```curl https://app.example.com:443```测试是否配置成功，配置成功会返回OK。```web-chat```的```config.js```里面的```APP_SERVER```需要填写https地址。

### im server
1. 针对授权域名，需要做负载均衡，可采用nginx，参考配置如下：
```

upstream imserver_cluster  {
    server 192.168.2.5;  # imserver node1
    server 192.168.2.11; # imserver node2
    server 192.168.2.15; # imserver node3
}

server {
    listen 80;
    server_name  example.com; #im server的授权域名

    root   html;
    index  index.html index.htm index.php;

    location /route {
        proxy_set_header  Host  $host; #host一定要带上
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
        server_name example.com; #授权域名
        ssl on;
        root html;
        index index.html index.htm;
        ssl_certificate /etc/nginx/cert/web.pem; #证书一定要和域名对应
        ssl_certificate_key /etc/nginx/cert/web.key;;
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

2. 针对每个节点，需要进行如下配置配置：
   ```
    # wildfirechat.conf
    jks_path /path_to_your_keystore/node1.imtest.jks  # 重要!! 每个节点都需要使用对应该节点域名的证书，或者使用通配符证书
    key_store_password 证书密码
    key_manager_password 证书密码
   ```

### 文件存储服务
文件存储服务，需要支持https，推荐使用七牛，或者野火IM专业版文件存储服务。