"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
const client_1 = require("@prisma/client");
const prisma_client_1 = require("../configs/prisma-client");
const error_handler_1 = require("../common/utils/errors/error-handler");
// TODO: ADD RETURN TYPE (IF NOT NATIVE TYPE) IN CONTROLLER, SERVICE, REPO AND ADD MIDDLEWARE OR UTILS TO response with data (message, data) or response with error (message, errors)
class TransactionRepository {
    static create = async (data, tx) => {
        try {
            // Use tx if provided, otherwise fall back to prismaClient
            const client = tx ?? prisma_client_1.prismaClient;
            await client.$executeRaw `
        INSERT INTO nutech_transactions (
          user_id,
          service_id,
          transaction_type,
          total_amount,
          invoice_number,
          created_by,
          updated_at,
          updated_by
        )
        VALUES (
          ${data.userId}, 
          ${data.serviceId}, 
          ${data.transactionType}, 
          ${data.totalAmount}, 
          ${data.invoiceNumber},
          ${data.createdBy}, 
          ${data.updatedAt},
          ${data.updatedBy}
        )`;
        }
        catch (error) {
            throw (0, error_handler_1.handleError)({
                operationName: 'TransactionRepository.create',
                error,
            });
        }
    };
    static findManyAndCountByFilter = async (filter) => {
        try {
            const { selectFields, filterFields, pagination, sorts } = filter;
            // Handle select specific fields
            const selectClause = selectFields && selectFields.length > 0
                ? client_1.Prisma.join(selectFields.map(field => client_1.Prisma.raw(field)), ', ')
                : undefined;
            const select = selectClause ? client_1.Prisma.sql `${selectClause}` : client_1.Prisma.sql `*`;
            // Handle filter fields
            const whereClauses = filterFields && filterFields.length > 0
                ? filterFields.map(({ field, operator, value }) => {
                    switch (operator) {
                        case 'equals':
                            return client_1.Prisma.sql `${client_1.Prisma.raw(field)} = ${value}`;
                        case 'not':
                            return client_1.Prisma.sql `${client_1.Prisma.raw(field)} != ${value}`;
                        case 'contains':
                            return client_1.Prisma.sql `${client_1.Prisma.raw(field)} LIKE ${'%' + value + '%'}`;
                        case 'null':
                            return value === true
                                ? client_1.Prisma.sql `${client_1.Prisma.raw(field)} IS NULL`
                                : client_1.Prisma.sql `${client_1.Prisma.raw(field)} IS NOT NULL`;
                    }
                })
                : [];
            const where = whereClauses.length > 0
                ? client_1.Prisma.sql `WHERE ${client_1.Prisma.join(whereClauses, ' AND ')}`
                : client_1.Prisma.sql ``;
            // Handle sort
            const orderByClause = sorts && sorts.length > 0
                ? client_1.Prisma.join(sorts.map(({ field, order }) => client_1.Prisma.sql `${client_1.Prisma.raw(field)} ${client_1.Prisma.raw(order)}`), ', ')
                : undefined;
            const orderBy = orderByClause
                ? client_1.Prisma.sql `ORDER BY ${orderByClause}`
                : client_1.Prisma.sql ``;
            // Handle pagination
            const limit = pagination && pagination.pageSize !== undefined
                ? client_1.Prisma.sql `LIMIT ${pagination.pageSize}`
                : client_1.Prisma.sql ``;
            const offset = pagination && pagination.pageSize !== undefined
                ? client_1.Prisma.sql `OFFSET ${(pagination.page - 1) * pagination.pageSize}`
                : client_1.Prisma.sql ``;
            // Query
            const transactionsSelectQuery = client_1.Prisma.sql `
                SELECT ${select}
                FROM nutech_transactions
                ${where}
                ${orderBy}
                ${limit}
                ${offset}
            `;
            const transactionsCountQuery = client_1.Prisma.sql `
                SELECT COUNT(*) as count
                FROM nutech_transactions
                ${where}
            `;
            const [transactions, totalTransactions] = await prisma_client_1.prismaClient.$transaction([
                prisma_client_1.prismaClient.$queryRaw(transactionsSelectQuery),
                prisma_client_1.prismaClient.$queryRaw(transactionsCountQuery),
            ]);
            const mappedTransactions = transactions.map(transactionDb => ({
                id: transactionDb.id,
                userId: transactionDb.user_id,
                serviceId: transactionDb.service_id,
                transactionType: transactionDb.transaction_type,
                totalAmount: transactionDb.total_amount,
                invoiceNumber: transactionDb.invoice_number,
                createdAt: transactionDb.created_at,
                createdBy: transactionDb.created_by,
                updatedAt: transactionDb.updated_at,
                updatedBy: transactionDb.updated_by,
                deletedAt: transactionDb.deleted_at,
                deletedBy: transactionDb.deleted_by,
            }));
            return [mappedTransactions, totalTransactions[0].count];
        }
        catch (error) {
            throw (0, error_handler_1.handleError)({
                operationName: 'TransactionRepository.findManyAndCountByFilter',
                error,
            });
        }
    };
}
exports.TransactionRepository = TransactionRepository;
//# sourceMappingURL=transaction-repository.js.map