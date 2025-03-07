"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const http_status_codes_1 = require("http-status-codes");
const transaction_service_1 = require("../services/transaction-service");
const transaction_dto_1 = require("../models/dto/transaction-dto");
const constant_1 = require("../utils/constant");
const response_1 = require("../utils/response");
const transaction_model_1 = require("../models/transaction-model");
const auth_middleware_1 = require("../middlewares/auth-middleware");
class TransactionController {
    static getBalanceForCurrentUser = [
        auth_middleware_1.AuthMiddleware.authenticateToken,
        async (req, res, next) => {
            try {
                const request = {
                    email: res.locals[constant_1.CONSTANT.LOCAL.EMAIL],
                };
                const validatedRequest = await transaction_dto_1.TransactionValidator.validateGetByEmailRequest(request);
                const response = await transaction_service_1.TransactionService.getBalanceByEmail({
                    email: validatedRequest.email,
                });
                (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, constant_1.CONSTANT.INTERNAL_STATUS_CODE.SUCCESS, 'Get balance success', response);
            }
            catch (error) {
                next(error);
            }
        },
    ];
    static topUpBalanceForCurrentUser = [
        auth_middleware_1.AuthMiddleware.authenticateToken,
        async (req, res, next) => {
            try {
                const request = {
                    email: res.locals[constant_1.CONSTANT.LOCAL.EMAIL],
                    transactionType: transaction_model_1.TransactionType.TOPUP,
                    topUpAmount: req.body.topUpAmount,
                };
                const validatedRequest = await transaction_dto_1.TransactionValidator.validateTopUpBalanceByEmailRequest(request);
                await transaction_service_1.TransactionService.topUpBalanceByEmail({
                    email: validatedRequest.email,
                    transactionType: validatedRequest.transactionType,
                    topUpAmount: validatedRequest.topUpAmount,
                });
                const response = await transaction_service_1.TransactionService.getBalanceByEmail({
                    email: validatedRequest.email,
                });
                (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, constant_1.CONSTANT.INTERNAL_STATUS_CODE.SUCCESS, 'Top-Up balance success', response);
            }
            catch (error) {
                next(error);
            }
        },
    ];
    static paymentForCurrentUser = [
        auth_middleware_1.AuthMiddleware.authenticateToken,
        async (req, res, next) => {
            try {
                const request = {
                    email: req.res?.locals[constant_1.CONSTANT.LOCAL.EMAIL],
                    transactionType: transaction_model_1.TransactionType.PAYMENT,
                    serviceCode: req.body.serviceCode,
                };
                const validatedRequest = await transaction_dto_1.TransactionValidator.validatePaymentByEmailRequest(request);
                await transaction_service_1.TransactionService.paymentByEmail({
                    email: validatedRequest.email,
                    transactionType: validatedRequest.transactionType,
                    serviceCode: validatedRequest.serviceCode,
                });
                const response = await transaction_service_1.TransactionService.getLatestByEmail({
                    email: validatedRequest.email,
                });
                (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, constant_1.CONSTANT.INTERNAL_STATUS_CODE.SUCCESS, 'Payment success', response);
            }
            catch (error) {
                next(error);
            }
        },
    ];
    static getListForCurrentUser = [
        auth_middleware_1.AuthMiddleware.authenticateToken,
        async (req, res, next) => {
            try {
                const request = {
                    email: res.locals[constant_1.CONSTANT.LOCAL.EMAIL],
                    page: req.query.page
                        ? Number(req.query.page)
                        : constant_1.CONSTANT.QUERY.DEFAULT_PAGE,
                    pageSize: req.query.page_size
                        ? Number(req.query.page_size)
                        : undefined,
                };
                const validatedRequest = await transaction_dto_1.TransactionValidator.validateGetListByEmailRequest(request);
                const response = await transaction_service_1.TransactionService.getListByEmail({
                    email: validatedRequest.email,
                    page: validatedRequest.page,
                    pageSize: validatedRequest.pageSize,
                });
                (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, constant_1.CONSTANT.INTERNAL_STATUS_CODE.SUCCESS, 'Get transaction list success', response);
            }
            catch (error) {
                next(error);
            }
        },
    ];
}
exports.TransactionController = TransactionController;
//# sourceMappingURL=transaction-controller.js.map