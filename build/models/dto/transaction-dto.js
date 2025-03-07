"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const transaction_model_1 = require("../transaction-model");
const service_model_1 = require("../service-model");
class TransactionValidator {
    static getByEmailRequestValidator = joi_1.default.object({
        email: joi_1.default.string().email().required(),
    });
    static validateGetByEmailRequest = async (req) => {
        return await this.getByEmailRequestValidator.validateAsync(req);
    };
    static getListByEmailRequestValidator = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        page: joi_1.default.number().min(1).optional(),
        pageSize: joi_1.default.number().min(1).optional(),
    });
    static validateGetListByEmailRequest = async (req) => {
        return await this.getListByEmailRequestValidator.validateAsync(req);
    };
    static topUpBalanceByEmailRequestValidator = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        transactionType: joi_1.default.string()
            .valid(...Object.values(transaction_model_1.TransactionType))
            .required(),
        topUpAmount: joi_1.default.number().min(0).required(),
    });
    static validateTopUpBalanceByEmailRequest = async (req) => {
        return await this.topUpBalanceByEmailRequestValidator.validateAsync(req);
    };
    static paymentByEmailRequestValidator = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        transactionType: joi_1.default.string()
            .valid(...Object.values(transaction_model_1.TransactionType))
            .required(),
        serviceCode: joi_1.default.string()
            .valid(...Object.values(service_model_1.ServiceCode))
            .required(),
    });
    static validatePaymentByEmailRequest = async (req) => {
        return await this.paymentByEmailRequestValidator.validateAsync(req);
    };
}
exports.TransactionValidator = TransactionValidator;
//# sourceMappingURL=transaction-dto.js.map