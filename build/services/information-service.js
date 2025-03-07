"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InformationService = void 0;
const winston_1 = require("../configs/winston");
const failure_1 = require("../utils/failure");
const banner_repository_1 = require("../repositories/banner-repository");
const service_repository_1 = require("../repositories/service-repository");
const banner_model_1 = require("../models/banner-model");
const service_model_1 = require("../models/service-model");
class InformationService {
    static getBannerList = async () => {
        try {
            const [banners] = await banner_repository_1.BannerRepository.findManyAndCountByFilter({
                selectFields: [
                    banner_model_1.bannerDbField.bannerName,
                    banner_model_1.bannerDbField.bannerImage,
                    banner_model_1.bannerDbField.description,
                ],
            });
            return banners;
        }
        catch (error) {
            winston_1.winstonLogger.error(`[InformationService.getBannerList] Error retrieving banners: ${error}`);
            throw failure_1.Failure.internalServer('Failed to retrieve banners');
        }
    };
    static getServiceList = async () => {
        try {
            const [services] = await service_repository_1.ServiceRepository.findManyAndCountByFilter({
                selectFields: [
                    service_model_1.serviceDbField.serviceCode,
                    service_model_1.serviceDbField.serviceName,
                    service_model_1.serviceDbField.serviceIcon,
                    service_model_1.serviceDbField.serviceTariff,
                ],
            });
            return services;
        }
        catch (error) {
            winston_1.winstonLogger.error(`[InformationService.getServiceList] Error retrieving services: ${error}`);
            throw failure_1.Failure.internalServer('Failed to retrieve services');
        }
    };
}
exports.InformationService = InformationService;
//# sourceMappingURL=information-service.js.map