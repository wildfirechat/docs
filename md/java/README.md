# Java客户端

野火IM提供Java客户端，该客户端是一个精简版的客户端，只具有连接和收发消息能力。可以用于智能硬件的Android或者linux系统中。不建议用于后端服务，后端服务建议使用消息转发和server api来收发消息。


#### 使用方法

##### 1. 构造IMClient，参数依次为userId, token, clientid, 服务器地址，服务器端口。例如：

```
//token与userid和clientid是绑定的，使用时一定要传入正确的userid和clientid，不然会认为token非法
IMClient client = new IMClient("yzyOyOKK", "7SJk13q+YdHHe6EwDzry9BKogxTNf3UgtYj50cBTZgWNkNuxEkiqg2koKg0lXViONIX1LmwCR1jN0Mw8hvk6KGpiSKFi+IRaRkIb3mNzgIfrq4afhyIHaQfa2HOfsi6Ws+9YobkdDgdq7W70bEdVfiCSU9+JOIY449nxZzfg2Zw=", "DD72C212-26C7-4B38-A5FC-88550896B170", "192.168.1.101", 80);
```
> 理解所有参数的意义，每一个参数不能错误。客户经常出现的错误就是随便填写clientid，clientid与用户的session对应，clientid不是获取token时传入的值时，将无法连接。这里的参数及client源码里的测试参数仅为示例，无法直接使用。请参考demo的登录过程获取这几个参数（登录请求里有clientId，响应里有token和userId）。

##### 2.设置回调函数， 可以设置连接回调和发消息回调。

```
client.setReceiveMessageCallback(new ReceiveMessageCallback() {
    @Override
    public void onReceiveMessages(List<WFCMessage.Message> messageList, boolean hasMore) {

    }

    @Override
    public void onRecallMessage(long messageUid) {

    }
});

client.setConnectionStatusCallback((ConnectionStatus newStatus) -> {
    if (newStatus == ConnectionStatus_Connected) {

    }
});
```

##### 3.连接

```
client.connect();
```

##### 4.发送消息，在连接成功后就可以发送消息了

```
WFCMessage.Conversation conversation = WFCMessage.Conversation.newBuilder().setType(0).setTarget("yzyOyOKK").setLine(0).build();
WFCMessage.MessageContent messageContent = WFCMessage.MessageContent.newBuilder().setContent("helloworld").setType(1).build();
client.sendMessage(conversation, messageContent, new SendMessageCallback() {
    @Override
    public void onSuccess(long messageUid, long timestamp) {
        System.out.println("send success");
    }

    @Override
    public void onFailure(int errorCode) {
        System.out.println("send failure");
    }
});
```

##### 5. 特别注意事项
clientId唯一代表一台设备，一个clientId只能存在一个连接。如果有多个地方使用同一个clientId，比如同时在手机和服务器使用同一个clientId，会产生不可预料的错误。

##### 6. 使用java client的流程
1. 首先需要生成一个uuid，java有类库来实现，需要保证uuid的唯一性。
2. 使用uuid到im服务去获取token（调用sdk中的getIMToken方法）。
3. 使用uuid+token去连接。
4. 您可以保存下来uuid+token，每次固定使用。
