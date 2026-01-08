/**
 * Application Logger
 * Centralized logging for consistent error tracking and debugging
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogMetadata {
  [key: string]: unknown
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatMessage(level: LogLevel, message: string, metadata?: LogMetadata): string {
    const timestamp = new Date().toISOString()
    const metadataStr = metadata ? ` ${JSON.stringify(metadata)}` : ''
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metadataStr}`
  }

  info(message: string, metadata?: LogMetadata): void {
    const formatted = this.formatMessage('info', message, metadata)
    console.log(formatted)
  }

  warn(message: string, metadata?: LogMetadata): void {
    const formatted = this.formatMessage('warn', message, metadata)
    console.warn(formatted)
  }

  error(message: string, error?: Error | unknown, metadata?: LogMetadata): void {
    const errorDetails = error instanceof Error 
      ? { message: error.message, stack: error.stack, ...metadata }
      : { error, ...metadata }
    
    const formatted = this.formatMessage('error', message, errorDetails)
    console.error(formatted)
  }

  debug(message: string, metadata?: LogMetadata): void {
    if (this.isDevelopment) {
      const formatted = this.formatMessage('debug', message, metadata)
      console.debug(formatted)
    }
  }
}

export const logger = new Logger()
