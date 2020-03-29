## ```web-chat```如何启用https？

### 浏览器访问```web-chat```的时候，会进行下面一些操作，如果需要支持https，那么所有操作都需要支持。
1. 请求网页本身
2. 请求appserver创建session、登录等
3. 请求imserver进行route
4. 通过websocket和im server的某一个节点建立长连接
5. 发送图片等时，需要访问文件存储服务器进行文件上传

### 部署实践
1. 购买一台机器作为代理服务器，为其分配一个域名(文档以web.wildfirechat.cn示例)，安装nginx，并部署web应用
2. 将***im server的授权域名***、app server的域名，解析到代理服务器，
3. web端对app server、im server进行http、https访问时，都经由代理服务器转发，参考配置如下：

```
# imserver.conf

upstream imserver_cluster  {
    server 192.168.2.5;  # imserver node1
    server 192.168.2.11; # imserver node2
    server 192.168.2.15; # imserver node3
}

server {
    listen 80;
    server_name  wildfirechat.cn; #im server的授权域名

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
        server_name wildfirechat.cn;
        ssl on;
        root html;
        index index.html index.htm;
        ssl_certificate   cert/a.pem; #证书配置，一定是对应im server授权域名的证书
        ssl_certificate_key  cert/a.key; #证书配置，一定是对应im server授权域名的证书
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

```
# appserver.conf

upstream appserver  {
    server 192.168.0.10:8888; # app server
}

server {
    listen 8888;
    server_name  www.wildfirechat.cn;

    root   html;
    index  index.html index.htm index.php;

    ## send request back to app server ##
    location / {
        proxy_pass  http://appserver;
    }
}

```

```
## web.conf
server {
    listen 80;
    listen 443;
    server_name  web.wildfirechat.cn; # 分配给你的web端页面的域名，浏览器输入https://web.wildfirechat.cn访问web-chat

    root /home/ubuntu/wildfirechat_web/src;
    ssl_certificate /etc/nginx/cert/web.pem; #一定要是和分配给你的web端域名对应的正你数
    ssl_certificate_key /etc/nginx/cert/web.key;

    location /pc_session{
        proxy_pass   http://localhost:8888;
    }
    location /route{
        proxy_set_header  Host  $host;
        proxy_set_header  X-real-ip $remote_addr;
        proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
        ## proxy_pass   http://localhost:8080;
        proxy_pass   http://imserver_cluster;
    }
    location /session{
        proxy_pass   http://localhost:8888;
    }
    location /session_login{
        proxy_pass   http://localhost:8888;
    }
    location / {
        index  index.html;
    }
}

```
4. im server配置支持secure websocket，可采取两种方式配置，每个节点都需要配置
   1. 采用nginx转发secure websocket请求，将8084端口的请求转发到8083端口
   ```
       # websocket start
    map $http_upgrade $connection_upgrade {
        default upgrade;
        '' close;
    }
    upstream websocket {
        server 127.0.0.1:8083;
    }

    server {
        listen       8084 ssl;
        server_name  localhost;

        ssl_certificate ssl/certs/node1.imtest.wildfirechat.cn.crt; # 每个节点都需要设置该节点域名对应的证书，或者使用通配符在证书
        ssl_certificate_key ssl/private/node1.imtest.wildfirechat.cn.key;
        ssl_dhparam ssl/certs/dhparam.pem;

        #ssl_session_cache    shared:SSL:1m;
        #ssl_session_timeout  5m;

        #ssl_ciphers  HIGH:!aNULL:!MD5;
        #ssl_prefer_server_ciphers  on;

         location / {
            proxy_pass http://websocket;
            proxy_http_version 1.1;
            proxy_connect_timeout 4s;
            proxy_read_timeout 60s;                  #配置点2，如果没效，可以考虑这个时间配置长一点
            proxy_send_timeout 12s;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
            proxy_set_header Host $host;
        }
    }

    # websocket start
   ```
   2. secure websocket直连im server，每个节点都需要进行如下配置
   ```
    jks_path /path_to_your_keystore/node1.imtest.jks  # 重要!! 每个节点都需要使用对应该节点域名的证书，或者使用通配符证书
    key_store_password 证书密码
    key_manager_password 证书密码
   ```
