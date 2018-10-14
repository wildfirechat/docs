# Admin API接口
Admin API是供客户服务器调用的，所有接口的调用都必须经过签名。

## 签名规则
以下参数需要放在Http Request Header中

| 参数| 参数说明 |
| ---- | ------|
| nonce | 随机数 |
| timestamp | 当前的时间戳，为了防止重放攻击，时间戳与火信服务器时间戳差2个小时的请求会被拒绝 |
| sign | 签名 |

> 签名的计算方法： ```sign = sha1(nonce + "|" + SECRET_KEY + "|" + timestamp)```。其中SECRET_KEY定义在moquette.conf中。为了安全一定要修改默认的SECRET_KEY。
