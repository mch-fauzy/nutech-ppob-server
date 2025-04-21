import { Banner } from '../models/banner-model';
import { Service } from '../models/service-model';
declare class InformationService {
    static getBannerList: () => Promise<Banner[]>;
    static getServiceList: () => Promise<Service[]>;
}
export { InformationService };
