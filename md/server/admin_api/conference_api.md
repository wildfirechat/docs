# 实时音视频会议

## 创建会议室
#### 地址
```
http://domain:18080/admin/conference/create
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| roomId | string | 是 | 房间ID，不可重复 |
| description | string | 是 | 房间描述 |
| pin | string | 是 | 房间密码 |
| max_publishers | int | 否 | 最大交互成员人数 |
| bitrate | int | 否 |  单路音视频最大码率 |
| advance | bool | 否 | 是否是超级会议 |
| recording | bool | 否 | 是否在服务器端录制 |
| permanent | bool | 否 | 是否持久化会议，如果使用持久化注意使用后销毁，避免保存的会议无限增长 |

#### 响应
N/A


#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{  \
  \"roomId\":\"roomid1\",                             \
  \"description\":\"my conference\",                             \
  \"pin\":\"123456\",                             \
  \"max_publishers\":20",                             \
  }" http://localhost:18080/admin/conference/create

{
  "code":0,
  "msg":"success"
}
```

## 销毁会议室信息
#### 地址
```
http://domain:18080/admin/conference/destroy
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| roomId | string | 是 | 会议室ID |
| advance | bool | 否 | 是否是超级会议 |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"roomId\":\"aaaa\"}" http://localhost:18080/admin/conference/destroy

{
  "code":0,
  "msg":"success"
}
```

## 获取会议室列表
#### 地址
```
http://domain:18080/admin/conference/list
```
#### body
N/A

#### 响应
响应

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| conferenceInfoList | Object[] | 是 | 会议信息列表 |

--------------

会议信息

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| roomId | string | 是 | 房间ID，不可重复 |
| serverId | string | 否 | 会议室服务ID，如果超级会议为空，否则必须存在 |
| description | string | 是 | 房间描述 |
| max_publishers | int | 是 | 最大交互成员人数 |
| num_publishers | int | 是 | 会议参会人数 |
| bitrate | int | 是 | 单音视频最大码率 |
| advance | bool | 否 | 是否是超级会议 |
| recording | bool | 否 | 是否在服务器端录制 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json"  http://localhost:18080/admin//conference/list

{
  "code":0,
  "msg":"success",
  "result":[{
    "roomId":"aaaa",
    "serverId":"aaaa",
    ...
  }
  ]
}
```


## 获取会议室成员列表
#### 地址
```
http://domain:18080/admin/conference/list_participant
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| roomId | string | 是 | 会议室ID |
| advance | bool | 否 | 是否是超级会议 |

#### 响应

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| participantList | Object[] | 是 | 会议信息列表 |

--------------

成员信息

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 房间ID，不可重复 |
| publishing | bool | 否 | 是否发布者 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"roomId\":\"aaaa\"}" http://localhost:18080/admin/conference/list_participant

{
  "code":0,
  "msg":"success",
  "result":[{
    "roomId":"aaaa",
    "serverId":"aaaa",
    ...
  }
  ]
}
```

## 检查会议室是否存在
#### 地址
```
http://domain:18080/admin/conference/exist
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| conferenceId | string | 是 | 会议ID |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| result | bool | 是 | 是否存在 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"conferenceId\":\"roomid1\"}" http://localhost:18080/admin/conference/exist

{
  "code":0,
  "msg":"success",
  "result":true
}
```

## 开启/关闭会议录制
#### 地址
```
http://domain:18080/admin/conference/recording
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| roomId | string | 是 | 会议室ID |
| advance | bool | 否 | 是否是超级会议 |
| recording | bool | 是 | 是否开启录制 |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"roomId\":\"roomid1\",\"advance\":false,\"recording\":true}" http://localhost:18080/admin/conference/recording

{
  "code":0,
  "msg":"success"
}
```

## RTP转发
将指定参会者的音视频流转发到指定RTP端口。

#### 地址
```
http://domain:18080/admin/conference/rtp_forward
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| roomId | string | 是 | 会议室ID |
| publisherId | string | 是 | 发布者用户ID |
| host | string | 是 | RTP转发目标主机地址 |
| audioPort | int | 是 | 音频RTP端口 |
| audioPt | int | 是 | 音频Payload Type |
| audioSSRC | long | 是 | 音频SSRC |
| videoPort | int | 是 | 视频RTP端口 |
| videoPt | int | 是 | 视频Payload Type |
| videoSSRC | long | 是 | 视频SSRC |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"roomId\":\"roomid1\",\"publisherId\":\"user1\",\"host\":\"192.168.1.100\",\"audioPort\":5004,\"audioPt\":111,\"audioSSRC\":123456,\"videoPort\":5006,\"videoPt\":96,\"videoSSRC\":654321}" http://localhost:18080/admin/conference/rtp_forward

{
  "code":0,
  "msg":"success"
}
```

## 停止RTP转发
停止指定参会者的RTP流转发。

#### 地址
```
http://domain:18080/admin/conference/stop_rtp_forward
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| roomId | string | 是 | 会议室ID |
| publisherId | string | 是 | 发布者用户ID |
| streamId | long | 是 | 流ID |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"roomId\":\"roomid1\",\"publisherId\":\"user1\",\"streamId\":123}" http://localhost:18080/admin/conference/stop_rtp_forward

{
  "code":0,
  "msg":"success"
}
```

## 列出RTP转发器
获取会议室内所有的RTP转发器列表。

#### 地址
```
http://domain:18080/admin/conference/list_rtp_forward
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| roomId | string | 是 | 会议室ID |

#### 响应

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| roomId | string | 是 | 会议室ID |
| forwarders | Object[] | 是 | 转发器列表 |

--------------

转发器信息

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| publisherId | string | 是 | 发布者用户ID |
| streams | Object[] | 是 | 流列表 |

--------------

流信息

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| streamId | long | 是 | 流ID |
| type | string | 是 | 流类型(audio/video) |
| host | string | 是 | 目标主机地址 |
| port | int | 是 | 目标端口 |
| ssrc | long | 是 | SSRC |
| pt | int | 是 | Payload Type |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d "{\"roomId\":\"roomid1\"}" http://localhost:18080/admin/conference/list_rtp_forward

{
  "code":0,
  "msg":"success",
  "result":{
    "roomId":"roomid1",
    "forwarders":[{
      "publisherId":"user1",
      "streams":[{
        "streamId":123,
        "type":"audio",
        "host":"192.168.1.100",
        "port":5004,
        "ssrc":123456,
        "pt":111
      }]
    }]
  }
}
```
