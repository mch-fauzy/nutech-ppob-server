"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const user_repository_1 = require("../repositories/user-repository");
const db_field_constant_1 = require("../common/constants/db-field-constant");
const failure_1 = require("../common/utils/errors/failure");
const transaction_repository_1 = require("../repositories/transaction-repository");
const generate_invoice_number_1 = require("../common/utils/generators/generate-invoice-number");
const service_repository_1 = require("../repositories/service-repository");
const error_handler_1 = require("../common/utils/errors/error-handler");
const db_transaction_1 = require("../common/utils/database/db-transaction");
// TODO: ADD RETURN TYPE (IF NOT NATIVE TYPE) IN CONTROLLER, SERVICE, REPO AND ADD MIDDLEWARE OR UTILS TO response with data (message, data) or response with error (message, errors)
class TransactionService {
    static topUpBalanceByEmail = async (req) => {
        try {
            const [users, totalUsers] = await user_repository_1.UserRepository.findManyAndCountByFilter({
                selectFields: [db_field_constant_1.DB_FIELD.ID],
                filterFields: [
                    {
                        field: db_field_constant_1.DB_FIELD.EMAIL,
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
            await (0, db_transaction_1.withTransactionRetry)({
                /* Higher isolation levels offer stronger data consistency but decreased concurrency and performance*/
                isolationLevel: 'Serializable',
                transactionFn: async (tx) => {
                    const currentUser = await user_repository_1.UserRepository.findById({
                        id: user.id,
                        filter: {
                            selectFields: [db_field_constant_1.DB_FIELD.BALANCE],
                        },
                        tx,
                    });
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
                            balance: currentUser.balance + req.topUpAmount,
                            updatedBy: req.email,
                            updatedAt: new Date(),
                        },
                        tx,
                    });
                },
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
                selectFields: [db_field_constant_1.DB_FIELD.ID],
                filterFields: [
                    {
                        field: db_field_constant_1.DB_FIELD.EMAIL,
                        operator: 'equals',
                        value: req.email,
                    },
                ],
            });
            if (totalUsers === BigInt(0))
                throw failure_1.Failure.notFound('User with this email not found');
            const user = users[0];
            const [services, totalServices] = await service_repository_1.ServiceRepository.findManyAndCountByFilter({
                selectFields: [db_field_constant_1.DB_FIELD.ID, db_field_constant_1.DB_FIELD.SERVICE_TARIFF],
                filterFields: [
                    {
                        field: db_field_constant_1.DB_FIELD.SERVICE_CODE,
                        operator: 'equals',
                        value: req.serviceCode,
                    },
                ],
            });
            if (totalServices === BigInt(0))
                throw failure_1.Failure.notFound('Service with this code not found');
            const service = services[0];
            // Simulate payment logic, ideally will have confirmation if user already pay for payment
            // Wrap the repository operations in a transaction
            await (0, db_transaction_1.withTransactionRetry)({
                /* Higher isolation levels offer stronger data consistency but decreased concurrency and performance*/
                isolationLevel: 'Serializable',
                transactionFn: async (tx) => {
                    const currentUser = await user_repository_1.UserRepository.findById({
                        id: user.id,
                        filter: {
                            selectFields: [db_field_constant_1.DB_FIELD.BALANCE],
                        },
                        tx,
                    });
                    /* Check if balance is undefined OR balance is higher than tariff */
                    if (!currentUser.balance ||
                        currentUser.balance < service.serviceTariff)
                        throw failure_1.Failure.badRequest('Insufficient balance to make the payment');
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
                            balance: currentUser.balance - service.serviceTariff,
                            updatedBy: req.email,
                            updatedAt: new Date(),
                        },
                        tx,
                    });
                },
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
                selectFields: [db_field_constant_1.DB_FIELD.BALANCE],
                filterFields: [
                    {
                        field: db_field_constant_1.DB_FIELD.EMAIL,
                        operator: 'equals',
                        value: req.email,
                    },
                ],
            });
            if (totalUsers === BigInt(0))
                throw failure_1.Failure.notFound('User with this email not found');
            const user = users[0];
            return {
                balance: user.balance,
            };
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
                selectFields: [db_field_constant_1.DB_FIELD.ID],
                filterFields: [
                    {
                        field: db_field_constant_1.DB_FIELD.EMAIL,
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
                    db_field_constant_1.DB_FIELD.SERVICE_ID,
                    db_field_constant_1.DB_FIELD.INVOICE_NUMBER,
                    db_field_constant_1.DB_FIELD.TRANSACTION_TYPE,
                    db_field_constant_1.DB_FIELD.TOTAL_AMOUNT,
                    db_field_constant_1.DB_FIELD.CREATED_AT,
                ],
                filterFields: [
                    {
                        field: db_field_constant_1.DB_FIELD.USER_ID,
                        operator: 'equals',
                        value: user.id,
                    },
                ],
                sorts: [
                    {
                        field: db_field_constant_1.DB_FIELD.CREATED_AT,
                        order: 'desc',
                    },
                ],
            });
            if (totalTransactions === BigInt(0))
                throw failure_1.Failure.notFound('Transaction not found');
            const transaction = transactions[0];
            const [services, totalServices] = await service_repository_1.ServiceRepository.findManyAndCountByFilter({
                selectFields: [db_field_constant_1.DB_FIELD.SERVICE_CODE, db_field_constant_1.DB_FIELD.SERVICE_NAME],
                filterFields: [
                    {
                        field: db_field_constant_1.DB_FIELD.ID,
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
                selectFields: [db_field_constant_1.DB_FIELD.ID],
                filterFields: [
                    {
                        field: db_field_constant_1.DB_FIELD.EMAIL,
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
                    db_field_constant_1.DB_FIELD.SERVICE_ID,
                    db_field_constant_1.DB_FIELD.INVOICE_NUMBER,
                    db_field_constant_1.DB_FIELD.TRANSACTION_TYPE,
                    db_field_constant_1.DB_FIELD.TOTAL_AMOUNT,
                    db_field_constant_1.DB_FIELD.CREATED_AT,
                ],
                filterFields: [
                    {
                        field: db_field_constant_1.DB_FIELD.USER_ID,
                        operator: 'equals',
                        value: user.id,
                    },
                ],
                sorts: [
                    {
                        field: db_field_constant_1.DB_FIELD.CREATED_AT,
                        order: 'desc',
                    },
                ],
                pagination: {
                    page: req.page,
                    pageSize: req.pageSize,
                },
            });
            const [services] = await service_repository_1.ServiceRepository.findManyAndCountByFilter({
                selectFields: [db_field_constant_1.DB_FIELD.ID, db_field_constant_1.DB_FIELD.SERVICE_NAME],
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