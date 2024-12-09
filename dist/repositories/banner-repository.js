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
exports.BannerRepository = void 0;
const client_1 = require("@prisma/client");
const prisma_client_1 = require("../configs/prisma-client");
const winston_1 = require("../configs/winston");
const failure_1 = require("../utils/failure");
class BannerRepository {
}
exports.BannerRepository = BannerRepository;
_a = BannerRepository;
BannerRepository.findManyAndCountByFilter = (filter) => __awaiter(void 0, void 0, void 0, function* () {
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
        const limit = pagination && pagination.pageSize !== undefined ? client_1.Prisma.sql `LIMIT ${pagination.pageSize}` : client_1.Prisma.sql ``;
        const offset = pagination && pagination.pageSize !== undefined
            ? client_1.Prisma.sql `OFFSET ${(pagination.page - 1) * pagination.pageSize}`
            : client_1.Prisma.sql ``;
        // Query
        const bannersSelectQuery = client_1.Prisma.sql `
                SELECT ${select}
                FROM nutech_banners
                ${where}
                ${orderBy}
                ${limit}
                ${offset}
            `;
        const bannersCountQuery = client_1.Prisma.sql `
                SELECT COUNT(*) as count
                FROM nutech_banners
                ${where}
            `;
        const [banners, totalBanners] = yield prisma_client_1.prismaClient.$transaction([
            prisma_client_1.prismaClient.$queryRaw(bannersSelectQuery),
            prisma_client_1.prismaClient.$queryRaw(bannersCountQuery),
        ]);
        const mappedBanners = banners.map(bannerDb => ({
            id: bannerDb.id,
            bannerName: bannerDb.banner_name,
            bannerImage: bannerDb.banner_image,
            description: bannerDb.description,
            createdAt: bannerDb.created_at,
            createdBy: bannerDb.created_by,
            updatedAt: bannerDb.updated_at,
            updatedBy: bannerDb.updated_by,
            deletedAt: bannerDb.deleted_at,
            deletedBy: bannerDb.deleted_by,
        }));
        return [mappedBanners, totalBanners[0].count];
    }
    catch (error) {
        winston_1.logger.error(`[BannerRepository.findManyAndCountByFilter] Error finding and counting banners by filter: ${error}`);
        throw failure_1.Failure.internalServer('Failed to find and count banners by filter');
    }
});
