"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./configs/config");
const winston_1 = require("./configs/winston");
const error_handler_middleware_1 = require("./middlewares/error-handler-middleware");
const routes_1 = require("./routes");
const connection_check_1 = require("./utils/connection-check");
const PORT = config_1.CONFIG.SERVER.PORT;
const app = (0, express_1.default)();
// Declaration of app.use must be ordered, dont random placement
app.use((0, cors_1.default)());
app.use((0, express_1.json)());
app.use(express_1.default.static(config_1.CONFIG.APP.STATIC));
app.use('/', routes_1.router);
app.use(error_handler_middleware_1.errorHandler);
// Wait for both database and Redis connection
Promise.all([(0, connection_check_1.initDbConnection)()])
    .then(() => {
    // Create an HTTP server instance from the Express app
    const server = (0, http_1.createServer)(app);
    server.listen(PORT, () => {
        winston_1.logger.info(`Server running on ${config_1.CONFIG.APP.URL}:${PORT}`);
    });
    // Handle startup errors
    server.on('error', (error) => {
        winston_1.logger.error(`[server] An error occurred while starting the server: ${error}`);
        process.exit(1);
    });
});
