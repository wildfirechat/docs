# Server API接口
Server API是供客户服务器调用的。所有的请求都是POST方式，body使用json格式。所有接口的调用都必须经过签名。所有的响应数据都是JSON格式。我们提供了Java语言的Server SDK，建议Java的客户使用[SDK](../sdk.md)。

## 签名规则
以下参数需要放在Http Request Header中

| 参数| 参数说明 |
| ---- | ------|
| nonce | 随机数 |
| timestamp | 当前的时间戳，为了防止重放攻击，时间戳与野火IM服务器时间戳差2个小时的请求会被拒绝 |
| sign | 签名 |

> 签名的计算方法： ```sign = sha1(nonce + "|" + SECRET_KEY + "|" + timestamp)```。其中SECRET_KEY定义在wildfirechat.conf中。为了安全一定要修改默认的SECRET_KEY。

## Content-Type
```
"Content-Type": "application/json; charset=utf-8"
```

## 响应
所有响应都是如下这个格式。成功时code为0，result为请求返回对于的数据；失败时code为错误码，msg为失败提示。
```
{
  "code":0,
  "msg":"success",
  "result":{
    "userId":"a",
    "imToken":"hN0AF2XX6+pOWqMS7iQiZnCFfGA53r1r"
  }
}
```
