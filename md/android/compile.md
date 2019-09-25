## 代码编译于工程说明

###	工程说明

本工程下面包含如下一些子module

| module名称        | 说明                              | 备注                                              |
| ----------------- | --------------------------------- | ------------------------------------------------- |
| avenginekit       | 音视频相关                        | 目前只支持1对1音视频                              |
| chat              | 野火IM的演示App，包含野火IM UIKit | 如果想复用野火IM提供的UI组件，可基于UIKit进行开发 |
| client            | 野火IM Lib部分，不包含UI          | 如果不需要野火IM提供的UI部分，可基于此进行开发    |
| emojilibrary      | 表情相关                          |                                                   |
| imagepicker       | 图片选择相关                      |                                                   |
| mars-core-release | 协议栈wrapper                     |                                                   |



### 编译部署

1. 如果服务器是私有部署，则需对应修改服务器地址，然后编译。

   ```java
   // cn.wildfire.chat.app.Config.java
   // IM server相关地址及端口，不用写http
   String IM_SERVER_HOST = "wildfirechat.cn"; 
   int IM_SERVER_PORT = 80;
   
   // App server相关地址及端口，一定要写http
   String APP_SERVER_ADDRESS = "http://wildfirechat.cn:8888";
   
   // Voip turn服务相关
   String ICE_ADDRESS = "turn:turn.liyufan.win:3478";
   String ICE_USERNAME = "wfchat";
   String ICE_PASSWORD = "wfchat";
   ```
   
2. 导入```Android Studio```进行编译，或者在项目根目录执行```./gradlew clean build```进行编译。

   1. 可能需要科学上网
   2. 由于依赖了一些推送等第三方，可能某段时间找不到对应的依赖，可以自行调试一下。

   