# IM 服务安全防护指南——如何避免黑客攻击与数据泄露

## 前言

本文从**网络安全、密钥安全、客户端行为管控**三个维度，系统梳理 IM 服务的安全防护要点。

---

## 一、关闭 18080 管理端口的对外访问

### 风险分析

IM 服务的管理端口（默认 `18080`）是 Server API 的入口，拥有极高的操作权限：
- 查询任意用户信息
- 强制添加/删除好友关系
- 创建、解散群组
- 发送任意消息
- 修改用户资料

如果该端口暴露在互联网上，且管理密钥被泄露或猜解，攻击者将拥有对整个 IM 系统的完全控制权。

### 防护措施

**必须关闭 18080 端口的对外防火墙规则，仅允许内网访问。**


---

## 二、修改默认管理密钥

### 风险分析

配置文件中的默认管理密钥是公开的

攻击者一旦扫描到 18080 端口开放，配合默认密钥即可直接调用所有管理接口，无需任何破解。

### 防护措施

**立即将默认密钥修改为高强度随机字符串（建议 32 位以上字母数字组合，不支持#）。**

```properties
# 修改为高强度密钥示例
http.admin.secret_key YourStrongRandomKeyHere2024!@
```

**配套安全加固：**

| 配置项 | 说明 | 推荐值 |
|-------|------|-------|
| `http.admin.secret_key` | 管理接口密钥 | **必须修改，长度 ≥ 32 位** |
| `http.admin.no_check_time` | 是否关闭请求时间校验 | `false`（保持时间校验开启） |
| `http.admin.rate_limit` | 管理 API 限频（10 秒内请求次数） | `10000`（根据业务调整） |

> **重要**：修改 `http.admin.secret_key` 后，需要同步更新所有调用 Server API 的服务（应用服务、对象存储服务、推送服务等），否则会导致接口调用失败。

---

## 三、封禁客户端高危操作，改为 Server API 审查

客户端（移动端、Web 端、小程序）存在被反编译、抓包、二次打包的风险。如果关键操作完全由客户端自主发起，黑客可通过破解客户端直接调用底层协议，绕过业务层的审查逻辑。

**核心策略：将敏感操作从客户端回收，改为通过 Server API 由业务服务端审查后执行。**

### 3.1 禁止客户端搜索用户（防止信息遍历）

黑客可通过遍历用户 ID、手机号、昵称批量拉取用户信息。

```properties
# 禁止搜索用户
friend.disable_search true

# 禁止按昵称搜索
friend.disable_nick_name_search true

# 禁止按用户 ID 搜索
friend.disable_user_id_search true

# 搜索错误号码限次（防止遍历手机号）
friend.search_mobile_empty_rate_limit 5

# 搜索频率限制（24 小时内）
friend.search_rate_limit 20
```

**业务层替代方案**：用户搜索需求通过业务服务端代理，接入风控、实名认证、权限校验后，再调用 Server API 查询。

### 3.2 禁止客户端随意添加好友

```properties
# 禁止客户端发送好友邀请
friend.disable_friend_request true

# 好友请求频率限制
friend.request_rate_limit 10

# 请求过期时间（默认 7 天）
friend.request_expiration_duration 604800000
```

**业务层替代方案**：好友添加逻辑由业务服务管控，例如：
- 双方完成实名认证后才允许添加
- 企业组织架构内自动添加，外部需审批
- 通过业务接口调用 Server API `force` 参数强制添加

### 3.3 禁止客户端群组操作（核心防御）

群组操作是重灾区，必须收紧客户端权限：

```properties
# 禁止客户端群操作（按位控制，0xFFF 表示禁止全部 12 项）
# 第1位: 创建群组
# 第2位: 销毁群组
# 第3位: 加入群
# 第4位: 退出群
# 第5位: 邀请群成员
# 第6位: 移出群成员
# 第7位: 转移群
# 第8位: 设置群管理员
# 第9位: 白名单处理
# 第10位: 群禁言
# 第11位: 修改群组信息
# 第12位: 群成员禁言
group.forbidden_client_operation 0xFFF

# 禁止陌生人拉人入群
group.disable_stranger_invite true

# 群成员加入失败时是否允许部分成功（关闭可防止批量加人攻击）
group.add_member_allow_part_success false
```

**业务层替代方案**：所有群组操作由业务服务端审查后调用 Server API：
- **创建群组**：校验用户权限、组织关系、付费状态
- **邀请成员**：校验被邀请人是否在通讯录、是否同意入群
- **解散群组**：记录审计日志，保留历史数据
- **踢人/禁言**：接入管理员权限体系

### 3.4 禁止客户端发送敏感消息类型

对于交易、充值、系统通知等高风险消息类型，禁止客户端直接发送：

```properties
# 禁止客户端发送的消息类型（逗号分隔）
# 例如：3999=转账消息, 4000=红包消息, 4001=充值消息
message.forbidden_client_send_types 3999,4000,4001
```

**业务层替代方案**：金融类、系统类消息必须由业务服务端生成并调用 Server API 发送，确保可审计、可回滚。

### 3.5 限制陌生人交互

```properties
# 禁止陌生人之间聊天
message.disable_stranger_chat true

# 允许聊天的例外用户（系统号、客服等）
message.allow_stranger_chat_list admin,FireRobot,wfc_file_transfer
```

### 3.6 隐藏用户敏感属性

防止客户端被破解后泄露用户隐私：

```properties
# 隐藏属性类型：2=性别, 3=电话, 4=邮箱, 5=地址, 6=公司, 7=社交账号, 8=Extra
user.hide_properties 3,4,5,6,7
```

> 注意：此配置仅对客户端生效，Server API 不受影响，业务服务仍可正常获取完整信息。

### 3.7 强化 ID 生成策略

短 ID 容易被穷举攻击，建议使用 UUID：

```properties
id.use_uuid true
```

---

## 四、其他安全加固建议

### 4.1 启用配置加密

```properties
# 开启密码等敏感信息加密
secret_key_encrypt true
```

> 开启后，数据库密码、对象存储 SK、Server API 密钥等均需加密配置。加密密钥位于 `SKT` 目录下，**务必单独保管，不要与程序放在一起**。

### 4.2 修改 Token 私钥

```properties
# 生产环境必须修改！
token.key YourPrivateTokenKeyForProduction2024!
```

### 4.3 关闭版本探测接口

```properties
# 上线后关闭版本接口，减少信息泄露
http.close_api_version true
```

### 4.4 消息内容加密存储

```properties
# 数据库中加密存储消息内容
message.encrypt_message_content true
message.disable_remote_search true
```

---

## 五、安全配置速查表

| 风险场景 | 配置文件项 | 推荐配置 |
|---------|----------|---------|
| 管理端口暴露公网 | `http.admin.port` | **防火墙关闭 18080 公网访问** |
| 默认密钥弱口令 | `http.admin.secret_key` | **修改为高强度随机字符串** |
| 用户信息被遍历 | `friend.disable_search` / `friend.disable_user_id_search` | `true` |
| 批量添加好友 | `friend.disable_friend_request` | `true` |
| 客户端随意建群 | `group.forbidden_client_operation` | `0xFFF` |
| 陌生人拉人入群 | `group.disable_stranger_invite` | `true` |
| 客户端发金融消息 | `message.forbidden_client_send_types` | 业务敏感类型 |
| 陌生人骚扰 | `message.disable_stranger_chat` | `true` |
| 用户隐私泄露 | `user.hide_properties` | `3,4,5,6,7` |
| 短 ID 穷举 | `id.use_uuid` | `true` |
| Token 伪造 | `token.key` | 生产环境修改 |
| 消息明文存储 | `message.encrypt_message_content` | `true` |

---

## 六、总结

IM 服务的安全不是单一措施可以解决的，而是**网络隔离 + 密钥安全 + 客户端行为管控**的纵深防御体系：

1. **网络层**：18080 管理端口绝不暴露公网，这是最基础的底线。
2. **密钥层**：所有默认密钥（管理密钥、Token 私钥、数据库密码等）必须修改为高强度随机值。
3. **业务层**：将客户端的敏感操作权限收紧，全部收归业务服务端审查，通过 Server API 执行。

**核心原则：客户端不可信，服务端可控。** 任何涉及用户信息、好友关系、群组变更、资金交易的操作，都必须经过业务服务端的审查与授权，IM 服务仅作为消息通道，不承载业务逻辑的信任决策。
