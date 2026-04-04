# 野火音视频高级版开发指南

* 适用语言：本文档为语言无关的API规范文档，任何编程语言均可参考实现。  
* API文档：野火机器人API完整文档请参考 [机器人API](../server/robot_api/)
* Java参考实现：文中Java代码仅作为参考实现，展示如何调用API和处理逻辑。
* 物联网设备：参考 [物联网设备的接入](物联网设备的接入.md) 

## 1. 概述

野火音视频高级版是基于 Janus Gateway 和 WebRTC 技术构建的音视频通话解决方案。支持单聊和群聊通话，具备以下特点：

- 支持 SFU（Selective Forwarding Unit）架构，适合多人会议
- 支持音视频同时传输或纯音频通话
- 支持双向和单向（观众模式）通话
- 基于会议（Room）的媒体管理模式

## 2. 系统架构

### 2.1 核心组件

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Application Layer                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                      │
│  │  AVEngineKit │  │  CallSession │  │ CallEndPoint │                      │
│  └──────────────┘  └──────────────┘  └──────────────┘                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                               Signal Layer                                  │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │              SignalServer                                           │    │
│  │  - 消息信令 (sendMessage)                                           │    │
│  │  - 会议信令 (sendConference)                                        │    │
│  └────────────────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────────────────┤
│                          Robot Service Layer (野火SDK)                        │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │              RobotService                                           │    │
│  │  - sendMessage(机器人用户发送消息)                                   │    │
│  │  - sendConferenceRequest(发送会议请求)                               │    │
│  │  - getRobotId(获取机器人用户ID)                                     │    │
│  └────────────────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────────────────┤
│                               IM Server Layer                               │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │              IMCallback(消息回调接口)                                │    │
│  │  - onReceiveMessage(接收消息)                                       │    │
│  │  - onConferenceEvent(接收会议事件)                                  │    │
│  └────────────────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────────────────┤
│                              Media Layer                                    │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │              WebRTC Stack                                           │    │
│  │  - PeerConnection                                                   │    │
│  │  - Audio/Video Tracks                                               │    │
│  │  - ICE/STUN/TURN                                                    │    │
│  └────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 机器人用户说明

音视频高级版需要以**机器人用户**身份接入IM服务。

#### 什么是机器人用户

机器人用户是IM系统中的一种特殊用户类型：
- 与普通用户一样有用户ID、昵称、头像
- 可以发送和接收消息
- 可以被邀请加入群组
- **区别在于**：机器人用户通过服务端程序接入，而非移动端APP

#### 机器人用户的作用

1. **发送信令消息**：通过机器人账号发送 Type 400-420 的音视频信令消息
2. **接收信令消息**：接收对方发送的音视频信令消息（Type 400-420）
3. **发送会议请求**：通过机器人账号向 Janus 会议服务器发送控制命令
4. **接收会议事件**：接收 Janus 会议服务器推送的媒体事件

#### 创建和配置机器人用户

1. 在IM管理后台创建机器人用户，获取机器人用户ID
2. 使用机器人用户ID和密码初始化 `RobotService`
3. 将 `RobotService` 传入 `AVEngineKit.init()` 完成音视频引擎初始化

```java
// 初始化机器人服务（野火SDK提供）
RobotService robotService = new RobotService(IM_SERVER_URL, ROBOT_USER_ID, ROBOT_PASSWORD);

// 初始化音视频引擎
AVEngineKit.getInstance().init(robotService, engineKitCallback);
```

### 2.3 机器人用户与IM服务的交互

音视频引擎通过机器人用户与IM服务和会议服务器进行双向通信。

#### 2.3.1 发送接口（HTTP API）

机器人API通过HTTP协议提供，所有请求均为POST，请求体使用JSON格式。**端口使用80端口**（不同于Server API的18080端口）。

完整API文档请参考：https://docs.wildfirechat.cn/server/robot_api/

##### 通用请求规范

**请求头（Header）**:

| 参数 | 说明 |
|------|------|
| Content-Type | `application/json; charset=utf-8` |
| nonce | 随机字符串 |
| timestamp | 当前时间戳（毫秒），与服务器时间差2小时的请求会被拒绝 |
| sign | 签名：`sha1(nonce + "\|" + SECRET_KEY + "\|" + timestamp)` |
| rid | 机器人用户ID |

**响应格式**:

```json
{
  "code": 0,        // 0表示成功，非0表示错误
  "msg": "success", // 错误描述
  "result": {}      // 业务数据
}
```

##### API 1: 发送消息

用于发送音视频信令消息（Type 400-420）。

**请求**:
```http
POST http://{domain}/robot/message/send
Content-Type: application/json
nonce: 76616
timestamp: 1558350862502
sign: b98f9b0717f59febccf1440067a7f50d9b31bdde
rid: robot_av_001

{
  "conv": {
    "type": 0,          // 0=单聊, 1=群聊, 2=频道
    "target": "user1",  // 目标用户ID或群组ID
    "line": 0           // 会话线路
  },
  "payload": {
    "type": 400,        // 消息类型（400-420）
    "content": "call-id-uuid",  // 通话ID
    "base64edData": "eyJ0cyI6WyJ1c2VyMSJdLCJhIjox..."  // Base64编码的附加数据
  }
}
```

**响应**:
```json
{
  "code": 0,
  "msg": "success",
  "result": {
    "messageUid": 5323423532,  // 消息唯一ID
    "timestamp": 13123423234324
  }
}
```

**参考实现**（Java SDK）:

```java
public long sendMessage(Conversation conversation, MessagePayload payload) {
    try {
        // 调用野火SDK的机器人接口发送消息
        IMResult<SendMessageResult> imResult = robotService.sendMessage(
            robotService.getRobotId(),  // 机器人用户ID作为发送者
            conversation, 
            payload
        );
        
        if(imResult.getErrorCode() == ErrorCode.ERROR_CODE_SUCCESS) {
            return imResult.getResult().getMessageUid();  // 返回消息UID
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
    return -1;  // 发送失败
}
```

**使用场景**：
- 发送 Type 400 邀请通话消息
- 发送 Type 401 接听消息
- 发送 Type 402 结束通话消息

---

##### API 2: 发送会议请求

用于与 Janus 会议服务器交互。

**请求**:
```http
POST http://{domain}/robot/conference/request
Content-Type: application/json
nonce: 76616
timestamp: 1558350862502
sign: b98f9b0717f59febccf1440067a7f50d9b31bdde
rid: robot_av_001

{
  "robotId": "robot_av_001",    // 机器人ID
  "clientId": "uuid-client-001", // 客户端唯一标识（UUID）
  "request": "create_room",      // 请求类型
  "sessionId": 0,                // Janus会话ID（首次填0）
  "roomId": "call-id-uuid",      // 房间ID（对应通话callId）
  "data": "{\"publishers\":10,\"is_private\":true,\"pin\":\"1234\"}",  // 请求体JSON字符串
  "advance": false               // 是否高级会议（音视频高级版填true）
}
```

**响应**:
```json
{
  "code": 0,
  "msg": "success",
  "result": "{\"session_id\":123456789,\"handle_id\":987654321,...}"
}
```

**request 类型列表**:

| request | 说明 | 适用场景 |
|---------|------|----------|
| create_room | 创建会议房间 | 主叫方发起通话时 |
| join_pub | 加入会议并作为发布者 | 双方接听后发送 |
| join_sub | 加入会议并作为订阅者 | 需要订阅其他用户媒体时 |
| message | 发送SDP或控制消息 | 发送offer/answer/configure等 |
| trickle | 发送ICE candidate | ICE收集过程中 |
| keepalive | 保活心跳 | 每20秒发送一次 |
| leave | 离开房间 | 结束通话时 |

**参考实现**（Java SDK）:

```java
public void sendConference(String robotId, String clientId, String request, 
                           long sessionId, String roomId, String data, 
                           boolean advance, ConferenceResponseCallback callback) {
    try {
        // 调用野火SDK的机器人接口发送会议请求
        IMResult<String> imResult = robotService.sendConferenceRequest(
            robotId, clientId, request, sessionId, roomId, data, advance
        );
        
        if(imResult != null) {
            if(imResult.getErrorCode() == ErrorCode.ERROR_CODE_SUCCESS) {
                callback.onResponse(imResult.getResult());  // 返回JSON响应
            } else {
                callback.onError(imResult.getCode());  // 返回错误码
            }
        }
    } catch (Exception e) {
        callback.onError(-2);
        e.printStackTrace();
    }
}
```

---

##### API 3: 设置回调地址

配置IM服务将消息和会议事件推送到应用层的URL。

**请求**:
```http
POST http://{domain}/robot/set_callback
Content-Type: application/json
nonce: 76616
timestamp: 1558350862502
sign: b98f9b0717f59febccf1440067a7f50d9b31bdde
rid: robot_av_001

{
  "url": "http://your-server:8080/robot/callback"
}
```

**响应**:
```json
{
  "code": 0,
  "msg": "success"
}
```

**说明**：设置回调地址后，IM服务会将所有发给该机器人用户的消息和会议事件推送到此URL。

#### 2.3.2 接收回调（IM服务推送）

IM服务会将属于机器人用户的消息和会议事件推送到应用层配置的回调节口。

##### 接收消息回调

当有人向机器人用户发送消息时，IM服务会POST到配置的回调地址。

**回调请求**:

```http
POST http://your-server:8080/robot/callback
Content-Type: application/json

{
  "conv": {
    "type": 0,
    "target": "robot_av_001",
    "line": 0
  },
  "sender": "user1",
  "messageId": 123456789,
  "payload": {
    "type": 400,
    "content": "call-id-uuid",
    "base64edData": "eyJ0cyI6WyJ1c2VyMSJdLCJhIjox..."
  }
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| conv.type | int | 会话类型（0=单聊, 1=群聊） |
| conv.target | string | 会话目标（单聊为对方ID，群聊为群组ID） |
| conv.line | int | 会话线路 |
| sender | string | 发送者用户ID |
| messageId | long | 消息唯一ID |
| payload.type | int | 消息类型（400-420） |
| payload.content | string | 通话ID（callId） |
| payload.base64edData | string | Base64编码的附加数据 |

**处理流程**:

```java
/**
 * IM服务消息推送回调
 * HTTP接口接收并处理
 */
@PostMapping("/robot/callback")
public void onRobotCallback(@RequestBody OutputMessageData messageData) {
    // 转发给音视频引擎处理
    boolean isCallMessage = AVEngineKit.getInstance()
        .onReceiveCallMessage(messageData);
    
    if (isCallMessage) {
        System.out.println("收到音视频信令消息: type=" + 
            messageData.getPayload().getType());
    } else {
        // 处理其他普通消息
    }
}
```

1. IM服务收到发给机器人用户的消息
2. IM服务将消息POST到配置的回调地址
3. 应用层调用 `AVEngineKit.onReceiveCallMessage()` 处理
4. SDK解析消息类型：
   - Type 400：创建新的 CallSession，回调 `onReceiveCall()`
   - Type 401/402：找到对应 CallSession 并处理

---

##### 接收会议事件回调

当 Janus 会议服务器产生事件时，会通过IM服务POST到回调地址。

**回调请求**:

```http
POST http://your-server:8080/robot/callback
Content-Type: application/json

{
  "session_id": 123456789,
  "handle_id": 987654321,
  "data": {
    "videoroom": "event",
    "publishers": [
      {
        "id": "user1",
        "streams": [
          {"type": "audio", "mid": "0"},
          {"type": "video", "mid": "1"}
        ]
      }
    ]
  }
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| session_id | long | Janus会话ID，用于匹配CallSession |
| handle_id | long | Janus句柄ID |
| data.videoroom | string | 事件类型标识 |
| data.publishers | array | 新发布者列表 |

**处理流程**:

```java
/**
 * IM服务会议事件推送回调
 */
@PostMapping("/robot/callback")
public void onConferenceEvent(@RequestBody String eventJson) {
    // 直接原样转发给音视频引擎
    // SDK会根据session_id匹配对应的CallSession
    AVEngineKit.getInstance().onConferenceEvent(eventJson);
}
```

1. Janus 服务器产生事件（如用户加入、开始发布媒体等）
2. IM服务接收事件并与机器人用户关联
3. IM服务将事件POST到回调地址
4. 应用层调用 `AVEngineKit.onConferenceEvent()`
5. SDK解析 `session_id` 找到对应的 CallSession
6. CallSession 根据事件类型进行相应处理

#### 2.3.3 交互时序图

**主叫方发起通话**:

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│   应用层  │     │AVEngineKit│    │  HTTP客户端  │    │  IM服务    │    │Janus服务器│
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │                │
     │ 1.startPrivateCall()            │                │                │
     │────────────────>│                │                │                │
     │                │                │                │                │
     │                │ 2.create_room  │                │                │
     │                │───────────────>│                │                │
     │                │                │ 3.POST /robot/conference/request │
     │                │                │───────────────>│                │
     │                │                │                │ 4.转发到Janus   │
     │                │                │                │───────────────>│
     │                │                │                │ 5.返回响应      │
     │                │                │                │<───────────────│
     │                │                │ 6.返回session_id│                │
     │                │                │<───────────────│                │
     │                │                │                │                │
     │                │ 7.sendMessage()│                │                │
     │                │───────────────>│                │                │
     │                │                │ 8.POST /robot/message/send      │
     │                │                │───────────────>│                │
     │                │                │                │ 9.发送Type400给被叫
     │                │                │                │───────┐        │
     │                │                │                │       │        │
     │                │                │ 10.返回messageUid                │
     │                │                │<───────────────│<──────┘        │
     │                │                │                │                │
     │                │ ◄──── 等待被叫方接听 ────►       │                │
     │                │                │                │                │
```

**被叫方收到通话邀请**:

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│   应用层  │     │AVEngineKit│    │  IM服务    │    │Janus服务器│
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │
     │ ◄─────────── POST /robot/callback (Type400消息) ───│
     │                │                │                │
     │ 1.onReceiveCallMessage()        │                │
     │────────────────>│                │                │
     │                │                │                │
     │ 2.onReceiveCall()回调           │                │
     │<────────────────│                │                │
     │                │                │                │
     │ ◄────── 用户点击接听按钮 ─────►  │                │
     │                │                │                │
     │ 3.answer()     │                │                │
     │────────────────>│                │                │
     │                │                │                │
     │                │ 4.POST /robot/message/send      │
     │                │────────────────>│ 5.发送Type401给主叫
     │                │                │───────┐        │
     │                │                │       │        │
     │                │ 6.返回messageUid                │
     │                │<────────────────│<──────┘        │
     │                │                │                │
```

**会议事件推送**:

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│   应用层  │     │AVEngineKit│    │  IM服务    │    │Janus服务器│
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │
     │                │                │ ◄─── 用户发布媒体 ───│
     │                │                │                │
     │ ◄─────────── POST /robot/callback (publishers事件) ──│
     │                │                │                │
     │ 1.onConferenceEvent(eventJson)  │                │
     │────────────────>│                │                │
     │                │                │                │
     │                │ 2.解析session_id                │
     │                │ 3.找到对应CallSession           │
     │                │ 4.创建CallEndPoint              │
     │                │ 5.POST /robot/conference/request│
     │                │───────────────────────────────>│
     │                │                │                │
```

### 2.4 信令类型

系统使用两类信令：

1. **消息信令**：通过 IM 消息通道传输，类型范围为 400-420
2. **会议信令（ConferenceEvent）**：通过会议服务器传输，内容为 JSON 格式

## 3. 信令详细说明

### 3.1 消息信令

消息信令通过 IM 系统发送，消息 `Payload` 结构如下：

```java
public class MessagePayload {
    int type;        // 消息类型
    String content;  // 通话ID (callId)
    String base64edData;  // Base64编码的JSON数据
}
```

#### 3.1.1 发起通话 (Type = 400)

**方向**: 主叫方 → 被叫方

**Payload 结构**:
- `type`: 400
- `content`: 通话ID (UUID)
- `base64edData`: Base64编码的 JSON 对象

**base64edData 解码后的 JSON**:
```json
{
  "ts": ["userId1", "userId2"],  // 目标用户ID列表
  "a": 1,                          // 是否音频通话 (1=是, 0=否)
  "ty": 2,                         // 类型: 1=免费版, 2=高级版
  "p": "1234"                      // 会议PIN码(可选)
}
```

**流程**:
1. 主叫方创建会议房间 (`create_room`)
2. 收到会议创建成功响应后，发送 Type 400 消息给被叫方
3. 消息包含会议ID和通话相关信息

#### 3.1.2 接听通话 (Type = 401)

**方向**: 被叫方 → 主叫方

**Payload 结构**:
- `type`: 401
- `content`: 通话ID
- `base64edData`: Base64编码的音频降级标志
  - `"1"`: 降级为音频接听
  - `"0"`: 正常接听（视频通话）

**流程**:
1. 被叫方收到 Type 400 消息
2. 用户点击接听后，发送 Type 401 消息
3. 双方同时进入连接状态，开始加入会议并发布/订阅媒体

#### 3.1.3 结束通话 (Type = 402)

**方向**: 双向

**Payload 结构**:
- `type`: 402
- `content`: 通话ID
- `base64edData`: Base64编码的 JSON

**base64edData 解码后的 JSON**:
```json
{
  "r": 3,      // 结束原因 (对应 CallEndReason 的 ordinal)
  "u": 12345   // 原始消息的 messageUid
}
```

**结束原因 (CallEndReason)**:
| 值 | 名称 | 说明 |
|----|------|------|
| 0 | kWFAVCallEndReasonUnknown | 未知原因 |
| 1 | kWFAVCallEndReasonBusy | 忙线 |
| 2 | kWFAVCallEndReasonSignalError | 信令错误 |
| 3 | kWFAVCallEndReasonHangup | 主动挂断 |
| 4 | kWFAVCallEndReasonMediaError | 媒体错误 |
| 5 | kWFAVCallEndReasonRemoteHangup | 对方挂断 |
| 6 | kWFAVCallEndReasonOpenCameraFailure | 摄像头打开失败 |
| 7 | kWFAVCallEndReasonTimeout | 超时 |
| 8 | kWFAVCallEndReasonAcceptByOtherClient | 被其他客户端接听 |
| 9 | kWFAVCallEndReasonAllLeft | 所有成员离开 |
| 10 | kWFAVCallEndReasonRemoteBusy | 对方忙线 |
| 11 | kWFAVCallEndReasonRemoteTimeout | 对方超时 |
| 12 | kWFAVCallEndReasonRemoteNetworkError | 对方网络错误 |
| 13 | kWFAVCallEndReasonRoomDestroyed | 房间被销毁 |
| 14 | kWFAVCallEndReasonRoomNotExist | 房间不存在 |
| 15 | kWFAVCallEndReasonRoomParticipantsFull | 房间已满 |
| 16 | kWFAVCallEndReasonInterrupted | 通话中断 |
| 17 | kWFAVCallEndReasonRemoteInterrupted | 对方通话中断 |

#### 3.1.4 预留类型 (Type = 403, 404)

Type 403 和 404 预留用于未来扩展。

### 3.2 会议信令 (ConferenceEvent)

会议信令分为**发送**和**接收**两部分，均采用 JSON 格式。

#### 发送会议信令

通过 `SignalServer.sendConference()` 方法发送：

```java
public void sendConference(
    String robotId,          // 机器人ID
    String clientId,         // 客户端唯一标识（UUID）
    String request,          // 请求类型
    long sessionId,          // Janus 会话ID（首次发送填0）
    String roomId,           // 房间ID（对应通话callId）
    String data,             // 请求体JSON字符串
    boolean advance,         // 是否高级版（固定传true）
    ConferenceResponseCallback callback  // 响应回调
)
```

**参数说明**:

| 参数 | 类型 | 说明 |
|------|------|------|
| robotId | String | 当前机器人的用户ID |
| clientId | String | 客户端唯一标识，每次通话生成一个UUID，用于区分同一机器人的不同客户端 |
| request | String | 请求类型，详见下表 |
| sessionId | long | Janus 会话ID，首次请求填0，后续请求使用返回的session_id |
| roomId | String | 房间ID，对应通话的callId（UUID格式） |
| data | String | 请求体JSON字符串，不同请求类型有不同的格式 |
| advance | boolean | 是否高级版，固定传true |
| callback | ConferenceResponseCallback | 异步回调，包含onResponse和onError |

**request 类型列表**:

| request | 说明 | 适用场景 |
|---------|------|----------|
| create_room | 创建会议房间 | 主叫方发起通话时 |
| join_pub | 加入会议并作为发布者 | 双方接听后发送 |
| join_sub | 加入会议并作为订阅者 | 需要订阅其他用户媒体时 |
| message | 发送SDP或控制消息 | 发送offer/answer/configure等 |
| trickle | 发送ICE candidate | ICE收集过程中 |
| keepalive | 保活心跳 | 每20秒发送一次 |
| leave | 离开房间 | 结束通话时 |

**回调接口**:
```java
public interface ConferenceResponseCallback {
    void onResponse(String response);  // 成功响应，response为JSON字符串
    void onError(int errorCode);       // 错误码
}
```

---

#### 接收会议事件

通过 `AVEngineKit.onConferenceEvent(String event)` 接收服务器推送的事件。

**调用方式**:
```java
// 当IM服务转发会议事件时调用
String event = "{...}";  // 服务器推送的JSON字符串
AVEngineKit.getInstance().onConferenceEvent(event);
```

**事件JSON格式**:

```json
{
  "session_id": 123456789,    // Janus会话ID
  "handle_id": 987654321,     // Janus句柄ID
  "data": {                   // 事件数据
    "videoroom": "event",     // 事件类型标识
    ...                       // 其他事件字段
  }
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| session_id | long | Janus会话ID，用于匹配对应的CallSession |
| handle_id | long | Janus句柄ID，标识具体的插件实例 |
| data | Object | 事件数据体，包含videoroom字段标识事件类型 |
| data.videoroom | String | 事件类型：event/participants/mute/slowlink/destroyed等 |

**处理流程**:
1. SDK解析event JSON，提取session_id
2. 根据session_id找到对应的CallSession
3. 将事件分发给对应的CallSession处理
4. 如果找不到对应session，会记录错误日志

---

#### 3.2.1 创建房间 (create_room)

**发送请求**:

```java
String data = "{\n" +
    "  \"publishers\": 10,\n" +      // 最大发布者数量
    "  \"is_private\": true,\n" +   // 是否私有房间
    "  \"pin\": \"1234\"\n" +       // 房间PIN码
    "}";

sendConference(robotId, clientId, "create_room", 0, callId, data, false, callback);
```

**请求data格式**:
```json
{
  "publishers": 10,       // 最大发布者数量（建议10）
  "is_private": true,     // 是否私有房间（固定true）
  "pin": "1234"           // 房间PIN码（4位随机数字）
}
```

**接收响应** (callback.onResponse):
```json
{
  "session_id": 123456789,
  "handle_id": 987654321,
  "data": {
    "videoroom": "created",
    "room": "call-id-uuid",
    "permanent": false
  }
}
```

**响应字段说明**:
- `session_id`: Janus会话ID，后续请求都需要携带
- `handle_id`: Janus插件句柄ID，后续请求都需要携带

#### 3.2.2 加入并发布 (join_pub)

**发送请求**:

```java
String data = "{\n" +
    "  \"session_id\": 123456789,\n" +  // 已有session时填写
    "  \"handle_id\": 987654321,\n" +   // 已有handle时填写
    "  \"user_id\": \"robotId\",\n" +   // 当前用户ID
    "  \"pin\": \"1234\"\n" +          // 房间PIN码
    "}";

sendConference(robotId, clientId, "join_pub", sessionId, callId, data, false, callback);
```

**请求data格式**:
```json
{
  "session_id": 123456789,    // 可选，已有session时填写
  "handle_id": 987654321,     // 可选，已有handle时填写
  "user_id": "robotId",       // 当前用户ID（机器人ID）
  "pin": "1234"               // 房间PIN码（创建房间时生成）
}
```

**注意**: 首次join_pub时sessionId参数传0，响应会返回session_id和handle_id，后续请求使用返回的值。

**接收响应** (callback.onResponse):
```json
{
  "session_id": 123456789,
  "handle_id": 987654321,
  "data": {
    "videoroom": "joined",
    "room": "call-id-uuid",
    "id": "userId",
    "attendees": [
      {"id": "user1", "display": "User 1"},
      {"id": "user2", "display": "User 2"}
    ],
    "publishers": [
      {
        "id": "user1",
        "streams": [
          {"type": "audio", "mid": "0"},
          {"type": "video", "mid": "1"}
        ]
      }
    ]
  }
}
```

**响应字段说明**:
- `session_id`: Janus会话ID，需保存供后续使用
- `handle_id`: 发布者句柄ID，需保存供后续使用
- `attendees`: 已在房间的其他成员列表
- `publishers`: 正在发布的成员列表（包含媒体流信息）

#### 3.2.3 加入并订阅 (join_sub)

**发送请求**:

```java
String data = "{\n" +
    "  \"feed\": \"targetUserId\",\n" +  // 要订阅的用户ID
    "  \"pin\": \"1234\",\n" +
    "  \"streams\": [\n" +
    "    {\n" +
    "      \"feed\": \"targetUserId\",\n" +
    "      \"mid\": \"0\"\n" +          // 音频流ID
    "    },\n" +
    "    {\n" +
    "      \"feed\": \"targetUserId\",\n" +
    "      \"mid\": \"1\"\n" +          // 视频流ID
    "    }\n" +
    "  ]\n" +
    "}";

sendConference(robotId, clientId, "join_sub", sessionId, callId, data, false, callback);
```

**请求data格式**:
```json
{
  "feed": "targetUserId",     // 要订阅的目标用户ID
  "pin": "1234",              // 房间PIN码
  "streams": [                // 要订阅的媒体流列表
    {
      "feed": "targetUserId", // 流所属用户ID
      "mid": "0"              // 媒体流ID（从publishers事件获取）
    },
    {
      "feed": "targetUserId",
      "mid": "1"
    }
  ]
}
```

**接收响应** (callback.onResponse):
```json
{
  "session_id": 123456789,
  "handle_id": 111111111,
  "jsep": {
    "type": "offer",
    "sdp": "v=0..."
  }
}
```

**响应字段说明**:
- `handle_id`: 订阅者句柄ID（与发布者不同）
- `jsep`: 包含SDP offer，需要创建Answer回复

#### 3.2.4 发送 SDP (message)

**发布者发送 Offer**:

```java
String data = "{\n" +
    "  \"session_id\": 123456789,\n" +
    "  \"handle_id\": 987654321,\n" +
    "  \"body\": {\n" +
    "    \"request\": \"configure\",\n" +
    "    \"audio\": true,\n" +
    "    \"video\": true,\n" +
    "    \"pin\": \"1234\"\n" +
    "  },\n" +
    "  \"jsep\": {\n" +
    "    \"type\": \"offer\",\n" +
    "    \"sdp\": \"v=0...\"\n" +
    "  }\n" +
    "}";

sendConference(robotId, clientId, "message", sessionId, callId, data, false, callback);
```

**请求data格式 (发布者)**:
```json
{
  "session_id": 123456789,
  "handle_id": 987654321,
  "body": {
    "request": "configure",
    "audio": true,          // 是否发布音频
    "video": true,          // 是否发布视频
    "pin": "1234"
  },
  "jsep": {
    "type": "offer",        // 固定为offer
    "sdp": "v=0..."         // WebRTC本地SDP
  }
}
```

**发布者接收响应** (callback.onResponse):
```json
{
  "session_id": 123456789,
  "jsep": {
    "type": "answer",       // 服务器返回的answer
    "sdp": "v=0..."
  }
}
```

**订阅者发送 Answer**:

```java
String data = "{\n" +
    "  \"session_id\": 123456789,\n" +
    "  \"handle_id\": 111111111,\n" +
    "  \"body\": {\n" +
    "    \"request\": \"start\"\n" +
    "  },\n" +
    "  \"jsep\": {\n" +
    "    \"type\": \"answer\",\n" +
    "    \"sdp\": \"v=0...\"\n" +
    "  }\n" +
    "}";

sendConference(robotId, clientId, "message", sessionId, callId, data, false, callback);
```

**请求data格式 (订阅者)**:
```json
{
  "session_id": 123456789,
  "handle_id": 111111111,
  "body": {
    "request": "start"      // 订阅者固定使用start
  },
  "jsep": {
    "type": "answer",       // 回复的answer
    "sdp": "v=0..."
  }
}
```

#### 3.2.5 发送 ICE Candidate (trickle)

在 WebRTC ICE 收集过程中，每收集到一个 candidate 都需要发送。

```java
String data = "{\n" +
    "  \"session_id\": 123456789,\n" +
    "  \"handle_id\": 987654321,\n" +
    "  \"candidate\": {\n" +
    "    \"candidate\": \"candidate:8421631 1 udp 1677729535 192.168.1.100...\",\n" +
    "    \"sdpMid\": \"0\",\n" +
    "    \"sdpMLinelndex\": 0,\n" +
    "    \"pin\": \"1234\"\n" +
    "  }\n" +
    "}";

sendConference(robotId, clientId, "trickle", sessionId, callId, data, false, null);
// 注意：trickle通常不需要处理响应，callback可传null
```

**请求data格式**:
```json
{
  "session_id": 123456789,
  "handle_id": 987654321,
  "candidate": {
    "candidate": "candidate:...",    // ICE candidate字符串
    "sdpMid": "0",                    // 媒体流标识
    "sdpMLinelndex": 0,               // 媒体行索引
    "pin": "1234"
  }
}
```

**字段说明**:
- `candidate`: WebRTC 生成的 ICE candidate
- `sdpMid`: 对应的媒体流标识（audio/video）
- `sdpMLinelndex`: SDP 中的媒体行索引

#### 3.2.6 保活 (keepalive)

定期发送以保持 Janus 会话活跃，防止超时断开。建议每 20 秒发送一次。

```java
// data 传 null 或空字符串
sendConference(robotId, clientId, "keepalive", sessionId, callId, null, false, 
    new ConferenceResponseCallback() {
        @Override
        public void onResponse(String response) {
            // 保活成功
        }
        
        @Override
        public void onError(int errorCode) {
            // 保活失败，可能需要重新建立连接
        }
    });
```

**请求data**: `null` 或空字符串

**接收响应**:
```json
{
  "session_id": 123456789
}
```

#### 3.2.7 离开房间 (leave)

通话结束时发送，离开会议房间。

```java
String data = "{\n" +
    "  \"handle_id\": 987654321,\n" +
    "  \"destroy\": true\n" +    // 是否销毁房间
    "}";

sendConference(robotId, clientId, "leave", sessionId, callId, data, false, callback);
```

**请求data格式**:
```json
{
  "handle_id": 987654321,   // 要断开的句柄ID
  "destroy": true           // 是否销毁房间（单聊通话结束后应销毁）
}
```

**说明**:
- `destroy`: 为 true 时会销毁整个房间，所有成员都会被踢出
- 适用于单聊通话结束或群聊最后一个成员离开的场景

### 3.3 会议事件接收 (ConferenceEvent - 服务器推送)

会议服务器会主动推送事件，**必须通过 `AVEngineKit.onConferenceEvent()` 接收并处理**。

#### 3.3.1 接收方式

```java
// 当IM服务器转发会议事件时调用此方法
public void onConferenceEventReceived(String eventJson) {
    // 转发给音视频引擎处理
    AVEngineKit.getInstance().onConferenceEvent(eventJson);
}
```

**重要说明**:
- 事件由 IM 服务器从 Janus 会议服务器接收后转发给客户端
- 必须调用 `onConferenceEvent()` 否则 SDK 无法正常处理媒体事件
- SDK 内部会根据 `session_id` 将事件路由到对应的 CallSession

#### 3.3.2 事件JSON格式

```json
{
  "session_id": 123456789,     // Janus会话ID，用于匹配CallSession
  "handle_id": 987654321,      // Janus句柄ID
  "data": {                    // 事件数据体
    "videoroom": "event",      // 事件类型标识
    ...                        // 具体事件字段
  }
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| session_id | long | **关键字段**，用于SDK匹配对应的CallSession。如果找不到匹配的session，会记录错误日志 |
| handle_id | long | Janus句柄ID，标识是哪个插件实例产生的事件 |
| data | Object | 事件数据体，格式取决于 videoroom 字段的值 |
| data.videoroom | String | 事件类型，决定了data中的其他字段 |

#### 3.3.3 事件类型详解

以下是可能收到的各种事件类型：

##### publishers - 有新发布者加入

**事件格式**:
```json
{
  "session_id": 123456789,
  "data": {
    "videoroom": "event",
    "publishers": [
      {
        "id": "userId",
        "streams": [
          {"type": "audio", "mid": "0"},
          {"type": "video", "mid": "1"}
        ]
      }
    ]
  }
}
```

**处理逻辑**: SDK收到此事件后，会为每个新发布者创建 CallEndPoint，并发送 `join_sub` 请求订阅其媒体。

---

##### unpublished - 发布者停止发布

**事件格式**:
```json
{
  "session_id": 123456789,
  "data": {
    "videoroom": "event",
    "unpublished": "userId"
  }
}
```

**处理逻辑**: SDK会停止对应用户的媒体接收，但用户仍在会议中。

---

##### leaving - 成员离开会议

**事件格式**:
```json
{
  "session_id": 123456789,
  "data": {
    "videoroom": "event",
    "leaving": "userId",
    "reason": "ok"
  }
}
```

**reason 说明**:
- `"ok"`: 正常离开
- `"kicked"`: 被踢出房间

**特殊处理**: 当 `leaving` 为 `"ok"` 且 `reason` 为 `"kicked"` 时，表示当前用户自己被踢出。

---

##### kicked - 成员被踢出

**事件格式**:
```json
{
  "session_id": 123456789,
  "data": {
    "videoroom": "event",
    "kicked": "userId"
  }
}
```

---

##### joining - 新成员加入（仅通知）

**事件格式**:
```json
{
  "session_id": 123456789,
  "data": {
    "videoroom": "event",
    "joining": {
      "id": "userId",
      "display": "displayName"
    }
  }
}
```

**注意**: 此事件仅表示用户加入会议，不代表开始发布媒体。开始发布媒体时会收到 `publishers` 事件。

---

##### participants - 房间成员列表

**事件格式**:
```json
{
  "session_id": 123456789,
  "data": {
    "videoroom": "participants",
    "attendees": ["userId1", "userId2"],
    "leavings": ["userId3"]
  }
}
```

**触发场景**: 通常在加入房间后收到，显示当前所有成员。

---

##### destroyed - 房间被销毁

**事件格式**:
```json
{
  "session_id": 123456789,
  "data": {
    "videoroom": "destroyed",
    "room": "call-id-uuid"
  }
}
```

**处理逻辑**: SDK会立即结束通话，回调 `onCallEnd(CallEndReason.kWFAVCallEndReasonRoomDestroyed)`。

---

##### mute - 静音/取消静音事件

**事件格式**:
```json
{
  "session_id": 123456789,
  "data": {
    "videoroom": "mute",
    "mute": {
      "id": "userId",
      "media": "audio"    // 或 "video"
    }
  }
}
```

---

##### slowlink - 网络质量警告

**事件格式**:
```json
{
  "session_id": 123456789,
  "handle_id": 987654321,
  "data": {
    "videoroom": "slowlink",
    "current-bitrate": 100000,
    "current-layers": 1
  }
}
```

**说明**: 表示网络质量不佳，码率下降。

---

##### slow_link - 网络延迟警告

**事件格式**:
```json
{
  "session_id": 123456789,
  "handle_id": 987654321,
  "data": {
    "videoroom": "slow_link"
  }
}
```

---

##### hangup - 连接挂断（Janus 原生事件）

**事件格式**:
```json
{
  "session_id": 123456789,
  "janus": "hangup",
  "data": {
    "reason": "ICE failed"
  }
}
```

### 3.4 收发对照总结

#### 发送 vs 接收流程

```
┌─────────────────────────────────────────────────────────────────────┐
│                          发送流程                                    │
├─────────────────────────────────────────────────────────────────────┤
│  应用层                                                               │
│    ↓                                                                │
│  AVEngineKit                                                        │
│    ↓ 调用 SignalServer.sendConference()                              │
│  SignalServer                                                       │
│    ↓ 调用 robotService.sendConferenceRequest()                       │
│  RobotService (SDK提供)                                              │
│    ↓ HTTP/WebSocket 请求                                             │
│  IM服务器 → Janus服务器                                              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          接收流程                                    │
├─────────────────────────────────────────────────────────────────────┤
│  Janus服务器                                                        │
│    ↓ 推送事件                                                        │
│  IM服务器                                                            │
│    ↓ 转发给客户端                                                     │
│  应用层 (需要调用 AVEngineKit.onConferenceEvent())                    │
│    ↓ 解析 session_id 匹配 CallSession                                │
│  AVEngineKit                                                        │
│    ↓ 分发到对应 Session                                              │
│  CallSessionConfImpl.onReceiveEvent()                               │
└─────────────────────────────────────────────────────────────────────┘
```

#### 关键字段对照表

| 字段 | 发送时 | 接收时 | 说明 |
|------|--------|--------|------|
| session_id | 请求参数和data中都需携带 | 顶层字段，用于路由 | Janus会话ID |
| handle_id | data中携带 | 可选 | Janus句柄ID，标识插件实例 |
| callId/roomId | sendConference的roomId参数 | data.room | 房间ID，对应通话UUID |
| request | sendConference的request参数 | data.videoroom | 请求类型/事件类型 |

#### 典型时序

**主叫方建立通话**:
```
1. 发送 create_room → 
2. ← 接收响应（获取session_id/handle_id）
3. 发送 Type400 消息给被叫方
4. 等待...
5. 接收 Type401 接听消息
6. 发送 join_pub →
7. ← 接收响应（attendees/publishers）
8. ← 接收 publishers 事件
9. 创建PeerConnection，发送 message (configure+offer) →
10. ← 接收响应（answer）
11. 发送 trickle (ICE candidates) →
12. ← 接收 publishers 事件（被叫方加入）
13. 发送 join_sub →
14. ← 接收响应（offer）
15. 创建Answer，发送 message (start+answer) →
16. 媒体连接建立成功
17. 每20秒发送 keepalive →
```

**被叫方加入通话**:
```
1. 接收 Type400 消息
2. 发送 Type401 接听消息
3. 发送 join_pub →
4. ← 接收响应（attendees/publishers）
5. 创建PeerConnection，发送 message (configure+offer) →
6. ← 接收响应（answer）
7. 发送 trickle (ICE candidates) →
8. ← 接收 publishers 事件（主叫方已在发布）
9. 发送 join_sub →
10. ← 接收响应（offer）
11. 创建Answer，发送 message (start+answer) →
12. 媒体连接建立成功
```

---

## 4. 通话流程

### 4.1 主叫方流程

```
1. 用户发起通话
   ↓
2. AVEngineKit.startPrivateCall() / startGroupCall()
   ↓
3. 创建 CallSessionConfImpl 实例
   ↓
4. 发送 create_room 请求创建会议
   ↓
5. 收到创建成功响应
   ↓
6. 发送 Type 400 消息给被叫方
   ↓
7. 等待接听（60秒超时）
   ↓
8. 收到 Type 401 接听消息
   ↓
9. 状态变为 Connecting
   ↓
10. 发送 join_pub 加入会议
   ↓
11. 创建 PeerConnection 并发送 SDP Offer
   ↓
12. 等待 ICE 连接建立
   ↓
13. 状态变为 Connected
   ↓
14. 定时发送 keepalive
   ↓
15. 通话结束，发送 Type 402 和 leave 请求
```

### 4.2 被叫方流程

```
1. 收到 Type 400 消息
   ↓
2. AVEngineKit.onReceiveCallMessage() 处理
   ↓
3. 创建 CallSessionConfImpl 实例
   ↓
4. 状态变为 Incomming
   ↓
5. 用户点击接听
   ↓
6. 调用 CallSession.answer()
   ↓
7. 发送 Type 401 消息
   ↓
8. 状态变为 Connecting
   ↓
9. 发送 join_pub 加入会议
   ↓
10. 创建 PeerConnection 并发送 SDP Offer
   ↓
11. 等待 ICE 连接建立
   ↓
12. 状态变为 Connected
   ↓
13. 定时发送 keepalive
   ↓
14. 通话结束，发送 Type 402 和 leave 请求
```

### 4.3 多人通话媒体订阅流程

当检测到新的 publishers 时：

```
1. 收到 publishers 事件
   ↓
2. 为每个新发布者创建 CallEndPoint
   ↓
3. 发送 join_sub 请求订阅该用户
   ↓
4. 收到 SDP Offer
   ↓
5. 创建订阅用的 PeerConnection
   ↓
6. 设置 RemoteDescription (Offer)
   ↓
7. 创建 Answer
   ↓
8. 设置 LocalDescription
   ↓
9. 发送 message 请求携带 Answer SDP
   ↓
10. ICE 连接建立后开始接收媒体
```

## 5. API 参考

### 5.1 AVEngineKit

#### 初始化
```java
public void init(RobotService robotService, AVEngineKitCallback engineKitCallback)
```

#### 发起单聊通话
```java
public CallSession startPrivateCall(
    Conversation conversation,     // 会话对象
    boolean audioOnly,             // 是否音频通话
    boolean advanceEngine,         // 是否高级版（必须传true）
    AudioDevice audioDevice,       // 音频设备实现
    CallEventCallback callEventCallback  // 通话事件回调
)
```

#### 发起群聊通话
```java
public CallSession startGroupCall(
    Conversation conversation,     // 会话对象（必须是群聊）
    List<String> targets,          // 目标用户ID列表
    boolean audioOnly,             // 是否音频通话
    boolean advanceEngine,         // 是否高级版（必须传true）
    AudioDevice audioDevice,       // 音频设备实现
    CallEventCallback callEventCallback  // 通话事件回调
)
```

#### 接收会议事件
```java
public void onConferenceEvent(String event)
```
IM 服务器转发会议事件时调用。

#### 接收通话消息
```java
public boolean onReceiveCallMessage(OutputMessageData messageData)
```
收到 IM 消息时调用，返回 true 表示是音视频消息。

### 5.2 CallSession

#### 接听通话
```java
void answer(boolean audioOnly)
```
- `audioOnly`: 是否降级为音频接听

#### 结束通话
```java
void endCall()
```

#### 获取通话状态
```java
CallState getCallState()
```

#### 设置事件回调
```java
void setEventCallback(CallEventCallback eventCallback)
```

#### 设置音频设备
```java
void setAudioDevice(AudioDevice audioDevice)
```

#### 设置视频捕获
```java
void setVideoCapture(JavaVideoCapture videoCapture)
```

### 5.3 CallEventCallback

```java
public interface CallEventCallback {
    // 通话状态更新
    void onCallStateUpdated(CallSession callSession, CallState state);
    
    // 新用户加入（仅加入会议，未开始传输媒体）
    void onParticipantJoined(CallSession callSession, String userId);
    
    // 用户接通（开始传输媒体）
    void onParticipantConnected(CallSession callSession, String userId);
    
    // 收到远端视频轨道
    void onReceiveRemoteVideoTrack(CallSession callSession, String userId, VideoTrack videoTrack);
    
    // 用户离开
    void onParticipantLeft(CallSession callSession, String userId, CallEndReason reason);
    
    // 通话结束
    void onCallEnd(CallSession callSession, CallEndReason endReason);
}
```

### 5.4 AudioDevice

用于自定义音频采集和播放：

```java
public interface AudioDevice {
    // 播放相关
    int initPlayout(CallSession callSession, String userId);
    int stopPlayout(CallSession callSession, String userId);
    void playoutData(CallSession callSession, String userId, byte[] sampleData, int nBuffSize);
    
    // 采集相关
    int initRecording(CallSession callSession);
    int startRecording(CallSession callSession);
    int stopRecording(CallSession callSession);
    void fetchRecordData(CallSession callSession, byte[] sampleData, int nSamples, 
                         int nSampleBytes, int nChannels, int nSampleRate, int nBuffSize);
}
```

## 6. 状态机

```
                    ┌─────────────────────────────────────┐
                    │                                     │
                    ▼                                     │
┌──────┐    ┌──────────────┐    ┌─────────────┐    ┌──────▼──────┐
│ Idle │───▶│   Outgoing   │───▶│  Connecting │───▶│  Connected  │
└──────┘    └──────────────┘    └─────────────┘    └─────────────┘
                  │                                        │
                  │    ┌──────────────┐                    │
                  └───▶│  Incomming   │────────────────────┘
                       └──────────────┘
```

- **Idle**: 空闲状态，无通话或通话已结束
- **Outgoing**: 呼出状态，已发送邀请等待对方接听
- **Incomming**: 呼入状态，收到通话邀请等待用户接听
- **Connecting**: 连接中，双方开始建立媒体连接
- **Connected**: 已连接，媒体通道已建立

## 7. 错误码

会议信令可能返回以下错误码：

| 错误码 | 说明 |
|--------|------|
| 426 | 房间不存在 |
| 428 | 发布者不存在 |
| 436 | 已在会议中 |
| 其他 | 参考 Janus 错误码 |

## 8. 第三方开发集成指南

### 8.1 依赖引入

```xml
<dependency>
    <groupId>cn.wildfirechat</groupId>
    <artifactId>avenginekit</artifactId>
    <version>1.2.2</version>
</dependency>
```

### 8.2 初始化

#### 8.2.1 创建和配置机器人用户

在使用音视频功能前，需要在IM管理后台创建机器人用户：

1. 登录IM管理后台
2. 创建机器人用户，记录以下信息：
   - **机器人用户ID** (rid)
   - **密码** (用于计算签名)
   - **SECRET_KEY** (创建机器人时指定，用于计算签名)
3. 确保机器人用户已添加到需要使用音视频的群组中（如果是群聊）

#### 8.2.2 设置回调地址

应用层需要提供一个HTTP接口供IM服务推送消息和会议事件。

**步骤1**：在应用层实现回调接口

```java
@RestController
public class RobotCallbackController {
    
    @PostMapping("/robot/callback")
    public void onRobotCallback(@RequestBody String body) {
        // 解析消息类型
        JsonObject json = JsonParser.parseString(body).getAsJsonObject();
        
        if (json.has("payload")) {
            // 这是消息回调
            OutputMessageData messageData = parseMessageData(json);
            AVEngineKit.getInstance().onReceiveCallMessage(messageData);
        } else if (json.has("session_id")) {
            // 这是会议事件回调
            AVEngineKit.getInstance().onConferenceEvent(body);
        }
    }
}
```

**步骤2**：调用API设置回调地址

```http
POST http://{im-server}/robot/set_callback
Content-Type: application/json
nonce: 76616
timestamp: 1558350862502
sign: { calculated_sign }
rid: robot_av_001

{
  "url": "http://your-server:8080/robot/callback"
}
```

#### 8.2.3 初始化音视频引擎（Java参考实现）

如果使用Java语言，建议使用野火提供的SDK：

```java
import cn.wildfirechat.sdk.RobotService;

// 初始化机器人服务
RobotService robotService = new RobotService(
    "http://im-server:80",  // IM服务器地址（注意是80端口）
    "robot_av_001",          // 机器人用户ID
    "robot_password"         // 机器人密码
);

// 初始化音视频引擎
AVEngineKit.getInstance().init(robotService, new AVEngineKitCallback() {
    @Override
    public void onReceiveCall(CallSession callSession) {
        // 收到来电，显示来电界面
        showIncomingCallUI(callSession);
    }
});

// 可选：开启 WebRTC 日志（仅调试时使用）
AVEngineKit.getInstance().enableWebRTCLog();
```

**其他语言实现**：参考本节的HTTP API说明，自行实现签名计算和HTTP调用。

### 8.3 配置 IM 消息和会议事件回调

**⚠️ 重要：回调配置是音视频功能正常工作的关键！**

应用层需要提供一个HTTP接口供IM服务推送消息和会议事件。

#### 8.3.1 回调接口规范

**接口地址**：由应用层提供，通过 `POST /robot/set_callback` 设置

**请求方法**：POST

**请求体**：JSON格式，可能是以下两种之一：

**1. 消息推送格式**：
```json
{
  "conv": {
    "type": 0,
    "target": "robot_av_001",
    "line": 0
  },
  "sender": "user1",
  "messageId": 123456789,
  "payload": {
    "type": 400,
    "content": "call-id-uuid",
    "base64edData": "eyJ0cyI6WyJ1c2VyMSJdLCJhIjox..."
  }
}
```

**2. 会议事件推送格式**：
```json
{
  "session_id": 123456789,
  "handle_id": 987654321,
  "data": {
    "videoroom": "event",
    "publishers": [...]
  }
}
```

**区分方式**：
- 如果包含 `payload` 字段 → 消息推送
- 如果包含 `session_id` 字段且无 `payload` → 会议事件推送

#### 8.3.2 回调处理逻辑

应用层收到回调后，需要转发给音视频引擎处理。

**HTTP接口实现示例**（Java Spring Boot）：

```java
@RestController
public class RobotCallbackController {
    
    @PostMapping("/robot/callback")
    public ResponseEntity<Void> onRobotCallback(@RequestBody String body) {
        JsonObject json = JsonParser.parseString(body).getAsJsonObject();
        
        if (json.has("payload")) {
            // 消息推送
            OutputMessageData messageData = parseMessageData(json);
            boolean handled = AVEngineKit.getInstance()
                .onReceiveCallMessage(messageData);
            
            if (handled) {
                System.out.println("收到音视频信令: type=" + 
                    messageData.getPayload().getType());
            }
        } else if (json.has("session_id")) {
            // 会议事件推送
            System.out.println("收到会议事件: " + body);
            AVEngineKit.getInstance().onConferenceEvent(body);
        }
        
        return ResponseEntity.ok().build();
    }
}
```

**数据模型参考**：

```java
public class OutputMessageData {
    private Conversation conv;       // 会话信息
    private String sender;           // 发送者用户ID
    private long messageId;          // 消息唯一ID
    private MessagePayload payload;  // 消息内容
}

public class MessagePayload {
    private int type;                // 消息类型（400-420）
    private String content;          // 通话ID（callId）
    private String base64edData;     // Base64编码的附加数据
}
```

#### 8.3.3 完整回调配置示例（Java）

如果使用Java语言，可以使用野火SDK简化开发：

```java
public class AVApplication {
    
    private RobotService robotService;
    
    public void init() {
        // 1. 初始化机器人服务
        robotService = new RobotService(
            "http://im-server:80",
            "robot_av_001",
            "robot_password"
        );
        
        // 2. 配置消息接收回调（SDK自动处理HTTP接收）
        robotService.setMessageCallback(messageData -> {
            handleRobotMessage(messageData);
        });
        
        // 3. 配置会议事件接收回调
        robotService.setConferenceCallback(eventJson -> {
            handleConferenceEvent(eventJson);
        });
        
        // 4. 连接到IM服务并设置回调地址
        robotService.connect();
        
        // 5. 初始化音视频引擎
        AVEngineKit.getInstance().init(robotService, callSession -> {
            onIncomingCall(callSession);
        });
    }
    
    private void handleRobotMessage(OutputMessageData messageData) {
        boolean isCallMessage = AVEngineKit.getInstance()
            .onReceiveCallMessage(messageData);
        
        if (isCallMessage) {
            System.out.println("收到音视频信令: type=" + 
                messageData.getPayload().getType());
        }
    }
    
    private void handleConferenceEvent(String eventJson) {
        AVEngineKit.getInstance().onConferenceEvent(eventJson);
    }
    
    private void onIncomingCall(CallSession callSession) {
        // 显示来电界面
        System.out.println("收到来电: " + callSession.getCallId());
    }
}
```

#### 8.3.4 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|------|---------|---------|
| 收不到通话邀请 | 回调地址未设置或不可访问 | 检查 `POST /robot/set_callback` 是否成功，确保回调地址可从IM服务器访问 |
| 接听后没有视频 | 未接收/处理会议事件 | 检查回调接口是否正确转发 `session_id` 类型的事件给 `onConferenceEvent()` |
| session_id 匹配失败 | 会议事件延迟到达 | 正常现象，引擎会记录日志忽略 |
| 双方都在等待 | 消息未送达对方 | 检查 `POST /robot/message/send` 响应是否成功 |
| 签名错误 | 时间戳过期或密钥错误 | 确保timestamp与服务器时间差不超过2小时，SECRET_KEY正确 |

**调试技巧**：

```java
// 在回调接口中记录所有接收到的数据
@PostMapping("/robot/callback")
public void onRobotCallback(@RequestBody String body) {
    System.out.println("收到回调: " + body);
    // ... 处理逻辑
}
```

### 8.4 发起通话

应用层调用音视频引擎接口发起通话。以下代码为 **Java参考实现**，其他语言需根据引擎API进行对应实现。

```java
// 创建会话对象
Conversation conversation = new Conversation();
conversation.setType(ProtoConstants.ConversationType.ConversationType_Private);
conversation.setTarget("targetUserId");
conversation.setLine(0);

// 发起通话
CallSession session = AVEngineKit.getInstance().startPrivateCall(
    conversation,
    false,      // 视频通话（true=音频通话）
    true,       // 使用高级版引擎
    audioDevice,// 音频设备实现
    new CallEventCallback() {
        @Override
        public void onCallStateUpdated(CallSession callSession, CallState state) {
            // 更新UI状态
        }

        @Override
        public void onParticipantJoined(CallSession callSession, String userId) {
            // 用户加入会议
        }

        @Override
        public void onParticipantConnected(CallSession callSession, String userId) {
            // 用户接通
        }

        @Override
        public void onReceiveRemoteVideoTrack(CallSession callSession, 
                                               String userId, 
                                               VideoTrack videoTrack) {
            // 收到视频轨道，可以绑定到渲染视图
        }

        @Override
        public void onParticipantLeft(CallSession callSession, 
                                       String userId, 
                                       CallEndReason reason) {
            // 用户离开
        }

        @Override
        public void onCallEnd(CallSession callSession, CallEndReason endReason) {
            // 通话结束，关闭界面
        }
    }
);
```

**说明**：引擎内部会自动调用 `POST /robot/conference/request` 创建房间，然后调用 `POST /robot/message/send` 发送 Type 400 消息。

### 8.5 接听通话

应用层在收到来电回调后，调用引擎接口接听。以下代码为 **Java参考实现**。

```java
// 在 onReceiveCall 回调中接听
void showIncomingCallUI(CallSession callSession) {
    // 显示接听界面
    // 用户点击接听按钮时：
    callSession.answer(false);  // false=正常接听，true=降级为音频
}
```

**说明**：引擎内部会自动调用 `POST /robot/message/send` 发送 Type 401 消息。

---

### 8.6 结束通话

应用层调用引擎接口结束通话。**Java参考实现**：

```java
// 用户点击挂断按钮
callSession.endCall();
```

**说明**：引擎内部会自动：
1. 调用 `POST /robot/message/send` 发送 Type 402 消息
2. 调用 `POST /robot/conference/request` 发送 leave 请求

---

### 8.7 视频渲染

当收到视频轨道时进行渲染。**Java参考实现**：

```java
// 当收到视频轨道时进行渲染
@Override
public void onReceiveRemoteVideoTrack(CallSession callSession, 
                                       String userId, 
                                       VideoTrack videoTrack) {
    // 使用 webrtc-java 的 VideoRenderer 进行渲染
    // 或者使用自定义渲染
}
```

---

### 8.8 自定义音频设备

如果需要自定义音频采集和播放，可以实现 AudioDevice 接口。**Java参考实现**：

```java
public class CustomAudioDevice implements AudioDevice {
    @Override
    public int initPlayout(CallSession callSession, String userId) {
        // 初始化音频播放设备
        return 0;
    }

    @Override
    public int stopPlayout(CallSession callSession, String userId) {
        // 停止音频播放
        return 0;
    }

    @Override
    public void playoutData(CallSession callSession, String userId, 
                           byte[] sampleData, int nBuffSize) {
        // 播放音频数据
    }

    @Override
    public int initRecording(CallSession callSession) {
        // 初始化音频采集设备
        return 0;
    }

    @Override
    public int startRecording(CallSession callSession) {
        // 开始音频采集
        return 0;
    }

    @Override
    public int stopRecording(CallSession callSession) {
        // 停止音频采集
        return 0;
    }

    @Override
    public void fetchRecordData(CallSession callSession, byte[] sampleData, 
                               int nSamples, int nSampleBytes, int nChannels, 
                               int nSampleRate, int nBuffSize) {
        // 处理采集到的音频数据
    }
}
```

## 9. 注意事项

1. **线程安全**: 所有回调都在工作线程中执行，更新 UI 需要切换到主线程
2. **超时处理**: 
   - 呼入/呼出超时：60秒
   - 连接超时：5秒
   - 远端连接超时：7秒
   - ICE 连接检查：10秒
3. **保活机制**: 需要每 20 秒发送一次 keepalive
4. **资源释放**: 通话结束后会自动释放 WebRTC 资源，无需手动处理
5. **PIN 码**: 每次通话生成 4 位随机 PIN 码，用于会议房间鉴权

## 10. 完整示例

参见项目源码中的测试用例和示例代码。

---

**版本**: 1.2.2  
**更新日期**: 2026-04-04  
**技术支持**: https://www.wildfirechat.cn
