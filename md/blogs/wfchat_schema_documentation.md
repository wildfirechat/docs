# Wildfire Chat 数据库表结构文档

## 概述

本文详细描述了 Wildfire Chat IM 服务器的全部数据库表及其字段含义。

### 表分类

| 分类 | 表名 |
|------|------|
| **核心实体** | `t_user`, `t_group`, `t_group_member`, `t_friend`, `t_channel`, `t_chatroom`, `t_robot`, `t_device`, `t_domain`, `t_secret_chat` |
| **消息存储** | `t_messages` (36张分片表), `t_group_messages` (128张分片表), `t_user_messages` (128张分片表) |
| **会话/认证** | `t_user_session`, `t_session` (遗留) |
| **状态/回执** | `t_user_status`, `t_user_setting`, `t_read_report`, `t_user_read_report`, `t_delivery_report`, `t_user_delivery_report` |
| **关系/请求** | `t_friend_request`, `t_join_group_request`, `t_channel_listener` |
| **聊天室管理** | `t_chatroom_blacklist`, `t_chatroom_manager` |
| **音视频会议** | `t_conference` |
| **文件管理** | `t_file` |
| **敏感词/审计** | `t_sensitiveword`, `t_sensitive_messages` |
| **基础设施** | `t_id_generator`, `t_settings`, `flyway_schema_history` |

---

## 1. `flyway_schema_history` — Flyway 迁移记录

Flyway 数据库迁移框架自动维护的元数据表，记录每次迁移脚本的执行情况。

| 字段 | 类型 | 说明 |
|------|------|------|
| `installed_rank` | int | 安装排序序号，主键 |
| `version` | varchar(50) | 迁移版本号 |
| `description` | varchar(200) | 迁移描述 |
| `type` | varchar(20) | 迁移类型（SQL/JAVA等） |
| `script` | varchar(1000) | 脚本文件名 |
| `checksum` | int | 脚本校验和 |
| `installed_by` | varchar(100) | 执行迁移的数据库用户 |
| `installed_on` | timestamp | 迁移执行时间 |
| `execution_time` | int | 执行耗时（毫秒） |
| `success` | tinyint(1) | 是否成功 |

---

## 2. `t_user` — 用户表

存储平台注册用户的核心信息。对应 Java 类 `UserInfoData`。支持软删除。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_uid` | varchar(64) | 用户唯一 ID，业务标识 |
| `_name` | varchar(64) | 用户名，唯一索引 |
| `_display_name` | varchar(64) | 显示昵称 |
| `_gender` | int | 性别（0-未知，1-男，2-女） |
| `_portrait` | varchar(1024) | 头像 URL |
| `_mobile` | varchar(64) | 手机号 |
| `_email` | varchar(64) | 邮箱 |
| `_address` | varchar(64) | 地址 |
| `_company` | varchar(64) | 公司 |
| `_social` | varchar(64) | 社交账号信息 |
| `_passwd_md5` | varchar(64) | MD5 密码哈希 |
| `_salt` | varchar(64) | 密码加盐值 |
| `_extra` | text | 扩展字段，JSON 格式 |
| `_type` | tinyint | 用户类型：0-普通用户，1-机器人 |
| `_dt` | bigint | 更新时间戳（毫秒） |
| `_createTime` | datetime | 创建时间 |
| `_deleted` | tinyint | 软删除标记：0-正常，1-已删除 |
| `_external` | tinyint | 外部用户标记：0-内部用户，1-外部用户 |

**索引**: `_uid`(唯一), `_name`(唯一), `_display_name`, `_mobile`, `_email`

---

## 3. `t_group` — 群组表

存储群组信息。对应 Java 类 `GroupInfoData`。支持普通群和超级群两种模式。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_gid` | varchar(64) | 群组唯一 ID |
| `_name` | varchar(64) | 群名称 |
| `_portrait` | varchar(1024) | 群头像 URL |
| `_owner` | varchar(64) | 群主用户 ID |
| `_type` | tinyint | 群类型（保留扩展） |
| `_extra` | text | 扩展字段 |
| `_dt` | bigint | 群信息更新时间戳 |
| `_member_count` | int | 群成员数量 |
| `_member_dt` | bigint | 成员列表变更时间戳 |
| `_createTime` | datetime | 创建时间 |
| `_mute` | tinyint | 全员禁言标记：0-正常，1-全员禁言 |
| `_join_type` | tinyint | 加群方式：0-无需审批，1-需要审批，2-禁止加群 |
| `_private_chat` | tinyint | 群内私聊权限：0-允许私聊，1-禁止私聊 |
| `_searchable` | int | 是否可被搜索到 |
| `_history_message` | tinyint | 新成员是否可见历史消息：0-不可见，1-可见 |
| `_max_member_count` | int | 最大成员数（默认2000） |
| `_super_group` | tinyint | 是否为超级群：0-普通群，1-超级群 |
| `_deleted` | tinyint | 软删除标记：0-正常，1-已删除 |

**索引**: `_gid`(唯一), `_name`

---

## 4. `t_group_member` — 群组成员表

存储群组成员关系。对应 Java 类 `GroupMemberData`。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_gid` | varchar(64) | 群组 ID |
| `_mid` | varchar(64) | 成员用户 ID |
| `_alias` | varchar(64) | 群内昵称/群备注 |
| `_type` | tinyint | 成员类型：0-普通成员，1-管理员，2-群主（与 Owner 相同） |
| `_dt` | bigint | 更新时间戳 |
| `_create_dt` | bigint | 加入时间戳 |
| `_extra` | text | 扩展字段 |

**索引**: `(_gid, _mid)`(唯一), `_mid`, `(_gid, _dt)`, `(_gid, _type)`

---

## 5. `t_friend` — 好友关系表

存储用户之间的好友关系。对应 Java 类 `FriendData`。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_uid` | varchar(64) | 用户 ID |
| `_friend_uid` | varchar(64) | 好友用户 ID |
| `_state` | tinyint | 好友状态：0-好友，1-陌生人。历史版本中2表示黑名单，已废弃 |
| `_dt` | bigint | 建立/更新时间戳 |
| `_alias` | varchar(64) | 好友备注/别名 |
| `_blacked` | tinyint | 黑名单标记：0-正常，1-已拉黑 |
| `_extra` | text | 扩展字段 |

**索引**: `(_uid, _friend_uid)`(唯一), `_friend_uid`

---

## 6. `t_friend_request` — 好友请求表

存储用户发送/接收到的好友请求。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_uid` | varchar(64) | 请求发起方用户 ID |
| `_friend_uid` | varchar(64) | 请求目标方用户 ID |
| `_reason` | text | 申请理由/验证信息 |
| `_status` | tinyint | 请求状态：0-待处理，1-已接受，2-已拒绝 |
| `_dt` | bigint | 发起时间戳 |
| `_from_read_status` | tinyint | 发起方是否已读 |
| `_to_read_status` | tinyint | 目标方是否已读 |
| `_extra` | text | 扩展字段 |

**索引**: `(_uid, _friend_uid)`(唯一), `_friend_uid`

---

## 7. `t_channel` — 频道/公众号表

存储频道（公众号/服务号）信息。对应 Java 类 `ChannelData`。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_cid` | varchar(64) | 频道唯一 ID |
| `_name` | varchar(64) | 频道名称 |
| `_portrait` | varchar(1024) | 频道头像 URL |
| `_owner` | varchar(64) | 频道所有者用户 ID |
| `_status` | int | 频道状态：0-公开，1-私有，2-已关闭 |
| `_desc` | text | 频道描述 |
| `_secret` | varchar(64) | 频道密钥（私有频道使用） |
| `_callback` | varchar(1024) | 消息回调 URL（当用户发消息给频道时，服务端回调此地址） |
| `_extra` | text | 扩展字段 |
| `_automatic` | tinyint | 是否自动回复模式：0-否，1-是 |
| `_dt` | bigint | 更新时间戳 |
| `_menu` | blob | 频道菜单配置（二进制序列化数据） |

**索引**: `_cid`(唯一), `_name`

---

## 8. `t_channel_listener` — 频道订阅者表

记录订阅了某个频道的用户。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_cid` | varchar(64) | 频道 ID |
| `_mid` | varchar(64) | 订阅用户 ID |
| `_dt` | bigint | 订阅时间戳 |

**索引**: `(_cid, _mid)`(唯一), `_mid`

---

## 9. `t_chatroom` — 聊天室表

存储聊天室信息。对应 Java 类 `ChatroomData`。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_cid` | varchar(64) | 聊天室唯一 ID |
| `_title` | varchar(64) | 聊天室标题 |
| `_portrait` | varchar(1024) | 聊天室头像 URL |
| `_state` | tinyint | 聊天室状态：0-正常，1-已关闭 |
| `_desc` | text | 聊天室描述 |
| `_extra` | text | 扩展字段 |
| `_dt` | bigint | 更新时间戳 |

**索引**: `_cid`(唯一)

---

## 10. `t_chatroom_blacklist` — 聊天室黑名单表

记录被禁止进入聊天室的用户。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_cid` | varchar(64) | 聊天室 ID |
| `_uid` | varchar(64) | 被拉黑的用户 ID |
| `_state` | tinyint | 状态（保留） |
| `_expired_time` | bigint | 解禁时间戳（到期自动解禁） |
| `_dt` | bigint | 拉黑时间戳 |

**索引**: `(_cid, _uid)`(唯一)

---

## 11. `t_chatroom_manager` — 聊天室管理员表

记录聊天室的管理员列表。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_cid` | varchar(64) | 聊天室 ID |
| `_uid` | varchar(64) | 管理员用户 ID |
| `_state` | tinyint | 状态（保留） |
| `_dt` | bigint | 设为管理员的时间戳 |

**索引**: `(_cid, _uid)`(唯一)

---

## 12. `t_conference` — 音视频会议表

存储音视频会议房间信息。用于 VoIP/会议功能。

| 字段 | 类型 | 说明 |
|------|------|------|
| `_id` | varchar(64) | 会议房间唯一 ID，主键 |
| `_des` | varchar(64) | 会议描述/主题 |
| `_pin` | varchar(16) | 会议 PIN 码/密码 |
| `_max_publishers` | int | 最大发布者数量（同时发言人数限制） |
| `_bitrate` | int | 比特率设置 |
| `_advance` | tinyint | 高级功能标记 |
| `_recording` | tinyint | 是否开启录制：0-否，1-是 |
| `_create_dt` | bigint | 创建时间戳 |
| `_delete_by` | varchar(64) | 删除者用户 ID |
| `_deleted` | tinyint | 软删除标记：0-正常，1-已删除 |
| `_delete_dt` | bigint | 删除时间戳 |

---

## 13. `t_robot` — 机器人表

存储机器人账号信息。对应 Java 类 `RobotData`。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_uid` | varchar(64) | 机器人用户 ID（关联 `t_user._uid`） |
| `_owner` | varchar(64) | 机器人所有者用户 ID |
| `_secret` | varchar(64) | 机器人密钥（用于回调认证） |
| `_callback` | varchar(1024) | 机器人消息回调 URL（收到消息时回调此地址） |
| `_state` | tinyint | 状态：0-正常，1-已删除 |
| `_extra` | text | 扩展字段 |
| `_dt` | bigint | 更新时间戳 |

**索引**: `_uid`(唯一), `_owner`

---

## 14. `t_device` — 设备表

存储 IoT/设备类账号信息。对应 Java 类 `DeviceData`。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_uid` | varchar(64) | 设备用户 ID（唯一标识） |
| `_token` | varchar(64) | 设备令牌 |
| `_state` | tinyint | 状态：0-正常，1-已删除 |
| `_extra` | text | 扩展字段 |
| `_dt` | bigint | 更新时间戳 |

**索引**: `_uid`(唯一)

---

## 15. `t_domain` — 域/租户表

存储企业域/租户信息。对应 Java 类 `DomainInfoData`。用于多租户场景。

| 字段 | 类型 | 说明 |
|------|------|------|
| `_domain_id` | varchar(128) | 域唯一 ID，主键 |
| `_name` | varchar(64) | 域名/企业名称 |
| `_desc` | varchar(256) | 域描述 |
| `_email` | varchar(64) | 联系邮箱 |
| `_tel` | varchar(64) | 联系电话 |
| `_address` | varchar(64) | 联系地址 |
| `_extra` | varchar(1024) | 扩展字段 |
| `_dt` | bigint | 更新时间戳 |

---

## 16. `t_secret_chat` — 端到端加密聊天表

存储端到端加密会话信息。对应 Java 类 `SecretChatData`。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_uid` | varchar(64) | 加密会话唯一 ID |
| `_from` | varchar(64) | 发起方用户 ID |
| `_from_cid` | varchar(64) | 发起方客户端 ID |
| `_to` | varchar(64) | 接收方用户 ID |
| `_to_cid` | varchar(64) | 接收方客户端 ID |
| `_state` | tinyint | 会话状态：0-待接受，1-已建立 |
| `_dt` | bigint | 创建/更新时间戳 |

**索引**: `_uid`(唯一)

---

## 17. `t_user_session` — 用户会话表

记录用户的登录会话信息。是当前活跃使用的会话管理表。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_uid` | varchar(64) | 用户 ID |
| `_cid` | varchar(64) | 客户端 ID（设备唯一标识） |
| `_token` | varchar(240) | 推送通知的设备 Token（如 APNs/小米/华为等推送 token） |
| `_voip_token` | varchar(240) | VoIP 推送 Token（iOS VoIP 推送专用） |
| `_secret` | varchar(64) | 会话密钥（用于客户端与服务端通信认证） |
| `_db_secret` | varchar(64) | 数据库级密钥（用于消息加密） |
| `_platform` | tinyint | 客户端平台：0-iOS，1-Android，2-Windows，3-OSX，4-WEB，5-Linux |
| `_push_type` | tinyint | 推送通道类型：0-无推送，1-小米，2-华为，3-APNs 等 |
| `_package_name` | varchar(64) | 应用包名 |
| `_device_name` | varchar(64) | 设备型号名称 |
| `_device_version` | varchar(64) | 设备系统版本 |
| `_phone_name` | varchar(64) | 手机名称 |
| `_language` | varchar(64) | 系统语言设置 |
| `_carrier_name` | varchar(64) | 运营商名称 |
| `_dt` | bigint | 最后更新/活跃时间戳 |
| `_deleted` | tinyint | 软删除标记：0-正常，1-已登出/过期 |
| `_user_type` | tinyint | 用户类型：0-普通用户，1-机器人，2-设备 |
| `_ip` | varchar(40) | 登录 IP 地址 |

**索引**: `(_cid, _uid)`(唯一), `_token`, `_uid`

---

## 18. `t_session` — 会话表（遗留）

旧的会话管理表。当前代码不再引用此表，由 `t_user_session` 替代。

| 字段 | 类型 | 说明 |
|------|------|------|
| `row_id` | varchar(64) | 会话行 ID，主键 |
| `del_flag` | tinyint(1) | 删除标记 |
| `create_time` | datetime | 创建时间 |
| `update_time` | datetime | 更新时间 |
| `expire_time` | datetime | 过期时间 |
| `user_id` | int | 关联用户 ID |

**索引**: `row_id`(主键), `(user_id, expire_time)`(唯一)

---

## 19. `t_user_setting` — 用户设置表

存储用户的个性化设置。使用 `(uid, scope, key)` 三元组来存储键值对设置。对应 Java 类 `UserSettingData`。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_uid` | varchar(64) | 用户 ID |
| `_scope` | int | 设置分类/作用域（如：1-全局设置，2-会话设置等） |
| `_key` | varchar(128) | 设置键名 |
| `_value` | varchar(4096) | 设置值 |
| `_dt` | bigint | 更新时间戳 |

**索引**: `(_uid, _scope, _key)`(唯一)

---

## 20. `t_user_status` — 用户在线状态表

记录用户当前的在线状态（由服务端维护）。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_uid` | varchar(64) | 用户 ID |
| `_status` | int | 在线状态：0-离线，1-在线 |
| `_dt` | bigint | 状态变更时间戳 |

**索引**: `_uid`(唯一)

---

## 21. `t_messages` — 消息表（按时间分片）

存储所有会话（私聊、群聊等）的原始消息内容。按 `(year * 12 + month) % 36` 分片到 `t_messages_0` ~ `t_messages_35` 共 36 张表。`t_messages` 基表本身不使用，仅为模板定义。

**注**: 分片表中额外包含 `_content_type` 字段，基表无此字段。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_mid` | bigint | 消息全局唯一 ID |
| `_from` | varchar(64) | 发送者用户 ID |
| `_type` | tinyint | 会话类型：0-单聊，1-群组，2-聊天室，3-频道，4-客服等 |
| `_target` | varchar(129) | 会话目标 ID（单聊为对方UID，群聊为群GID等） |
| `_line` | int | 会话线路号（用于多设备同步） |
| `_data` | blob | 消息内容的 Protobuf 二进制数据 |
| `_searchable_key` | text | 可搜索的文本内容（用于全文检索） |
| `_dt` | datetime | 消息时间 |
| `_content_type` | int | （仅分片表有）消息内容类型：0-文本，1-图片，2-语音，3-视频，4-位置，5-文件，6-贴图，7-链接等 |
| `_to` | varchar(64) | 显式接收者（群聊中指定特定成员可见时使用） |

**索引**: `_mid`(唯一), `(_type, _target, _line)`

---

## 22. `t_user_messages` — 用户消息索引表（按用户ID分片）

存储"用户-消息"的映射关系，用于快速拉取某个用户收到的消息列表。按 `userId % 128` 分片到 `t_user_messages_0` ~ `t_user_messages_127`。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_mid` | bigint | 消息 ID |
| `_uid` | varchar(64) | 接收消息的用户 ID |
| `_seq` | bigint | **该用户在全局递增的消息序列号**（用户级别，非会话级别） |
| `_dt` | datetime | 消息时间戳 |
| `_line` | int | 会话线路号 |
| `_type` | tinyint | 会话类型 |
| `_target` | varchar(129) | 会话目标 ID |
| `_directing` | tinyint(1) | 方向标记：0-收到的消息，1-发送的消息 |
| `_cont_type` | int | 消息内容类型 |

**索引**: `(_uid, _seq DESC)`, `(_uid, _line, _mid DESC)`, `_mid`, `(_uid, _type, _target, _line, _mid DESC)`

---

## 23. `t_group_messages` — 群消息表（按群ID分片）

存储发送到群组的消息。按 `gid % 128` 分片到 `t_group_messages_0` ~ `t_group_messages_127`。

| 字段 | 类型 | 说明 |
|------|------|------|
| `_mid` | bigint | 消息 ID，主键 |
| `_sender` | varchar(64) | 发送者用户 ID |
| `_gid` | varchar(64) | 群组 ID |
| `_line` | int | 会话线路号 |
| `_client_id` | varchar(64) | 客户端消息 ID（用于去重） |
| `_seq` | bigint | **群内递增的消息序号** |
| `_persist_flag` | int | 持久化标记 |
| `_mentioned_type` | int | @提及类型：0-未提及，1-@所有人，2-@指定成员 |
| `_mentioned_targets` | blob | @提及的目标用户列表（二进制序列化） |
| `_to` | blob | 指定接收者列表（群内定向发送） |
| `_cont_type` | int | 消息内容类型 |
| `_duration` | int | 语音/视频消息时长 |
| `_dt` | bigint | 消息时间戳 |

**索引**: `(_gid DESC, _line, _seq DESC)`

---

## 24. `t_read_report` — 会话读取报告表

存储每个用户在每个会话中的最新已读位置。`id` 是分配的自增 ID，关联到 `t_user_read_report`。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键（同时也是读取报告的全局 ID） |
| `_uid` | varchar(64) | 用户 ID |
| `_type` | tinyint | 会话类型 |
| `_line` | int | 会话线路号 |
| `_target` | varchar(64) | 会话目标 ID |
| `_dt` | bigint | 最后读取时间戳 |

**索引**: `(_uid, _type, _line, _target)`

---

## 25. `t_user_read_report` — 用户读取回执表

存储每个用户各会话的已读消息序列号。用于跨设备同步已读状态。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_rid` | int | 关联的读取报告 ID（关联 `t_read_report.id`） |
| `_uid` | varchar(64) | 用户 ID |
| `_seq` | bigint | 用户已读到的最新消息序列号 |
| `_dt` | datetime | 记录时间 |

**索引**: `(_uid DESC, _rid DESC)`(唯一), `(_uid DESC, _seq DESC)`

---

## 26. `t_delivery_report` — 送达回执表

存储每个用户消息送达的最大时间戳，每个用户一条记录。用于多节点场景下传递的幂等性。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_uid` | varchar(64) | 用户 ID |
| `_dt` | bigint | 已送达的最晚消息时间戳 |

**索引**: `_uid`(唯一)

---

## 27. `t_user_delivery_report` — 用户送达回执明细表

存储每条消息在每个设备上的送达状态。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_rid` | varchar(64) | 消息 ID（字符串类型） |
| `_uid` | varchar(64) | 用户 ID |
| `_seq` | bigint | 该消息在此用户的序列号 |
| `_dt` | datetime | 送达时间 |

**索引**: `(_uid DESC, _rid DESC)`(唯一), `(_uid DESC, _seq DESC)`

---

## 28. `t_file` — 文件记录表

存储通过 IM 发送的文件记录，用于文件管理和下载统计。

| 字段 | 类型 | 说明 |
|------|------|------|
| `_mid` | bigint | 关联消息 ID，主键 |
| `_from` | varchar(64) | 发送者用户 ID |
| `_type` | tinyint | 会话类型：0-单聊，1-群组 |
| `_target` | varchar(64) | 会话目标 ID |
| `_line` | int | 会话线路号 |
| `_name` | varchar(128) | 文件名 |
| `_url` | varchar(1024) | 文件存储 URL |
| `_size` | int | 文件大小（字节） |
| `_download_count` | int | 下载次数统计 |
| `_dt` | bigint | 发送时间戳 |

**索引**: `(_type, _line, _target, _mid)`, `(_from, _mid)`

---

## 29. `t_join_group_request` — 加群请求表

存储用户申请加入群组的请求记录。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_uid` | varchar(64) | 申请人用户 ID |
| `_gid` | varchar(64) | 目标群组 ID |
| `_mid` | varchar(64) | （用于标识请求来源，可能关联邀请人） |
| `_request_uid` | varchar(64) | 实际申请的用户 ID |
| `_accept_uid` | varchar(64) | 审批人/邀请人用户 ID |
| `_reason` | text | 申请理由 |
| `_extra` | text | 扩展字段 |
| `_status` | tinyint | 状态：0-待处理，1-已同意，2-已拒绝 |
| `_dt` | bigint | 申请时间戳 |
| `_read_status` | tinyint | 是否已读标记 |

**索引**: `(_uid, _gid, _mid, _request_uid)`(唯一), `(_gid, _mid)`, `(_uid, _dt)`

---

## 30. `t_user_device` — 用户-设备关联表

记录用户与设备ID的绑定关系。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_uid` | varchar(64) | 用户 ID |
| `_did` | varchar(64) | 设备 ID |

**索引**: `(_uid, _did)`(唯一), `_did`

---

## 31. `t_sensitiveword` — 敏感词表

存储需要被过滤/审计的敏感词列表。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_word` | text | 敏感词内容 |

---

## 32. `t_sensitive_messages` — 敏感消息审计表

当消息内容命中敏感词时，消息会被复制存储到本表，用于事后审计。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键 |
| `_mid` | bigint | 原始消息 ID |
| `_from` | varchar(64) | 发送者用户 ID |
| `_type` | tinyint | 会话类型 |
| `_target` | varchar(64) | 会话目标 ID |
| `_line` | int | 会话线路号 |
| `_data` | blob | 消息内容 Protobuf 数据 |
| `_searchable_key` | text | 可搜索文本 |
| `_dt` | datetime | 消息时间 |
| `_content_type` | int | 消息内容类型 |

**索引**: `_mid DESC`

---

## 33. `t_id_generator` — ID 生成器表

一个仅用于生成数据库自增 ID 的辅助表。通过 `INSERT` + `SELECT LAST_INSERT_ID()` 来获取全局唯一 ID，用于消息序列号等场景。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 自增主键（生成的 ID 通过 LAST_INSERT_ID 获取） |

---

## 34. `t_settings` — 系统设置表

存储系统级别的键值配置。由 `updateSystemSetting()` / `getSystemSetting()` 管理。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 设置项 ID（键），主键 |
| `_value` | varchar(64) | 设置值 |
| `_desc` | varchar(64) | 设置描述 |

---

## 附：分片表说明

### `t_messages` 分片（36张）
- 表名: `t_messages_0` ~ `t_messages_35`
- 分片算法: `(year * 12 + month) % 36`（基于消息时间，3年循环）
- 与基表的差异: 分片表额外包含 `_content_type` 字段

### `t_user_messages` 分片（128张）
- 表名: `t_user_messages_0` ~ `t_user_messages_127`
- 分片算法: `userId % 128`
- 用于高效拉取单个用户的消息列表

### `t_group_messages` 分片（128张）
- 表名: `t_group_messages_0` ~ `t_group_messages_127`
- 分片算法: `gid % 128`
- 用于高效拉取单个群组的消息列表
