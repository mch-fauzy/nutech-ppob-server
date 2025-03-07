import {Prisma} from '@prisma/client';

import {prismaClient} from '../configs/prisma-client';
import {
  Transaction,
  TransactionCreate,
  TransactionDb,
} from '../models/transaction-model';
import {Filter} from '../models/filter';
import {handleError} from '../utils/error-handler';

class TransactionRepository {
  static create = async (
    data: TransactionCreate,
    tx?: Prisma.TransactionClient,
  ) => {
    try {
      // Use tx if provided, otherwise fall back to prismaClient
      const client = tx ?? prismaClient;
      await client.$executeRaw`
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
    } catch (error) {
      throw handleError({
        operationName: 'TransactionRepository.create',
        error,
      });
    }
  };

  static findManyAndCountByFilter = async (
    filter: Filter,
  ): Promise<[Transaction[], bigint]> => {
    try {
      const {selectFields, filterFields, pagination, sorts} = filter;

      // Handle select specific fields
      const selectClause =
        selectFields && selectFields.length > 0
          ? Prisma.join(
              selectFields.map(field => Prisma.raw(field)),
              ', ',
            )
          : undefined;

      const select = selectClause ? Prisma.sql`${selectClause}` : Prisma.sql`*`;

      // Handle filter fields
      const whereClauses =
        filterFields && filterFields.length > 0
          ? filterFields.map(({field, operator, value}) => {
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

      const where =
        whereClauses.length > 0
          ? Prisma.sql`WHERE ${Prisma.join(whereClauses, ' AND ')}`
          : Prisma.sql``;

      // Handle sort
      const orderByClause =
        sorts && sorts.length > 0
          ? Prisma.join(
              sorts.map(
                ({field, order}) =>
                  Prisma.sql`${Prisma.raw(field)} ${Prisma.raw(order)}`,
              ),
              ', ',
            )
          : undefined;

      const orderBy = orderByClause
        ? Prisma.sql`ORDER BY ${orderByClause}`
        : Prisma.sql``;

      // Handle pagination
      const limit =
        pagination && pagination.pageSize !== undefined
          ? Prisma.sql`LIMIT ${pagination.pageSize}`
          : Prisma.sql``;
      const offset =
        pagination && pagination.pageSize !== undefined
          ? Prisma.sql`OFFSET ${(pagination.page - 1) * pagination.pageSize}`
          : Prisma.sql``;

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

      const [transactions, totalTransactions] = await prismaClient.$transaction(
        [
          prismaClient.$queryRaw<TransactionDb[]>(transactionsSelectQuery),
          prismaClient.$queryRaw<{count: bigint}[]>(transactionsCountQuery),
        ],
      );

      const mappedTransactions: Transaction[] = transactions.map(
        transactionDb => ({
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
        }),
      );

      return [mappedTransactions, totalTransactions[0].count];
    } catch (error) {
      throw handleError({
        operationName: 'TransactionRepository.findManyAndCountByFilter',
        error,
      });
    }
  };
}

export {TransactionRepository};
