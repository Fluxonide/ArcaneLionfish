# <p align="center">🐱 ArcaneLionfish</p>

<p align="center"> 简体中文 · <a href="./README_en.md">English</a></p>

<p align="center">一个 Node.js Telegram 机器人，可以下载文件（直接上传或通过 URL）并转存到 Telegram 日志频道。</p>

---

## 特性

- [x] 支持音频、视频、文件、贴纸

- [x] 支持通过 URL（单个链接或 .txt 文件中的链接列表）下载并转存

- [x] 将所有文件转存到 Telegram 日志频道

- [x] 批量下载，支持并发、进度跟踪与自动重试

- [x] 全局 flood gate，遵守 Telegram 限速

- [x] 多语言支持，可添加翻译文件，自动识别

- [x] 支持私聊中使用

- [ ] 支持群组中调用

## 部署

### 一键部署

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/new)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

详细部署指南请查看 [DEPLOY.md](DEPLOY.md)

### 本地部署

- Clone 此仓库到本地 / 服务器

- 配置 .env 文件（参照下方说明）

- 运行以下命令（需有 Node.js 环境）：

```Bash
# 需要先安装 pnpm
pnpm install && pnpm start
```

## 环境变量

- `BOT_TOKEN`: 从 BotFather 获得的 Bot token。

- `API_ID`: 从 my.telegram.org 获得的 API ID。

- `API_HASH`: 从 my.telegram.org 获得的 API hash。

- `ADMIN_ID`: 机器人拥有者（你本人）的 ID。可从 [GetIDs Bot](https://t.me/getidsbot) 获取。

- `LOG_CHANNEL_ID`: 用于存放记录的频道 ID。_可留空_。

- `DEFAULT_LANG`: [ `zh_CN` / `en_US` ] 用户的默认语言。

- `MAX_DOWNLOADING`: 允许用户同时上传文件的数量（建议 `1`–`3`）。

- `DOWNLOAD_DC_ID`: [ 可选 ] 下载文件时使用的 [Telegram 数据中心](https://docs.pyrogram.org/faq/what-are-the-ip-addresses-of-telegram-data-centers)。默认为 5，改为您机器人所在的 DC 可提高下载速度。

- `DOWNLOAD_WORKERS`: [ 可选 ] 同时下载文件的分块数。默认为 5，提高此项可提高下载速度。

- `PARALLEL_DOWNLOADS`: [ 可选 ] 批量模式下同时下载的 URL 数量。默认为 3。

- `MAX_CACHE_MB`: [ 可选 ] 缓存目录达到多少 MB 后开始清理。默认为 500。

- `ALLOWED_USERS`: [ 可选 ] 允许使用机器人的用户 ID，以逗号分隔。留空则所有人可用。

## 贡献翻译

1. 在 `/src/i18n` 文件夹下新建文件，以 `[语言代码].json` 命名（如有短杠 `-`，改为下划线 `_`）。示例：`zh_CN.json`。

2. 参照 `zh_CN.json` 或 `en_US.json` 进行翻译。所有属性必须翻译。
