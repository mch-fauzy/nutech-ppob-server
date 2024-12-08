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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const client_1 = require("@prisma/client");
const prisma_client_1 = require("../configs/prisma-client");
const winston_1 = require("../configs/winston");
const user_model_1 = require("../models/user-model");
const failure_1 = require("../utils/failure");
class UserRepository {
}
exports.UserRepository = UserRepository;
_a = UserRepository;
UserRepository.create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isUserAvailable = yield _a.existsById({ id: data.id });
        if (isUserAvailable)
            throw failure_1.Failure.conflict(`User with this id already exists`);
        yield prisma_client_1.prismaClient.$executeRaw `
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
                    ${data.id}::uuid, 
                    ${data.email}, 
                    ${data.password}, 
                    ${data.firstName}, 
                    ${data.lastName}, 
                    ${data.createdBy}, 
                    ${data.updatedBy},
                    ${data.updatedAt}
                )
            `;
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[UserRepository.create] Error creating user: ${error}`);
        throw failure_1.Failure.internalServer('Failed to create user');
    }
});
UserRepository.updateById = (primaryId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isUserAvailable = yield _a.existsById(primaryId);
        if (!isUserAvailable)
            throw failure_1.Failure.notFound(`User not found`);
        // output of Object.entries(object) => [['name', 'Anton'], ['age', 22]]
        const updateClauses = Object.entries(data).map(([key, value]) => {
            const dbField = user_model_1.userDbField[key]; // Assign key as the key of type userDbField
            return client_1.Prisma.sql `${client_1.Prisma.raw(dbField)} = ${value}`;
        });
        const update = client_1.Prisma.join(updateClauses, ', ');
        yield prisma_client_1.prismaClient.$executeRaw `
                UPDATE nutech_users
                SET ${update}
                WHERE id = ${primaryId.id}::uuid
            `;
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[UserRepository.updateById] Error updating user by id: ${error}`);
        throw failure_1.Failure.internalServer('Failed to update user by id');
    }
});
UserRepository.findManyAndCountByFilter = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { selectFields, filterFields, pagination, sorts } = filter;
        // Handle select specific fields
        const selectClause = selectFields && selectFields.length > 0
            ? client_1.Prisma.join(selectFields.map(field => client_1.Prisma.raw(field)), ', ')
            : undefined;
        const select = selectClause
            ? client_1.Prisma.sql `${selectClause}`
            : client_1.Prisma.sql `*`;
        // Handle filter fields
        const whereClauses = filterFields && filterFields.length > 0
            ? filterFields.map(({ field, operator, value }) => {
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
        const where = whereClauses.length > 0
            ? client_1.Prisma.sql `WHERE ${client_1.Prisma.join(whereClauses, ' AND ')}`
            : client_1.Prisma.sql ``;
        // Handle sort
        const orderByClause = sorts && sorts.length > 0
            ? client_1.Prisma.join(sorts.map(({ field, order }) => client_1.Prisma.sql `${client_1.Prisma.raw(field)} ${order}`), ', ')
            : undefined;
        const orderBy = orderByClause
            ? client_1.Prisma.sql `ORDER BY ${orderByClause}`
            : client_1.Prisma.sql ``;
        // Handle pagination
        const limit = pagination ? client_1.Prisma.sql `LIMIT ${pagination.pageSize}` : client_1.Prisma.sql ``;
        const offset = pagination ? client_1.Prisma.sql `OFFSET ${(pagination.page - 1) * pagination.pageSize}` : client_1.Prisma.sql ``;
        // Query
        const usersSelectQuery = client_1.Prisma.sql `
                SELECT ${select}
                FROM nutech_users
                ${where}
                ${orderBy}
                ${limit}
                ${offset}
            `;
        const usersCountQuery = client_1.Prisma.sql `
                SELECT COUNT(*) as count
                FROM nutech_users
                ${where}
            `;
        const [users, totalUsers] = yield prisma_client_1.prismaClient.$transaction([
            prisma_client_1.prismaClient.$queryRaw(usersSelectQuery),
            prisma_client_1.prismaClient.$queryRaw(usersCountQuery),
        ]);
        return [users, totalUsers[0].count];
    }
    catch (error) {
        winston_1.logger.error(`[UserRepository.findManyAndCountByFilter] Error finding and counting users by filter: ${error}`);
        throw failure_1.Failure.internalServer('Failed to find and count users by filter');
    }
});
UserRepository.countByFilter = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filterFields } = filter;
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
        const totalUsers = yield prisma_client_1.prismaClient.$queryRaw `
                    SELECT COUNT (*) as count
                    FROM nutech_users
                    ${where}
            `;
        return totalUsers[0].count;
    }
    catch (error) {
        winston_1.logger.error(`[UserRepository.countByFilter] Error counting users by filter: ${error}`);
        throw failure_1.Failure.internalServer('Failed to count users by filter');
    }
});
UserRepository.existsById = (primaryId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isUserAvailable = yield prisma_client_1.prismaClient.$queryRaw `
                SELECT EXISTS (
                    SELECT 1
                    FROM nutech_users
                    WHERE id = ${primaryId.id}::uuid
                ) as exists
            `;
        return isUserAvailable[0].exists;
    }
    catch (error) {
        winston_1.logger.error(`[UserRepository.existsById] Error determining user by id: ${error}`);
        throw failure_1.Failure.internalServer('Failed to determine user by id');
    }
});
