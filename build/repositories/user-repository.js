"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const client_1 = require("@prisma/client");
const prisma_client_1 = require("../configs/prisma-client");
const failure_1 = require("../common/utils/errors/failure");
const error_handler_1 = require("../common/utils/errors/error-handler");
const db_field_constant_1 = require("../common/constants/db-field-constant");
// TODO: ADD RETURN TYPE (IF NOT NATIVE TYPE) IN CONTROLLER, SERVICE, REPO AND ADD MIDDLEWARE OR UTILS TO response with data (message, data) or response with error (message, errors)
class UserRepository {
    static create = async (data) => {
        try {
            return await prisma_client_1.prismaClient.$executeRaw `
        INSERT INTO nutech_users (
          id, 
          email, 
          password, 
          first_name, 
          last_name, 
          created_by,
          updated_at, 
          updated_by
        )
        VALUES (
          ${data.id}, 
          ${data.email}, 
          ${data.password}, 
          ${data.firstName}, 
          ${data.lastName}, 
          ${data.createdBy},
          ${data.updatedAt}, 
          ${data.updatedBy}
        )`;
        }
        catch (error) {
            throw (0, error_handler_1.handleError)({
                operationName: 'UserRepository.create',
                error,
            });
        }
    };
    static updateById = async ({ id, data, tx }) => {
        try {
            const isUserAvailable = await this.existsById({ id });
            if (!isUserAvailable)
                throw failure_1.Failure.notFound('User is not found');
            // output of Object.entries(object) => [['name', 'Anton'], ['age', 22]]
            const updateClauses = Object.entries(data).map(([key, value]) => {
                const dbField = db_field_constant_1.DB_FIELD[key]; // Assign key as the key of type USER_DB_FIELD
                return client_1.Prisma.sql `${client_1.Prisma.raw(dbField)} = ${value}`;
            });
            const update = client_1.Prisma.join(updateClauses, ', ');
            // Use tx if provided, otherwise fall back to prismaClient
            const client = tx ?? prisma_client_1.prismaClient;
            return await client.$executeRaw `
                UPDATE nutech_users
                SET ${update}
                WHERE id = ${id}
            `;
        }
        catch (error) {
            throw (0, error_handler_1.handleError)({
                operationName: 'UserRepository.updateById',
                error,
            });
        }
    };
    static findManyAndCountByFilter = async (filter) => {
        try {
            // Handle select specific fields
            const selectClause = filter.selectFields?.length
                ? client_1.Prisma.join(filter.selectFields.map(field => client_1.Prisma.raw(field)), ', ')
                : undefined;
            const select = selectClause ? client_1.Prisma.sql `${selectClause}` : client_1.Prisma.sql `*`;
            // Handle filter fields
            const whereClauses = filter.filterFields?.length
                ? filter.filterFields.map(({ field, operator, value }) => {
                    switch (operator) {
                        case 'equals':
                            return client_1.Prisma.sql `${client_1.Prisma.raw(field)} = ${value}`; //Prisma.raw for predefined constants field provided by the app (trusted or already validated) not by user
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
            const where = whereClauses.length
                ? client_1.Prisma.sql `WHERE ${client_1.Prisma.join(whereClauses, ' AND ')}`
                : client_1.Prisma.sql ``;
            // Handle sort
            const orderByClause = filter.sorts?.length
                ? client_1.Prisma.join(filter.sorts.map(({ field, order }) => client_1.Prisma.sql `${client_1.Prisma.raw(field)} ${client_1.Prisma.raw(order)}`), //order is validated in controller to only accept asc or desc
                ', ')
                : undefined;
            const orderBy = orderByClause
                ? client_1.Prisma.sql `ORDER BY ${orderByClause}`
                : client_1.Prisma.sql ``;
            // Handle pagination
            const limit = filter.pagination?.pageSize
                ? client_1.Prisma.sql `LIMIT ${filter.pagination.pageSize}`
                : client_1.Prisma.sql ``;
            const offset = filter.pagination?.pageSize
                ? client_1.Prisma.sql `OFFSET ${(filter.pagination.page - 1) * filter.pagination.pageSize}`
                : client_1.Prisma.sql ``;
            // Query
            const SelectUsersQuery = client_1.Prisma.sql `
        SELECT ${select}
        FROM nutech_users
        ${where}
        ${orderBy}
        ${limit}
        ${offset}
      `;
            const countUsersQuery = client_1.Prisma.sql `
        SELECT COUNT(*) as count
        FROM nutech_users
        ${where}
      `;
            const [users, totalUsers] = await prisma_client_1.prismaClient.$transaction([
                prisma_client_1.prismaClient.$queryRaw(SelectUsersQuery),
                prisma_client_1.prismaClient.$queryRaw(countUsersQuery),
            ]);
            const mappedUsers = users.map(userDb => ({
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
        }
        catch (error) {
            throw (0, error_handler_1.handleError)({
                operationName: 'UserRepository.findManyAndCountByFilter',
                error,
            });
        }
    };
    static countByFilter = async (filter) => {
        try {
            const whereClauses = filter.filterFields?.length
                ? filter.filterFields.map(({ field, operator, value }) => {
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
            const totalUsers = await prisma_client_1.prismaClient.$queryRaw `
        SELECT COUNT (*) as count
        FROM nutech_users
        ${where}
      `;
            return totalUsers[0].count;
        }
        catch (error) {
            throw (0, error_handler_1.handleError)({
                operationName: 'UserRepository.countByFilter',
                error,
            });
        }
    };
    static existsById = async (primaryId) => {
        try {
            const isUserAvailable = await prisma_client_1.prismaClient.$queryRaw `
        SELECT EXISTS (
            SELECT 1
            FROM nutech_users
            WHERE id = ${primaryId.id}
        ) as exists
      `;
            return isUserAvailable[0].exists;
        }
        catch (error) {
            throw (0, error_handler_1.handleError)({
                operationName: 'UserRepository.existsById',
                error,
            });
        }
    };
    static findById = async (params) => {
        try {
            const { id, filter, tx } = params;
            const isUserAvailable = await this.existsById({ id });
            if (!isUserAvailable)
                throw failure_1.Failure.notFound('User is not found');
            const selectClause = filter.selectFields?.length
                ? client_1.Prisma.join(filter.selectFields.map(field => client_1.Prisma.raw(field)), ', ')
                : undefined;
            const select = selectClause ? client_1.Prisma.sql `${selectClause}` : client_1.Prisma.sql `*`;
            const client = tx ?? prisma_client_1.prismaClient;
            /* If using tx client, lock row FOR UPDATE to make the unabled to access by other */
            const lockClause = tx ? client_1.Prisma.sql `FOR UPDATE` : client_1.Prisma.sql ``;
            /* queryRaw always return array [] */
            const users = await client.$queryRaw `
        SELECT ${select}
        FROM nutech_users
        WHERE id = ${id}
        ${lockClause}
      `;
            const user = users[0];
            const mappedUser = {
                id: user.id,
                email: user.email,
                password: user.password,
                firstName: user.first_name,
                lastName: user.last_name,
                profileImage: user.profile_image,
                balance: user.balance,
                createdAt: user.created_at,
                createdBy: user.created_by,
                updatedAt: user.updated_at,
                updatedBy: user.updated_by,
                deletedAt: user.deleted_at,
                deletedBy: user.deleted_by,
            };
            return mappedUser;
        }
        catch (error) {
            throw (0, error_handler_1.handleError)({
                operationName: 'UserRepository.findById',
                error,
            });
        }
    };
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user-repository.js.map