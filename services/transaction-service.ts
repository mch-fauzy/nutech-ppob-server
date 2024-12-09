import { logger } from '../configs/winston';
import { UserRepository } from '../repositories/user-repository';
import {
    TransactionTopUpBalanceByEmailRequest,
    TransactionGetBalanceByEmailRequest
} from '../models/dto/transaction-dto';
import { userDbField, UserPrimaryId } from '../models/user-model';
import { Failure } from '../utils/failure';
import { TransactionRepository } from '../repositories/transaction-repository';
import { generateInvoiceNumber } from '../utils/generate-invoice-number';

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

            // Simulate top-up logic, ideally will have confirmation if user already pay for topup
            const invoiceNumber = generateInvoiceNumber();
            const userPrimaryId: UserPrimaryId = { id: users[0].id };
            await Promise.all([
                TransactionRepository.create({
                    userId: users[0].id,
                    serviceId: null,
                    transactionType: req.transactionType,
                    totalAmount: req.topUpAmount,
                    invoiceNumber: invoiceNumber,
                    createdBy: req.email,
                    updatedBy: req.email,
                    updatedAt: new Date()
                }),
                UserRepository.updateById(userPrimaryId, {
                    balance: users[0].balance + req.topUpAmount,
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

    static getBalanceByEmail = async (req: TransactionGetBalanceByEmailRequest) => {
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

            return users[0]
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[TransactionService.getBalanceByEmail] Error retrieving balance by email: ${error}`);
            throw Failure.internalServer('Failed to retrieve user by email');
        }
    };
}

export { TransactionService };
