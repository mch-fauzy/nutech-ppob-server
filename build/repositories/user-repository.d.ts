import { User, UserCreate, UserPrimaryId, UserUpdate, UserFind } from '../models/user-model';
import { Filter } from '../models/filter';
declare class UserRepository {
    static create: (data: UserCreate) => Promise<void>;
    static updateById: ({ id, data, tx }: UserUpdate) => Promise<void>;
    static findManyAndCountByFilter: (filter: Filter) => Promise<[User[], bigint]>;
    static countByFilter: (filter: Pick<Filter, 'filterFields'>) => Promise<bigint>;
    static existsById: (primaryId: UserPrimaryId) => Promise<boolean>;
    static findById: (params: UserFind) => Promise<User>;
}
export { UserRepository };
