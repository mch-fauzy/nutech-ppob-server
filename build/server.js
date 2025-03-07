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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./configs/config");
const error_response_middleware_1 = require("./middlewares/error-response-middleware");
const morgan_middleware_1 = require("./middlewares/morgan-middleware");
const routes_1 = require("./routes");
const logger_1 = require("./utils/logger");
const error_handler_1 = require("./utils/error-handler");
const prisma_client_1 = require("./configs/prisma-client");
/** Initialize Express application */
const app = (0, express_1.default)();
const port = config_1.CONFIG.SERVER.PORT;
/** Set up middlewares in a defined order */
app.use((0, cors_1.default)());
app.use((0, express_1.json)());
app.use(morgan_middleware_1.MorganMiddleware.handler);
app.use(express_1.default.static(config_1.CONFIG.APP.STATIC_DIRECTORY));
app.use('/', routes_1.router);
app.use(error_response_middleware_1.ErrorResponseMiddleware.handler);
/** Function to ping the database */
const pingDatabase = async () => {
    await prisma_client_1.prismaClient.$queryRaw `SELECT 1`;
    (0, logger_1.logInfo)('Connected to Database');
};
/** Function to start the server */
const startServer = async () => {
    try {
        /** Wait for database connection */
        await pingDatabase();
        /** Create an HTTP server instance from the Express app */
        const server = (0, http_1.createServer)(app);
        server.listen(port, () => {
            (0, logger_1.logInfo)(`Server running. Port: ${port}`);
        });
        /** Handle server runtime errors */
        server.on('error', error => {
            throw (0, error_handler_1.handleError)({
                operationName: 'startServer',
                error,
            });
        });
    }
    catch (error) {
        throw (0, error_handler_1.handleError)({
            operationName: 'startServer',
            error,
        });
    }
};
/** void: Explicitly ignore the return result of a function */
void startServer();
//# sourceMappingURL=server.js.map