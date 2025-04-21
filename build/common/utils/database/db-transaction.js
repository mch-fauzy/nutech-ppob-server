"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTransactionRetry = void 0;
const client_1 = require("@prisma/client");
const prisma_client_1 = require("../../../configs/prisma-client");
const failure_1 = require("../errors/failure");
const withTransactionRetry = async (params) => {
    const { maxRetries = 5, isolationLevel, transactionFn } = params;
    let retries = 0;
    while (retries < maxRetries) {
        try {
            return await prisma_client_1.prismaClient.$transaction(transactionFn, { isolationLevel });
        }
        catch (error) {
            /* If deadlock or have timing issues, then it will continue until max retries */
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2034') {
                retries++;
                const waitTime = Math.pow(2, retries) * 100;
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }
            throw error;
        }
    }
    /* If the loop exhausts all retries, throw this error */
    throw failure_1.Failure.conflict('Transaction failed due to repeated deadlocks');
};
exports.withTransactionRetry = withTransactionRetry;
//# sourceMappingURL=db-transaction.js.map