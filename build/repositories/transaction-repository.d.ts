import { Prisma } from '@prisma/client';
import { Transaction, TransactionCreate } from '../models/transaction-model';
import { Filter } from '../models/filter';
declare class TransactionRepository {
    static create: (data: TransactionCreate, tx?: Prisma.TransactionClient) => Promise<void>;
    static findManyAndCountByFilter: (filter: Filter) => Promise<[Transaction[], bigint]>;
}
export { TransactionRepository };
