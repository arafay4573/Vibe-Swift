export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

export function createLogger(prefix: string = 'VibeSwift', debugEnabled: boolean = false): Logger {
  return {
    debug: (...args: unknown[]) => {
      if (debugEnabled) {
        console.debug(`[${prefix}][DEBUG]`, ...args);
      }
    },
    info: (...args: unknown[]) => {
      console.info(`[${prefix}][INFO]`, ...args);
    },
    warn: (...args: unknown[]) => {
      console.warn(`[${prefix}][WARN]`, ...args);
    },
    error: (...args: unknown[]) => {
      console.error(`[${prefix}][ERROR]`, ...args);
    },
  };
}

export const defaultLogger = createLogger('VibeSwift');
