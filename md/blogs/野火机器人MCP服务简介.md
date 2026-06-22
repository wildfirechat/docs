# 野火机器人 MCP 工具简介

## 是什么

**野火机器人 MCP Server** 是一个基于 [MCP（Model Context Protocol）](https://modelcontextprotocol.io) 协议的服务，它把野火 IM 的机器人 API 封装成一组工具，供 AI Agent 调用。

简单来说：AI 可以通过这个服务，像人一样使用野火 IM 机器人发送消息、管理群组、查询用户信息等。

## 能做什么

目前提供 **34 个 MCP 工具**，分为以下几类：

| 类别 | 主要功能 |
|------|----------|
| **消息** | 发送文本/图片/文件消息、回复消息、撤回消息、更新消息 |
| **用户** | 查询用户信息（按 ID/手机号/用户名）、搜索用户、获取好友列表 |
| **资料** | 获取机器人自身资料 |
| **群组** | 创建/解散/转让群组、修改群信息、添加/踢出/禁言成员、设置管理员等 |
| **文件** | 上传本地文件到 IM 服务器 |

## 典型使用场景

- **智能客服机器人**：AI 接收用户问题后，自动在 IM 中回复文本、图片或文件。
- **群管理助手**：自动拉人、踢人、禁言、修改群公告等。
- **信息查询助手**：根据用户 ID 或手机号查询资料，再决定如何响应。

## 运行方式

支持两种模式：

1. **stdio 模式（本地）**：作为本地 Agent（如 Claude Desktop）的子进程运行。
2. **HTTP 模式（远程）**：部署到服务器，供远程 MCP 客户端通过 HTTP 连接。

```bash
# 本地模式
npm start

# HTTP 模式
export WF_MCP_PORT=3100
npm start
```

## 认证方式

每次调用工具时，需要提供：

- `robotId`：机器人 ID
- `robotSecret`：机器人密钥

由野火 IM 服务端负责鉴权，MCP 服务本身不额外存储或校验凭证。

## 安全提醒

- **公网务必使用 HTTPS**：`robotId` 和 `robotSecret` 会随每次请求明文传输，HTTP 部署在公网存在凭证泄露风险。
- **不要把管理后台 API（`/admin/`）暴露给 Agent**：机器人 API 权限有限，相对安全；管理 API 权限过大，不建议通过 MCP 暴露。
- **远程部署时注意 `filePath` 模式**：`upload_file`、发送图片/文件消息时的本地文件路径，只在 MCP 服务与客户端在同一台机器时有效。远程使用请改用 `imageUrl` / `fileUrl`。

## 快速接入

以 Claude Desktop 为例，在配置中添加：

```json
{
  "mcpServers": {
    "wf-robot": {
      "command": "node",
      "args": ["/path/to/wf-robot-mcp-server.ts/dist/index.js"],
      "env": {
        "WF_IM_SERVER_URL": "http://your-im-server"
      }
    }
  }
}
```

配置完成后，AI 即可在对话中调用野火机器人相关工具。

## 更多资料

- 项目仓库：[Github](https://github.com/wildfirechat/wf-robot-mcp-server.ts)和[码云](https://gitee.com/wfchat/wf-robot-mcp-server.ts)
- 完整接口说明：见项目根目录 `README.md`
- 协议规范：[Model Context Protocol](https://modelcontextprotocol.io)
