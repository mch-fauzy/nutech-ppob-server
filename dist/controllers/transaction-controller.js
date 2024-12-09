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
exports.TransactionController = void 0;
const http_status_codes_1 = require("http-status-codes");
const transaction_service_1 = require("../services/transaction-service");
const transaction_dto_1 = require("../models/dto/transaction-dto");
const constant_1 = require("../utils/constant");
const response_1 = require("../utils/response");
const transaction_model_1 = require("../models/transaction-model");
class TransactionController {
}
exports.TransactionController = TransactionController;
_a = TransactionController;
TransactionController.getBalanceForCurrentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = {
            email: String(req.headers[constant_1.CONSTANT.HEADERS.EMAIL])
        };
        const validatedRequest = yield transaction_dto_1.TransactionValidator.validateGetByEmailRequest(request);
        const response = yield transaction_service_1.TransactionService.getBalanceByEmail({
            email: validatedRequest.email
        });
        (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, constant_1.CONSTANT.STATUS.SUCCESS, 'Get Balance Success', response);
    }
    catch (error) {
        next(error);
    }
});
TransactionController.topUpBalanceForCurrentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = {
            email: String(req.headers[constant_1.CONSTANT.HEADERS.EMAIL]),
            transactionType: transaction_model_1.TransactionType.TOPUP,
            topUpAmount: req.body.topUpAmount
        };
        const validatedRequest = yield transaction_dto_1.TransactionValidator.validateTopUpBalanceByEmailRequest(request);
        yield transaction_service_1.TransactionService.topUpBalanceByEmail({
            email: validatedRequest.email,
            transactionType: validatedRequest.transactionType,
            topUpAmount: validatedRequest.topUpAmount
        });
        const response = yield transaction_service_1.TransactionService.getBalanceByEmail({
            email: validatedRequest.email
        });
        (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, constant_1.CONSTANT.STATUS.SUCCESS, 'Top-Up Balance Success', response);
    }
    catch (error) {
        next(error);
    }
});
TransactionController.paymentForCurrentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = {
            email: String(req.headers[constant_1.CONSTANT.HEADERS.EMAIL]),
            transactionType: transaction_model_1.TransactionType.PAYMENT,
            serviceCode: req.body.serviceCode
        };
        const validatedRequest = yield transaction_dto_1.TransactionValidator.validatePaymentByEmailRequest(request);
        yield transaction_service_1.TransactionService.paymentByEmail({
            email: validatedRequest.email,
            transactionType: validatedRequest.transactionType,
            serviceCode: validatedRequest.serviceCode
        });
        const response = yield transaction_service_1.TransactionService.getLatestByEmail({
            email: validatedRequest.email
        });
        (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, constant_1.CONSTANT.STATUS.SUCCESS, 'Payment Success', response);
    }
    catch (error) {
        next(error);
    }
});
TransactionController.getListForCurrentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = {
            email: String(req.headers[constant_1.CONSTANT.HEADERS.EMAIL]),
            page: req.query.page ? Number(req.query.page) : constant_1.CONSTANT.QUERY.DEFAULT_PAGE,
            pageSize: req.query.page_size ? Number(req.query.page_size) : undefined
        };
        const validatedRequest = yield transaction_dto_1.TransactionValidator.validateGetListByEmailRequest(request);
        const response = yield transaction_service_1.TransactionService.getListByEmail({
            email: validatedRequest.email,
            page: validatedRequest.page,
            pageSize: validatedRequest.pageSize
        });
        (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, constant_1.CONSTANT.STATUS.SUCCESS, 'Get Transaction List Success', response);
    }
    catch (error) {
        next(error);
    }
});
