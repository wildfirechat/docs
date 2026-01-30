# 机器人朋友圈API

机器人拥有完整的朋友圈功能，可以使用机器人来管理朋友圈动态、评论和用户资料。

## 发布朋友圈动态
机器人可以发布朋友圈动态。

#### 地址
```
http://domain/robot/moments/feed/post
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| type | int | 否 | 动态类型 |
| text | string | 否 | 文本内容 |
| medias | Object[] | 否 | 媒体文件列表 |
| to | string[] | 否 | 可见用户列表 |
| ex | string[] | 否 | 排除用户列表 |
| mu | string[] | 否 | 提及用户(@用户)列表 |
| extra | string | 否 | 附加信息 |

medias 媒体文件

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| m | string | 是 | 媒体文件URL |
| t | string | 否 | 缩略图URL |
| w | int | 否 | 图片/视频宽度 |
| h | int | 否 | 图片/视频高度 |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| feedId | long | 是 | 动态ID |
| timestamp | long | 是 | 服务器时间戳 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "rid":"robota" -d   \
  "{                       \
    \"text\":\"今天天气真好！\",                 \
    \"medias\":[                                  \
      {                                          \
        \"m\":\"http://example.com/image.jpg\",\
        \"t\":\"http://example.com/thumb.jpg\",\
        \"w\":1920,                           \
        \"h\":1080                           \
      }                                          \
    ],                                            \
    \"to\":[\"friend1\",\"friend2\"]               \
  }\"                                              \
  http://localhost/robot/moments/feed/post

{
  "code":0,
  "msg":"success",
  "result":{
    "feedId":123456789,
    "timestamp":13123423234324
  }
}
```

## 更新朋友圈动态
更新已发布的朋友圈动态。

#### 地址
```
http://domain/robot/moments/feed/update
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| feedId | long | 是 | 动态ID |
| type | int | 否 | 动态类型 |
| text | string | 否 | 文本内容 |
| medias | Object[] | 否 | 媒体文件列表 |
| to | string[] | 否 | 可见用户列表 |
| ex | string[] | 否 | 排除用户列表 |
| mu | string[] | 否 | 提及用户(@用户)列表 |
| extra | string | 否 | 附加信息 |

> 只有自己发布的动态才能更新。

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "rid":"robota" -d   \
  "{                       \
    \"feedId\":123456789,       \
    \"text\":\"更新后的内容\"                 \
  }\"                                \
  http://localhost/robot/moments/feed/update

{
  "code":0,
  "msg":"success"
}
```

## 获取朋友圈动态列表
获取指定用户的朋友圈动态列表。

#### 地址
```
http://domain/robot/moments/feed/pull
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| feedId | long | 否 | 起始动态ID，0表示从最新开始 |
| count | int | 否 | 每页数量 |
| user | string | 否 | 目标用户ID，不传则获取机器人自己的动态 |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| feeds | Object[] | 是 | 动态列表 |

Feed 数据结构

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| feedId | long | 是 | 动态ID |
| sender | string | 是 | 发送者用户ID |
| timestamp | long | 是 | 时间戳 |
| type | int | 是 | 动态类型 |
| text | string | 否 | 文本内容 |
| medias | Object[] | 否 | 媒体文件列表 |
| to | string[] | 否 | 可见用户列表 |
| ex | string[] | 否 | 排除用户列表 |
| mu | string[] | 否 | 提及用户列表 |
| extra | string | 否 | 附加信息 |
| comments | Object[] | 否 | 评论列表 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "rid":"robota" -d   \
  "{                       \
    \"feedId\":0,       \
    \"count\":20,                        \
    \"user\":\"user1\"                        \
  }\"                                \
  http://localhost/robot/moments/feed/pull

{
  "code":0,
  "msg":"success",
  "result":{
    "feeds":[...]
  }
}
```

## 获取单条动态
获取指定动态ID的详细信息。

#### 地址
```
http://domain/robot/moments/feed/pull_one
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| feedId | long | 是 | 动态ID |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| feedId | long | 是 | 动态ID |
| sender | string | 是 | 发送者用户ID |
| timestamp | long | 是 | 时间戳 |
| type | int | 是 | 动态类型 |
| text | string | 否 | 文本内容 |
| medias | Object[] | 否 | 媒体文件列表 |
| to | string[] | 否 | 可见用户列表 |
| ex | string[] | 否 | 排除用户列表 |
| mu | string[] | 否 | 提及用户列表 |
| extra | string | 否 | 附加信息 |
| comments | Object[] | 否 | 评论列表 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp\":\"1558350862502\" -H "sign\":\"b98f9b0717f59febccf1440067a7f50d9b31bdde\" -H "Content-Type:application/json" -H "rid":"robota" -d \"{\\\"feedId\\\":123456789}\" http://localhost/robot/moments/feed/pull_one

{
  "code":0,
  "msg":"success",
  "result":{
    "feedId":123456789,
    "sender\":\"user1\",
    "text\":\"今天天气真好！\",
    "timestamp\":13123423234324
  }
}
```

## 撤回朋友圈动态
删除已发布的朋友圈动态。

#### 地址
```
http://domain/robot/moments/feed/recall
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| id | long | 是 | 动态ID |

> 只能撤回自己发布的动态。

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "rid":"robota" -d "{\"id\":123456789}" http://localhost/robot/moments/feed/recall

{
  "code":0,
  "msg":"success"
}
```

## 发布评论
为指定的朋友圈动态发布评论。

#### 地址
```
http://domain/robot/moments/comment/post
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| feedId | long | 是 | 动态ID |
| replyId | long | 否 | 回复的评论ID，如果是回复评论则需要填写 |
| type | int | 否 | 评论类型 |
| text | string | 否 | 评论内容 |
| replyTo | string | 否 | 被回复的用户ID |
| extra | string | 否 | 附加信息 |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| commentId | long | 是 | 评论ID |
| timestamp | long | 是 | 服务器时间戳 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "rid":"robota" -d   \
  "{                       \
    \"feedId\":123456789,       \
    \"text\":\"赞！\"                        \
  }\"                                \
  http://localhost/robot/moments/comment/post

{
  "code":0,
  "msg":"success",
  "result":{
    "commentId":987654321,
    "timestamp":13123423234324
  }
}
```

## 撤回评论
删除已发布的评论。

#### 地址
```
http://domain/robot/moments/comment/recall
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| id | long | 是 | 评论ID |
| id2 | long | 是 | 动态ID |

> 只能撤回自己发布的评论。

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "rid":"robota" -d   \
  "{                       \
    \"id\":987654321,       \
    \"id2\":123456789                        \
  }\"                                \
  http://localhost/robot/moments/comment/recall

{
  "code":0,
  "msg":"success"
}
```

## 获取评论列表
获取指定动态的所有评论。

#### 地址
```
http://domain/robot/moments/comment/pull
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| feedId | long | 是 | 动态ID |
| userId | string | 否 | 用户ID |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| comments | Object[] | 是 | 评论列表 |

Comment 数据结构

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| commentId | long | 是 | 评论ID |
| replyId | long | 否 | 回复的评论ID |
| sender | string | 是 | 发送者用户ID |
| timestamp | long | 是 | 时间戳 |
| feedId | long | 是 | 动态ID |
| type | int | 是 | 评论类型 |
| text | string | 否 | 评论内容 |
| replyTo | string | 否 | 被回复的用户ID |
| extra | string | 否 | 附加信息 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "rid":"robota" -d "{\"feedId\":123456789}" http://localhost/robot/moments/comment/pull

{
  "code":0,
  "msg":"success",
  "result":{
    "comments":[...]
  }
}
```

## 获取用户朋友圈资料
获取指定用户的朋友圈资料信息。

#### 地址
```
http://domain/robot/moments/profiles/pull
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| u | string | 否 | 用户ID，不传则获取机器人自己的资料 |

#### 响应
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| bgUrl | string | 否 | 背景图片URL |
| blackList | string[] | 否 | 黑名单列表 |
| blockList | string[] | 否 | 屏蔽列表 |
| svc | int | 否 | 陌生人可见数量 |
| visiableScope | int | 否 | 可见范围 |

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "rid":"robota" -d "{\"u\":\"user1\"}" http://localhost/robot/moments/profiles/pull

{
  "code":0,
  "msg":"success",
  "result":{
    "bgUrl":"http://example.com/background.jpg",
    "svc":10,
    "visiableScope":0
  }
}
```

## 更新朋友圈背景
更新朋友圈的背景图片。

#### 地址
```
http://domain/robot/moments/profiles/value/push
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| t | int | 是 | 类型，固定为0（背景图片） |
| v | string | 是 | 背景图片URL |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "rid":"robota" -d   \
  "{                       \
    \"t\":0,       \
    \"v\":\"http://example.com/background.jpg\"                        \
  }\"                                \
  http://localhost/robot/moments/profiles/value/push

{
  "code":0,
  "msg":"success"
}
```

## 更新陌生人可见数量
设置陌生人可以查看的朋友圈动态数量。

#### 地址
```
http://domain/robot/moments/profiles/value/push
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| t | int | 是 | 类型，固定为1（陌生人可见数量） |
| i | int | 是 | 可见数量 |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "rid":"robota" -d   \
  "{                       \
    \"t\":1,       \
    \"i\":10                        \
  }\"                                \
  http://localhost/robot/moments/profiles/value/push

{
  "code":0,
  "msg":"success"
}
```

## 更新可见范围
更新朋友圈的可见范围设置。

#### 地址
```
http://domain/robot/moments/profiles/value/push
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| t | int | 是 | 类型，固定为2（可见范围） |
| i | int | 是 | 可见范围 |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "rid":"robota" -d   \
  "{                       \
    \"t\":2,       \
    \"i\":0                        \
  }\"                                \
  http://localhost/robot/moments/profiles/value/push

{
  "code":0,
  "msg":"success"
}
```

## 更新黑名单
更新朋友圈的黑名单列表。

#### 地址
```
http://domain/robot/moments/profiles/list/push
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| b | bool | 是 | 类型，false表示黑名单 |
| al | string[] | 否 | 添加到列表的用户ID |
| rl | string[] | 否 | 从列表中移除的用户ID |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "rid":"robota" -d   \
  "{                       \
    \"b\":false,       \
    \"al\":[\"user1\",\"user2\"]                        \
  }\"                                \
  http://localhost/robot/moments/profiles/list/push

{
  "code":0,
  "msg":"success"
}
```

## 更新屏蔽列表
更新朋友圈的屏蔽列表。

#### 地址
```
http://domain/robot/moments/profiles/list/push
```
#### body
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| b | bool | 是 | 类型，true表示屏蔽列表 |
| al | string[] | 否 | 添加到列表的用户ID |
| rl | string[] | 否 | 从列表中移除的用户ID |

#### 响应
N/A

#### 示例
```
curl -X POST -H "nonce:76616" -H "timestamp":"1558350862502" -H "sign":"b98f9b0717f59febccf1440067a7f50d9b31bdde" -H "Content-Type:application/json" -H "rid":"robota" -d   \
  "{                       \
    \"b\":true,       \
    \"al\":[\"user1\",\"user2\"]                        \
  }\"                                \
  http://localhost/robot/moments/profiles/list/push

{
  "code":0,
  "msg":"success"
}
```
