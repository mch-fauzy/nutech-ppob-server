import {
    Request,
    Response,
    NextFunction
} from 'express';
import { StatusCodes } from 'http-status-codes';

import { TransactionService } from '../services/transaction-service';
import {
    TransactionGetBalanceByEmailRequest,
    TransactionValidator
} from '../models/dto/transaction-dto';
import { CONSTANT } from '../utils/constant';
import { responseWithDetails } from '../utils/response';

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
}

export { TransactionController };
