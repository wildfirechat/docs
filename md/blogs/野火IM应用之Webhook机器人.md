# 野火IM应用之Webhook机器人
工作中使用过阿里非常多的服务，基本上都能够接入钉钉机器人进行通知。各种各样的事件都可以通过钉钉第一时间通知到您。当时就觉得非常的“高科技”，非常的“专业”，觉得这是一件很了不起的事情。现在本文告诉您，再也不用羡慕它了，因为您拥有的远比它更自由灵活和强大。

野火IM是连接人与人、连接人与服务的通道。自有服务很容易通过API和消息回调与野火IM进行整合，而第三方服务一般是无法进行编码对接的，就没有办法进行整合了吗？其实是有的，一般第三方服务都会有webhook，通过机器人服务就能与您的系统进行整合。下面我们以github为例，给大家讲一下怎么对接具有webhook的第三方服务。对接的demo工程点击[Github](https://github.com/wildfirechat/github_webhook)或者[码云](https://gitee.com/wfchat/github_webhook)查看

## 1. 先看一下效果
我们开启了github的webhook功能，所有github的事件都会回调到机器人服务，机器人服务解析事件，然后把事件以可以阅读的内容发送给需要的人。
![截图](https://static.wildfirechat.cn/githubwebhook.jpeg)

这样我们就可以看到客户提交回复issue的情况，就可以看到客户star和fork我们的情况，就可以看到团队成员提交代码的情况。非常的方便。

未来可以继续定义指令或者自定义消息，客户端发送指令，比如查询star数，机器人收到后，调用github api进行查询，查询成功后返回。

## 2. 准备好一个机器人
野火IM系统会自动创建一个机器人，您可以直接使用它，也可以通过server api重新创建一个新的机器人，建议您重新创建一个。创建完机器人后，您将会拥有机器人的id和机器人的密钥，后面会用到。

## 3. 配置和使用
下载[demo](https://github.com/wildfirechat/github_webhook)工程，然后按照上面的[说明](https://github.com/wildfirechat/github_webhook/blob/master/README.md)进行配置打包运行，另外按照上面的说明配置github webhook设置就可以了。这样当github有事件通知，您的野火IM就会收到消息通知啦。

## 4. 总结
机器人是非常有用的角色，基于它您将可以做非常多有意思的事情。您可以把这个[demo](https://github.com/wildfirechat/github_webhook)稍加修改，就能对接上所有具有webhook的服务。甚至由于机器人拥有双向沟通能力，您可以定义指令或者自定义消息来控制机器人调用第三方服务的API。使用它就将会为您或您的客户极大的提高信息化水平，提高系统服务于人的能力。
