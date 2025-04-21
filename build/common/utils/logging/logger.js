"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logInfo = exports.logUnknownError = exports.logError = void 0;
const winston_1 = require("../../../configs/winston");
const regex_constant_1 = require("../../constants/regex-constant");
/**
 * Logs generic errors using Winston logger
 */
const logError = ({ message, operationName, error, referenceId, }) => {
    winston_1.winstonLogger.error({
        message,
        operation: operationName,
        reason: error.message?.replace(regex_constant_1.REGEX.NEW_LINE, ' ').trim(),
        detail: error,
        referenceId,
    });
};
exports.logError = logError;
/**
 * Logs unknown errors using Winston logger
 */
const logUnknownError = ({ message, operationName, error, referenceId, }) => {
    winston_1.winstonLogger.error({
        message,
        operation: operationName,
        detail: error,
        referenceId,
    });
};
exports.logUnknownError = logUnknownError;
/**
 * Logs informational messages using Winston logger
 */
const logInfo = (message) => {
    winston_1.winstonLogger.info(message);
};
exports.logInfo = logInfo;
//# sourceMappingURL=logger.js.map