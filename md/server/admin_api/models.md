# 常用对象

## [MessagePayload](../../base_knowledge/message_payload.md)

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| type | int | 是 | [消息内容类型](../../base_knowledge/message_payload.md#contentType) |
| searchableContent | string | 否 | 消息可搜索内容 |
| pushContent | string | 否 | 消息推送内容 |
| pushData | string | 否 | 消息推送数据 |
| content | string | 否 | 消息内容 |
| base64edData | string | 否 | 消息二进制内容，base64编码 |
| mediaType | int | 否 | 媒体消息类型 |
| remoteMediaUrl | string | 否 | 媒体内容链接 |
| expireDuration | long | 否 | 消息过期时间 |
| mentionedType | int | 否 | 消息提醒类型 |
| mentionedTarget | string list | 否 | 消息提醒对象列表 |

示例:
```
{"type":1,"searchableContent":"hello"}
```

## [Conversation](../../base_knowledge/conversation.md)

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| type | int | 是 | [会话类型](../../base_knowledge/conversation.md#会话类型) |
| target | string | 是 | 会话目标 |
| line | int | 否 | 会话线路，缺省为0 |

示例:
```
{"type":0,"target":"userId"}
```

## GroupMember

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| member_id | string | 是 | 群成员的用户ID |
| alias | string | 否 | 群成员的群名片 |
| type | int | 否 | 群成员类型，0 普通成员, 1 管理员, 2 群主， 3 禁言，4 已经移除的成员，当修改群成员信息时，只能取值0/1，其他值由其他接口实现，暂不支持3|

示例:
```
{"member_id":"userId1","alias":"老王"}
```

## GroupInfo

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| target_id | string | 否 | 群组ID，创建群组时为可选参数，获取群组信息时是必填项 |
| name | string | 否 | 群组名称 |
| portrait | string | 否 | 群组头像 |
| owner | string | 是 | 群主用户ID |
| type | int | 是 | 群类型，0 weixin 风格群组；2 qq 风格群组。移动端demo使用的是2，建议使用2. |
| extra | string | 否 | 群的extra信息供客户扩展使用 |
| mute | int | 否 | 是否全员禁言，0 不禁言；1 全员禁言。 |
| join_type | int | 否 | 加入群权限，0 所有人可以加入；1 群成员可以拉人；2 群管理员或群组可以拉人。 |
| private_chat | int | 否 | 是否禁止私聊，0 允许群成员发起私聊；1 不允许群成员发起私聊。 |
| searchable | int | 否 | 群是否可以被搜索，但目前没有实现。如果需要请在appserver实现。 |
| max_member_count | int | 否 | 群最大成员数，社区版该字段无效，群最大参加在t_setting表中配置。专业版可以指定某个群的最大成员数。 |
| history_message | int | 否 | 是否允许查看群成员查看加入群之前的历史消息，0 不允许；1 是允许。 |


示例:
```
{"target_id":"groupId1","name":"老王的朋友们","owner":"laowang","type":2}
```

## Group

| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| group_info | [json](./models.md#GroupInfo) | 是 | 群组ID |
| members | list<[json](./models.md#GroupMember)> | 否 | 群组成员列表 |


示例:
```
{
  "group_info":{"target_id":"groupId1","name":"老王的朋友们","owner":"laowang","type":2},
  "members":[{"member_id":"memberId1","name":"老张","type":0}, {"member_id":"memberId2","name":"老王","type":2}, {"member_id":"memberId1","name":"老赵","type":0}]
}
```

## UserInfo
| 参数 | 类型 | 必需 | 描述 |
| ------ | ------ | --- | ------ |
| userId | string | 是 | 用户ID，在创建时可以为空，如果传空，系统会自动生成一个用户id。其它情况必须携带用户id。***必须保证唯一性。*** |
| name | string | 是 | 帐号名，***必须保证唯一性。*** |
| displayName | string | 是 | 显示名字 |
| portrait | string | 否 | 用户头像 |
| mobile | string | 否 | 用户手机号码 |
| email | string | 否 | 用户邮箱 |
| address | string | 否 | 用户地址 |
| company | string | 否 | 用户公司 |
| social | string | 否 | 社交信息 |
| extra | string | 否 | 附加信息 |

示例:
```
{"userId":"userId1","name":"userId1"，"displayName":"zhangsan"}
```

## UpdateUserInfoMask
```
// 更新用户信息的字段信息，第0bit位为1时更新userInfo中的昵称信息，第1位更新头像，第2位更新性别，第3更新电话，第4位更新email，第5位更新地址，第6位更新公司，第7位更新社交信息，第8位更新extra信息，第9位更新name信息。比如更新用户头像和昵称，flag应该位 0x03

public interface UpdateUserInfoMask {
    int Update_User_DisplayName = 0x01;
    int Update_User_Portrait = 0x02;
    int Update_User_Gender = 0x04;
    int Update_User_Mobile = 0x08;
    int Update_User_Email = 0x10;
    int Update_User_Address = 0x20;
    int Update_User_Company = 0x40;
    int Update_User_Social = 0x80;
    int Update_User_Extra = 0x100;
    int Update_User_Name = 0x200;
}

```