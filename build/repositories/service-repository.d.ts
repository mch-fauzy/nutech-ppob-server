import { Filter } from '../models/filter';
import { Service } from '../models/service-model';
declare class ServiceRepository {
    static findManyAndCountByFilter: (filter: Filter) => Promise<[Service[], bigint]>;
}
export { ServiceRepository };
