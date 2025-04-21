
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogConfig {
  enableConsoleLogging: boolean;
  logLevel: LogLevel;
  appName: string;
}

const LogLevels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

export const LoggerService = {
  // Configuração
  config: {
    enableConsoleLogging: process.env.NODE_ENV !== 'production', // Desativar em produção
    logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    appName: 'Furou'
  } as LogConfig,
  
  // Níveis de log em ordem de severidade
  levels: LogLevels,
  
  // Formata a mensagem de log com timestamp
  formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${this.config.appName}] [${level.toUpperCase()}] ${message}`;
  },
  
  // Verifica se deve registrar com base no nível configurado
  shouldLog(level: LogLevel): boolean {
    return LogLevels[level] >= LogLevels[this.config.logLevel as LogLevel];
  },
  
  // Métodos de logging
  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug') && this.config.enableConsoleLogging) {
      console.debug(this.formatMessage('debug', message), ...args);
    }
  },
  
  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info') && this.config.enableConsoleLogging) {
      console.info(this.formatMessage('info', message), ...args);
    }
  },
  
  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn') && this.config.enableConsoleLogging) {
      console.warn(this.formatMessage('warn', message), ...args);
    }
  },
  
  error(message: string, ...args: any[]): void {
    if (this.shouldLog('error') && this.config.enableConsoleLogging) {
      console.error(this.formatMessage('error', message), ...args);
    }
  },
  
  // Método para facilitar o log de erros de API
  logApiError(context: string, error: any): void {
    this.error(`API Error in ${context}`, {
      message: error?.message,
      code: error?.code,
      status: error?.status,
      details: error?.details
    });
  }
};
