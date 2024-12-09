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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const transaction_model_1 = require("../transaction-model");
const service_model_1 = require("../service-model");
class TransactionValidator {
}
exports.TransactionValidator = TransactionValidator;
_a = TransactionValidator;
TransactionValidator.getByEmailRequestValidator = joi_1.default.object({
    email: joi_1.default.string().email().required(),
});
TransactionValidator.validateGetByEmailRequest = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _a.getByEmailRequestValidator.validateAsync(req);
});
TransactionValidator.getListByEmailRequestValidator = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    page: joi_1.default.number().min(1).optional(),
    pageSize: joi_1.default.number().min(1).optional(),
});
TransactionValidator.validateGetListByEmailRequest = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _a.getListByEmailRequestValidator.validateAsync(req);
});
TransactionValidator.topUpBalanceByEmailRequestValidator = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    transactionType: joi_1.default.string().valid(...Object.values(transaction_model_1.TransactionType)).required(),
    topUpAmount: joi_1.default.number().min(0).required()
});
TransactionValidator.validateTopUpBalanceByEmailRequest = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _a.topUpBalanceByEmailRequestValidator.validateAsync(req);
});
TransactionValidator.paymentByEmailRequestValidator = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    transactionType: joi_1.default.string().valid(...Object.values(transaction_model_1.TransactionType)).required(),
    serviceCode: joi_1.default.string().valid(...Object.values(service_model_1.ServiceCode)).required()
});
TransactionValidator.validatePaymentByEmailRequest = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _a.paymentByEmailRequestValidator.validateAsync(req);
});
