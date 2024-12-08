import { Prisma } from '@prisma/client';

import { prismaClient } from '../configs/prisma-client';
import { logger } from '../configs/winston';
import { Filter } from '../models/filter';
import { Failure } from '../utils/failure';
import { Service } from '../models/service-model';

class ServiceRepository {

    static findManyAndCountByFilter = async (filter: Filter): Promise<[Service[], bigint]> => {
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
            const servicesSelectQuery = Prisma.sql`
                SELECT ${select}
                FROM nutech_services
                ${where}
                ${orderBy}
                ${limit}
                ${offset}
            `;

            const servicesCountQuery = Prisma.sql`
                SELECT COUNT(*) as count
                FROM nutech_services
                ${where}
            `;

            const [services, totalServices] = await prismaClient.$transaction([
                prismaClient.$queryRaw<Service[]>(servicesSelectQuery),
                prismaClient.$queryRaw<{ count: bigint }[]>(servicesCountQuery),
            ]);

            return [services, totalServices[0].count];

        } catch (error) {
            logger.error(`[ServiceRepository.findManyAndCountByFilter] Error finding and counting services by filter: ${error}`);
            throw Failure.internalServer('Failed to find and count services by filter');
        }
    };
}

export { ServiceRepository };