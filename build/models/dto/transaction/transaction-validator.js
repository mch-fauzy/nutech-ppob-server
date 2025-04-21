"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const transaction_model_1 = require("../../transaction-model");
const service_model_1 = require("../../service-model");
/**
 * Validator for transaction-related requests
 */
class TransactionValidator {
    /**
     * Validator schema for get-by-email requests
     */
    static getByEmailRequestValidator = joi_1.default.object({
        email: joi_1.default.string().email().required(),
    });
    /**
     * Validates a get-by-email request
     * @param req The request to validate
     * @returns The validated request
     */
    static validateGetByEmailRequest = async (req) => {
        return await this.getByEmailRequestValidator.validateAsync(req);
    };
    /**
     * Validator schema for get-list-by-email requests
     */
    static getListByEmailRequestValidator = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        page: joi_1.default.number().min(1).optional(),
        pageSize: joi_1.default.number().min(1).optional(),
    });
    /**
     * Validates a get-list-by-email request
     * @param req The request to validate
     * @returns The validated request
     */
    static validateGetListByEmailRequest = async (req) => {
        return await this.getListByEmailRequestValidator.validateAsync(req);
    };
    /**
     * Validator schema for top-up-balance-by-email requests
     */
    static topUpBalanceByEmailRequestValidator = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        transactionType: joi_1.default.string()
            .valid(...Object.values(transaction_model_1.TransactionType))
            .required(),
        topUpAmount: joi_1.default.number().min(0).required(),
    });
    /**
     * Validates a top-up-balance-by-email request
     * @param req The request to validate
     * @returns The validated request
     */
    static validateTopUpBalanceByEmailRequest = async (req) => {
        return await this.topUpBalanceByEmailRequestValidator.validateAsync(req);
    };
    /**
     * Validator schema for payment-by-email requests
     */
    static paymentByEmailRequestValidator = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        transactionType: joi_1.default.string()
            .valid(...Object.values(transaction_model_1.TransactionType))
            .required(),
        serviceCode: joi_1.default.string()
            .valid(...Object.values(service_model_1.ServiceCode))
            .required(),
    });
    /**
     * Validates a payment-by-email request
     * @param req The request to validate
     * @returns The validated request
     */
    static validatePaymentByEmailRequest = async (req) => {
        return await this.paymentByEmailRequestValidator.validateAsync(req);
    };
}
exports.TransactionValidator = TransactionValidator;
//# sourceMappingURL=transaction-validator.js.map