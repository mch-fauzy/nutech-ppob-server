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
const service_repository_1 = require("../repositories/service-repository");
const service_model_1 = require("../models/service-model");
const transaction_model_1 = require("../models/transaction-model");
const prisma_client_1 = require("../configs/prisma-client");
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
        const user = users[0];
        // Simulate top-up logic, ideally will have confirmation if user already pay for topup
        const invoiceNumber = (0, generate_invoice_number_1.generateInvoiceNumber)();
        const userPrimaryId = { id: user.id };
        // Wrap the repository operations in a transaction
        yield prisma_client_1.prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            yield transaction_repository_1.TransactionRepository.create({
                userId: user.id,
                serviceId: null,
                transactionType: req.transactionType,
                totalAmount: req.topUpAmount,
                invoiceNumber: invoiceNumber,
                createdBy: req.email,
                updatedBy: req.email,
                updatedAt: new Date()
            }, tx);
            yield user_repository_1.UserRepository.updateById(userPrimaryId, {
                balance: user.balance + req.topUpAmount,
                updatedBy: req.email,
                updatedAt: new Date()
            }, tx);
        }));
        return null;
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[TransactionService.topUpBalanceByEmail] Error top-up balance by email: ${JSON.stringify(error)}`);
        throw failure_1.Failure.internalServer('Failed to top-up balance by email');
    }
});
TransactionService.paymentByEmail = (req) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = users[0];
        const [services, totalServices] = yield service_repository_1.ServiceRepository.findManyAndCountByFilter({
            selectFields: [
                service_model_1.serviceDbField.id,
                service_model_1.serviceDbField.serviceTariff
            ],
            filterFields: [{
                    field: service_model_1.serviceDbField.serviceCode,
                    operator: 'equals',
                    value: req.serviceCode
                }]
        });
        if (totalServices === BigInt(0))
            throw failure_1.Failure.notFound('Service with this code not found');
        const service = services[0];
        // Simulate payment logic, ideally will have confirmation if user already pay for payment
        if (user.balance < service.serviceTariff)
            throw failure_1.Failure.badRequest('Insufficient balance to make the payment');
        const invoiceNumber = (0, generate_invoice_number_1.generateInvoiceNumber)();
        const userPrimaryId = { id: user.id };
        // Wrap the repository operations in a transaction
        yield prisma_client_1.prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            yield transaction_repository_1.TransactionRepository.create({
                userId: user.id,
                serviceId: service.id,
                transactionType: req.transactionType,
                totalAmount: service.serviceTariff,
                invoiceNumber: invoiceNumber,
                createdBy: req.email,
                updatedBy: req.email,
                updatedAt: new Date()
            }, tx);
            yield user_repository_1.UserRepository.updateById(userPrimaryId, {
                balance: user.balance - service.serviceTariff,
                updatedBy: req.email,
                updatedAt: new Date()
            }, tx);
        }));
        return null;
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[TransactionService.paymentByEmail] Error processing payment by email: ${JSON.stringify(error)}`);
        throw failure_1.Failure.internalServer('Failed to process payment by email');
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
        const user = users[0];
        return user;
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[TransactionService.getBalanceByEmail] Error retrieving balance by email: ${JSON.stringify(error)}`);
        throw failure_1.Failure.internalServer('Failed to retrieve user by email');
    }
});
TransactionService.getLatestByEmail = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [users, totalUsers] = yield user_repository_1.UserRepository.findManyAndCountByFilter({
            selectFields: [
                user_model_1.userDbField.id
            ],
            filterFields: [{
                    field: user_model_1.userDbField.email,
                    operator: 'equals',
                    value: req.email
                }]
        });
        if (totalUsers === BigInt(0))
            throw failure_1.Failure.notFound('User with this email not found');
        const user = users[0];
        const [transactions, totalTransactions] = yield transaction_repository_1.TransactionRepository.findManyAndCountByFilter({
            selectFields: [
                transaction_model_1.transactionDbField.serviceId,
                transaction_model_1.transactionDbField.invoiceNumber,
                transaction_model_1.transactionDbField.transactionType,
                transaction_model_1.transactionDbField.totalAmount,
                transaction_model_1.transactionDbField.createdAt
            ],
            filterFields: [{
                    field: transaction_model_1.transactionDbField.userId,
                    operator: 'equals',
                    value: user.id
                }],
            sorts: [{
                    field: transaction_model_1.transactionDbField.createdAt,
                    order: 'desc'
                }]
        });
        if (totalTransactions === BigInt(0))
            throw failure_1.Failure.notFound('Transaction not found');
        const transaction = transactions[0];
        const [services, totalServices] = yield service_repository_1.ServiceRepository.findManyAndCountByFilter({
            selectFields: [
                service_model_1.serviceDbField.serviceCode,
                service_model_1.serviceDbField.serviceName
            ],
            filterFields: [{
                    field: service_model_1.serviceDbField.id,
                    operator: 'equals',
                    value: transaction.serviceId
                }]
        });
        if (totalServices === BigInt(0))
            throw failure_1.Failure.notFound('Service not found');
        const service = services[0];
        const response = {
            invoiceNumber: transaction.invoiceNumber,
            serviceCode: service.serviceCode,
            serviceName: service.serviceName,
            transactionType: transaction.transactionType,
            totalAmount: transaction.totalAmount,
            createdAt: transaction.createdAt.toISOString()
        };
        return response;
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[TransactionService.getLatestByEmail] Error retrieving latest transaction by email: ${JSON.stringify(error)}`);
        throw failure_1.Failure.internalServer('Failed to retrieve latest transaction by email');
    }
});
TransactionService.getListByEmail = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [users, totalUsers] = yield user_repository_1.UserRepository.findManyAndCountByFilter({
            selectFields: [
                user_model_1.userDbField.id
            ],
            filterFields: [{
                    field: user_model_1.userDbField.email,
                    operator: 'equals',
                    value: req.email
                }]
        });
        if (totalUsers === BigInt(0))
            throw failure_1.Failure.notFound('User with this email not found');
        const user = users[0];
        const [transactions, totalTransactions] = yield transaction_repository_1.TransactionRepository.findManyAndCountByFilter({
            selectFields: [
                transaction_model_1.transactionDbField.serviceId,
                transaction_model_1.transactionDbField.invoiceNumber,
                transaction_model_1.transactionDbField.transactionType,
                transaction_model_1.transactionDbField.totalAmount,
                transaction_model_1.transactionDbField.createdAt
            ],
            filterFields: [{
                    field: transaction_model_1.transactionDbField.userId,
                    operator: 'equals',
                    value: user.id
                }],
            sorts: [{
                    field: transaction_model_1.transactionDbField.createdAt,
                    order: 'desc'
                }],
            pagination: {
                page: req.page,
                pageSize: req.pageSize
            }
        });
        if (totalTransactions === BigInt(0))
            throw failure_1.Failure.notFound('Transaction not found');
        const [services, totalServices] = yield service_repository_1.ServiceRepository.findManyAndCountByFilter({
            selectFields: [
                service_model_1.serviceDbField.id,
                service_model_1.serviceDbField.serviceName
            ]
        });
        if (totalServices === BigInt(0))
            throw failure_1.Failure.notFound('Service not found');
        const response = transactions.map(transaction => {
            // Find service by transaction.serviceId
            const service = services.find(service => service.id === transaction.serviceId);
            return {
                invoiceNumber: transaction.invoiceNumber,
                transactionType: transaction.transactionType,
                description: service ? service.serviceName : null,
                totalAmount: transaction.totalAmount,
                createdAt: transaction.createdAt.toISOString()
            };
        });
        return {
            page: req.page,
            pageSize: req.pageSize ? req.pageSize : Number(totalTransactions),
            records: response
        };
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[TransactionService.getListByEmail] Error retrieving transactions by email: ${JSON.stringify(error)}`);
        throw failure_1.Failure.internalServer('Failed to retrieve transactions by email');
    }
});
