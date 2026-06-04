// Shared helpers for rendering batch-download progress.
//
// These were previously copy-pasted between command.ts, message.ts and
// callbackQuery.ts. Keeping a single implementation avoids drift.

// Format a duration in seconds as HH:MM:SS.
export function secToTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) return '00:00:00'
  const hour = Math.floor(sec / 3600)
  const min = Math.floor((sec - hour * 3600) / 60)
  const secs = sec - hour * 3600 - min * 60
  return [
    hour.toString().padStart(2, '0'),
    min.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0'),
  ].join(':')
}

// Build a unicode progress bar for the given percentage.
export function buildProgressBar(percent: number, length = 20): string {
  const clamped = Math.max(0, Math.min(100, percent))
  const filled = Math.round((clamped / 100) * length)
  return '█'.repeat(filled) + '░'.repeat(length - filled)
}
