# Server API接口
Server API是供客户服务器调用的。**所有请求都是POST方式，且请求参数都是以Json格式放到body里面，不是Query参数，直接拼接到url上无效**。所有接口的调用都必须经过签名。所有的响应数据都是JSON格式。我们提供了Java语言的Server SDK，建议Java的客户使用[SDK](../sdk.md)。

## 签名规则
以下参数需要放在Http Request Header中，请注意**参数名是小写**

| 参数| 参数说明 |
| ---- | ------|
| nonce | 随机数 |
| timestamp | 当前的时间戳，**单位是毫秒**。为了防止重放攻击，时间戳与野火IM服务器时间戳差2个小时的请求会被拒绝 |
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
## 测试
服务器配置中有个参数，可以关掉时间检查，能够方便大家进行调试
```
#服务器API接口参数是否检查时间。当设置为false时，所有的请求会检查时间的有效性；当设置为true时，可以在http.admin.secret_key保持不变的情况下，使用固定的服务API签名
##nonce = "76616", timestamp = "1558350862502", sign = "b98f9b0717f59febccf1440067a7f50d9b31bdde"
http.admin.no_check_time false
```
在secret没有变，且关掉时间检查开关的情况下，可以直接使用上述的签名进行测试。在正式上线时 ***一定要修改secret和打开时间检查***，否则就相当于家里的大门开着，很容易被黑客攻击。
