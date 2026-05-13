// Centralized logging system for production monitoring

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: any;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

class Logger {
  private sessionId: string;
  private isDevelopment: boolean;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: any,
    userId?: string
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      userId,
      sessionId: this.sessionId,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    };
  }

  private async sendToMonitoring(entry: LogEntry) {
    // In production, send to monitoring service
    // Examples: Sentry, LogRocket, Datadog, etc.
    
    if (this.isDevelopment) {
      // In development, just log to console
      const color = {
        [LogLevel.DEBUG]: 'color: gray',
        [LogLevel.INFO]: 'color: blue',
        [LogLevel.WARN]: 'color: orange',
        [LogLevel.ERROR]: 'color: red',
        [LogLevel.CRITICAL]: 'color: red; font-weight: bold',
      }[entry.level];

      console.log(
        `%c[${entry.level.toUpperCase()}] ${entry.message}`,
        color,
        entry.context || ''
      );
    } else {
      // In production, send to monitoring service
      try {
        // Example: Send to your backend logging endpoint
        // await fetch('/api/logs', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(entry),
        // });

        // Or use a service like Sentry
        // Sentry.captureMessage(entry.message, {
        //   level: entry.level,
        //   extra: entry.context,
        // });
      } catch (error) {
        // Fallback to console if monitoring fails
        console.error('Failed to send log to monitoring:', error);
      }
    }
  }

  debug(message: string, context?: any, userId?: string) {
    const entry = this.createLogEntry(LogLevel.DEBUG, message, context, userId);
    this.sendToMonitoring(entry);
  }

  info(message: string, context?: any, userId?: string) {
    const entry = this.createLogEntry(LogLevel.INFO, message, context, userId);
    this.sendToMonitoring(entry);
  }

  warn(message: string, context?: any, userId?: string) {
    const entry = this.createLogEntry(LogLevel.WARN, message, context, userId);
    this.sendToMonitoring(entry);
  }

  error(message: string, context?: any, userId?: string) {
    const entry = this.createLogEntry(LogLevel.ERROR, message, context, userId);
    this.sendToMonitoring(entry);
  }

  critical(message: string, context?: any, userId?: string) {
    const entry = this.createLogEntry(LogLevel.CRITICAL, message, context, userId);
    this.sendToMonitoring(entry);
    
    // For critical errors, also alert immediately
    if (!this.isDevelopment) {
      // Send immediate alert (email, SMS, Slack, etc.)
      // Example: alerting.sendCriticalAlert(entry);
    }
  }

  // Performance monitoring
  startTimer(label: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.info(`Performance: ${label}`, { duration: `${duration.toFixed(2)}ms` });
    };
  }

  // Track user actions
  trackAction(action: string, metadata?: any, userId?: string) {
    this.info(`User Action: ${action}`, metadata, userId);
  }

  // Track API calls
  trackApiCall(endpoint: string, method: string, duration: number, status: number) {
    this.info(`API Call: ${method} ${endpoint}`, {
      duration: `${duration}ms`,
      status,
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Convenience functions
export const logDebug = (message: string, context?: any, userId?: string) =>
  logger.debug(message, context, userId);

export const logInfo = (message: string, context?: any, userId?: string) =>
  logger.info(message, context, userId);

export const logWarn = (message: string, context?: any, userId?: string) =>
  logger.warn(message, context, userId);

export const logError = (message: string, context?: any, userId?: string) =>
  logger.error(message, context, userId);

export const logCritical = (message: string, context?: any, userId?: string) =>
  logger.critical(message, context, userId);

export const trackAction = (action: string, metadata?: any, userId?: string) =>
  logger.trackAction(action, metadata, userId);

export const startTimer = (label: string) => logger.startTimer(label);
