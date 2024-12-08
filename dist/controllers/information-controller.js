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
exports.InformationController = void 0;
const http_status_codes_1 = require("http-status-codes");
const constant_1 = require("../utils/constant");
const response_1 = require("../utils/response");
const information_service_1 = require("../services/information-service");
class InformationController {
}
exports.InformationController = InformationController;
_a = InformationController;
InformationController.getBannerList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield information_service_1.InformationService.getBannerList();
        (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, constant_1.CONSTANT.STATUS.SUCCESS, 'Get Banner List Success', response);
    }
    catch (error) {
        next(error);
    }
});
InformationController.getServiceList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield information_service_1.InformationService.getServiceList();
        (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, constant_1.CONSTANT.STATUS.SUCCESS, 'Get Service List Success', response);
    }
    catch (error) {
        next(error);
    }
});
