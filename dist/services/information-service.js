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
exports.InformationService = void 0;
const winston_1 = require("../configs/winston");
const failure_1 = require("../utils/failure");
const banner_repository_1 = require("../repositories/banner-repository");
const service_repository_1 = require("../repositories/service-repository");
const banner_model_1 = require("../models/banner-model");
const service_model_1 = require("../models/service-model");
class InformationService {
}
exports.InformationService = InformationService;
_a = InformationService;
InformationService.getBannerList = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [banners, _] = yield banner_repository_1.BannerRepository.findManyAndCountByFilter({
            selectFields: [
                banner_model_1.bannerDbField.bannerName,
                banner_model_1.bannerDbField.bannerImage,
                banner_model_1.bannerDbField.description
            ],
        });
        return banners;
    }
    catch (error) {
        winston_1.logger.error(`[InformationService.getBannerList] Error retrieving banners: ${JSON.stringify(error)}`);
        throw failure_1.Failure.internalServer('Failed to retrieve banners');
    }
});
InformationService.getServiceList = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [services, _] = yield service_repository_1.ServiceRepository.findManyAndCountByFilter({
            selectFields: [
                service_model_1.serviceDbField.serviceCode,
                service_model_1.serviceDbField.serviceName,
                service_model_1.serviceDbField.serviceIcon,
                service_model_1.serviceDbField.serviceTariff
            ],
        });
        return services;
    }
    catch (error) {
        winston_1.logger.error(`[InformationService.getServiceList] Error retrieving services: ${JSON.stringify(error)}`);
        throw failure_1.Failure.internalServer('Failed to retrieve services');
    }
});
