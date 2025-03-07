import { Banner } from '../models/banner-model';
import { Filter } from '../models/filter';
declare class BannerRepository {
    static findManyAndCountByFilter: (filter: Filter) => Promise<[Banner[], bigint]>;
}
export { BannerRepository };
