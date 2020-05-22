# TURN服务安装说明

## 系统选择
这里使用CentOS作为范例，如果您是其它系统，本文档就无法解决问题了，可以做一下参考。CentOS版本在7.0以上，具有公网IP（如果是大局域网，需要具备大局域网的“公网IP”地址，也就是说可以被系统网络内的所有设备直接访问到）。需要开通TCP 3478和所有UDP端口或指定范围的UDP端口。

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

tar -xvfz libevent-2.0.21-stable.tar.gz

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

make && make install
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

#### 运行
```
turnserver -v -r ${公网IP}:3478 -a -o -c /usr/local/etc/turnserver.conf
```

#### 测试
使用[这个链接](https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/)检查turn服务是否部署成功。***注意一定要是turn服务，不能是stun服务，一定要出现下图中红线标注的type***。
![图片](turn_check.jpeg)

> 当Type为"relay"且后面的地址为您的公网IP时，表明turn服务部署成功，否则为失败。

#### 进阶设置
启用TLS，生成证书并配置证书，这个就从网上自己找吧。
