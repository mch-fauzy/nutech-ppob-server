import {Prisma} from '@prisma/client';

import {prismaClient} from '../configs/prisma-client';
import {
  User,
  UserCreate,
  USER_DB_FIELD,
  UserPrimaryId,
  UserUpdate,
  UserDb,
  UserFind,
} from '../models/user-model';
import {Filter} from '../models/filter';
import {Failure} from '../utils/failure';
import {handleError} from '../utils/error-handler';

class UserRepository {
  static create = async (data: UserCreate) => {
    try {
      await prismaClient.$executeRaw`
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
    } catch (error) {
      throw handleError({
        operationName: 'UserRepository.create',
        error,
      });
    }
  };

  static updateById = async ({id, data, tx}: UserUpdate) => {
    try {
      const isUserAvailable = await this.existsById({id});
      if (!isUserAvailable) throw Failure.notFound('User is not found');

      // output of Object.entries(object) => [['name', 'Anton'], ['age', 22]]
      const updateClauses = Object.entries(data).map(([key, value]) => {
        const dbField = USER_DB_FIELD[key as keyof typeof USER_DB_FIELD]; // Assign key as the key of type USER_DB_FIELD
        return Prisma.sql`${Prisma.raw(dbField)} = ${value}`;
      });
      const update = Prisma.join(updateClauses, ', ');

      // Use tx if provided, otherwise fall back to prismaClient
      const client = tx ?? prismaClient;
      await client.$executeRaw`
                UPDATE nutech_users
                SET ${update}
                WHERE id = ${id}
            `;
    } catch (error) {
      throw handleError({
        operationName: 'UserRepository.updateById',
        error,
      });
    }
  };

  static findManyAndCountByFilter = async (
    filter: Filter,
  ): Promise<[User[], bigint]> => {
    try {
      // Handle select specific fields
      const selectClause = filter.selectFields?.length
        ? Prisma.join(
            filter.selectFields.map(field => Prisma.raw(field)),
            ', ',
          )
        : undefined;

      const select = selectClause ? Prisma.sql`${selectClause}` : Prisma.sql`*`;

      // Handle filter fields
      const whereClauses = filter.filterFields?.length
        ? filter.filterFields.map(({field, operator, value}) => {
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

      const where = whereClauses.length
        ? Prisma.sql`WHERE ${Prisma.join(whereClauses, ' AND ')}`
        : Prisma.sql``;

      // Handle sort
      const orderByClause = filter.sorts?.length
        ? Prisma.join(
            filter.sorts.map(
              ({field, order}) =>
                Prisma.sql`${Prisma.raw(field)} ${Prisma.raw(order)}`,
            ), //order is validated in controller to only accept asc or desc
            ', ',
          )
        : undefined;

      const orderBy = orderByClause
        ? Prisma.sql`ORDER BY ${orderByClause}`
        : Prisma.sql``;

      // Handle pagination
      const limit = filter.pagination?.pageSize
        ? Prisma.sql`LIMIT ${filter.pagination.pageSize}`
        : Prisma.sql``;
      const offset = filter.pagination?.pageSize
        ? Prisma.sql`OFFSET ${(filter.pagination.page - 1) * filter.pagination.pageSize}`
        : Prisma.sql``;

      // Query
      const SelectUsersQuery = Prisma.sql`
        SELECT ${select}
        FROM nutech_users
        ${where}
        ${orderBy}
        ${limit}
        ${offset}
      `;

      const countUsersQuery = Prisma.sql`
        SELECT COUNT(*) as count
        FROM nutech_users
        ${where}
      `;

      const [users, totalUsers] = await prismaClient.$transaction([
        prismaClient.$queryRaw<UserDb[]>(SelectUsersQuery),
        prismaClient.$queryRaw<{count: bigint}[]>(countUsersQuery),
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
      throw handleError({
        operationName: 'UserRepository.findManyAndCountByFilter',
        error,
      });
    }
  };

  static countByFilter = async (filter: Pick<Filter, 'filterFields'>) => {
    try {
      const whereClauses = filter.filterFields?.length
        ? filter.filterFields.map(({field, operator, value}) => {
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

      const totalUsers = await prismaClient.$queryRaw<{count: bigint}[]>`
        SELECT COUNT (*) as count
        FROM nutech_users
        ${where}
      `;

      return totalUsers[0].count;
    } catch (error) {
      throw handleError({
        operationName: 'UserRepository.countByFilter',
        error,
      });
    }
  };

  static existsById = async (primaryId: UserPrimaryId) => {
    try {
      const isUserAvailable = await prismaClient.$queryRaw<{exists: boolean}[]>`
        SELECT EXISTS (
            SELECT 1
            FROM nutech_users
            WHERE id = ${primaryId.id}
        ) as exists
      `;

      return isUserAvailable[0].exists;
    } catch (error) {
      throw handleError({
        operationName: 'UserRepository.existsById',
        error,
      });
    }
  };

  static findById = async (params: UserFind): Promise<User> => {
    try {
      const {id, filter, tx} = params;

      const isUserAvailable = await this.existsById({id});
      if (!isUserAvailable) throw Failure.notFound('User is not found');

      const selectClause = filter.selectFields?.length
        ? Prisma.join(
            filter.selectFields.map(field => Prisma.raw(field)),
            ', ',
          )
        : undefined;

      const select = selectClause ? Prisma.sql`${selectClause}` : Prisma.sql`*`;

      const client = tx ?? prismaClient;
      /* If using tx client, lock row FOR UPDATE to make the unabled to access by other */
      const lockClause = tx ? Prisma.sql`FOR UPDATE` : Prisma.sql``;

      /* queryRaw always return array [] */
      const users = await client.$queryRaw<UserDb[]>`
        SELECT ${select}
        FROM nutech_users
        WHERE id = ${id}
        ${lockClause}
      `;

      const user = users[0];
      const mappedUser: User = {
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
    } catch (error) {
      throw handleError({
        operationName: 'UserRepository.findById',
        error,
      });
    }
  };
}

export {UserRepository};
