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
class TransactionService {
}
exports.TransactionService = TransactionService;
_a = TransactionService;
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
