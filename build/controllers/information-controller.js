"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InformationController = void 0;
const http_status_codes_1 = require("http-status-codes");
const constant_1 = require("../utils/constant");
const response_1 = require("../utils/response");
const information_service_1 = require("../services/information-service");
const auth_middleware_1 = require("../middlewares/auth-middleware");
class InformationController {
    static getBannerList = async (req, res, next) => {
        try {
            const response = await information_service_1.InformationService.getBannerList();
            (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, constant_1.CONSTANT.INTERNAL_STATUS_CODE.SUCCESS, 'Get banner list success', response);
        }
        catch (error) {
            next(error);
        }
    };
    static getServiceList = [
        auth_middleware_1.AuthMiddleware.authenticateToken,
        async (req, res, next) => {
            try {
                const response = await information_service_1.InformationService.getServiceList();
                (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, constant_1.CONSTANT.INTERNAL_STATUS_CODE.SUCCESS, 'Get service list success', response);
            }
            catch (error) {
                next(error);
            }
        },
    ];
}
exports.InformationController = InformationController;
//# sourceMappingURL=information-controller.js.map