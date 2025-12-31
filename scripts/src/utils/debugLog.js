import { appendFileSync } from 'fs';

const LOG_PATH = '/Users/sru_raj/Documents/BeyondChats/.cursor/debug.log';

export function debugLog(location, message, data, hypothesisId) {
  const logEntry = {
    location,
    message,
    data,
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'run1',
    hypothesisId
  };
  try {
    appendFileSync(LOG_PATH, JSON.stringify(logEntry) + '\n');
  } catch (err) {
    // Silently fail if log file can't be written
  }
}