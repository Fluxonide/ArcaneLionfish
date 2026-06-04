// Centralized timing constants.
//
// These delays exist to keep the bot well under Telegram's rate limits and to
// avoid hammering source servers. They were previously scattered as magic
// numbers across transfer.ts, command.ts and message.ts. Tune them here.

// Delay between consecutive sends to the log channel. Telegram limits group/
// channel media sends to roughly 20/min, so we stay comfortably below that.
export const LOG_CHANNEL_SEND_DELAY_MS = 4500

// Extra safety buffer added on top of a reported FloodWait window.
export const FLOOD_SAFETY_BUFFER_MS = 2000

// Default FloodWait to assume when the duration cannot be parsed from an error.
export const FLOOD_DEFAULT_SECONDS = 30

// Delay between downloads within a single worker, to avoid overwhelming the
// source server (some hosts, e.g. Cloudflare Workers, rate-limit aggressively).
export const WORKER_DOWNLOAD_DELAY_MS = 2000

// Stagger between launching parallel workers so they don't all hit the source
// server simultaneously at startup.
export const WORKER_STAGGER_MS = 2500

// Delay between retrying a failed download in the auto-retry phase.
export const RETRY_DELAY_MS = 5000

// How often the batch progress message is auto-refreshed.
export const PROGRESS_REFRESH_INTERVAL_MS = 7000

// Delay between sequential command blocks in a single multi-command message.
export const COMMAND_BLOCK_DELAY_MS = 1500

// Backpressure: pause launching new downloads while the log queue is deeper
// than this, to avoid filling the disk with cached files awaiting upload.
export const LOG_QUEUE_BACKPRESSURE_LIMIT = 10
