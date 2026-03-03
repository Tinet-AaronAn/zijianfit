/**
 * 日志工具类
 * 支持不同级别的日志输出和文件记录
 */

import fs from 'fs';
import path from 'path';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

class Logger {
  private logLevel: LogLevel;
  private logFile?: string;

  constructor() {
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO;
    this.logFile = process.env.LOG_FILE;

    // 确保日志目录存在
    if (this.logFile) {
      const logDir = path.dirname(this.logFile);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
    }
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}\n`;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  private writeToFile(formattedMessage: string): void {
    if (this.logFile) {
      fs.appendFileSync(this.logFile, formattedMessage);
    }
  }

  debug(message: string, meta?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const formatted = this.formatMessage(LogLevel.DEBUG, message, meta);
      console.debug(formatted.trim());
      this.writeToFile(formatted);
    }
  }

  info(message: string, meta?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const formatted = this.formatMessage(LogLevel.INFO, message, meta);
      console.info(formatted.trim());
      this.writeToFile(formatted);
    }
  }

  warn(message: string, meta?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const formatted = this.formatMessage(LogLevel.WARN, message, meta);
      console.warn(formatted.trim());
      this.writeToFile(formatted);
    }
  }

  error(message: string, error?: Error | any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const meta = error instanceof Error 
        ? { message: error.message, stack: error.stack }
        : error;
      const formatted = this.formatMessage(LogLevel.ERROR, message, meta);
      console.error(formatted.trim());
      this.writeToFile(formatted);
    }
  }
}

// 导出单例
export const logger = new Logger();
