import { logger } from '../configs/winston';
import { UserRepository } from '../repositories/user-repository';
import { TransactionGetBalanceByEmailRequest } from '../models/dto/transaction-dto';
import { userDbField } from '../models/user-model';
import { Failure } from '../utils/failure';

class TransactionService {
    // static register = async (req: MembershipRegisterRequest) => {
    //     try {
    //         const totalUsers = await UserRepository.countByFilter({
    //             filterFields: [{
    //                 field: userDbField.email,
    //                 operator: 'equals',
    //                 value: req.email
    //             }]
    //         });
    //         if (totalUsers !== BigInt(0)) throw Failure.conflict('User with this email already exists');

    //         const id = uuidv4();
    //         if (!validateUuid(id)) throw Failure.badRequest('Invalid UUID format');

    //         const hashedPassword = await hashPassword(req.password);
    //         await UserRepository.create({
    //             id,
    //             email: req.email,
    //             firstName: req.firstName,
    //             lastName: req.lastName,
    //             password: hashedPassword,
    //             createdBy: req.email,
    //             updatedBy: req.email,
    //             updatedAt: new Date()
    //         });

    //         return null;
    //     } catch (error) {
    //         if (error instanceof Failure) throw error;

    //         logger.error(`[AuthService.register] Error registering user: ${error}`);
    //         throw Failure.internalServer('Failed to register user');
    //     }
    // };

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
