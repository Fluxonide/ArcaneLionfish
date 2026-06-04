import i18n from '../i18n/index.js'
import { bot } from '../../index.js'
import {
  writeFileSync,
  readFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  rmSync,
} from 'fs'
import { DEFAULT_LANG } from '../env.js'
import type { UserData } from '../types/data.js'

export let chatData: Record<string, UserData> = {}
export const chatDataTemplate = {
  lang: DEFAULT_LANG,
  downloading: 0,
  total: 0,
  banned: false,
}

// Timestamp captured when the process started, used to detect orphan cache items.
const PROCESS_START_TIME = Date.now()

// console.log, with date added
export function log(...text: any[]) {
  console.log(`[${new Date().toISOString()}] [Bot] - ${text.join(' ')}`)
}

export function initChatData(userId: string | number | bigint) {
  const _userId = userId.toString()
  if (!chatData[_userId]) {
    chatData[_userId] = Object.assign({}, chatDataTemplate)
    console.log(`User ${_userId} data initialized`)
  } else {
    // Only fill in genuinely missing keys. Using `=== undefined` avoids
    // wrongly resetting valid falsy values like downloading: 0 or banned: false.
    for (let key in chatDataTemplate) {
      if (chatData[_userId][key] === undefined) {
        chatData[_userId][key] = chatDataTemplate[key]
      }
    }
  }
  saveBotData()
}

// Debounced save: initChatData() runs on every incoming message, so writing the
// whole JSON file each time is wasteful. Batch writes into a short window while
// still guaranteeing a flush via saveBotDataNow() (e.g. on shutdown).
let saveTimer: NodeJS.Timeout | null = null
const SAVE_DEBOUNCE_MS = 3000

export function saveBotData() {
  if (saveTimer) return
  saveTimer = setTimeout(() => {
    saveTimer = null
    saveBotDataNow()
  }, SAVE_DEBOUNCE_MS)
}

export function saveBotDataNow() {
  if (saveTimer) {
    clearTimeout(saveTimer)
    saveTimer = null
  }
  try {
    writeFileSync('./data/chatsList.json', JSON.stringify(chatData))
  } catch (e) {
    log(`Failed to save bot data: ${e.message}`)
  }
}

export function loadBotData() {
  log('Loading bot data...')
  if (!existsSync('./data')) mkdirSync('./data')
  if (existsSync('./data/chatsList.json'))
    chatData = JSON.parse(readFileSync('./data/chatsList.json', 'utf-8')) || {}
  
  log(`Loaded data from ${Object.keys(chatData).length} chat(s)`)
}

export function cleanupOrphanTransferTasks() {
  let userCount = 0

  for (let chat in chatData) {
    if (chatData[chat].downloading) {
      userCount++
      chatData[chat].downloading = 0
      bot.sendMessage(chat, { message: i18n.t(chatData[chat].lang, 'error') }).catch()
    }
  }

  // Find cache files and directories that were created before the bot was launched,
  // and delete them. Comparing against the process start time (not `now`) ensures
  // we never remove files belonging to transfers started by this running instance.
  let deletedCount = 0

  if (existsSync('./cache')) {
    try {
      const cacheItems = readdirSync('./cache', 'utf-8')

      cacheItems.forEach(item => {
        const itemPath = `./cache/${item}`
        try {
          const stat = statSync(itemPath)
          if (stat.birthtimeMs < PROCESS_START_TIME) {
            if (stat.isFile()) {
              rmSync(itemPath)
              deletedCount++
            } else if (stat.isDirectory()) {
              rmSync(itemPath, { recursive: true })
              deletedCount++
            }
          }
        } catch (e) {
          log(`Failed to clean cache item ${itemPath}: ${e.message}`)
        }
      })
    } catch (e) {
      log(`Failed to read cache directory: ${e.message}`)
    }
  }

  log(`Aborted ${userCount} transfer(s) and deleted ${deletedCount} orphan cache item(s)`)
}
