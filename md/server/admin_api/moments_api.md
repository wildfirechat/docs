# 朋友圈管理

本文讲述朋友圈相关的接口。管理员端提供基础的发布动态功能，更多的朋友圈功能（如获取动态、评论管理、用户资料等）主要通过 Robot 服务提供。我们提供有Java版本的[SDK](../sdk.md)，建议使用Java语言的客户使用这个SDK，其它语言可以按照本文档对接。

## 发布朋友圈动态
管理员可以代理用户发布朋友圈动态。

#### 地址
```
http://domain:18080/admin/moments/feed/post
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| sender | string | 是 | 发布者用户ID |
| feedId | long | 否 | 动态ID，如果不填写系统自动生成 |
| timestamp | long | 否 | 时间戳（毫秒） |
| type | int | 否 | 动态类型 |
| text | string | 否 | 文本内容 |
| medias | Object[] | 否 | 媒体文件列表 |
| to | string[] | 否 | 可见用户列表 |
| ex | string[] | 否 | 排除用户列表 |
| mu | string[] | 否 | 提及用户(@用户)列表 |
| extra | string | 否 | 附加信息 |
| comments | Object[] | 否 | 评论列表 |

medias 媒体文件

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| type | int | 是 | 媒体类型（0图片，1视频） |
| url | string | 是 | 媒体文件URL |
| thumbnailUrl | string | 否 | 缩略图URL |
| width | int | 否 | 图片/视频宽度 |
| height | int | 否 | 图片/视频高度 |
| duration | int | 否 | 视频时长（秒） |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| messageUid | long | 是 | 消息唯一ID |
| timestamp | long | 是 | 服务器处理时间 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -d   \
  "{                       \
    \"sender\":\"user1\",       \
    \"text\":\"今天天气真好！\",                 \
    \"media\":[                                  \
      {                                          \
        \"type\":0,                              \
        \"url\":\"http://example.com/image.jpg\",\
        \"thumbnailUrl\":\"http://example.com/thumb.jpg\",\
        \"width\":1920,                           \
        \"height\":1080                           \
      }                                          \
    ],                                            \
    \"to\":[\"friend1\",\"friend2\"]               \
  }"                                              \
  http://localhost:18080/admin/moments/feed/post

{
  "code":0,
  "msg":"success",
  "result":{
    "messageUid":5323423532,
    "timestamp":13123423234324
  }
}
```
