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
exports.TransactionService = void 0;
const winston_1 = require("../configs/winston");
const user_repository_1 = require("../repositories/user-repository");
const user_model_1 = require("../models/user-model");
const failure_1 = require("../utils/failure");
const transaction_repository_1 = require("../repositories/transaction-repository");
const generate_invoice_number_1 = require("../utils/generate-invoice-number");
class TransactionService {
}
exports.TransactionService = TransactionService;
_a = TransactionService;
TransactionService.topUpBalanceByEmail = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [users, totalUsers] = yield user_repository_1.UserRepository.findManyAndCountByFilter({
            selectFields: [
                user_model_1.userDbField.id,
                user_model_1.userDbField.balance
            ],
            filterFields: [{
                    field: user_model_1.userDbField.email,
                    operator: 'equals',
                    value: req.email
                }]
        });
        if (totalUsers === BigInt(0))
            throw failure_1.Failure.notFound('User with this email not found');
        // Simulate top-up logic, ideally will have confirmation if user already pay for topup
        const invoiceNumber = (0, generate_invoice_number_1.generateInvoiceNumber)();
        const userPrimaryId = { id: users[0].id };
        yield Promise.all([
            transaction_repository_1.TransactionRepository.create({
                userId: users[0].id,
                serviceId: null,
                transactionType: req.transactionType,
                totalAmount: req.topUpAmount,
                invoiceNumber: invoiceNumber,
                createdBy: req.email,
                updatedBy: req.email,
                updatedAt: new Date()
            }),
            user_repository_1.UserRepository.updateById(userPrimaryId, {
                balance: users[0].balance + req.topUpAmount,
                updatedBy: req.email,
                updatedAt: new Date()
            })
        ]);
        return null;
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[TransactionService.topUpBalanceByEmail] Error top-up balance by email: ${error}`);
        throw failure_1.Failure.internalServer('Failed to top-up balance by email');
    }
});
TransactionService.getBalanceByEmail = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [users, totalUsers] = yield user_repository_1.UserRepository.findManyAndCountByFilter({
            selectFields: [
                user_model_1.userDbField.balance
            ],
            filterFields: [{
                    field: user_model_1.userDbField.email,
                    operator: 'equals',
                    value: req.email
                }]
        });
        if (totalUsers === BigInt(0))
            throw failure_1.Failure.notFound('User with this email not found');
        return users[0];
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[TransactionService.getBalanceByEmail] Error retrieving balance by email: ${error}`);
        throw failure_1.Failure.internalServer('Failed to retrieve user by email');
    }
});
