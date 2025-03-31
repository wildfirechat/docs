# 用户设置
野火系统中，有一种数据结构叫用户设置，系统中大部分用户相关的数据都是存储在这个数据结构中。因此这个数据是个通用的数据结构，***在操作这个数据时需要格外小心，避免不同端直接因为格式不一致导致错误，甚至崩溃***。

## 用户设置的格式
用户设置包含4部分内容：
1. 用户ID：是属于那个用户的数据。字段名为userId。
2. 数据类型：是那一类数据。字段名为scope。
3. 数据的Key：数据的Key值。字段名为key。
4. 数据的Value：数据的value。字段名为value。
在客户端因为只能同步当前用户的设置，所以就不包含用户ID字段。

## 用户设置的同步
用户设置会自动实时同步。当修改设置时，会自动同步到所有端及IM服务上去。

## 内置的数据类型。
每个客户端和服务器都有枚举或者定义UserSettingScope，定义了系统内置的设置。包括如下：
```
//会话静音设置
UserSettingScope_Conversation_Silent = 1,
//全局静音设置
UserSettingScope_Global_Silent = 2,
//会话置顶设置
UserSettingScope_Conversation_Top = 3,
//隐藏通知详情设置
UserSettingScope_Hidden_Notification_Detail = 4,
//群组隐藏昵称设置
UserSettingScope_Group_Hide_Nickname = 5,
//收藏群组设置
UserSettingScope_Favourite_Group = 6,
//同步会话阅读状态设置
UserSettingScope_Conversation_Sync = 7,
//拥有的频道设置
UserSettingScope_My_Channel = 8,
//订阅的频道设置
UserSettingScope_Listened_Channel = 9,
//PC在线状态设置
UserSettingScope_PC_Online = 10,
//同步会话已读状态设置
UserSettingScope_Conversation_Readed = 11,
//web在线状态设置
UserSettingScope_WebOnline = 12,
//禁止草稿同步设置
UserSettingScope_DisableRecipt = 13,
//收藏圈子设置
UserSettingScope_Favourite_User = 14,
//不能直接使用
UserSettingScope_Mute_When_PC_Online = 15,
//不能直接使用
UserSettingScope_Lines_Readed = 16,
//不能直接使用
UserSettingScope_No_Disturbing = 17,
//不能直接使用，协议栈内会使用此值
UserSettingScope_Conversation_Clear_Message = 18,
//不能直接使用，协议栈内会使用此值
UserSettingScope_Conversation_Draft = 19,
//不能直接使用，协议栈内会使用此值
UserSettingScope_Disable_Sync_Draft = 20,
//不能直接使用，协议栈内会使用此值
UserSettingScope_Voip_Silent = 21,
//不能直接使用，协议栈内会使用此值
UserSettingScope_PTT_Reserved = 22,
//不能直接使用，协议栈内会使用此值
UserSettingScope_Custom_State = 23,
//不能直接使用，协议栈内会使用此值
UserSettingScope_Disable_Secret_Chat = 24,
//不能直接使用，协议栈内会使用此值
UserSettingScope_Ptt_Silent = 25,
//不能直接使用，协议栈内会使用此值
UserSettingScope_Group_Remark = 26,
//不能直接使用，协议栈内会使用此值
UserSettingScope_Privacy_Searchable = 27,
//不能直接使用，协议栈内会使用此值
UserSettingScope_AddFriend_NoVerify = 28,

//自定义用户设置，请使用1000以上的key
UserSettingScope_Custom_Begin = 1000
```
***上述内置设置在所有端和服务器都有使用，因此内置设置不能更改。如果第三方服务设置修改需要严格按照格式处理，否则有可能出严重问题，甚至崩溃。***

客户可以二开使用少量设置，scope的值要大于1000，避免与野火未来设置冲突。
