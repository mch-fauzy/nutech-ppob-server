import {Request, Response, NextFunction} from 'express';
import {StatusCodes} from 'http-status-codes';

import {TransactionService} from '../services/transaction-service';
import {
  TransactionGetByEmailRequest,
  TransactionGetListByEmailRequest,
  TransactionPaymentByEmailRequest,
  TransactionTopUpBalanceByEmailRequest,
  TransactionValidator,
} from '../models/dto/transaction-dto';
import {CONSTANT} from '../utils/constant';
import {responseWithDetails} from '../utils/response';
import {TransactionType} from '../models/transaction-model';
import {AuthMiddleware} from '../middlewares/auth-middleware';

class TransactionController {
  static getBalanceForCurrentUser = [
    AuthMiddleware.authenticateToken,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const request: TransactionGetByEmailRequest = {
          email: res.locals[CONSTANT.LOCAL.EMAIL],
        };
        const validatedRequest =
          await TransactionValidator.validateGetByEmailRequest(request);

        const response = await TransactionService.getBalanceByEmail({
          email: validatedRequest.email,
        });

        responseWithDetails(
          res,
          StatusCodes.OK,
          CONSTANT.INTERNAL_STATUS_CODE.SUCCESS,
          'Get balance success',
          response,
        );
      } catch (error) {
        next(error);
      }
    },
  ];

  static topUpBalanceForCurrentUser = [
    AuthMiddleware.authenticateToken,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const request: TransactionTopUpBalanceByEmailRequest = {
          email: res.locals[CONSTANT.LOCAL.EMAIL],
          transactionType: TransactionType.TOPUP,
          topUpAmount: req.body.topUpAmount,
        };
        const validatedRequest =
          await TransactionValidator.validateTopUpBalanceByEmailRequest(
            request,
          );

        await TransactionService.topUpBalanceByEmail({
          email: validatedRequest.email,
          transactionType: validatedRequest.transactionType,
          topUpAmount: validatedRequest.topUpAmount,
        });

        const response = await TransactionService.getBalanceByEmail({
          email: validatedRequest.email,
        });

        responseWithDetails(
          res,
          StatusCodes.OK,
          CONSTANT.INTERNAL_STATUS_CODE.SUCCESS,
          'Top-Up balance success',
          response,
        );
      } catch (error) {
        next(error);
      }
    },
  ];

  static paymentForCurrentUser = [
    AuthMiddleware.authenticateToken,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const request: TransactionPaymentByEmailRequest = {
          email: req.res?.locals[CONSTANT.LOCAL.EMAIL],
          transactionType: TransactionType.PAYMENT,
          serviceCode: req.body.serviceCode,
        };
        const validatedRequest =
          await TransactionValidator.validatePaymentByEmailRequest(request);

        await TransactionService.paymentByEmail({
          email: validatedRequest.email,
          transactionType: validatedRequest.transactionType,
          serviceCode: validatedRequest.serviceCode,
        });

        const response = await TransactionService.getLatestByEmail({
          email: validatedRequest.email,
        });

        responseWithDetails(
          res,
          StatusCodes.OK,
          CONSTANT.INTERNAL_STATUS_CODE.SUCCESS,
          'Payment success',
          response,
        );
      } catch (error) {
        next(error);
      }
    },
  ];

  static getListForCurrentUser = [
    AuthMiddleware.authenticateToken,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const request: TransactionGetListByEmailRequest = {
          email: res.locals[CONSTANT.LOCAL.EMAIL],
          page: req.query.page
            ? Number(req.query.page)
            : CONSTANT.QUERY.DEFAULT_PAGE,
          pageSize: req.query.page_size
            ? Number(req.query.page_size)
            : undefined,
        };
        const validatedRequest =
          await TransactionValidator.validateGetListByEmailRequest(request);

        const response = await TransactionService.getListByEmail({
          email: validatedRequest.email,
          page: validatedRequest.page,
          pageSize: validatedRequest.pageSize,
        });

        responseWithDetails(
          res,
          StatusCodes.OK,
          CONSTANT.INTERNAL_STATUS_CODE.SUCCESS,
          'Get transaction list success',
          response,
        );
      } catch (error) {
        next(error);
      }
    },
  ];
}

export {TransactionController};
