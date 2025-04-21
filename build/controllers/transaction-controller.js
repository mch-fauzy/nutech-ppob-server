"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const http_status_codes_1 = require("http-status-codes");
const transaction_service_1 = require("../services/transaction-service");
const transaction_validator_1 = require("../models/dto/transaction/transaction-validator");
const internal_status_code_constant_1 = require("../common/constants/internal-status-code-constant");
const express_constant_1 = require("../common/constants/express-constant");
const response_1 = require("../common/utils/http/response");
const transaction_model_1 = require("../models/transaction-model");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const pagination_constant_1 = require("../common/constants/pagination-constant");
// TODO: ADD RETURN TYPE (IF NOT NATIVE TYPE) IN CONTROLLER, SERVICE, REPO AND ADD MIDDLEWARE OR UTILS TO response with data (message, data) or response with error (message, errors)
class TransactionController {
    static getBalanceForCurrentUser = [
        auth_middleware_1.AuthMiddleware.authenticateToken,
        async (req, res, next) => {
            try {
                const request = {
                    email: res.locals[express_constant_1.EXPRESS.LOCAL.EMAIL],
                };
                const validatedRequest = await transaction_validator_1.TransactionValidator.validateGetByEmailRequest(request);
                const response = await transaction_service_1.TransactionService.getBalanceByEmail({
                    email: validatedRequest.email,
                });
                (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, internal_status_code_constant_1.INTERNAL_STATUS_CODE.SUCCESS, 'Get balance success', response);
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
                    email: res.locals[express_constant_1.EXPRESS.LOCAL.EMAIL],
                    transactionType: transaction_model_1.TransactionType.TOPUP,
                    topUpAmount: req.body.topUpAmount,
                };
                const validatedRequest = await transaction_validator_1.TransactionValidator.validateTopUpBalanceByEmailRequest(request);
                await transaction_service_1.TransactionService.topUpBalanceByEmail({
                    email: validatedRequest.email,
                    transactionType: validatedRequest.transactionType,
                    topUpAmount: validatedRequest.topUpAmount,
                });
                const response = await transaction_service_1.TransactionService.getBalanceByEmail({
                    email: validatedRequest.email,
                });
                (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, internal_status_code_constant_1.INTERNAL_STATUS_CODE.SUCCESS, 'Top-Up balance success', response);
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
                    email: req.res?.locals[express_constant_1.EXPRESS.LOCAL.EMAIL],
                    transactionType: transaction_model_1.TransactionType.PAYMENT,
                    serviceCode: req.body.serviceCode,
                };
                const validatedRequest = await transaction_validator_1.TransactionValidator.validatePaymentByEmailRequest(request);
                await transaction_service_1.TransactionService.paymentByEmail({
                    email: validatedRequest.email,
                    transactionType: validatedRequest.transactionType,
                    serviceCode: validatedRequest.serviceCode,
                });
                const response = await transaction_service_1.TransactionService.getLatestByEmail({
                    email: validatedRequest.email,
                });
                (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, internal_status_code_constant_1.INTERNAL_STATUS_CODE.SUCCESS, 'Payment success', response);
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
                    email: res.locals[express_constant_1.EXPRESS.LOCAL.EMAIL],
                    page: req.query.page
                        ? Number(req.query.page)
                        : pagination_constant_1.PAGINATION.DEFAULT_PAGE,
                    pageSize: req.query.page_size
                        ? Number(req.query.page_size)
                        : undefined,
                };
                const validatedRequest = await transaction_validator_1.TransactionValidator.validateGetListByEmailRequest(request);
                const response = await transaction_service_1.TransactionService.getListByEmail({
                    email: validatedRequest.email,
                    page: validatedRequest.page,
                    pageSize: validatedRequest.pageSize,
                });
                (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, internal_status_code_constant_1.INTERNAL_STATUS_CODE.SUCCESS, 'Get transaction list success', response);
            }
            catch (error) {
                next(error);
            }
        },
    ];
}
exports.TransactionController = TransactionController;
//# sourceMappingURL=transaction-controller.js.map