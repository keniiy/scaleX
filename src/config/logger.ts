// logger.ts
import winston from 'winston';
import fs from 'fs';
import appRoot from 'app-root-path';
import keys from './keys'; // Make sure this path is correct

interface LoggerOptions {
  logDirPath?: string;
  debugMode?: boolean;
  label?: string;
}

class Logger {
  private logDir: string;
  private label: string;
  private debugMode: boolean;
  private environment: string;
  private _commonOptions: {
    console: winston.transports.ConsoleTransportOptions;
    file: winston.transports.FileTransportOptions;
  };

  constructor(options: LoggerOptions) {
    this.logDir = options.logDirPath || `${appRoot}/logs`;
    this.label = options.label || 'Spacex-Backend-Test';
    this.debugMode = options.debugMode !== undefined ? options.debugMode : true;
    this.environment = keys.NODE_ENV || 'development';

    this._commonOptions = {
      console: {
        level: 'debug',
        handleExceptions: true,
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.printf(
            (info) =>
              `[${new Date(info.timestamp).toUTCString()}]: ${info.label} - ${
                info.level
              }: ${info.message}`
          )
        ),
      },
      file: {
        level: 'debug',
        filename: `${this.logDir}/app.log`,
        handleExceptions: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        format: winston.format.json(),
      },
    };
  }

  private _getTransports() {
    const { console, file } = this._commonOptions;
    let level = this.debugMode ? 'debug' : 'info';
    if (this.environment === 'production' && this.debugMode) level = 'error';

    return [
      new winston.transports.File({ ...file, level }),
      new winston.transports.Console({ ...console, level }),
    ];
  }

  init() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }

    const logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.label({ label: this.label })
      ),
      transports: this._getTransports(),
      exitOnError: false,
    });

    return logger;
  }

  static createLogger(options: LoggerOptions) {
    const loggerInstance = new Logger(options);
    return loggerInstance.init();
  }
}

const logger = Logger.createLogger({
  debugMode: keys.NODE_ENV !== 'production',
  label: 'Scalex-Backend-Test',
});

export default logger;
