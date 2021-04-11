# TURN服务安装说明

## 系统选择
这里使用CentOS作为范例，如果您是其它系统，本文档就无法解决问题了，可以做一下参考。CentOS版本在7.0以上，具有公网IP（如果是大局域网，需要具备大局域网的“公网IP”地址，也就是说可以被系统网络内的所有设备直接访问到）。需要开通TCP 3478和所有UDP端口或配置文件中指定范围的UDP端口。

## 安装过程
#### 系统环境
需要运行以下命令：
```
sudo yum install -y make gcc cc gcc-c++ wget

sudo yum install -y openssl-devel libevent libevent-devel
```

#### 安装 libEvent 组件
```
wget https://github.com/downloads/libevent/libevent/libevent-2.0.21-stable.tar.gz

tar -xvzf libevent-2.0.21-stable.tar.gz

cd libevent-2.0.21-stable && ./configure

make

sudo make install

cd ..
```

#### 安装TURN服务
```
wget http://turnserver.open-sys.org/downloads/v4.5.1.2/turnserver-4.5.1.2.tar.gz

tar -xvzf turnserver-4.5.1.2.tar.gz

cd turnserver-4.5.1.2 && ./configure

make

sudo make install
```

#### 配置
使用vi 编辑 ```/usr/local/etc/turnserver.conf```文件，修改如下部分:
```
listening-ip=${内网IP}
relay-ip=${内网IP}
external-ip=${外网IP}

user=username:password

min-port=49152
max-port=65535
```
> 有些服务器没有在NAT内，只有一个IP，那么配置中的内网IP就使用这个IP。
> 端口范围默认是注释掉的，也就是任何端口都有可能，这时就需要开放所有UDP端口；可以指定范围，然后开放这个范围udp入访权限。

#### 运行
```
turnserver -v -r ${公网IP}:3478 -a -o -c /usr/local/etc/turnserver.conf
```

#### 测试
使用[这个链接](https://docs.wildfirechat.net/webrtc/trickle-ice/)检查turn服务是否部署成功。***注意一定要是turn服务，不能是stun服务，一定要出现下图中红线标注的type***。
![图片](turn_check.jpeg)

> 当Type为"relay"且后面的地址为您的公网IP时，表明turn服务部署成功，否则为失败。

#### 进阶设置
启用TLS，生成证书并配置证书，这个就从网上自己找吧。

#### 最后
为了方便大家学习部署，我们录制了视频，点击[TURN部署部署](https://www.bilibili.com/video/BV1ok4y167b9/)观看。
