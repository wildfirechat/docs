# 服务器配置

```config``` 目录下放有所有服务器的配置，部署时需要对配置进行修改

#### 1. 服务器的地址
把下面四个0替换成您的公网IP地址，并且开通这3个端口。端口要保持不变并开通公网访问，不要用其它端口！

```
server.ip 0.0.0.0
port 1883
http_port 80
websocket_port 8083
```
> 客户端需要设置服务器地址，请使用域名指向这个ip，然后使用http://${domain} 地址（当然如果没有域名直接使用ip也行）。如果您的域名为www.wildfirechat.cn，那么客户端的服务器地址为http://www.wildfirechat.cn。 由于[mars](./api_description.md#安全防护)的限制，请使用https站点（不用担心，都经过AES加密的）。

#### 2.修改数据库
请参考[数据库配置](./db_config.md)

#### 3.修改服务器API密钥
把下面这个值换一个随机数，注意您调用这些接口的地方都要相应修改。
```
http.admin.secret_key 123456
```

#### 4.修改客户端密钥
16个字节的随机数，注意同步修改客户端对应的密钥，不然连不上。
```
##客户端协议栈密钥，需要与客户端协议栈文件libemqq.cc文件中的aes_key值保持一致，16进制byte用逗号分割
client.proto.secret_key 0x00,0x11,0x22,0x33,0x44,0x55,0x66,0x77,0x78,0x79,0x7A,0x7B,0x7C,0x7D,0x7E,0x7F

```

#### 5.配置媒体服务器
请参考[媒体服务器选择](./media_server.md)

#### 6.推送配置
请参考[推送说明](.push_config.md)
