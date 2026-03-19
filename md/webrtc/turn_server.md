# TURN服务安装说明
TURN服务是开源服务，不属于野火IM维护，这里给大家一个部署参考，如果遇到问题，请在网上查找解决方案。这里给出的示例是使用源码编译安装运行的，网上有很多docker的方案也是可以的，也可以考虑用docker的方法，都是可以的。

## 系统选择
这里使用CentOS作为范例，如果您是其它系统，本文档就无法解决问题了，可以做一下参考。CentOS版本在7.0以上，具有公网IP（如果是大局域网，需要具备大局域网的“公网IP”地址，也就是说可以被系统网络内的所有设备直接访问到）。需要开通 ***3478 (同时开通UDP和TCP端口)*** 和配置文件中指定范围的UDP端口(如果没有指定需要开通所有UDP端口，建议指定范围)的入访和出访权限。

## 安装过程
#### 系统环境
需要运行以下命令：
```
sudo yum install -y make gcc cc gcc-c++ wget

sudo yum install -y openssl-devel libevent libevent-devel
```

> OpenSSL需要是1.0.2或者1.x。下面编译的coturn4.5.1.3与OpenSSL3.x有兼容问题。

#### 安装 libEvent 组件
```
wget https://github.com/libevent/libevent/releases/download/release-2.1.12-stable/libevent-2.1.12-stable.tar.gz

tar -xvzf libevent-2.1.12-stable.tar.gz

cd libevent-2.1.12-stable && ./configure

make

sudo make install

cd ..
```

#### 安装TURN服务
```
wget https://github.com/coturn/coturn/archive/4.5.1.3.tar.gz

tar -xvzf 4.5.1.3.tar.gz

cd coturn-4.5.1.3 && ./configure

make

sudo make install
```

> 地址可能会无法访问，如果无法访问可以从网上找找这个版本。
> 如果编译失败，可以是OPENSSL版本不兼容，请确保OPENSSL版本为1.0.2或者1.X。已知OPENSSL 3.X有问题。

#### 配置
默认有个配置模版在```/usr/local/etc/turnserver.conf.default```，需要复制一个名称为```/usr/local/etc/turnserver.conf```。然后使用vi 编辑 ```/usr/local/etc/turnserver.conf```文件，修改如下部分:
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
使用[这个链接](https://docs.wildfirechat.cn/webrtc/trickle-ice/)检查turn服务是否部署成功。***注意一定要是turn服务，不能是stun服务，一定要出现下图中红线标注的type***。
![图片](turn_check.jpeg)

> 当Type为"relay"且后面的地址为您的公网IP时，表明turn服务部署成功，否则为失败。

#### 关掉日志
当turn服务正常工作后，可以考虑关掉日志，避免生成大量的日志文件占满磁盘空间。在配置文件中，添加如下这句话：
```
log-file=/dev/null
```

#### 客户端配置
> 此处以 Android 端为例，其他端也是类似的

```
    // Config.java
    public static String[][] ICE_SERVERS/*请仔细阅读上面的注释*/ = new String[][]{
        // 如果是高级版，请删除掉下面的配置项目，保持ICE_SERVERS为空数组就行。
        // 数组元素定义
        /*{"turn server uri", "userName", "password"}*/
        // 请根据部署情况修改下面的配置
        {"turn:turn.wildfirechat.net:3478", "wfchat", "wfchatpwd"} // 请根据部署情况，修改下面的配置
    };

```

#### 进阶设置
启用TLS，生成证书并配置证书，这个就从网上自己找吧。

#### 已知问题
turn服务4.5.2版本与OpenSSL1.1.1之前版本不兼容，所以要用4.5.1.3才行。

#### 版本升级
以上libEvent和turnserver的版本都是写文档时最新的版本，以后可能会有更新的版本发布，请自行替换成最新的或者自己喜欢的版本。

#### 最后
为了方便大家学习部署，我们录制了视频，点击[TURN部署部署](https://www.bilibili.com/video/BV1ok4y167b9/)观看。
