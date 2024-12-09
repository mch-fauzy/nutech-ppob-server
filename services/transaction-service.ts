import { logger } from '../configs/winston';
import { UserRepository } from '../repositories/user-repository';
import {
    TransactionTopUpBalanceByEmailRequest,
    TransactionGetByEmailRequest,
    TransactionPaymentByEmailRequest,
    TransactionResponse,
    TransactionListResponse,
    TransactionGetListByEmailRequest,
    TransactionListWithPaginationResponse
} from '../models/dto/transaction-dto';
import {
    userDbField,
    UserPrimaryId
} from '../models/user-model';
import { Failure } from '../utils/failure';
import { TransactionRepository } from '../repositories/transaction-repository';
import { generateInvoiceNumber } from '../utils/generate-invoice-number';
import { ServiceRepository } from '../repositories/service-repository';
import { serviceDbField } from '../models/service-model';
import { transactionDbField } from '../models/transaction-model';

class TransactionService {
    static topUpBalanceByEmail = async (req: TransactionTopUpBalanceByEmailRequest) => {
        try {
            const [users, totalUsers] = await UserRepository.findManyAndCountByFilter({
                selectFields: [
                    userDbField.id,
                    userDbField.balance
                ],
                filterFields: [{
                    field: userDbField.email,
                    operator: 'equals',
                    value: req.email
                }]
            });
            if (totalUsers === BigInt(0)) throw Failure.notFound('User with this email not found');
            const user = users[0];

            // Simulate top-up logic, ideally will have confirmation if user already pay for topup
            const invoiceNumber = generateInvoiceNumber();
            const userPrimaryId: UserPrimaryId = { id: user.id };
            await Promise.all([
                TransactionRepository.create({
                    userId: user.id,
                    serviceId: null,
                    transactionType: req.transactionType,
                    totalAmount: req.topUpAmount,
                    invoiceNumber: invoiceNumber,
                    createdBy: req.email,
                    updatedBy: req.email,
                    updatedAt: new Date()
                }),
                UserRepository.updateById(userPrimaryId, {
                    balance: user.balance + req.topUpAmount,
                    updatedBy: req.email,
                    updatedAt: new Date()
                })
            ]);

            return null;
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[TransactionService.topUpBalanceByEmail] Error top-up balance by email: ${error}`);
            throw Failure.internalServer('Failed to top-up balance by email');
        }
    };

    static paymentByEmail = async (req: TransactionPaymentByEmailRequest) => {
        try {
            const [users, totalUsers] = await UserRepository.findManyAndCountByFilter({
                selectFields: [
                    userDbField.id,
                    userDbField.balance
                ],
                filterFields: [{
                    field: userDbField.email,
                    operator: 'equals',
                    value: req.email
                }]
            });
            if (totalUsers === BigInt(0)) throw Failure.notFound('User with this email not found');
            const user = users[0];

            const [services, totalServices] = await ServiceRepository.findManyAndCountByFilter({
                selectFields: [
                    serviceDbField.id,
                    serviceDbField.serviceTariff
                ],
                filterFields: [{
                    field: serviceDbField.serviceCode,
                    operator: 'equals',
                    value: req.serviceCode
                }]
            });
            if (totalServices === BigInt(0)) throw Failure.notFound('Service with this code not found');
            const service = services[0];

            // Simulate payment logic, ideally will have confirmation if user already pay for payment
            if (user.balance < service.serviceTariff) throw Failure.badRequest('Insufficient balance to make the payment');

            const invoiceNumber = generateInvoiceNumber();
            const userPrimaryId: UserPrimaryId = { id: user.id };
            await Promise.all([
                TransactionRepository.create({
                    userId: user.id,
                    serviceId: service.id,
                    transactionType: req.transactionType,
                    totalAmount: service.serviceTariff,
                    invoiceNumber: invoiceNumber,
                    createdBy: req.email,
                    updatedBy: req.email,
                    updatedAt: new Date()
                }),
                UserRepository.updateById(userPrimaryId, {
                    balance: user.balance - service.serviceTariff,
                    updatedBy: req.email,
                    updatedAt: new Date()
                })
            ])

            return null;
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[TransactionService.paymentByEmail] Error processing payment by email: ${error}`);
            throw Failure.internalServer('Failed to process payment by email');
        }
    };

    static getBalanceByEmail = async (req: TransactionGetByEmailRequest) => {
        try {
            const [users, totalUsers] = await UserRepository.findManyAndCountByFilter({
                selectFields: [
                    userDbField.balance
                ],
                filterFields: [{
                    field: userDbField.email,
                    operator: 'equals',
                    value: req.email
                }]
            });
            if (totalUsers === BigInt(0)) throw Failure.notFound('User with this email not found');
            const user = users[0];

            return user
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[TransactionService.getBalanceByEmail] Error retrieving balance by email: ${error}`);
            throw Failure.internalServer('Failed to retrieve user by email');
        }
    };

    static getLatestByEmail = async (req: TransactionGetByEmailRequest): Promise<TransactionResponse> => {
        try {
            const [users, totalUsers] = await UserRepository.findManyAndCountByFilter({
                selectFields: [
                    userDbField.id
                ],
                filterFields: [{
                    field: userDbField.email,
                    operator: 'equals',
                    value: req.email
                }]
            });
            if (totalUsers === BigInt(0)) throw Failure.notFound('User with this email not found');
            const user = users[0]

            const [transactions, totalTransactions] = await TransactionRepository.findManyAndCountByFilter({
                selectFields: [
                    transactionDbField.serviceId,
                    transactionDbField.invoiceNumber,
                    transactionDbField.transactionType,
                    transactionDbField.totalAmount,
                    transactionDbField.createdAt
                ],
                filterFields: [{
                    field: transactionDbField.userId,
                    operator: 'equals',
                    value: user.id
                }],
                sorts: [{
                    field: transactionDbField.createdAt,
                    order: 'desc'
                }]
            });
            if (totalTransactions === BigInt(0)) throw Failure.notFound('Transaction not found');
            const transaction = transactions[0]

            const [services, totalServices] = await ServiceRepository.findManyAndCountByFilter({
                selectFields: [
                    serviceDbField.serviceCode,
                    serviceDbField.serviceName
                ],
                filterFields: [{
                    field: serviceDbField.id,
                    operator: 'equals',
                    value: transaction.serviceId
                }]
            });
            if (totalServices === BigInt(0)) throw Failure.notFound('Service not found');
            const service = services[0];

            const response: TransactionResponse = {
                invoiceNumber: transaction.invoiceNumber,
                serviceCode: service.serviceCode,
                serviceName: service.serviceName,
                transactionType: transaction.transactionType,
                totalAmount: transaction.totalAmount,
                createdAt: transaction.createdAt.toISOString()
            };

            return response;
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[TransactionService.getLatestByEmail] Error retrieving latest transaction by email: ${error}`);
            throw Failure.internalServer('Failed to retrieve latest transaction by email');
        }
    };

    static getListByEmail = async (req: TransactionGetListByEmailRequest): Promise<TransactionListWithPaginationResponse> => {
        try {
            const [users, totalUsers] = await UserRepository.findManyAndCountByFilter({
                selectFields: [
                    userDbField.id
                ],
                filterFields: [{
                    field: userDbField.email,
                    operator: 'equals',
                    value: req.email
                }]
            });
            if (totalUsers === BigInt(0)) throw Failure.notFound('User with this email not found');
            const user = users[0]

            const [transactions, totalTransactions] = await TransactionRepository.findManyAndCountByFilter({
                selectFields: [
                    transactionDbField.serviceId,
                    transactionDbField.invoiceNumber,
                    transactionDbField.transactionType,
                    transactionDbField.totalAmount,
                    transactionDbField.createdAt
                ],
                filterFields: [{
                    field: transactionDbField.userId,
                    operator: 'equals',
                    value: user.id
                }],
                sorts: [{
                    field: transactionDbField.createdAt,
                    order: 'desc'
                }],
                pagination: {
                    page: req.page,
                    pageSize: req.pageSize
                }
            });
            if (totalTransactions === BigInt(0)) throw Failure.notFound('Transaction not found');

            const [services, totalServices] = await ServiceRepository.findManyAndCountByFilter({
                selectFields: [
                    serviceDbField.id,
                    serviceDbField.serviceName
                ]
            });
            if (totalServices === BigInt(0)) throw Failure.notFound('Service not found');

            const response: TransactionListResponse[] = transactions.map(transaction => {
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
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[TransactionService.getListByEmail] Error retrieving transactions by email: ${error}`);
            throw Failure.internalServer('Failed to retrieve transactions by email');
        }
    };
}

export { TransactionService };
