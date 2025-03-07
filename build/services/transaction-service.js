"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const user_repository_1 = require("../repositories/user-repository");
const user_model_1 = require("../models/user-model");
const failure_1 = require("../utils/failure");
const transaction_repository_1 = require("../repositories/transaction-repository");
const generate_invoice_number_1 = require("../utils/generate-invoice-number");
const service_repository_1 = require("../repositories/service-repository");
const service_model_1 = require("../models/service-model");
const transaction_model_1 = require("../models/transaction-model");
const prisma_client_1 = require("../configs/prisma-client");
const error_handler_1 = require("../utils/error-handler");
class TransactionService {
    static topUpBalanceByEmail = async (req) => {
        try {
            const [users, totalUsers] = await user_repository_1.UserRepository.findManyAndCountByFilter({
                selectFields: [user_model_1.USER_DB_FIELD.id, user_model_1.USER_DB_FIELD.balance],
                filterFields: [
                    {
                        field: user_model_1.USER_DB_FIELD.email,
                        operator: 'equals',
                        value: req.email,
                    },
                ],
            });
            if (totalUsers === BigInt(0))
                throw failure_1.Failure.notFound('User with this email not found');
            const user = users[0];
            // Simulate top-up logic, ideally will have confirmation if user already pay for topup
            // Wrap the repository operations in a transaction
            await prisma_client_1.prismaClient.$transaction(async (tx) => {
                await transaction_repository_1.TransactionRepository.create({
                    userId: user.id,
                    serviceId: null,
                    transactionType: req.transactionType,
                    totalAmount: req.topUpAmount,
                    invoiceNumber: (0, generate_invoice_number_1.generateInvoiceNumber)(),
                    createdBy: req.email,
                    updatedBy: req.email,
                    updatedAt: new Date(),
                }, tx);
                await user_repository_1.UserRepository.updateById({
                    id: user.id,
                    data: {
                        balance: user.balance + req.topUpAmount,
                        updatedBy: req.email,
                        updatedAt: new Date(),
                    },
                    tx,
                });
            });
            return null;
        }
        catch (error) {
            throw (0, error_handler_1.handleError)({
                operationName: 'TransactionService.topUpBalanceByEmail',
                error,
            });
        }
    };
    static paymentByEmail = async (req) => {
        try {
            const [users, totalUsers] = await user_repository_1.UserRepository.findManyAndCountByFilter({
                selectFields: [user_model_1.USER_DB_FIELD.id, user_model_1.USER_DB_FIELD.balance],
                filterFields: [
                    {
                        field: user_model_1.USER_DB_FIELD.email,
                        operator: 'equals',
                        value: req.email,
                    },
                ],
            });
            if (totalUsers === BigInt(0))
                throw failure_1.Failure.notFound('User with this email not found');
            const user = users[0];
            const [services, totalServices] = await service_repository_1.ServiceRepository.findManyAndCountByFilter({
                selectFields: [service_model_1.serviceDbField.id, service_model_1.serviceDbField.serviceTariff],
                filterFields: [
                    {
                        field: service_model_1.serviceDbField.serviceCode,
                        operator: 'equals',
                        value: req.serviceCode,
                    },
                ],
            });
            if (totalServices === BigInt(0))
                throw failure_1.Failure.notFound('Service with this code not found');
            const service = services[0];
            // Simulate payment logic, ideally will have confirmation if user already pay for payment
            if (user.balance < service.serviceTariff)
                throw failure_1.Failure.badRequest('Insufficient balance to make the payment');
            // Wrap the repository operations in a transaction
            await prisma_client_1.prismaClient.$transaction(async (tx) => {
                await transaction_repository_1.TransactionRepository.create({
                    userId: user.id,
                    serviceId: service.id,
                    transactionType: req.transactionType,
                    totalAmount: service.serviceTariff,
                    invoiceNumber: (0, generate_invoice_number_1.generateInvoiceNumber)(),
                    createdBy: req.email,
                    updatedBy: req.email,
                    updatedAt: new Date(),
                }, tx);
                await user_repository_1.UserRepository.updateById({
                    id: user.id,
                    data: {
                        balance: user.balance - service.serviceTariff,
                        updatedBy: req.email,
                        updatedAt: new Date(),
                    },
                    tx,
                });
            });
            return null;
        }
        catch (error) {
            throw (0, error_handler_1.handleError)({
                operationName: 'TransactionService.paymentByEmail',
                error,
            });
        }
    };
    static getBalanceByEmail = async (req) => {
        try {
            const [users, totalUsers] = await user_repository_1.UserRepository.findManyAndCountByFilter({
                selectFields: [user_model_1.USER_DB_FIELD.balance],
                filterFields: [
                    {
                        field: user_model_1.USER_DB_FIELD.email,
                        operator: 'equals',
                        value: req.email,
                    },
                ],
            });
            if (totalUsers === BigInt(0))
                throw failure_1.Failure.notFound('User with this email not found');
            const user = users[0];
            return user;
        }
        catch (error) {
            throw (0, error_handler_1.handleError)({
                operationName: 'TransactionService.getBalanceByEmail',
                error,
            });
        }
    };
    static getLatestByEmail = async (req) => {
        try {
            const [users, totalUsers] = await user_repository_1.UserRepository.findManyAndCountByFilter({
                selectFields: [user_model_1.USER_DB_FIELD.id],
                filterFields: [
                    {
                        field: user_model_1.USER_DB_FIELD.email,
                        operator: 'equals',
                        value: req.email,
                    },
                ],
            });
            if (totalUsers === BigInt(0))
                throw failure_1.Failure.notFound('User with this email not found');
            const user = users[0];
            const [transactions, totalTransactions] = await transaction_repository_1.TransactionRepository.findManyAndCountByFilter({
                selectFields: [
                    transaction_model_1.transactionDbField.serviceId,
                    transaction_model_1.transactionDbField.invoiceNumber,
                    transaction_model_1.transactionDbField.transactionType,
                    transaction_model_1.transactionDbField.totalAmount,
                    transaction_model_1.transactionDbField.createdAt,
                ],
                filterFields: [
                    {
                        field: transaction_model_1.transactionDbField.userId,
                        operator: 'equals',
                        value: user.id,
                    },
                ],
                sorts: [
                    {
                        field: transaction_model_1.transactionDbField.createdAt,
                        order: 'desc',
                    },
                ],
            });
            if (totalTransactions === BigInt(0))
                throw failure_1.Failure.notFound('Transaction not found');
            const transaction = transactions[0];
            const [services, totalServices] = await service_repository_1.ServiceRepository.findManyAndCountByFilter({
                selectFields: [
                    service_model_1.serviceDbField.serviceCode,
                    service_model_1.serviceDbField.serviceName,
                ],
                filterFields: [
                    {
                        field: service_model_1.serviceDbField.id,
                        operator: 'equals',
                        value: transaction.serviceId,
                    },
                ],
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
                createdAt: transaction.createdAt.toISOString(),
            };
            return response;
        }
        catch (error) {
            throw (0, error_handler_1.handleError)({
                operationName: 'TransactionService.getLatestByEmail',
                error,
            });
        }
    };
    static getListByEmail = async (req) => {
        try {
            const [users, totalUsers] = await user_repository_1.UserRepository.findManyAndCountByFilter({
                selectFields: [user_model_1.USER_DB_FIELD.id],
                filterFields: [
                    {
                        field: user_model_1.USER_DB_FIELD.email,
                        operator: 'equals',
                        value: req.email,
                    },
                ],
            });
            if (totalUsers === BigInt(0))
                throw failure_1.Failure.notFound('User with this email not found');
            const user = users[0];
            const [transactions, totalTransactions] = await transaction_repository_1.TransactionRepository.findManyAndCountByFilter({
                selectFields: [
                    transaction_model_1.transactionDbField.serviceId,
                    transaction_model_1.transactionDbField.invoiceNumber,
                    transaction_model_1.transactionDbField.transactionType,
                    transaction_model_1.transactionDbField.totalAmount,
                    transaction_model_1.transactionDbField.createdAt,
                ],
                filterFields: [
                    {
                        field: transaction_model_1.transactionDbField.userId,
                        operator: 'equals',
                        value: user.id,
                    },
                ],
                sorts: [
                    {
                        field: transaction_model_1.transactionDbField.createdAt,
                        order: 'desc',
                    },
                ],
                pagination: {
                    page: req.page,
                    pageSize: req.pageSize,
                },
            });
            const [services] = await service_repository_1.ServiceRepository.findManyAndCountByFilter({
                selectFields: [service_model_1.serviceDbField.id, service_model_1.serviceDbField.serviceName],
            });
            const response = transactions.map(transaction => {
                // Find service by transaction.serviceId
                const service = services.find(service => service.id === transaction.serviceId);
                return {
                    invoiceNumber: transaction.invoiceNumber,
                    transactionType: transaction.transactionType,
                    description: service ? service.serviceName : null,
                    totalAmount: transaction.totalAmount,
                    createdAt: transaction.createdAt.toISOString(),
                };
            });
            return {
                page: req.page,
                pageSize: req.pageSize ? req.pageSize : Number(totalTransactions),
                records: response,
            };
        }
        catch (error) {
            throw (0, error_handler_1.handleError)({
                operationName: 'TransactionService.getListByEmail',
                error,
            });
        }
    };
}
exports.TransactionService = TransactionService;
//# sourceMappingURL=transaction-service.js.map