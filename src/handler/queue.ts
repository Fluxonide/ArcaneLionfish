import { bot } from '../../index.js'

/**
 * Per-user message queue.
 *
 * Each user gets their own FIFO queue. When a message arrives and a previous
 * message for that user is still being processed, the new message is added to
 * the queue and will be processed after the current one finishes.
 *
 * Certain "immediate" commands (like /cancel) bypass the queue entirely so they
 * can take effect while a long-running batch is in progress.
 */

// Commands that should NEVER be queued – they execute immediately even if
// another message is being processed.
const IMMEDIATE_COMMANDS = new Set(['cancel', 'stats', 'help', 'start', 'settings'])

interface QueueEntry {
  /** The processing function to call for this message */
  execute: () => Promise<void>
  /** Human-readable label for logging */
  label: string
}

/** Per-user queues, keyed by numeric chat ID */
const userQueues = new Map<number, QueueEntry[]>()

/** Set of chat IDs currently being processed */
const processing = new Set<number>()

/**
 * Check if a message text consists solely of immediate (queue-bypassing)
 * commands. A message bypasses the queue only if every command block in it
 * is an immediate command.
 */
export function isImmediateMessage(text: string): boolean {
  if (!text.startsWith('/')) return false

  // Split the same way handleCommand does
  const blocks = text.split(/(?=^\/)/m).map(b => b.trim()).filter(b => b.startsWith('/'))

  if (blocks.length === 0) return false

  return blocks.every(block => {
    const match = block.match(/^\/([^\s@]+)/)
    if (!match) return false
    return IMMEDIATE_COMMANDS.has(match[1].toLowerCase())
  })
}

/**
 * Enqueue a message for processing. If nothing is currently being processed
 * for this user, it starts immediately. Otherwise it waits in line.
 *
 * Returns a promise that resolves when the message has been fully processed.
 */
export function enqueueMessage(
  chatId: number,
  execute: () => Promise<void>,
  label: string,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const entry: QueueEntry = {
      execute: async () => {
        try {
          await execute()
          resolve()
        } catch (e) {
          reject(e)
        }
      },
      label,
    }

    let queue = userQueues.get(chatId)
    if (!queue) {
      queue = []
      userQueues.set(chatId, queue)
    }

    queue.push(entry)

    const position = queue.length
    if (position > 1) {
      // There's already something being processed — notify the user
      console.log(`[Queue] Chat ${chatId}: message queued at position ${position} — "${label}"`)
      bot.sendMessage(chatId, {
        message: `⏳ <b>Queued</b> — your message is #${position} in line. It will start after the current task finishes.`,
        parseMode: 'html',
      }).catch(() => {})
    }

    // If we're the only item and nothing is processing, start immediately
    if (!processing.has(chatId)) {
      processQueue(chatId)
    }
  })
}

/**
 * Process the queue for a given user. Runs entries one-by-one until the
 * queue is drained.
 */
async function processQueue(chatId: number): Promise<void> {
  if (processing.has(chatId)) return
  processing.add(chatId)

  const queue = userQueues.get(chatId)

  while (queue && queue.length > 0) {
    const entry = queue[0]
    console.log(`[Queue] Chat ${chatId}: processing — "${entry.label}"`)

    try {
      await entry.execute()
    } catch (e: any) {
      console.error(`[Queue] Chat ${chatId}: error processing "${entry.label}":`, e)
    }

    // Remove the completed entry
    queue.shift()

    if (queue.length > 0) {
      console.log(`[Queue] Chat ${chatId}: ${queue.length} message(s) remaining in queue`)
    }
  }

  processing.delete(chatId)
  userQueues.delete(chatId)
  console.log(`[Queue] Chat ${chatId}: queue empty`)
}

/**
 * Clear all queued (not yet started) messages for a user.
 * The currently-processing message is NOT interrupted — that's handled
 * by the /cancel command itself through the existing cancellation flags.
 *
 * Returns the number of messages removed from the queue.
 */
export function clearQueue(chatId: number): number {
  const queue = userQueues.get(chatId)
  if (!queue || queue.length <= 1) return 0

  // Keep the first entry (currently executing), drop the rest
  const removed = queue.length - 1
  queue.splice(1)
  console.log(`[Queue] Chat ${chatId}: cleared ${removed} queued message(s)`)
  return removed
}

/**
 * Get the current queue depth for a user (including the currently-processing item).
 */
export function getQueueDepth(chatId: number): number {
  return userQueues.get(chatId)?.length ?? 0
}
