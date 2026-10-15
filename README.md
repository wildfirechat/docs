# 野火IM开发文档

本仓库包含野火IM的开发文档（`md/` 目录，使用 [HonKit](https://github.com/honkit/honkit) 构建，即 GitBook 3 的开源社区继任者，已不依赖 Node 10 和老版 gitbook CLI）以及文档中引用的一些周边项目（`trickle-ice`、`abilitytest`、`wstool`、`pricing-calculator` 等）。

## 依赖

* Node.js ≥ 18（推荐 Node 20，见 `md/.nvmrc`，可用 nvm 管理）
* 文档构建依赖通过 npm 本地安装：`cd md && npm install`（安装 HonKit 及全部插件，无需全局安装）
* 生成 PDF 需要 [Calibre](https://calibre-ebook.com/)（提供 `ebook-convert` 命令），macOS 下 `brew install --cask calibre` 即可

## 构建

```bash
cd md
npm install          # 首次需要
npm run build        # 生成静态网站到 _book/
npm run serve        # 本地预览
npm run pdf          # 生成 野火IM开发文档.pdf
```

## 发布

```bash
cd md
./publish.sh         # 构建网站和PDF，整合周边项目，替换CDN链接，打包上传到 wfccn
```
