# 服务端SDK

#### SDK简介
目前只提供有Java语言的服务端SDK，其它语言按照API接口文档来自己对接也很简单。服务器SDK包括Admin SDK、机器人SDK和频道SDK。如果您需要一种或多种功能都可以使用这个SDK。
1. Admin SDK是IM服务的管理SDK，实现了包括创建用户、发送消息、创建群组、创建机器人、创建频道、管理敏感词、封禁/解封用户、消息回调等操作，实现了所有的[Server API](./admin_api/)接口。
2. 机器人SDK是机器人管理SDK，可以管理某个机器人，实现了包括查询用户、发送消息、创建群组等操作，实现了所有的[Robot API](./robot_api/)接口。
3. 频道SDK是频道SDK，可以管理某个频道，实现了包括查询用户、广播消息、单发消息、订阅/取消订阅、修改自身信息等操作，实现了所有的[Channel API](./channel_api/)接口。

#### SDK的位置
源码在```server/sdk```目录，编译打包后在release包中的```server_sdk```目录中。在```server_sdk```目录下有2个jar包和一个说明。


#### 引入SDK
1. 把release包中的两个jar包```common-0.xx.jar```和```sdk-0.xx.jar```放到工程目录下，比如```${ProjectPath}/src/lib```目录下。
2. 修改pom文件，在pom文件中加入如下依赖，注意修改jar包的路径
```xml
<dependencies>
		<dependency>
			<groupId>com.google.code.gson</groupId>
			<artifactId>gson</artifactId>
			<version>2.8.2</version>
		</dependency>

		<dependency>
			<groupId>commons-httpclient</groupId>
			<artifactId>commons-httpclient</artifactId>
			<version>3.1</version>
		</dependency>

		<dependency>
			<groupId>org.apache.httpcomponents</groupId>
			<artifactId>httpclient</artifactId>
			<version>4.5.3</version>
		</dependency>

		<dependency>
			<groupId>commons-codec</groupId>
			<artifactId>commons-codec</artifactId>
			<version>1.11</version>
			<scope>compile</scope>
		</dependency>

		<dependency>
			<groupId>com.google.protobuf</groupId>
			<artifactId>protobuf-java</artifactId>
			<version>2.5.0</version>
		</dependency>

		<dependency>
			<groupId>cn.wildfirechat</groupId>
			<artifactId>sdk</artifactId>
			<version>0.20</version>
			<scope>system</scope>
			<systemPath>${project.basedir}/src/lib/sdk-0.20.jar</systemPath>
		</dependency>

		<dependency>
			<groupId>cn.wildfirechat</groupId>
			<artifactId>common</artifactId>
			<version>0.20</version>
			<scope>system</scope>
			<systemPath>${project.basedir}/src/lib/common-0.20.jar</systemPath>
		</dependency>
	</dependencies>
```

3. 修改打包插件配置，确保打包时能把这两个jar包打进去，下面是springboot的修改，请参考。如果有问题，请百度解决。
```xml
<!--# 由于添加了本地jar包，需要打包时把sdk和common打进去，下面是springboot项目添加includeSystemScope部分，其它类型项目请百度。 -->
	<build>
    	<plugins>
    		<plugin>
    			<groupId>org.springframework.boot</groupId>
    			<artifactId>spring-boot-maven-plugin</artifactId>
    			<configuration>
    				<includeSystemScope>true</includeSystemScope>
    			</configuration>
    		</plugin>
    	</plugins>
    </build>
```

4. 编译打包，确保能够打包成功。

#### 使用SDK
1. 首先需要初始化。在```ChatConfig```类里有三个函数，分别初始化Server API接口、Robot API接口和Channel API接口。如果您只使用部分接口，只需要初始化您使用的功能就行了。
```java
AdminConfig.initAdmin(mIMConfig.admin_url, mIMConfig.admin_secret);

RobotService robotService = new RobotService(im_url, robotId, robotSecret);

ChannelServiceApi channelServiceApi = new ChannelServiceApi(im_url, channelId, channelSecret);
```
> Admin URL使用server API端口（默认是18080）， Robot和Channel API使用80端口。

2. 调用不同的接口，来实现功能
```java
//使用用户id获取token
  IMResult<OutputGetIMTokenData> tokenResult = UserAdmin.getUserToken(user.getUserId(), clientId);
  if (tokenResult.getErrorCode() != ErrorCode.ERROR_CODE_SUCCESS) {
    LOG.error("Get user failure {}", tokenResult.code);
    return null;
  }
  return tokenResult.getResult().getToken();

	//机器人发送消息给用户
	IMResult<SendMessageResult> resultRobotSendMessage = robotService.sendMessage("robot1", conversation, payload);
	if (resultRobotSendMessage != null && resultRobotSendMessage.getErrorCode() == ErrorCode.ERROR_CODE_SUCCESS) {
	    System.out.println("robot send message success");
	} else {
	    System.out.println("robot send message failure");
	    System.exit(-1);
	}
```

3. 使用说明
请参考源码```${ProjectPath}/sdk/src/main/java/cn.wildfirechat.sdk.Main.java```。如果有问题或者缺失，请提issue。
