"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MorganMiddleware = void 0;
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = require("../utils/logger");
class MorganMiddleware {
    static handler = (0, morgan_1.default)('dev', {
        stream: {
            write: message => {
                (0, logger_1.logInfo)(message.trim());
            },
        },
    });
}
exports.MorganMiddleware = MorganMiddleware;
//# sourceMappingURL=morgan-middleware.js.map