# 野火IM支持国密啦
国密算法是我国自主研发的一系列数据加密算法，具体细节就不介绍了，网上有很多相关资料，记住国密是国产的算法而且安全性非常高就足够了。最近有金融行业的客户对野火IM的加密算法有定制需求，想要把我们SDK使用的AES加密改成国密算法，我们最近就实现了对国密的支持。金融行业的客户都使用了，说明国密的安全性非常高，如果对安全性有极高要求的客户可以使用国密来加密传输。

## 那些组件在使用国密
IM服务专业版和客户端之间的链接使用国密算法加密。如果使用野火私有对象服务，客户端上传文件到野火私有对象服务也是经过国密算法加密的。

## 为什么只使用了SM4
SM4是对称加密算法，替换了野火中的AES加密。国密算法中还有SM2非对称加密，这个一般是建立链接交换对称加密密钥用的，野火的密钥是通过token来传递的，需要应用层来保证token的传递安全，野火不涉及到SM2的使用场景。

## 如何切换到国密算法
野火支持国密和AES加密，但只能选其中一种。在客户端SDK有```useSM4()```方法开启国密算法，服务器需要在配置文件中打开```encrypt.use_sm4```开关，对象存储服务的说明中也有如何开启国密加密的方法。

## 限制
国密算法需要使用双方同时支持，不能客户端和服务器一端用国密另外一端用AES。另外不支持切换，比如开始用AES再切换到国密，只能项目开始时就确定下来那种加密方式不能改变。
