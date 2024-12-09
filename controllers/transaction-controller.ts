import {
    Request,
    Response,
    NextFunction
} from 'express';
import { StatusCodes } from 'http-status-codes';

import { TransactionService } from '../services/transaction-service';
import {
    TransactionGetBalanceByEmailRequest,
    TransactionTopUpBalanceByEmailRequest,
    TransactionValidator
} from '../models/dto/transaction-dto';
import { CONSTANT } from '../utils/constant';
import { responseWithDetails } from '../utils/response';
import { TransactionType } from '../models/transaction-model';

class TransactionController {
    static getBalanceForCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const request: TransactionGetBalanceByEmailRequest = {
                email: String(req.headers[CONSTANT.HEADERS.EMAIL])
            };
            const validatedRequest = await TransactionValidator.validateGetBalanceByEmailRequest(request);

            const response = await TransactionService.getBalanceByEmail({
                email: validatedRequest.email
            });

            responseWithDetails(res, StatusCodes.OK, CONSTANT.STATUS.SUCCESS, 'Get Balance For Current User Success', response);
        } catch (error) {
            next(error);
        }
    };

    static topUpBalanceForCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const request: TransactionTopUpBalanceByEmailRequest = {
                email: String(req.headers[CONSTANT.HEADERS.EMAIL]),
                transactionType: TransactionType.TOPUP,
                topUpAmount: req.body.topUpAmount
            };
            const validatedRequest = await TransactionValidator.validateTopUpBalanceByEmailRequest(request);

            await TransactionService.topUpBalanceByEmail({
                email: validatedRequest.email,
                transactionType: validatedRequest.transactionType,
                topUpAmount: validatedRequest.topUpAmount
            });

            const response = await TransactionService.getBalanceByEmail({
                email: validatedRequest.email
            });

            responseWithDetails(res, StatusCodes.OK, CONSTANT.STATUS.SUCCESS, 'Top-Up Balance For Current User Success', response);
        } catch (error) {
            next(error);
        }
    };
}

export { TransactionController };
