# Electron 应用自动升级实现指南（全平台）

> 适用项目：基于 `vue-cli-plugin-electron-builder` + `electron-updater` 的 Electron 桌面应用  
> 目标平台：Windows、macOS、Linux（AppImage / deb）

---

## 1. 概述

本文档详细介绍如何在 Electron 应用中集成自动升级功能，涵盖从依赖安装、代码配置、打包构建到服务器部署的完整流程。

**核心方案**：使用 `electron-updater` 模块 + `electron-builder` 的 `publish` 配置，配合静态文件服务器（generic provider）实现更新检测与下载。

**升级方式**：
- **静默自动更新**：应用启动后自动检测，发现新版本后台下载，完成后提示用户重启（已默认关闭，需手动开启）
- **手动检查更新**：用户通过菜单栏（macOS）或托盘右键菜单（Windows/Linux）主动触发

---

## 2. 升级原理

```
┌─────────────┐     1. 请求 latest.yml      ┌─────────────────┐
│   客户端     │ ──────────────────────────> │   更新服务器      │
│  (Electron)  │                             │  (Nginx/CDN/对象存储)│
└─────────────┘     <──────────────────────  └─────────────────┘
       │                    2. 返回版本信息 & 下载地址
       │
       ▼
  3. 对比本地版本号
       │
       ▼
  4. 发现新版本 → 后台下载安装包
       │
       ▼
  5. 下载完成 → 弹窗提示用户重启
       │
       ▼
  6. 用户确认 → autoUpdater.quitAndInstall()
```

### 2.1 关键文件说明

| 文件 | 说明 |
|---|---|
| `latest.yml` / `latest-mac.yml` / `latest-linux.yml` | 更新元数据文件，包含版本号、下载 URL、SHA512 校验值、文件大小 |
| `.blockmap` | 增量更新块映射文件，支持差量下载，减少流量消耗 |
| 安装包本体（`.exe` / `.dmg` / `.AppImage`） | 实际供客户端下载的新版本安装包 |

---

## 3. 配置步骤

### 3.1 安装依赖

```bash
npm install electron-updater --save
```

### 3.2 配置更新服务器地址（启用更新的必要步骤）

**默认情况下，自动更新功能是关闭的**。如需启用，必须先配置更新服务器地址。

#### 方式一：在 vue.config.js 中配置（推荐）

在 `vue.config.js` 的 `pluginOptions.electronBuilder.builderOptions` 中取消 `publish` 注释并填写实际地址：

```js
// vue.config.js
module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                // ... 其他现有配置
                
                // 自动更新服务器配置（generic = 通用静态文件服务器）
                publish: {
                    provider: 'generic',
                    url: 'https://your-update-server.com/releases'
                }
            }
        }
    }
}
```

**配置要点**：
- `provider: 'generic'`：表示使用任意 HTTP 静态服务器托管更新文件，无需特定云服务商 API
- `url`：更新文件的根目录地址，客户端会自动在此地址下寻找 `latest-xxx.yml`
- 打包时会自动生成 `latest.yml`、`latest-mac.yml`、`latest-linux.yml` 及对应的 `.blockmap` 文件

#### 方式二：在 background.js 中动态设置

如果不方便修改 `vue.config.js`，也可在主进程中通过代码动态设置（取消注释即可）：

```js
// src/background.js 中的 checkForUpdates 函数内
autoUpdater.setFeedURL({
    provider: 'generic',
    url: 'https://your-update-server.com/releases'
});
```

> **注意**：方式一会在打包时将地址嵌入应用，客户端无需额外配置；方式二适合需要根据不同环境动态切换地址的场景。

### 3.3 主进程代码（background.js）

#### 3.3.1 引入模块

```js
import { autoUpdater } from 'electron-updater';
```

#### 3.3.2 判断是否支持自动更新

```js
function isAutoUpdaterSupported() {
    if (isDevelopment) return false;              // 开发模式禁用
    // Linux 仅 AppImage 支持自动更新，deb/rpm 等不支持
    if (process.platform === 'linux' && !process.env.APPIMAGE) return false;
    return true;
}
```

**平台支持矩阵**：

| 平台 | 安装包格式 | 是否支持自动更新 | 原因 |
|---|---|---|---|
| macOS | `.dmg` / `.zip` | ✅ 支持 | electron-updater 原生支持 |
| Windows | `.exe` (nsis) | ✅ 支持 | electron-updater 原生支持 |
| Linux | `.AppImage` | ✅ 支持 | AppImage 可执行文件可被直接替换 |
| Linux | `.deb` / `.rpm` | ❌ 不支持 | 包管理器统一管理，无法直接替换 |

#### 3.3.3 检查更新函数

```js
function checkForUpdates(manual = false) {
    manualUpdateCheck = manual;
    if (!isAutoUpdaterSupported()) {
        if (manual) {
            dialog.showMessageBox({
                type: 'info',
                buttons: ['OK'],
                title: pkg.name,
                message: Locales.__('Update').Unsupported,
                detail: Locales.__('Update').UnsupportedDetail
            });
        }
        return;
    }

    if (downloading) {
        dialog.showMessageBox({
            type: 'info',
            buttons: ['OK'],
            title: pkg.name,
            message: Locales.__('Update').Downloading,
            detail: Locales.__('Update').DownloadingDetail
        });
        return;
    }

    // 如需自定义更新服务器，可在此动态设置 Feed URL
    // autoUpdater.setFeedURL({
    //     provider: 'generic',
    //     url: 'https://your-update-server.com/releases'
    // });

    if (!autoUpdater.feedUrl) {
        if (manual) {
            dialog.showMessageBox({
                type: 'info',
                buttons: ['OK'],
                title: pkg.name,
                message: Locales.__('Update').NotConfigured,
                detail: Locales.__('Update').NotConfiguredDetail
            });
        }
        return;
    }

    autoUpdater.checkForUpdates().catch(err => {
        console.error('checkForUpdates error', err);
        downloading = false;
        if (manualUpdateCheck) {
            dialog.showMessageBox({
                type: 'error',
                buttons: ['OK'],
                title: pkg.name,
                message: Locales.__('Update').Error,
                detail: err.message
            });
        }
        manualUpdateCheck = false;
    });
}
```

#### 3.3.4 监听更新事件

```js
autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
    console.log('Update available.', info);
    downloading = true;
});

autoUpdater.on('update-not-available', (info) => {
    console.log('Update not available.', info);
    if (manualUpdateCheck) {
        dialog.showMessageBox({
            type: 'info',
            buttons: ['OK'],
            title: pkg.name,
            message: Locales.__('Update').NotAvailable,
            detail: Locales.__('Update').NotAvailableDetail
        });
    }
    manualUpdateCheck = false;
});

autoUpdater.on('download-progress', (progressObj) => {
    let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
    logMessage += ` - Downloaded ${progressObj.percent}%`;
    logMessage += ` (${progressObj.transferred}/${progressObj.total})`;
    console.log(logMessage);
});

autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded.', info);
    downloading = false;
    dialog.showMessageBox({
        type: 'info',
        buttons: [Locales.__('Update').Restart, Locales.__('Update').Later],
        title: pkg.name,
        message: Locales.__('Update').Downloaded,
        detail: Locales.__('Update').DownloadedDetail
    }).then(({ response }) => {
        if (response === 0) {
            autoUpdater.quitAndInstall();
        }
    });
    manualUpdateCheck = false;
});

autoUpdater.on('error', (err) => {
    console.error('Auto updater error', err);
    downloading = false;
    if (manualUpdateCheck) {
        dialog.showMessageBox({
            type: 'error',
            buttons: ['OK'],
            title: pkg.name,
            message: Locales.__('Update').Error,
            detail: err.message
        });
    }
    manualUpdateCheck = false;
});
```

#### 3.3.5 应用启动后的自动检查（默认已关闭）

```js
app.on('ready', () => {
    // ... 其他初始化代码

    // 如需启动后自动检查更新，请取消下面注释
    // if (isAutoUpdaterSupported()) {
    //     setTimeout(() => {
    //         checkForUpdates(false);
    //     }, 60 * 1000); // 启动1分钟后检查
    // }
});
```

> **注意**：自动检查默认已注释关闭。如需开启，取消注释即可。建议初次上线时先使用手动检查模式验证链路。

#### 3.3.6 菜单与按钮的显隐控制

当前代码会根据**是否配置了更新服务器地址**，动态显示或隐藏"检查更新"入口：

```js
function shouldShowUpdateMenu() {
    return isAutoUpdaterSupported() && !!autoUpdater.feedUrl;
}
```

| 入口 | 未配置地址时 | 已配置地址时 |
|---|---|---|
| macOS 顶部菜单栏（`Cmd+U`） | ❌ 隐藏 | ✅ 显示 |
| Windows / Linux 托盘右键菜单 | ❌ 隐藏 | ✅ 显示 |
| 设置页面"检查更新"按钮 | ❌ 隐藏 | ✅ 显示 |

> 这样即使用户没有配置更新服务器，也不会看到无法使用的"检查更新"选项，避免困惑。

#### 3.3.7 菜单触发手动检查

**macOS 顶部菜单栏**（已加 `id` 用于过滤）：
```js
{
    id: 'menu-check-update',
    label: Locales.__('Main').Check,
    accelerator: 'Cmd+U',
    click() {
        checkForUpdates(true);
    }
}
```

**Windows / Linux 托盘右键菜单**（已加 `id` 用于过滤）：
```js
{
    id: 'menu-check-update',
    label: Locales.__('Main').Check,
    click() {
        checkForUpdates(true);
    }
}
```

---

## 4. 打包构建

### 4.1 打包命令

项目已配置多平台打包脚本：

```bash
# macOS (Universal)
npm run package

# Windows x64
npm run cross-package-win

# Windows ia32
npm run cross-package-win32

# Linux x64
npm run cross-package-linux

# Linux arm64
npm run cross-package-linux-arm64
```

### 4.2 打包产物说明

以版本 `1.1.1` 为例，打包成功后 `dist_electron/` 目录会生成：

#### macOS
```
dist_electron/
├── 野火IM-1.1.1-mac-universal.dmg          # 安装包
├── 野火IM-1.1.1-mac-universal.dmg.blockmap  # 差量更新块映射
├── latest-mac.yml                           # macOS 更新元数据
└── mac-universal/                           # 未封装目录（测试用）
```

#### Windows
```
dist_electron/
├── 野火IM-1.1.1-win-x64-setup.exe          # 安装包
├── 野火IM-1.1.1-win-x64-setup.exe.blockmap  # 差量更新块映射
├── latest.yml                               # Windows 更新元数据
└── win-unpacked/                            # 未封装目录（测试用）
```

#### Linux AppImage
```
dist_electron/
├── 野火IM-1.1.1-linux-arm64.AppImage          # 可执行安装包
├── 野火IM-1.1.1-linux-arm64.AppImage.blockmap  # 差量更新块映射
├── latest-linux.yml                              # Linux 更新元数据
└── linux-arm64-unpacked/                         # 未封装目录（测试用）
```

#### Linux deb
```
dist_electron/
├── 野火IM-1.1.1-linux-arm64.deb   # Debian 安装包
└── linux-arm64-unpacked/           # 未封装目录（测试用）
```

> **deb 包不会生成 `latest-linux.yml`**，因为 deb 不支持 electron-updater 自动更新。

---

## 5. 服务器部署

### 5.1 服务器选型

`provider: 'generic'` 支持任何能托管静态文件的 HTTP 服务器：
- Nginx / Apache
- CDN（阿里云 OSS、腾讯云 COS、AWS S3 + CloudFront 等）
- GitHub Pages / Gitee Pages
- MinIO 等对象存储

**要求**：
- 支持 HTTP/HTTPS 访问
- 文件路径大小写敏感（Linux 服务器需注意）
- 建议开启 gzip（latest.yml 文件很小，gzip 后仅几百字节）
- **必须支持 CORS 跨域**（如果客户端通过 HTTPS 访问，服务器也要 HTTPS）

### 5.2 推荐的目录结构

以 `https://your-update-server.com/releases/` 为根路径：

```
releases/
├── latest.yml                          # Windows x64 元数据
├── latest-mac.yml                      # macOS 元数据
├── latest-linux.yml                    # Linux 元数据
├── 野火IM-1.1.1-win-x64-setup.exe
├── 野火IM-1.1.1-win-x64-setup.exe.blockmap
├── 野火IM-1.1.1-mac-universal.dmg
├── 野火IM-1.1.1-mac-universal.dmg.blockmap
├── 野火IM-1.1.1-linux-arm64.AppImage
├── 野火IM-1.1.1-linux-arm64.AppImage.blockmap
└── 野火IM-1.1.1-linux-arm64.deb       # deb 可放同一目录供手动下载
```

### 5.3 需要上传到服务器的文件清单

| 平台 | 必须上传 | 推荐上传 | 说明 |
|---|---|---|---|
| **Windows** | `.exe`、`latest.yml` | `.exe.blockmap` | blockmap 支持差量更新 |
| **macOS** | `.dmg`、 `latest-mac.yml` | `.dmg.blockmap` | 也可用 `.zip` 代替 `.dmg` |
| **Linux AppImage** | `.AppImage`、 `latest-linux.yml` | `.AppImage.blockmap` | AppImage 是唯一支持自动更新的 Linux 格式 |
| **Linux deb** | `.deb` | — | 仅手动下载，不参与自动更新 |

### 5.4 Nginx 配置示例

```nginx
server {
    listen 443 ssl;
    server_name your-update-server.com;

    root /var/www/releases;
    autoindex on;

    # 允许跨域（electron-updater 需要）
    location /releases/ {
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, HEAD, OPTIONS';

        # 对 yml 文件开启 gzip
        location ~* \.yml$ {
            gzip on;
            gzip_types text/plain application/x-yaml;
        }
    }
}
```

---

## 6. 客户端请求的 URL 规则

`electron-updater` 会根据当前平台自动拼接请求 URL：

| 客户端平台 | 请求的 URL |
|---|---|
| Windows | `https://your-update-server.com/releases/latest.yml` |
| macOS | `https://your-update-server.com/releases/latest-mac.yml` |
| Linux (AppImage) | `https://your-update-server.com/releases/latest-linux.yml` |

**latest.yml 内容示例**：
```yaml
version: 1.1.1
files:
  - url: 野火IM-1.1.1-win-x64-setup.exe
    sha512: xxxxxxxx...
    size: 12345678
    blockMapSize: 1234
path: 野火IM-1.1.1-win-x64-setup.exe
sha512: xxxxxxxx...
releaseDate: '2024-01-15T10:00:00.000Z'
```

---

## 7. 发布新版本流程

1. **修改版本号**：在 `package.json` 中更新 `version` 字段（如 `1.1.1` → `1.1.2`）
2. **执行打包**：运行对应平台的打包命令
3. **上传到服务器**：
   - 上传新的安装包和 `.blockmap` 文件
   - **覆盖旧的 `latest-xxx.yml`**（或保留历史版本但确保 latest.yml 指向最新版）
4. **客户端检测**：
   - 已安装旧版本的用户点击"检查更新"，或等待自动检查触发
   - 客户端下载 `latest.yml`，发现 `version` > 本地版本，开始后台下载
   - 下载完成后弹窗提示重启

---

## 8. 常见问题

### Q1：默认状态下为什么看不到"检查更新"菜单？
**这是设计如此**。因为 `vue.config.js` 中的 `publish` 默认被注释掉了，代码通过 `shouldShowUpdateMenu()` 判断没有配置更新服务器地址，因此主动隐藏了所有"检查更新"入口（macOS 菜单、托盘菜单、设置页面按钮）。

只有配置了 `publish.url` 后，这些入口才会显示出来。

### Q2：配置了 publish，打包时会自动上传到服务器吗？
**不会**。`generic` provider 没有上传 API，electron-builder 只会在本地生成 `latest.yml` 等文件。你需要手动或通过 CI/CD（如 GitHub Actions、Jenkins）将文件上传到服务器。

打包命令中的 `-p never` 表示"不执行发布动作"，即使去掉该参数，`generic` provider 也不会自动上传。

### Q3：为什么 Linux deb 不支持自动更新？
`deb` 包由系统包管理器（`dpkg`/`apt`）管理，应用本身没有权限直接替换 `/usr/share/applications/` 下的文件。而 `AppImage` 是一个独立的可执行文件，可以被直接下载替换，因此支持自动更新。

### Q4：可以同时支持多个架构（x64 / arm64）的自动更新吗？
可以。需要在服务器上按架构分目录存放：
```
releases/
├── win-x64/
│   ├── latest.yml
│   └── 野火IM-1.1.1-win-x64-setup.exe
├── linux-arm64/
│   ├── latest-linux.yml
│   └── 野火IM-1.1.1-linux-arm64.AppImage
└── ...
```
然后在 `vue.config.js` 中按条件设置不同的 `publish.url`，或在代码中通过 `process.arch` 动态 `setFeedURL()`。

### Q5：用户点击"立即重启"后，更新没有生效？
- Windows：确保打包使用的是 `nsis` target，且不是便携版（portable）
- macOS：确保应用已签名（SIP 和 Gatekeeper 可能阻止未签名应用的替换）
- Linux：确保是 AppImage 格式，且用户对原文件有写入权限

### Q6：如何测试更新功能？
1. 将 `package.json` 版本改为旧版本（如 `1.0.0`）
2. 打包并安装到本地
3. 将 `package.json` 版本改回新版本（如 `1.1.1`），重新打包并上传服务器
4. 启动旧版本客户端，手动触发"检查更新"
5. 观察控制台日志和弹窗行为

---

## 9. 总结

| 环节 | 关键动作 |
|---|---|
| **依赖** | 安装 `electron-updater` |
| **构建配置** | `vue.config.js` 中配置 `publish: { provider: 'generic', url: '...' }` |
| **代码逻辑** | `background.js` 中集成 `autoUpdater` 事件监听和菜单触发 |
| **平台兼容** | macOS/Windows/AppImage 支持自动更新；deb 不支持 |
| **自动检查** | 默认关闭，按需开启 |
| **服务器部署** | 上传安装包 + `latest-xxx.yml` + `.blockmap` 到静态服务器 |
| **版本发布** | 修改 version → 打包 → 上传覆盖 latest.yml |

按以上步骤配置后，即可实现全平台的自动更新能力。
