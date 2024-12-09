import { Prisma } from '@prisma/client';

import { prismaClient } from '../configs/prisma-client';
import { logger } from '../configs/winston';
import {
    Transaction,
    TransactionCreate,
    TransactionPrimaryId
} from '../models/transactions-model';
import { Filter } from '../models/filter';
import { Failure } from '../utils/failure';

class TransactionRepository {
    static create = async (data: TransactionCreate) => {
        try {
            const isTransactionAvailable = await this.existsById({ id: data.id });
            if (isTransactionAvailable) throw Failure.conflict(`Transaction with this id already exists`);

            await prismaClient.$executeRaw`
                INSERT INTO nutech_transactions (
                    id, 
                    user_id, 
                    service_id, 
                    transaction_type, 
                    total_amount,
                    invoice_number, 
                    created_by, 
                    updated_by,
                    updated_at
                )
                VALUES (
                    ${data.id},
                    ${data.userId}::uuid, 
                    ${data.serviceId}, 
                    ${data.transactionType}, 
                    ${data.totalAmount}, 
                    ${data.invoiceNumber},
                    ${data.createdBy}, 
                    ${data.updatedBy},
                    ${data.updatedAt}
                )
            `;
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[TransactionRepository.create] Error creating transaction: ${error}`);
            throw Failure.internalServer('Failed to create transaction');
        }

    };

    static findManyAndCountByFilter = async (filter: Filter): Promise<[Transaction[], bigint]> => {
        try {

            const { selectFields, filterFields, pagination, sorts } = filter;

            // Handle select specific fields
            const selectClause = selectFields && selectFields.length > 0
                ? Prisma.join(
                    selectFields.map(field => Prisma.raw(field)),
                    ', '
                )
                : undefined;

            const select = selectClause
                ? Prisma.sql`${selectClause}`
                : Prisma.sql`*`;

            // Handle filter fields
            const whereClauses = filterFields && filterFields.length > 0
                ? filterFields.map(({ field, operator, value }) => {
                    switch (operator) {
                        case 'equals':
                            return Prisma.sql`${Prisma.raw(field)} = ${value}`;
                        case 'not':
                            return Prisma.sql`${Prisma.raw(field)} != ${value}`;
                        case 'contains':
                            return Prisma.sql`${Prisma.raw(field)} LIKE ${'%' + value + '%'}`;
                        case 'null':
                            return value === true
                                ? Prisma.sql`${Prisma.raw(field)} IS NULL`
                                : Prisma.sql`${Prisma.raw(field)} IS NOT NULL`;
                    }
                })
                : [];

            const where = whereClauses.length > 0
                ? Prisma.sql`WHERE ${Prisma.join(whereClauses, ' AND ')}`
                : Prisma.sql``;

            // Handle sort
            const orderByClause = sorts && sorts.length > 0
                ? Prisma.join(
                    sorts.map(({ field, order }) => Prisma.sql`${Prisma.raw(field)} ${order}`),
                    ', '
                )
                : undefined;

            const orderBy = orderByClause
                ? Prisma.sql`ORDER BY ${orderByClause}`
                : Prisma.sql``;

            // Handle pagination
            const limit = pagination ? Prisma.sql`LIMIT ${pagination.pageSize}` : Prisma.sql``;
            const offset = pagination ? Prisma.sql`OFFSET ${(pagination.page - 1) * pagination.pageSize}` : Prisma.sql``;

            // Query
            const transactionsSelectQuery = Prisma.sql`
                SELECT ${select}
                FROM nutech_transactions
                ${where}
                ${orderBy}
                ${limit}
                ${offset}
            `;

            const transactionsCountQuery = Prisma.sql`
                SELECT COUNT(*) as count
                FROM nutech_transactions
                ${where}
            `;

            const [transactions, totalTransactions] = await prismaClient.$transaction([
                prismaClient.$queryRaw<Transaction[]>(transactionsSelectQuery),
                prismaClient.$queryRaw<{ count: bigint }[]>(transactionsCountQuery),
            ]);

            return [transactions, totalTransactions[0].count];
        } catch (error) {
            logger.error(`[TransactionRepository.findManyAndCountByFilter] Error finding and counting transactions by filter: ${error}`);
            throw Failure.internalServer('Failed to find and count transactions by filter');
        }
    };

    static existsById = async (primaryId: TransactionPrimaryId) => {
        try {
            const isTransactionAvailable = await prismaClient.$queryRaw<{ exists: boolean }[]>`
                SELECT EXISTS (
                    SELECT 1
                    FROM nutech_transactions
                    WHERE id = ${primaryId.id}
                ) as exists
            `;

            return isTransactionAvailable[0].exists;
        } catch (error) {
            logger.error(`[TransactionRepository.existsById] Error determining transaction by id: ${error}`);
            throw Failure.internalServer('Failed to determine transaction by id');
        }
    };
}

export { TransactionRepository };
