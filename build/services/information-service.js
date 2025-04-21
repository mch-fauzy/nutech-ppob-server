"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InformationService = void 0;
const banner_repository_1 = require("../repositories/banner-repository");
const service_repository_1 = require("../repositories/service-repository");
const db_field_constant_1 = require("../common/constants/db-field-constant");
const error_handler_1 = require("../common/utils/errors/error-handler");
// TODO: ADD RETURN TYPE (IF NOT NATIVE TYPE) IN CONTROLLER, SERVICE, REPO AND ADD MIDDLEWARE OR UTILS TO response with data (message, data) or response with error (message, errors)
class InformationService {
    static getBannerList = async () => {
        try {
            const [banners] = await banner_repository_1.BannerRepository.findManyAndCountByFilter({
                selectFields: [
                    db_field_constant_1.DB_FIELD.BANNER_NAME,
                    db_field_constant_1.DB_FIELD.BANNER_IMAGE,
                    db_field_constant_1.DB_FIELD.DESCRIPTION,
                ],
            });
            return banners;
        }
        catch (error) {
            throw (0, error_handler_1.handleError)({
                operationName: 'InformationService.getBannerList',
                error,
            });
        }
    };
    static getServiceList = async () => {
        try {
            const [services] = await service_repository_1.ServiceRepository.findManyAndCountByFilter({
                selectFields: [
                    db_field_constant_1.DB_FIELD.SERVICE_CODE,
                    db_field_constant_1.DB_FIELD.SERVICE_NAME,
                    db_field_constant_1.DB_FIELD.SERVICE_ICON,
                    db_field_constant_1.DB_FIELD.SERVICE_TARIFF,
                ],
            });
            return services;
        }
        catch (error) {
            throw (0, error_handler_1.handleError)({
                operationName: 'InformationService.getServiceList',
                error,
            });
        }
    };
}
exports.InformationService = InformationService;
//# sourceMappingURL=information-service.js.map