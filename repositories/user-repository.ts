import { Prisma } from '@prisma/client';

import { prismaClient } from '../configs/prisma-client';
import { logger } from '../configs/winston';
import {
    User,
    UserUpdateBalance,
    UserCreate,
    userDbField,
    UserPrimaryId,
    UserUpdateProfileImage,
    UserUpdate,
    UserDb
} from '../models/user-model';
import { Filter } from '../models/filter';
import { Failure } from '../utils/failure';

class UserRepository {
    static create = async (data: UserCreate) => {
        try {
            const isUserAvailable = await this.existsById({ id: data.id });
            if (isUserAvailable) throw Failure.conflict(`User with this id already exists`);

            await prismaClient.$executeRaw`
                INSERT INTO nutech_users (
                    id, 
                    email, 
                    password, 
                    first_name, 
                    last_name, 
                    created_by, 
                    updated_by,
                    updated_at
                )
                VALUES (
                    ${data.id}, 
                    ${data.email}, 
                    ${data.password}, 
                    ${data.firstName}, 
                    ${data.lastName}, 
                    ${data.createdBy}, 
                    ${data.updatedBy},
                    ${data.updatedAt}
                )
            `;
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[UserRepository.create] Error creating user: ${error}`);
            throw Failure.internalServer('Failed to create user');
        }

    };

    static updateById = async (primaryId: UserPrimaryId, data: UserUpdate | UserUpdateProfileImage | UserUpdateBalance) => {
        try {
            const isUserAvailable = await this.existsById(primaryId);
            if (!isUserAvailable) throw Failure.notFound(`User not found`);

            // output of Object.entries(object) => [['name', 'Anton'], ['age', 22]]
            const updateClauses = Object.entries(data).map(([key, value]) => {
                const dbField = userDbField[key as keyof typeof userDbField]; // Assign key as the key of type userDbField
                return Prisma.sql`${Prisma.raw(dbField)} = ${value}`;
            });

            const update = Prisma.join(updateClauses, ', ');

            await prismaClient.$executeRaw`
                UPDATE nutech_users
                SET ${update}
                WHERE id = ${primaryId.id}
            `;
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[UserRepository.updateById] Error updating user by id: ${error}`);
            throw Failure.internalServer('Failed to update user by id');
        }
    };

    static findManyAndCountByFilter = async (filter: Filter): Promise<[User[], bigint]> => {
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
                            return Prisma.sql`${Prisma.raw(field)} = ${value}`; //Prisma.raw for predefined constants field provided by the app (trusted or already validated) not by user
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
                    sorts.map(({ field, order }) => Prisma.sql`${Prisma.raw(field)} ${Prisma.raw(order)}`),
                    ', '
                )
                : undefined;

            const orderBy = orderByClause
                ? Prisma.sql`ORDER BY ${orderByClause}`
                : Prisma.sql``;

            // Handle pagination
            const limit = pagination && pagination.pageSize !== undefined ? Prisma.sql`LIMIT ${pagination.pageSize}` : Prisma.sql``;
            const offset = pagination && pagination.pageSize !== undefined
                ? Prisma.sql`OFFSET ${(pagination.page - 1) * pagination.pageSize}`
                : Prisma.sql``;

            // Query
            const usersSelectQuery = Prisma.sql`
                SELECT ${select}
                FROM nutech_users
                ${where}
                ${orderBy}
                ${limit}
                ${offset}
            `;

            const usersCountQuery = Prisma.sql`
                SELECT COUNT(*) as count
                FROM nutech_users
                ${where}
            `;

            const [users, totalUsers] = await prismaClient.$transaction([
                prismaClient.$queryRaw<UserDb[]>(usersSelectQuery),
                prismaClient.$queryRaw<{ count: bigint }[]>(usersCountQuery),
            ]);

            const mappedUsers: User[] = users.map(userDb => ({
                id: userDb.id,
                email: userDb.email,
                password: userDb.password,
                firstName: userDb.first_name,
                lastName: userDb.last_name,
                profileImage: userDb.profile_image,
                balance: userDb.balance,
                createdAt: userDb.created_at,
                createdBy: userDb.created_by,
                updatedAt: userDb.updated_at,
                updatedBy: userDb.updated_by,
                deletedAt: userDb.deleted_at,
                deletedBy: userDb.deleted_by,
            }));

            return [mappedUsers, totalUsers[0].count];
        } catch (error) {
            logger.error(`[UserRepository.findManyAndCountByFilter] Error finding and counting users by filter: ${error}`);
            throw Failure.internalServer('Failed to find and count users by filter');
        }
    };

    static countByFilter = async (filter: Pick<Filter, 'filterFields'>) => {
        try {
            const { filterFields } = filter;

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

            const totalUsers = await prismaClient.$queryRaw<{ count: bigint }[]>`
                    SELECT COUNT (*) as count
                    FROM nutech_users
                    ${where}
            `;

            return totalUsers[0].count;
        } catch (error) {
            logger.error(`[UserRepository.countByFilter] Error counting users by filter: ${error}`);
            throw Failure.internalServer('Failed to count users by filter');
        }
    };

    static existsById = async (primaryId: UserPrimaryId) => {
        try {
            const isUserAvailable = await prismaClient.$queryRaw<{ exists: boolean }[]>`
                SELECT EXISTS (
                    SELECT 1
                    FROM nutech_users
                    WHERE id = ${primaryId.id}
                ) as exists
            `;

            return isUserAvailable[0].exists;
        } catch (error) {
            logger.error(`[UserRepository.existsById] Error determining user by id: ${error}`);
            throw Failure.internalServer('Failed to determine user by id');
        }
    };
}

export { UserRepository };
