## Server SDK
应用通过机器人API和频道API与IM服务进行沟通的。野火提供有Java、Golang和Node.js版本的SDK，使用SDK更方便。SDK中包含管理API、机器人API和频道API，请注意只使用机器人API和频道API。

SDK及使用方法请参考 [SDK测试代码](https://github.com/wildfirechat/im-server/blob/wildfirechat/sdk/src/main/java/cn/wildfirechat/sdk/Main.java) 中的 ```testRobot```和```testChannel```方法。

**Golang SDK**
- GitHub: https://github.com/wildfirechat/server-sdk-go
- 码云: https://gitee.com/wfchat/server-sdk-go

详情请参考开源项目。

**Node.js SDK**
- GitHub: https://github.com/wildfirechat/server-sdk.js
- 码云: https://gitee.com/wfchat/server-sdk.js

详情请参考开源项目。

如果其它语言，可以参考[机器人API](../server/robot_api/README.md)和[频道API](../server/channel_api/README.md)来自行开发。
