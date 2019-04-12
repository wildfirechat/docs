# SDK与Demo的关系
## SDK
SDK分为ChatClient和ChatUIKit，其中ChatClient提供IM能力，另外附加群组关系托管，用户信息托管和好友关系托管，只提供能力，不包括UI界面。ChatUIKit提供常用的UI界面，客户可以直接使用ChatUIKit的UI来进行二次开发，也可以只使用ChatClient自己来开发UI。

## Demo
Demo是使用了ChatUIKit的演示。演示如何集成我们的SDK

## 我们提供的支持
SDK和Demo全部开源，都采用MIT版权。但我们对SDK和Demo提供不同的技术支持。

对于SDK的ChatClient，我们提供完全的维护工作，建议客户不要修改这个SDK，如果有bug请提交issue，如果缺少IM的某些功能导致应用无法完成某项功能，也可以提issue给我们。

对于ChatUIKit和Demo，建议用户自己修改，如果有issue可以给我们提Pull Request。
