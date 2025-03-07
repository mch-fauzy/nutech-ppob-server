"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonLogger = void 0;
const winston_1 = require("winston");
// import DailyRotateFile from 'winston-daily-rotate-file';
const config_1 = require("./config");
/* const errorLogRotateTransport = new DailyRotateFile({
  dirname: './docs/logs',
  filename: '%DATE%-nutech-ppob-error.log',
  level: 'error', // Only save error level into log file
  datePattern: 'YYYY-MM-DD',
  maxFiles: '7d', // Only keep log up to 7d
  format: format.combine(format.timestamp(), format.json()),
}); */
const consoleLogTransport = new winston_1.transports.Console({
    format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp(), winston_1.format.printf(({ timestamp, level, message, operation, reason, detail }) => {
        if (operation && reason) {
            return `${timestamp} ${level} [${operation}] ${message}. Reason: ${reason}`;
        }
        // Log unknown type error
        if (operation && detail) {
            return `${timestamp} ${level} [${operation}] ${message}. Detail: ${JSON.stringify(detail)}`;
        }
        return `${timestamp} ${level} ${message}`;
    })),
});
const winstonLogger = (0, winston_1.createLogger)({
    defaultMeta: { appName: config_1.CONFIG.APP.NAME },
    transports: [consoleLogTransport, /* errorLogRotateTransport */],
});
exports.winstonLogger = winstonLogger;
//# sourceMappingURL=winston.js.map