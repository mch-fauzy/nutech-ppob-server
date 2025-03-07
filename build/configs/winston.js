"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonLogger = void 0;
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const config_1 = require("./config");
const errorLogRotateTransport = new winston_daily_rotate_file_1.default({
    dirname: './docs/logs',
    filename: '%DATE%-nutech-ppob-error.log',
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '7d',
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
});
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
    transports: [consoleLogTransport, errorLogRotateTransport],
});
exports.winstonLogger = winstonLogger;
//# sourceMappingURL=winston.js.map