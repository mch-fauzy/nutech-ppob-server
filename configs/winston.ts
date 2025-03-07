import {format, transports, createLogger} from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';

import {CONFIG} from './config';

/* const errorLogRotateTransport = new DailyRotateFile({
  dirname: './docs/logs',
  filename: '%DATE%-nutech-ppob-error.log',
  level: 'error', // Only save error level into log file
  datePattern: 'YYYY-MM-DD',
  maxFiles: '7d', // Only keep log up to 7d
  format: format.combine(format.timestamp(), format.json()),
}); */

const consoleLogTransport = new transports.Console({
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({timestamp, level, message, operation, reason, detail}) => {
      if (operation && reason) {
        return `${timestamp} ${level} [${operation}] ${message}. Reason: ${reason}`;
      }

      // Log unknown type error
      if (operation && detail) {
        return `${timestamp} ${level} [${operation}] ${message}. Detail: ${JSON.stringify(detail)}`;
      }

      return `${timestamp} ${level} ${message}`;
    }),
  ),
});

const winstonLogger = createLogger({
  defaultMeta: {appName: CONFIG.APP.NAME}, // Saved in error log via errorLogRotateTransport
  transports: [consoleLogTransport, /* errorLogRotateTransport */],
});

export {winstonLogger};
