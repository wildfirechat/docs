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
| bitrate | int | 否 | 但路音视频码率 |
| advance | bool | 否 | 是否是超级会议 |
| recording | bool | 否 | 是否在服务器端录制 |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |


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

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |


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
| bitrate | int | 是 | 但路音视频码率 |
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

#### 响应
响应

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
