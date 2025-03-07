declare class InformationService {
    static getBannerList: () => Promise<import("../models/banner-model").Banner[]>;
    static getServiceList: () => Promise<import("../models/service-model").Service[]>;
}
export { InformationService };
