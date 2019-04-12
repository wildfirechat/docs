# ChatUIKit简介
ChatUIKit是IM UI工具集，依赖于ChatClient。当ChatClient调用connect后（调用connect就直接打开了数据库，不用等待成功连上），ChatUIKit就可以使用。

ChatUIKit包含以下页面：
* 会话列表界面
* 消息列表界面
* 输入框的处理
* 好友界面
* 好友请求处理界面
* 会话设置界面
* 个人信息界面
* 群组信息界面
* 频道信息界面
* 音视频通话界面

消息类型的支持：
* 文本
* 图片
* 语音
* 视频
* 文件
* 动态表情
* 输入状态
* 地理位置
* 通知消息
* 自定义消息，可以自己添加任意类型消息

音视频通话：
音视频通话只支持1对1，如果不需要可以选择去掉。搜索```WFCU_SUPPORT_VOIP``` 找到头文件中定义改成0。工程中去掉WebRTC和WFAVEngineKit的依赖。
