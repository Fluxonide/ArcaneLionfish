# <p align="center">🐱 ArcaneLionfish</p>

<p align="center">A Node.js Telegram bot that downloads files (uploaded directly or from URLs) and mirrors them to a Telegram log channel.</p>

---

## Features

- [x] Upload files (stickers, photos, audios, videos)

- [x] Download and mirror files from URLs (single links or a list in a .txt file)

- [x] Mirror everything to a Telegram log channel

- [x] Batch downloads with parallel workers, progress tracking and auto-retry

- [x] Global flood gate to respect Telegram rate limits

- [x] Multi-language support (zh_CN & en_US currently)

- [x] Available in private chats

- [ ] Available in groups

## Deploy

### One-Click Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/new)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

For detailed deployment instructions, see [DEPLOY.md](DEPLOY.md)

### Manual Deploy

- Clone this repo

- Configure the .env file, following the instructions below

- Run the following command (Node.js environment required):

```Bash
# Requires pnpm
pnpm install && pnpm start
```

## Variables

- `BOT_TOKEN`: Bot token from BotFather.

- `API_ID`: API ID obtained from my.telegram.org.

- `API_HASH`: API hash obtained from my.telegram.org.

- `ADMIN_ID`: Admin ID (usually yours. Get it from [GetIDs Bot](https://t.me/getidsbot)).

- `LOG_CHANNEL_ID`: Channel to store logs. Can be left empty.

- `DEFAULT_LANG`: [ `zh_CN` / `en_US` ] Default language for your users.

- `MAX_DOWNLOADING`: Number of parallel file uploads allowed per user. (Recommended `1`–`3`)

- `DOWNLOAD_DC_ID`: [ Optional ] [Telegram DC](https://docs.pyrogram.org/faq/what-are-the-ip-addresses-of-telegram-data-centers) ID for downloading files. Default `5`. Changing this to your bot's DC ID may improve download speed.

- `DOWNLOAD_WORKERS`: [ Optional ] Number of parallel chunk downloads. Default `5`. Increasing this may improve download speed.

- `PARALLEL_DOWNLOADS`: [ Optional ] Number of URLs downloaded concurrently in batch mode. Default `3`.

- `MAX_CACHE_MB`: [ Optional ] Maximum cache directory size in MB before eviction. Default `500`.

- `ALLOWED_USERS`: [ Optional ] Comma-separated user IDs allowed to use the bot. If empty, everyone is allowed.

## Translations

1. Create a new file in the `src/i18n` folder, named `[language_code].json`, replacing `-` (if present) with `_` (e.g. `en_US.json`).

2. Translate every property, using `zh_CN.json` or `en_US.json` as the source. All properties are required.
