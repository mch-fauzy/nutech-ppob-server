"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDbConnection = void 0;
const winston_1 = require("../configs/winston");
const prisma_client_1 = require("../configs/prisma-client");
// Function to ping the database to init the connection
const initDbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_client_1.prismaClient.$queryRaw `SELECT 1`;
        winston_1.logger.info('Connected to database');
    }
    catch (error) {
        winston_1.logger.error(`[initDbConnection] Utility error connecting to the database: ${error}`);
        process.exit(1); // Exit the application if the database connection fails
    }
});
exports.initDbConnection = initDbConnection;
